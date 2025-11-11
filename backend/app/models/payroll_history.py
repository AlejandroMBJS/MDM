# app/models/payroll_history.py
from sqlalchemy import Column, String, Integer, Date, DECIMAL, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime

class PayrollHistory(BaseModel):
    __tablename__ = "payroll_history"

    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    payroll_period = Column(String(50), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    
    base_salary = Column(DECIMAL(12, 2), nullable=True)
    overtime_pay = Column(DECIMAL(12, 2), default=0)
    bonuses = Column(DECIMAL(12, 2), default=0)
    commissions = Column(DECIMAL(12, 2), default=0)
    other_income = Column(DECIMAL(12, 2), default=0)
    gross_pay = Column(DECIMAL(12, 2), nullable=True)
    
    isr_tax = Column(DECIMAL(12, 2), default=0)
    imss_employee = Column(DECIMAL(12, 2), default=0)
    infonavit_discount = Column(DECIMAL(12, 2), default=0)
    fonacot_discount = Column(DECIMAL(12, 2), default=0)
    other_deductions = Column(DECIMAL(12, 2), default=0)
    total_deductions = Column(DECIMAL(12, 2), nullable=True)
    
    net_pay = Column(DECIMAL(12, 2), nullable=True)
    
    payment_status = Column(Enum("PENDING", "PROCESSED", "PAID", "CANCELLED"), default="PENDING")
    payment_date = Column(Date, nullable=True)
    payment_method = Column(String(50), nullable=True)
    
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    employee = relationship("User", foreign_keys=[employee_id], back_populates="payroll_history")
    created_by_user = relationship("User", foreign_keys=[created_by])
