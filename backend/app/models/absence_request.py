# app/models/absence_request.py
from sqlalchemy import Column, String, Integer, Date, DECIMAL, ForeignKey, Text, Enum, TIMESTAMP
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime

class AbsenceRequest(BaseModel):
    __tablename__ = "absence_requests"

    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    request_type = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_days = Column(DECIMAL(8, 2), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(Enum("PENDING", "APPROVED", "REJECTED", "CANCELLED", "ARCHIVED"), default="PENDING")
    current_approval_stage = Column(String(50), default="SUPERVISOR")
    hours_per_day = Column(DECIMAL(5, 2), nullable=True)
    paid_days = Column(DECIMAL(8, 2), nullable=True)
    unpaid_days = Column(DECIMAL(8, 2), nullable=True)
    unpaid_comments = Column(String(500), nullable=True)
    shift_details = Column(String(500), nullable=True)
    
    leave_category = Column(String(100), nullable=True)
    business_days = Column(DECIMAL(8, 2), nullable=True)
    attachment_path = Column(String(500), nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_date = Column(TIMESTAMP, nullable=True)
    rejected_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    rejected_date = Column(TIMESTAMP, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    employee = relationship("User", foreign_keys=[employee_id], back_populates="absence_requests")
    approved_by_user = relationship("User", foreign_keys=[approved_by])
    rejected_by_user = relationship("User", foreign_keys=[rejected_by])
    created_by_user = relationship("User", foreign_keys=[created_by])
    updated_by_user = relationship("User", foreign_keys=[updated_by])
