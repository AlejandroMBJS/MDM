# app/repositories/emergency_contact_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.emergency_contact import EmergencyContact
from typing import List

class EmergencyContactRepository(BaseRepository[EmergencyContact]):
    def __init__(self):
        super().__init__(EmergencyContact)

    def get_by_employee_id(self, db: Session, employee_id: int) -> List[EmergencyContact]:
        return db.query(self.model).filter(self.model.employee_id == employee_id).all()
