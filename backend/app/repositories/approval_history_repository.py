# app/repositories/approval_history_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.approval_history import ApprovalHistory
from typing import List

class ApprovalHistoryRepository(BaseRepository[ApprovalHistory]):
    def __init__(self):
        super().__init__(ApprovalHistory)

    def get_by_approver_id(self, db: Session, approver_id: int) -> List[ApprovalHistory]:
        return db.query(self.model).filter(self.model.approver_id == approver_id).all()

    def get_by_request_id(self, db: Session, request_id: int) -> List[ApprovalHistory]:
        return db.query(self.model).filter(self.model.request_id == request_id).all()
