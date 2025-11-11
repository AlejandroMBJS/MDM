# app/repositories/dependent_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.dependent import Dependent
from typing import List

class DependentRepository(BaseRepository[Dependent]):
    def __init__(self):
        super().__init__(Dependent)

    def get_by_employee_id(self, db: Session, employee_id: int) -> List[Dependent]:
        return db.query(self.model).filter(self.model.employee_id == employee_id).all()
