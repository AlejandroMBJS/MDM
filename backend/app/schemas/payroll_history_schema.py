# app/schemas/payroll_history_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class PayrollHistoryBase(BaseModel):
    employee_id: int
    payroll_period: str
    period_start: date
    period_end: date
    
    base_salary: Optional[float] = None
    overtime_pay: float = 0
    bonuses: float = 0
    commissions: float = 0
    other_income: float = 0
    gross_pay: Optional[float] = None
    
    isr_tax: float = 0
    imss_employee: float = 0
    infonavit_discount: float = 0
    fonacot_discount: float = 0
    other_deductions: float = 0
    total_deductions: Optional[float] = None
    
    net_pay: Optional[float] = None
    
    payment_status: str = "PENDING" # ENUM: 'PENDING', 'PROCESSED', 'PAID', 'CANCELLED'
    payment_date: Optional[date] = None
    payment_method: Optional[str] = None
    
    created_by: Optional[int] = None

class PayrollHistoryCreate(PayrollHistoryBase):
    pass

class PayrollHistoryOut(PayrollHistoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
