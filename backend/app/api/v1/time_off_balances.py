# app/api/v1/time_off_balances.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.time_off_balance_schema import TimeOffBalanceCreate, TimeOffBalanceOut
from app.repositories.time_off_balance_repository import TimeOffBalanceRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = TimeOffBalanceRepository()

@router.post("/", response_model=TimeOffBalanceOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_time_off_balance(payload: TimeOffBalanceCreate, db: Session = Depends(get_db)):
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[TimeOffBalanceOut], dependencies=[Depends(JWTBearer())])
def list_time_off_balances(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=TimeOffBalanceOut, dependencies=[Depends(JWTBearer())])
def get_time_off_balance(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Balance de tiempo libre no encontrado")
    return obj

@router.put("/{id}", response_model=TimeOffBalanceOut, dependencies=[Depends(JWTBearer())])
def update_time_off_balance(id: int, payload: TimeOffBalanceCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Balance de tiempo libre no encontrado")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_time_off_balance(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Balance de tiempo libre no encontrado")
    repo.delete(db=db, id=id)
    return
