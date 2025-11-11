# app/models/dependent.py
from sqlalchemy import Column, String, Integer, Boolean, Date, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime

class Dependent(BaseModel):
    __tablename__ = "dependents"

    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dependent_name = Column(String(200), nullable=False)
    relationship_type = Column(String(100), nullable=False)
    birth_date = Column(Date, nullable=True)
    gender = Column(String(20), nullable=True)
    curp = Column(String(18), nullable=True)
    is_beneficiary = Column(Boolean, default=False)
    beneficiary_percentage = Column(DECIMAL(5, 2), nullable=True)
    is_dependent = Column(Boolean, default=True)
    has_disability = Column(Boolean, default=False)
    notes = Column(String(500), nullable=True)

    employee = relationship("User", back_populates="dependents")
