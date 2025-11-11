# app/models/emergency_contact.py
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class EmergencyContact(BaseModel):
    __tablename__ = "emergency_contacts"

    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    contact_name = Column(String(200), nullable=False)
    relationship_type = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=False)
    alternative_phone = Column(String(20), nullable=True)
    email = Column(String(200), nullable=True)
    address = Column(String(500), nullable=True)
    is_primary = Column(Boolean, default=False)

    employee = relationship("User", back_populates="emergency_contacts")
