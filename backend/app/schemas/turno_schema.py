# app/schemas/turno_schema.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TurnoBase(BaseModel):
    nombre: str
    codigo: str
    hora_inicio: str
    hora_fin: str
    es_descanso: bool = False
    activo: bool = True

class TurnoCreate(TurnoBase):
    pass

class TurnoOut(TurnoBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
