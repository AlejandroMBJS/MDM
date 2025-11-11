# app/schemas/notification_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    user_id: int
    request_id: Optional[int] = None
    message: str
    is_read: bool = False
    notification_type: Optional[str] = None
    read_at: Optional[datetime] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationOut(NotificationBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
