# app/schemas/horario_excepcion_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class HorarioExcepcionBase(BaseModel):
    empleado_id: int
    fecha_inicio: date
    fecha_fin: date
    turno_id: int
    motivo: Optional[str] = None
    aprobado_por: Optional[int] = None
    estado: str = "pendiente" # ENUM: 'pendiente', 'aprobado', 'rechazado'

class HorarioExcepcionCreate(HorarioExcepcionBase):
    pass

class HorarioExcepcionOut(HorarioExcepcionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
