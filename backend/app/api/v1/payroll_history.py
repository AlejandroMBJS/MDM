# app/api/v1/payroll_history.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.payroll_history_schema import PayrollHistoryCreate, PayrollHistoryOut
from app.repositories.payroll_history_repository import PayrollHistoryRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = PayrollHistoryRepository()

@router.post("/", response_model=PayrollHistoryOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_payroll_history(payload: PayrollHistoryCreate, db: Session = Depends(get_db)):
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[PayrollHistoryOut], dependencies=[Depends(JWTBearer())])
def list_payroll_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=PayrollHistoryOut, dependencies=[Depends(JWTBearer())])
def get_payroll_history(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de nómina no encontrado")
    return obj

@router.put("/{id}", response_model=PayrollHistoryOut, dependencies=[Depends(JWTBearer())])
def update_payroll_history(id: int, payload: PayrollHistoryCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de nómina no encontrado")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_payroll_history(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de nómina no encontrado")
    repo.delete(db=db, id=id)
    return
