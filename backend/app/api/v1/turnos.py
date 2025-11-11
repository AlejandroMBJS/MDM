# app/api/v1/turnos.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.turno_schema import TurnoCreate, TurnoOut
from app.repositories.turno_repository import TurnoRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = TurnoRepository()

@router.post("/", response_model=TurnoOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_turno(payload: TurnoCreate, db: Session = Depends(get_db)):
    existing = repo.get_by_codigo(db=db, codigo=payload.codigo)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Código de turno ya registrado")
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[TurnoOut], dependencies=[Depends(JWTBearer())])
def list_turnos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=TurnoOut, dependencies=[Depends(JWTBearer())])
def get_turno(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turno no encontrado")
    return obj

@router.put("/{id}", response_model=TurnoOut, dependencies=[Depends(JWTBearer())])
def update_turno(id: int, payload: TurnoCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turno no encontrado")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_turno(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turno no encontrado")
    repo.delete(db=db, id=id)
    return
