# app/models/approval_history.py
from sqlalchemy import Column, String, Integer, Text, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime

class ApprovalHistory(BaseModel):
    __tablename__ = "approval_history"

    request_id = Column(Integer, ForeignKey("absence_requests.id"), nullable=False)
    approver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    approval_stage = Column(String(50), nullable=False)
    action = Column(String(50), nullable=False)
    comments = Column(Text, nullable=True)

    absence_request = relationship("AbsenceRequest")
    approver = relationship("User")
