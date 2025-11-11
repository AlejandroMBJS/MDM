# app/repositories/time_off_balance_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.time_off_balance import TimeOffBalance
from typing import List

class TimeOffBalanceRepository(BaseRepository[TimeOffBalance]):
    def __init__(self):
        super().__init__(TimeOffBalance)

    def get_by_employee_id(self, db: Session, employee_id: int) -> List[TimeOffBalance]:
        return db.query(self.model).filter(self.model.employee_id == employee_id).all()
