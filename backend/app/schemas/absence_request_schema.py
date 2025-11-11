# app/schemas/absence_request_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class AbsenceRequestBase(BaseModel):
    employee_id: int
    request_type: str
    start_date: date
    end_date: date
    total_days: float
    reason: str
    status: str = "PENDING" # ENUM: 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'ARCHIVED'
    current_approval_stage: str = "SUPERVISOR"
    hours_per_day: Optional[float] = None
    paid_days: Optional[float] = None
    unpaid_days: Optional[float] = None
    unpaid_comments: Optional[str] = None
    shift_details: Optional[str] = None
    
    leave_category: Optional[str] = None
    business_days: Optional[float] = None
    attachment_path: Optional[str] = None
    approved_by: Optional[int] = None
    approved_date: Optional[datetime] = None
    rejected_by: Optional[int] = None
    rejected_date: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    created_by: Optional[int] = None
    updated_by: Optional[int] = None

class AbsenceRequestCreate(AbsenceRequestBase):
    pass

class AbsenceRequestOut(AbsenceRequestBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
