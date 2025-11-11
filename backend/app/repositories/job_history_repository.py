# app/repositories/job_history_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.job_history import JobHistory
from typing import List

class JobHistoryRepository(BaseRepository[JobHistory]):
    def __init__(self):
        super().__init__(JobHistory)

    def get_by_employee_id(self, db: Session, employee_id: int) -> List[JobHistory]:
        return db.query(self.model).filter(self.model.employee_id == employee_id).all()
