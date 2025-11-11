# app/models/notification.py
from sqlalchemy import Column, String, Integer, Text, ForeignKey, Boolean, TIMESTAMP
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime

class Notification(BaseModel):
    __tablename__ = "notifications"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    request_id = Column(Integer, ForeignKey("absence_requests.id"), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    
    notification_type = Column(String(50), nullable=True)
    read_at = Column(TIMESTAMP, nullable=True)

    user = relationship("User", back_populates="notifications")
    absence_request = relationship("AbsenceRequest")
