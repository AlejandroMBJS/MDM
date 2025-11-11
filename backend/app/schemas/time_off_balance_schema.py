# app/schemas/time_off_balance_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class TimeOffBalanceBase(BaseModel):
    employee_id: int
    year: int
    leave_type: str
    total_days: float = 0
    used_days: float = 0
    pending_days: float = 0
    expires_on: Optional[date] = None
    notes: Optional[str] = None

class TimeOffBalanceCreate(TimeOffBalanceBase):
    pass

class TimeOffBalanceOut(TimeOffBalanceBase):
    id: int
    available_days: float # This is a generated column in SQL, but we can calculate it or let the ORM handle it
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
