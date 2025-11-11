# app/models/employee_benefit.py
from sqlalchemy import Column, String, Integer, Date, DECIMAL, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime

class EmployeeBenefit(BaseModel):
    __tablename__ = "employee_benefits"

    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    benefit_type = Column(String(100), nullable=False)
    benefit_name = Column(String(200), nullable=False)
    provider = Column(String(200), nullable=True)
    policy_number = Column(String(100), nullable=True)
    coverage_amount = Column(DECIMAL(12, 2), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    employee_cost = Column(DECIMAL(10, 2), default=0)
    employer_cost = Column(DECIMAL(10, 2), default=0)
    beneficiary_name = Column(String(200), nullable=True)
    is_active = Column(Boolean, default=True)
    notes = Column(String(500), nullable=True)

    employee = relationship("User", back_populates="employee_benefits")
