# app/schemas/auditoria_horarios_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime, time

class AuditoriaHorariosBase(BaseModel):
    empleado_id: int
    fecha: date
    hora_entrada: Optional[time] = None
    hora_salida: Optional[time] = None
    estado: str = "puntual" # ENUM: 'puntual', 'tarde', 'ausente', 'temprano'
    registrado_por: Optional[int] = None
    notas: Optional[str] = None

class AuditoriaHorariosCreate(AuditoriaHorariosBase):
    pass

class AuditoriaHorariosOut(AuditoriaHorariosBase):
    id: int
    horas_trabajadas: Optional[float] = None # Generated column
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
