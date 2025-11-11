# app/models/user.py
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Date, DECIMAL, ForeignKey, Text, Time, Enum
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime

# Import all related models for SQLAlchemy to resolve relationships
from app.models.emergency_contact import EmergencyContact
from app.models.dependent import Dependent
from app.models.employee_document import EmployeeDocument
from app.models.job_history import JobHistory
from app.models.time_off_balance import TimeOffBalance
from app.models.employee_benefit import EmployeeBenefit
from app.models.horario_base import HorarioBase
from app.models.horario_excepcion import HorarioExcepcion
from app.models.auditoria_horarios import AuditoriaHorarios
from app.models.payroll_history import PayrollHistory
from app.models.absence_request import AbsenceRequest
from app.models.approval_history import ApprovalHistory
from app.models.notification import Notification

class User(BaseModel):
    __tablename__ = "users"

    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="employee")
    supervisor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    department = Column(String(200), nullable=True)
    default_dashboard = Column(String(100), nullable=True)
    payroll_number = Column(String(50), unique=True, nullable=True)
    periodo = Column(String(100), nullable=True)
    centro_u = Column(String(100), nullable=True)
    tipo_usuario = Column(String(100), nullable=True)
    area = Column(String(200), nullable=True)
    regimen = Column(String(100), nullable=True)
    first_name = Column(String(100), nullable=True)
    middle_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    second_last_name = Column(String(100), nullable=True)
    personal_email = Column(String(200), nullable=True)
    phone_number = Column(String(20), nullable=True)
    mobile_number = Column(String(20), nullable=True)
    street_address = Column(String(300), nullable=True)
    address_line2 = Column(String(200), nullable=True)
    city = Column(String(100), nullable=True)
    state_province = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    country = Column(String(100), default="México")
    birth_date = Column(Date, nullable=True)
    gender = Column(Enum("M", "F", "O", "PREFER_NOT_TO_SAY"), nullable=True)
    marital_status = Column(String(50), nullable=True)
    nationality = Column(String(100), nullable=True)
    curp = Column(String(18), unique=True, nullable=True)
    rfc = Column(String(13), unique=True, nullable=True)
    nss = Column(String(11), unique=True, nullable=True)
    passport_number = Column(String(50), nullable=True)
    drivers_license = Column(String(50), nullable=True)
    employee_status = Column(Enum("ACTIVE", "INACTIVE", "SUSPENDED", "TERMINATED", "ON_LEAVE"), default="ACTIVE")
    hire_date = Column(Date, nullable=True)
    termination_date = Column(Date, nullable=True)
    termination_reason = Column(String(500), nullable=True)
    position_title = Column(String(200), nullable=True)
    job_level = Column(String(50), nullable=True)
    cost_center = Column(String(100), nullable=True)
    salary = Column(DECIMAL(12, 2), nullable=True)
    salary_currency = Column(String(10), default="MXN")
    payment_frequency = Column(String(50), nullable=True)
    payment_method = Column(String(50), nullable=True)
    bank_name = Column(String(100), nullable=True)
    bank_account_number = Column(String(50), nullable=True)
    clabe = Column(String(18), nullable=True)
    contract_type = Column(String(100), nullable=True)
    work_schedule = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    infonavit_credit = Column(Boolean, default=False)
    infonavit_number = Column(String(50), nullable=True)
    infonavit_discount = Column(DECIMAL(10, 2), nullable=True)
    fonacot_credit = Column(Boolean, default=False)
    fonacot_number = Column(String(50), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    emergency_contacts = relationship("EmergencyContact", back_populates="employee")
    dependents = relationship("Dependent", back_populates="employee")
    employee_documents = relationship("EmployeeDocument", foreign_keys="[EmployeeDocument.employee_id]", back_populates="employee")
    verified_documents = relationship("EmployeeDocument", foreign_keys="[EmployeeDocument.verified_by]")
    job_history = relationship("JobHistory", foreign_keys="[JobHistory.employee_id]", back_populates="employee")
    created_job_history = relationship("JobHistory", foreign_keys="[JobHistory.created_by]")
    time_off_balances = relationship("TimeOffBalance", back_populates="employee")
    employee_benefits = relationship("EmployeeBenefit", back_populates="employee")
    horarios_base = relationship("HorarioBase", back_populates="employee")
    horarios_excepcion = relationship("HorarioExcepcion", foreign_keys="[HorarioExcepcion.empleado_id]", back_populates="employee")
    approved_horarios_excepcion = relationship("HorarioExcepcion", foreign_keys="[HorarioExcepcion.aprobado_por]")
    auditoria_horarios = relationship("AuditoriaHorarios", foreign_keys="[AuditoriaHorarios.empleado_id]", back_populates="employee")
    registered_auditoria_horarios = relationship("AuditoriaHorarios", foreign_keys="[AuditoriaHorarios.registrado_por]")
    payroll_history = relationship("PayrollHistory", foreign_keys="[PayrollHistory.employee_id]", back_populates="employee")
    created_payroll_history = relationship("PayrollHistory", foreign_keys="[PayrollHistory.created_by]")
    absence_requests = relationship("AbsenceRequest", foreign_keys="[AbsenceRequest.employee_id]", back_populates="employee")
    approved_absence_requests = relationship("AbsenceRequest", foreign_keys="[AbsenceRequest.approved_by]")
    rejected_absence_requests = relationship("AbsenceRequest", foreign_keys="[AbsenceRequest.rejected_by]")
    created_absence_requests = relationship("AbsenceRequest", foreign_keys="[AbsenceRequest.created_by]")
    updated_absence_requests = relationship("AbsenceRequest", foreign_keys="[AbsenceRequest.updated_by]")
    approval_history = relationship("ApprovalHistory", foreign_keys="[ApprovalHistory.approver_id]", back_populates="approver")
    notifications = relationship("Notification", back_populates="user")
    
    supervisor = relationship("User", remote_side=lambda: User.id, foreign_keys=[supervisor_id])
    created_by_user = relationship("User", foreign_keys=[created_by], remote_side=lambda: User.id)
    updated_by_user = relationship("User", foreign_keys=[updated_by], remote_side=lambda: User.id)
