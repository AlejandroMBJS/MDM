# app/schemas/employee_document_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class EmployeeDocumentBase(BaseModel):
    employee_id: int
    document_type: str
    document_name: str
    file_path: Optional[str] = None
    file_url: Optional[str] = None
    expiration_date: Optional[date] = None
    is_verified: bool = False
    verified_by: Optional[int] = None
    verified_date: Optional[datetime] = None
    notes: Optional[str] = None

class EmployeeDocumentCreate(EmployeeDocumentBase):
    pass

class EmployeeDocumentOut(EmployeeDocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
