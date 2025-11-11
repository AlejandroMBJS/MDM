# app/schemas/emergency_contact_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class EmergencyContactBase(BaseModel):
    employee_id: int
    contact_name: str
    relationship: str
    phone_number: str
    alternative_phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    is_primary: bool = False

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContactOut(EmergencyContactBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
