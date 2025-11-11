# app/models/auditoria_horarios.py
from sqlalchemy import Column, String, Integer, Date, Time, DECIMAL, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime

class AuditoriaHorarios(BaseModel):
    __tablename__ = "auditoria_horarios"

    empleado_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora_entrada = Column(Time, nullable=True)
    hora_salida = Column(Time, nullable=True)
    # horas_trabajadas is a generated column, so we don't map it directly in SQLAlchemy
    estado = Column(Enum("puntual", "tarde", "ausente", "temprano"), default="puntual")
    registrado_por = Column(Integer, ForeignKey("users.id"), nullable=True)
    notas = Column(String(500), nullable=True)

    employee = relationship("User", foreign_keys=[empleado_id], back_populates="auditoria_horarios")
    registered_by_user = relationship("User", foreign_keys=[registrado_por])
