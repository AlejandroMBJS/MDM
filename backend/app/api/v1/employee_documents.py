# app/api/v1/employee_documents.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.employee_document_schema import EmployeeDocumentCreate, EmployeeDocumentOut
from app.repositories.employee_document_repository import EmployeeDocumentRepository
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = EmployeeDocumentRepository()

@router.post("/", response_model=EmployeeDocumentOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_employee_document(payload: EmployeeDocumentCreate, db: Session = Depends(get_db)):
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[EmployeeDocumentOut], dependencies=[Depends(JWTBearer())])
def list_employee_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=EmployeeDocumentOut, dependencies=[Depends(JWTBearer())])
def get_employee_document(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Documento de empleado no encontrado")
    return obj

@router.put("/{id}", response_model=EmployeeDocumentOut, dependencies=[Depends(JWTBearer())])
def update_employee_document(id: int, payload: EmployeeDocumentCreate, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Documento de empleado no encontrado")
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_employee_document(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Documento de empleado no encontrado")
    repo.delete(db=db, id=id)
    return
