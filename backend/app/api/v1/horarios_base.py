# app/api/v1/horarios_base.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.schemas.horario_base_schema import HorarioBaseCreate, HorarioBaseUpdate, HorarioBaseOut
from app.repositories.horario_base_repository import HorarioBaseRepository

# Si usas auth JWT:
# from app.core.auth_bearer import JWTBearer
# auth_dep = Depends(JWTBearer())

router = APIRouter()
repo = HorarioBaseRepository()

@router.get("/", response_model=List[HorarioBaseOut])
def list_horarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/by-empleado/{empleado_id}", response_model=List[HorarioBaseOut])
def list_by_empleado(empleado_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_by_empleado(db=db, empleado_id=empleado_id, skip=skip, limit=limit)

@router.get("/{id}", response_model=HorarioBaseOut)
def get_horario(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario not found")
    return obj

@router.post("/", response_model=HorarioBaseOut, status_code=status.HTTP_201_CREATED)
def create_horario(payload: HorarioBaseCreate, db: Session = Depends(get_db)):
    # puedes validar que empleado y turno existan (FK)
    return repo.create(db=db, obj_in=payload)

@router.put("/{id}", response_model=HorarioBaseOut)
def update_horario(id: int, payload: HorarioBaseUpdate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario not found")
    updated = repo.update(db=db, db_obj=obj, obj_in=payload.dict(exclude_unset=True))
    return updated

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_horario(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario not found")
    repo.delete(db=db, id=id)
    return None
