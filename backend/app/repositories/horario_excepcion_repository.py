# app/repositories/horario_excepcion_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.horario_excepcion import HorarioExcepcion
from typing import List

class HorarioExcepcionRepository(BaseRepository[HorarioExcepcion]):
    def __init__(self):
        super().__init__(HorarioExcepcion)

    def get_by_empleado_id(self, db: Session, empleado_id: int) -> List[HorarioExcepcion]:
        return db.query(self.model).filter(self.model.empleado_id == empleado_id).all()
