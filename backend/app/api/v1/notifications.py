# app/api/v1/notifications.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.notification_schema import NotificationCreate, NotificationOut
from app.repositories.notification_repository import NotificationRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = NotificationRepository()

@router.post("/", response_model=NotificationOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_notification(payload: NotificationCreate, db: Session = Depends(get_db)):
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[NotificationOut], dependencies=[Depends(JWTBearer())])
def list_notifications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=NotificationOut, dependencies=[Depends(JWTBearer())])
def get_notification(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notificación no encontrada")
    return obj

@router.put("/{id}", response_model=NotificationOut, dependencies=[Depends(JWTBearer())])
def update_notification(id: int, payload: NotificationCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notificación no encontrada")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_notification(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notificación no encontrada")
    repo.delete(db=db, id=id)
    return
