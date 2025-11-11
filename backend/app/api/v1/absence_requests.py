# app/api/v1/absence_requests.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.absence_request_schema import AbsenceRequestCreate, AbsenceRequestOut
from app.repositories.absence_request_repository import AbsenceRequestRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = AbsenceRequestRepository()

@router.post("/", response_model=AbsenceRequestOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_absence_request(payload: AbsenceRequestCreate, db: Session = Depends(get_db)):
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[AbsenceRequestOut], dependencies=[Depends(JWTBearer())])
def list_absence_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=AbsenceRequestOut, dependencies=[Depends(JWTBearer())])
def get_absence_request(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud de ausencia no encontrada")
    return obj

@router.put("/{id}", response_model=AbsenceRequestOut, dependencies=[Depends(JWTBearer())])
def update_absence_request(id: int, payload: AbsenceRequestCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud de ausencia no encontrada")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_absence_request(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud de ausencia no encontrada")
    repo.delete(db=db, id=id)
    return
