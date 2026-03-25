import uuid
from sqlalchemy import Column, String, Boolean, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True) # Null if Google Auth
    display_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")

class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    nausea = Column(Boolean, default=False, nullable=False)
    loss_of_appetite = Column(Boolean, default=False, nullable=False)
    peritonitis = Column(Text, default='none', nullable=False)
    urinary_ketones = Column(Text, default='none', nullable=False)
    free_fluids = Column(Boolean, default=False, nullable=False)
    wbc_count = Column(Numeric, default=0, nullable=False)
    body_temperature = Column(Numeric, default=36.5, nullable=False)
    neutrophil_percentage = Column(Numeric, default=0, nullable=False)
    crp = Column(Numeric, default=0, nullable=False)
    appendix_diameter = Column(Numeric, default=0, nullable=False)
    
    dharma_score = Column(Numeric, default=0, nullable=False)
    confidence_low = Column(Numeric, default=0, nullable=False)
    confidence_high = Column(Numeric, default=0, nullable=False)
    result_status = Column(Text, default='', nullable=False)
    clinical_note = Column(Text, default='', nullable=False)

    complication_score = Column(Numeric, nullable=True)
    complication_status = Column(Text, nullable=True)
    complication_low = Column(Numeric, nullable=True)
    complication_high = Column(Numeric, nullable=True)
    complication_note = Column(Text, nullable=True)

    user = relationship("User", back_populates="reports")
