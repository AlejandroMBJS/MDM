# app/repositories/payroll_history_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.payroll_history import PayrollHistory
from typing import List

class PayrollHistoryRepository(BaseRepository[PayrollHistory]):
    def __init__(self):
        super().__init__(PayrollHistory)

    def get_by_employee_id(self, db: Session, employee_id: int) -> List[PayrollHistory]:
        return db.query(self.model).filter(self.model.employee_id == employee_id).all()
