# app/repositories/absence_request_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.absence_request import AbsenceRequest
from typing import List

class AbsenceRequestRepository(BaseRepository[AbsenceRequest]):
    def __init__(self):
        super().__init__(AbsenceRequest)

    def get_by_employee_id(self, db: Session, employee_id: int) -> List[AbsenceRequest]:
        return db.query(self.model).filter(self.model.employee_id == employee_id).all()
