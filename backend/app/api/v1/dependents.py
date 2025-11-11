# app/api/v1/dependents.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.dependent_schema import DependentCreate, DependentOut
from app.repositories.dependent_repository import DependentRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = DependentRepository()

@router.post("/", response_model=DependentOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_dependent(payload: DependentCreate, db: Session = Depends(get_db)):
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[DependentOut], dependencies=[Depends(JWTBearer())])
def list_dependents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=DependentOut, dependencies=[Depends(JWTBearer())])
def get_dependent(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dependiente no encontrado")
    return obj

@router.put("/{id}", response_model=DependentOut, dependencies=[Depends(JWTBearer())])
def update_dependent(id: int, payload: DependentCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dependiente no encontrado")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_dependent(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dependiente no encontrado")
    repo.delete(db=db, id=id)
    return
