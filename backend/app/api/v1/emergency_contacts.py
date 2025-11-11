# app/api/v1/emergency_contacts.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.emergency_contact_schema import EmergencyContactCreate, EmergencyContactOut
from app.repositories.emergency_contact_repository import EmergencyContactRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = EmergencyContactRepository()

@router.post("/", response_model=EmergencyContactOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_emergency_contact(payload: EmergencyContactCreate, db: Session = Depends(get_db)):
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[EmergencyContactOut], dependencies=[Depends(JWTBearer())])
def list_emergency_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=EmergencyContactOut, dependencies=[Depends(JWTBearer())])
def get_emergency_contact(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contacto de emergencia no encontrado")
    return obj

@router.put("/{id}", response_model=EmergencyContactOut, dependencies=[Depends(JWTBearer())])
def update_emergency_contact(id: int, payload: EmergencyContactCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contacto de emergencia no encontrado")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_emergency_contact(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contacto de emergencia no encontrado")
    repo.delete(db=db, id=id)
    return