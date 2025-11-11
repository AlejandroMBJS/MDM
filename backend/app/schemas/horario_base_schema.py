# app/schemas/horario_base_schema.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class HorarioBaseCreate(BaseModel):
    empleado_id: int
    turno_id: int
    dia_semana: int = Field(..., ge=0, le=6)

class HorarioBaseUpdate(BaseModel):
    turno_id: Optional[int] = None
    dia_semana: Optional[int] = Field(None, ge=0, le=6)

class HorarioBaseOut(BaseModel):
    id: int
    empleado_id: int
    turno_id: int
    dia_semana: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
