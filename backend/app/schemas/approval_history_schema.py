# app/schemas/approval_history_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ApprovalHistoryBase(BaseModel):
    request_id: int
    approver_id: int
    approval_stage: str
    action: str
    comments: Optional[str] = None

class ApprovalHistoryCreate(ApprovalHistoryBase):
    pass

class ApprovalHistoryOut(ApprovalHistoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
