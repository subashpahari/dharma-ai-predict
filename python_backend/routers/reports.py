from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
from .users import get_current_user
import uuid

router = APIRouter(prefix="/api/reports", tags=["reports"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.ReportOut])
def get_user_reports(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    reports = db.query(models.Report).filter(models.Report.user_id == current_user.id).order_by(models.Report.created_at.desc()).limit(50).all()
    return reports

@router.post("/", response_model=schemas.ReportOut)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_report = models.Report(**report.dict(), user_id=current_user.id)
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.get("/admin", response_model=List[schemas.AdminReportOut])
def get_all_reports(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Check if user is admin based on VITE_ADMIN_EMAIL or ADMIN_EMAIL in ENV
    import os
    admin_emails = [email.strip() for email in os.getenv("VITE_ADMIN_EMAIL", "").split(",")]
    if current_user.email not in admin_emails:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    # Needs to select all reports and join user email
    reports = db.query(models.Report, models.User.email).join(models.User, models.Report.user_id == models.User.id).order_by(models.Report.created_at.desc()).all()
    
    # Transform response
    admin_reports = []
    for report, email in reports:
        report_dict = {c.name: getattr(report, c.name) for c in report.__table__.columns}
        report_dict["user_email"] = email
        admin_reports.append(report_dict)
        
    return admin_reports
