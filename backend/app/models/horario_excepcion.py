# app/models/horario_excepcion.py
from sqlalchemy import Column, String, Integer, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import datetime
from app.models.turno import Turno # Import the Turno model

class HorarioExcepcion(BaseModel):
    __tablename__ = "horarios_excepcion"

    empleado_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    turno_id = Column(Integer, ForeignKey("turnos.id"), nullable=False)
    motivo = Column(String(500), nullable=True)
    aprobado_por = Column(Integer, ForeignKey("users.id"), nullable=True)
    estado = Column(Enum("pendiente", "aprobado", "rechazado"), default="pendiente")

    employee = relationship("User", foreign_keys=[empleado_id], back_populates="horarios_excepcion")
    turno = relationship("Turno")
    approved_by_user = relationship("User", foreign_keys=[aprobado_por])
