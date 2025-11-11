# app/schemas/user_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "employee"
    supervisor_id: Optional[int] = None
    department: Optional[str] = None
    default_dashboard: Optional[str] = None
    payroll_number: Optional[str] = None
    periodo: Optional[str] = None
    centro_u: Optional[str] = None
    tipo_usuario: Optional[str] = None
    area: Optional[str] = None
    regimen: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    second_last_name: Optional[str] = None
    personal_email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    mobile_number: Optional[str] = None
    street_address: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state_province: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = "México"
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    nationality: Optional[str] = None
    curp: Optional[str] = None
    rfc: Optional[str] = None
    nss: Optional[str] = None
    passport_number: Optional[str] = None
    drivers_license: Optional[str] = None
    employee_status: Optional[str] = "ACTIVE"
    hire_date: Optional[date] = None
    termination_date: Optional[date] = None
    termination_reason: Optional[str] = None
    position_title: Optional[str] = None
    job_level: Optional[str] = None
    cost_center: Optional[str] = None
    salary: Optional[float] = None
    salary_currency: Optional[str] = "MXN"
    payment_frequency: Optional[str] = None
    payment_method: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    clabe: Optional[str] = None
    contract_type: Optional[str] = None
    work_schedule: Optional[str] = None
    is_active: Optional[bool] = True
    last_login: Optional[datetime] = None
    infonavit_credit: Optional[bool] = False
    infonavit_number: Optional[str] = None
    infonavit_discount: Optional[float] = None
    fonacot_credit: Optional[bool] = False
    fonacot_number: Optional[str] = None
    created_by: Optional[int] = None
    updated_by: Optional[int] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    supervisor_id: Optional[int] = None
    department: Optional[str] = None
    default_dashboard: Optional[str] = None
    payroll_number: Optional[str] = None
    periodo: Optional[str] = None
    centro_u: Optional[str] = None
    tipo_usuario: Optional[str] = None
    area: Optional[str] = None
    regimen: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    second_last_name: Optional[str] = None
    personal_email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    mobile_number: Optional[str] = None
    street_address: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state_province: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    nationality: Optional[str] = None
    curp: Optional[str] = None
    rfc: Optional[str] = None
    nss: Optional[str] = None
    passport_number: Optional[str] = None
    drivers_license: Optional[str] = None
    employee_status: Optional[str] = None
    hire_date: Optional[date] = None
    termination_date: Optional[date] = None
    termination_reason: Optional[str] = None
    position_title: Optional[str] = None
    job_level: Optional[str] = None
    cost_center: Optional[str] = None
    salary: Optional[float] = None
    salary_currency: Optional[str] = None
    payment_frequency: Optional[str] = None
    payment_method: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    clabe: Optional[str] = None
    contract_type: Optional[str] = None
    work_schedule: Optional[str] = None
    last_login: Optional[datetime] = None
    infonavit_credit: Optional[bool] = None
    infonavit_number: Optional[str] = None
    infonavit_discount: Optional[float] = None
    fonacot_credit: Optional[bool] = None
    fonacot_number: Optional[str] = None
    created_by: Optional[int] = None
    updated_by: Optional[int] = None

    class Config:
        from_attributes = True
