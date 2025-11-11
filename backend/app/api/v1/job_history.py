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
def create_job_history(user_id: int, payload: JobHistoryCreate, db: Session = Depends(get_db)):
    """
    Create new job history record for a user.
    The user_id is captured from the URL path.
    """
    # Optional: Validate that payload.employee_id matches user_id
    if hasattr(payload, 'employee_id') and payload.employee_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="employee_id in payload must match user_id in URL"
        )
    
    db_obj = repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/", response_model=List[JobHistoryOut], dependencies=[Depends(JWTBearer())])
def list_job_history(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    List all job history records for a specific user.
    Filters by user_id (employee_id) automatically.
    """
    # If your repository has a method to filter by employee_id, use it:
    # return repo.get_by_employee(db=db, employee_id=user_id, skip=skip, limit=limit)
    
    # Otherwise, get all and filter (less efficient):
    all_records = repo.get_multi(db=db, skip=skip, limit=limit)
    # Filter by employee_id if your model has this field
    filtered = [r for r in all_records if getattr(r, 'employee_id', None) == user_id]
    return filtered

@router.get("/{id}", response_model=JobHistoryOut, dependencies=[Depends(JWTBearer())])
def get_job_history(user_id: int, id: int, db: Session = Depends(get_db)):
    """
    Get a specific job history record.
    Validates that the record belongs to the specified user.
    """
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Historial de trabajo no encontrado"
        )
    
    # Verify the record belongs to this user
    if hasattr(obj, 'employee_id') and obj.employee_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permiso para acceder a este registro"
        )
    
    return obj

@router.put("/{id}", response_model=JobHistoryOut, dependencies=[Depends(JWTBearer())])
def update_job_history(user_id: int, id: int, payload: JobHistoryCreate, db: Session = Depends(get_db)):
    """
    Update a job history record.
    Validates that the record belongs to the specified user.
    """
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Historial de trabajo no encontrado"
        )
    
    # Verify the record belongs to this user
    if hasattr(obj, 'employee_id') and obj.employee_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permiso para modificar este registro"
        )
    
    # Optional: Ensure employee_id doesn't change
    if hasattr(payload, 'employee_id') and payload.employee_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puede cambiar el employee_id"
        )
    
    obj = repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_job_history(user_id: int, id: int, db: Session = Depends(get_db)):
    """
    Delete a job history record.
    Validates that the record belongs to the specified user.
    """
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Historial de trabajo no encontrado"
        )
    
    # Verify the record belongs to this user
    if hasattr(obj, 'employee_id') and obj.employee_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permiso para eliminar este registro"
        )
    
    repo.delete(db=db, id=id)
    return
