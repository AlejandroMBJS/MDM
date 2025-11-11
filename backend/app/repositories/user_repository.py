# app/repositories/user_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.user import User
from typing import Optional

class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(self.model).filter(self.model.email == email).first()

    def get_by_payroll_number(self, db: Session, payroll_number: str) -> Optional[User]:
        return db.query(self.model).filter(self.model.payroll_number == payroll_number).first()
