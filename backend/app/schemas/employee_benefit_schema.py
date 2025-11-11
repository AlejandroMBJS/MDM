# app/schemas/employee_benefit_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class EmployeeBenefitBase(BaseModel):
    employee_id: int
    benefit_type: str
    benefit_name: str
    provider: Optional[str] = None
    policy_number: Optional[str] = None
    coverage_amount: Optional[float] = None
    start_date: date
    end_date: Optional[date] = None
    employee_cost: float = 0
    employer_cost: float = 0
    beneficiary_name: Optional[str] = None
    is_active: bool = True
    notes: Optional[str] = None

class EmployeeBenefitCreate(EmployeeBenefitBase):
    pass

class EmployeeBenefitOut(EmployeeBenefitBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
