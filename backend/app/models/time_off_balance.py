# app/models/time_off_balance.py
from sqlalchemy import Column, String, Integer, Date, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime

class TimeOffBalance(BaseModel):
    __tablename__ = "time_off_balances"

    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    year = Column(Integer, nullable=False) # YEAR type in SQL is typically Integer in SQLAlchemy
    leave_type = Column(String(50), nullable=False)
    total_days = Column(DECIMAL(8, 2), default=0, nullable=False)
    used_days = Column(DECIMAL(8, 2), default=0)
    pending_days = Column(DECIMAL(8, 2), default=0)
    # available_days is a generated column, so we don't map it directly in SQLAlchemy
    expires_on = Column(Date, nullable=True)
    notes = Column(String(500), nullable=True)

    employee = relationship("User", back_populates="time_off_balances")
