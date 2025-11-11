# app/schemas/dependent_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class DependentBase(BaseModel):
    employee_id: int
    dependent_name: str
    relationship: str
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    curp: Optional[str] = None
    is_beneficiary: bool = False
    beneficiary_percentage: Optional[float] = None
    is_dependent: bool = True
    has_disability: bool = False
    notes: Optional[str] = None

class DependentCreate(DependentBase):
    pass

class DependentOut(DependentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
