# app/api/v1/horarios_excepcion.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.horario_excepcion_schema import HorarioExcepcionCreate, HorarioExcepcionOut
from app.repositories.horario_excepcion_repository import HorarioExcepcionRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = HorarioExcepcionRepository()

@router.post("/", response_model=HorarioExcepcionOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_horario_excepcion(payload: HorarioExcepcionCreate, db: Session = Depends(get_db)):
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[HorarioExcepcionOut], dependencies=[Depends(JWTBearer())])
def list_horarios_excepcion(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=HorarioExcepcionOut, dependencies=[Depends(JWTBearer())])
def get_horario_excepcion(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario de excepción no encontrado")
    return obj

@router.put("/{id}", response_model=HorarioExcepcionOut, dependencies=[Depends(JWTBearer())])
def update_horario_excepcion(id: int, payload: HorarioExcepcionCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario de excepción no encontrado")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_horario_excepcion(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario de excepción no encontrado")
    repo.delete(db=db, id=id)
    return
