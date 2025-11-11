# app/schemas/job_history_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class JobHistoryBase(BaseModel):
    employee_id: int
    effective_date: date
    end_date: Optional[date] = None
    position_title: Optional[str] = None
    department: Optional[str] = None
    area: Optional[str] = None
    supervisor_id: Optional[int] = None
    salary: Optional[float] = None
    change_type: Optional[str] = None
    change_reason: Optional[str] = None
    created_by: Optional[int] = None

class JobHistoryCreate(JobHistoryBase):
    pass

class JobHistoryOut(JobHistoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
