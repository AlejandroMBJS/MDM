# app/repositories/turno_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.turno import Turno
from typing import Optional

class TurnoRepository(BaseRepository[Turno]):
    def __init__(self):
        super().__init__(Turno)

    def get_by_codigo(self, db: Session, codigo: str) -> Optional[Turno]:
        return db.query(self.model).filter(self.model.codigo == codigo).first()
