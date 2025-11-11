# app/models/employee_document.py
from sqlalchemy import Column, String, Integer, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime

class EmployeeDocument(BaseModel):
    __tablename__ = "employee_documents"

    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_type = Column(String(100), nullable=False)
    document_name = Column(String(200), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_url = Column(String(500), nullable=True)
    expiration_date = Column(Date, nullable=True)
    is_verified = Column(Boolean, default=False)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_date = Column(DateTime, nullable=True)
    notes = Column(String(500), nullable=True)

    employee = relationship("User", foreign_keys=[employee_id], back_populates="employee_documents")
    verifier = relationship("User", foreign_keys=[verified_by])
