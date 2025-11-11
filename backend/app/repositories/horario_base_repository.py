# app/repositories/horario_base_repository.py
from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.horario_base import HorarioBase

class HorarioBaseRepository(BaseRepository[HorarioBase]):
    def __init__(self):
        super().__init__(HorarioBase)

    # Puedes añadir métodos específicos si los necesitas:
    def get_by_empleado(self, db: Session, empleado_id: int, skip: int = 0, limit: int = 100) -> List[HorarioBase]:
        query = db.query(self.model).filter(self.model.empleado_id == empleado_id)
        return query.offset(skip).limit(limit).all()
