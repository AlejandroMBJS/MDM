# app/repositories/employee_document_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.employee_document import EmployeeDocument
from typing import List

class EmployeeDocumentRepository(BaseRepository[EmployeeDocument]):
    def __init__(self):
        super().__init__(EmployeeDocument)

    def get_by_employee_id(self, db: Session, employee_id: int) -> List[EmployeeDocument]:
        return db.query(self.model).filter(self.model.employee_id == employee_id).all()
