# app/api/v1/approval_history.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.approval_history_schema import ApprovalHistoryCreate, ApprovalHistoryOut
from app.repositories.approval_history_repository import ApprovalHistoryRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = ApprovalHistoryRepository()

@router.post("/", response_model=ApprovalHistoryOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_approval_history(payload: ApprovalHistoryCreate, db: Session = Depends(get_db)):
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[ApprovalHistoryOut], dependencies=[Depends(JWTBearer())])
def list_approval_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=ApprovalHistoryOut, dependencies=[Depends(JWTBearer())])
def get_approval_history(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de aprobación no encontrado")
    return obj

@router.put("/{id}", response_model=ApprovalHistoryOut, dependencies=[Depends(JWTBearer())])
def update_approval_history(id: int, payload: ApprovalHistoryCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de aprobación no encontrado")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_approval_history(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de aprobación no encontrado")
    repo.delete(db=db, id=id)
    return
