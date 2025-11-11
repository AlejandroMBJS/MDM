# app/repositories/employee_benefit_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.employee_benefit import EmployeeBenefit
from typing import List

class EmployeeBenefitRepository(BaseRepository[EmployeeBenefit]):
    def __init__(self):
        super().__init__(EmployeeBenefit)

    def get_by_employee_id(self, db: Session, employee_id: int) -> List[EmployeeBenefit]:
        return db.query(self.model).filter(self.model.employee_id == employee_id).all()
