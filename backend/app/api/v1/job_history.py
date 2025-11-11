# app/api/v1/job_history.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.job_history_schema import JobHistoryCreate, JobHistoryOut
from app.repositories.job_history_repository import JobHistoryRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = JobHistoryRepository()

@router.post("/", response_model=JobHistoryOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_job_history(payload: JobHistoryCreate, db: Session = Depends(get_db)):
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[JobHistoryOut], dependencies=[Depends(JWTBearer())])
def list_job_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=JobHistoryOut, dependencies=[Depends(JWTBearer())])
def get_job_history(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de trabajo no encontrado")
    return obj

@router.put("/{id}", response_model=JobHistoryOut, dependencies=[Depends(JWTBearer())])
def update_job_history(id: int, payload: JobHistoryCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de trabajo no encontrado")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_job_history(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de trabajo no encontrado")
    repo.delete(db=db, id=id)
    return
