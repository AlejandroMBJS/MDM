# app/models/horario_base.py
from sqlalchemy import Column, Integer, DateTime, func, UniqueConstraint, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class HorarioBase(BaseModel):
    __tablename__ = "horarios_base"

    empleado_id = Column("empleado_id", Integer, ForeignKey("users.id"), nullable=False)
    turno_id = Column("turno_id", Integer, nullable=False)
    dia_semana = Column("dia_semana", Integer, nullable=False)  # 0..6

    employee = relationship("User", back_populates="horarios_base")

    __table_args__ = (
        UniqueConstraint("empleado_id", "dia_semana", name="uk_horario_empleado_dia"),
    )
