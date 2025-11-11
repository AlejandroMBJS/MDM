# app/repositories/auditoria_horarios_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.auditoria_horarios import AuditoriaHorarios
from typing import List

class AuditoriaHorariosRepository(BaseRepository[AuditoriaHorarios]):
    def __init__(self):
        super().__init__(AuditoriaHorarios)

    def get_by_empleado_id(self, db: Session, empleado_id: int) -> List[AuditoriaHorarios]:
        return db.query(self.model).filter(self.model.empleado_id == empleado_id).all()
