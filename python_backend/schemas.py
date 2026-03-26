from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
import uuid
from datetime import datetime

# Users

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuth(BaseModel):
    token: str

class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    display_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Reports ...
class ReportCreate(BaseModel):
    nausea: int
    loss_of_appetite: int
    peritonitis: int
    urinary_ketones: Optional[int] = None
    free_fluids: Optional[int] = None
    wbc_count: float
    body_temperature: float
    neutrophil_percentage: float
    crp: Optional[float] = None
    appendix_diameter: Optional[float] = None

    dharma_score: float
    confidence_low: float
    confidence_high: float
    result_status: str
    clinical_note: str

    complication_score: Optional[float] = None
    complication_status: Optional[str] = None
    complication_low: Optional[float] = None
    complication_high: Optional[float] = None
    complication_note: Optional[str] = None

class ReportOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    
    nausea: bool
    loss_of_appetite: bool
    peritonitis: Optional[str] = None
    urinary_ketones: Optional[str] = None
    free_fluids: Optional[bool] = None
    wbc_count: float
    body_temperature: float
    neutrophil_percentage: float
    crp: Optional[float] = None
    appendix_diameter: Optional[float] = None
    
    dharma_score: float
    confidence_low: float
    confidence_high: float
    result_status: str
    clinical_note: str

    complication_score: Optional[float] = None
    complication_status: Optional[str] = None
    complication_low: Optional[float] = None
    complication_high: Optional[float] = None
    complication_note: Optional[str] = None

    class Config:
        from_attributes = True

class AdminReportOut(ReportOut):
    user_email: str
    
    class Config:
        from_attributes = True
