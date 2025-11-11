# app/api/v1/auditoria_horarios.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.auditoria_horarios_schema import AuditoriaHorariosCreate, AuditoriaHorariosOut
from app.repositories.auditoria_horarios_repository import AuditoriaHorariosRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = AuditoriaHorariosRepository()

@router.post("/", response_model=AuditoriaHorariosOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_auditoria_horarios(payload: AuditoriaHorariosCreate, db: Session = Depends(get_db)):
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[AuditoriaHorariosOut], dependencies=[Depends(JWTBearer())])
def list_auditoria_horarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=AuditoriaHorariosOut, dependencies=[Depends(JWTBearer())])
def get_auditoria_horarios(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Auditoría de horario no encontrada")
    return obj

@router.put("/{id}", response_model=AuditoriaHorariosOut, dependencies=[Depends(JWTBearer())])
def update_auditoria_horarios(id: int, payload: AuditoriaHorariosCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Auditoría de horario no encontrada")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_auditoria_horarios(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Auditoría de horario no encontrada")
    repo.delete(db=db, id=id)
    return
