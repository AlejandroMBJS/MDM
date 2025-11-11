# app/models/job_history.py
from sqlalchemy import Column, String, Integer, Date, DECIMAL, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime

class JobHistory(BaseModel):
    __tablename__ = "job_history"

    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    effective_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    position_title = Column(String(200), nullable=True)
    department = Column(String(200), nullable=True)
    area = Column(String(200), nullable=True)
    supervisor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    salary = Column(DECIMAL(12, 2), nullable=True)
    change_type = Column(String(50), nullable=True)
    change_reason = Column(String(500), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    employee = relationship("User", foreign_keys=[employee_id], back_populates="job_history")
    supervisor = relationship("User", foreign_keys=[supervisor_id])
    creator = relationship("User", foreign_keys=[created_by])
