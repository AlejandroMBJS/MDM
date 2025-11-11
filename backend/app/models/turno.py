# app/models/turno.py
from sqlalchemy import Column, String, Integer, Boolean, DateTime
from app.models.base import BaseModel
import datetime

class Turno(BaseModel):
    __tablename__ = "turnos"

    nombre = Column(String(200), nullable=False)
    codigo = Column(String(50), unique=True, nullable=False)
    hora_inicio = Column(String(10), nullable=False)
    hora_fin = Column(String(10), nullable=False)
    es_descanso = Column(Boolean, default=False)
    activo = Column(Boolean, default=True)
