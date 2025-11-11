# app/api/v1/users.py
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.user_schema import UserCreate, UserOut
from app.schemas.emergency_contact_schema import EmergencyContactCreate, EmergencyContactOut
from app.schemas.dependent_schema import DependentCreate, DependentOut
from app.schemas.employee_document_schema import EmployeeDocumentCreate, EmployeeDocumentOut
from app.schemas.job_history_schema import JobHistoryCreate, JobHistoryOut
from app.schemas.time_off_balance_schema import TimeOffBalanceCreate, TimeOffBalanceOut
from app.schemas.employee_benefit_schema import EmployeeBenefitCreate, EmployeeBenefitOut
from app.schemas.horario_base_schema import HorarioBaseCreate, HorarioBaseOut
from app.schemas.horario_excepcion_schema import HorarioExcepcionCreate, HorarioExcepcionOut
from app.schemas.auditoria_horarios_schema import AuditoriaHorariosCreate, AuditoriaHorariosOut
from app.schemas.payroll_history_schema import PayrollHistoryCreate, PayrollHistoryOut
from app.schemas.absence_request_schema import AbsenceRequestCreate, AbsenceRequestOut
from app.schemas.approval_history_schema import ApprovalHistoryCreate, ApprovalHistoryOut
from app.schemas.notification_schema import NotificationCreate, NotificationOut
from app.repositories.user_repository import UserRepository
from app.repositories.emergency_contact_repository import EmergencyContactRepository
from app.repositories.dependent_repository import DependentRepository
from app.repositories.employee_document_repository import EmployeeDocumentRepository
from app.repositories.job_history_repository import JobHistoryRepository
from app.repositories.time_off_balance_repository import TimeOffBalanceRepository
from app.repositories.employee_benefit_repository import EmployeeBenefitRepository
from app.repositories.horario_base_repository import HorarioBaseRepository
from app.repositories.horario_excepcion_repository import HorarioExcepcionRepository
from app.repositories.auditoria_horarios_repository import AuditoriaHorariosRepository
from app.repositories.payroll_history_repository import PayrollHistoryRepository
from app.repositories.absence_request_repository import AbsenceRequestRepository
from app.repositories.approval_history_repository import ApprovalHistoryRepository
from app.repositories.notification_repository import NotificationRepository
from app.core.security import hash_password
from app.core.auth_bearer import JWTBearer

router = APIRouter()
repo = UserRepository()

@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):

    existing = repo.get_by_email(db=db, email=payload.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email ya registrado")
    
    # Extract password, hash it, and then create the user with all other fields
    password = payload.password
    hashed_password = hash_password(password)
    
    user_data = payload.dict(exclude_unset=True) # Use exclude_unset to only include provided fields
    user_data.pop("password") # Remove plain password
    user_data["password_hash"] = hashed_password
    
    db_obj = repo.create(db=db, obj_in=user_data)
    return db_obj

@router.get("/", response_model=List[UserOut], dependencies=[Depends(JWTBearer())])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{id}", response_model=UserOut, dependencies=[Depends(JWTBearer())])
def get_user(id: int, db: Session = Depends(get_db)):
    obj = repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return obj

# Emergency Contacts for a specific user
@router.post("/{user_id}/emergency-contacts/", response_model=EmergencyContactOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_emergency_contact_for_user(user_id: int, payload: EmergencyContactCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ec_repo = EmergencyContactRepository()
    db_obj = ec_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/emergency-contacts/", response_model=List[EmergencyContactOut], dependencies=[Depends(JWTBearer())])
def list_emergency_contacts_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ec_repo = EmergencyContactRepository()
    return ec_repo.get_by_employee_id(db=db, employee_id=user_id)

@router.get("/{user_id}/emergency-contacts/{contact_id}", response_model=EmergencyContactOut, dependencies=[Depends(JWTBearer())])
def get_emergency_contact_for_user(user_id: int, contact_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ec_repo = EmergencyContactRepository()
    obj = ec_repo.get(db=db, id=contact_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contacto de emergencia no encontrado para este usuario")
    return obj

@router.put("/{user_id}/emergency-contacts/{contact_id}", response_model=EmergencyContactOut, dependencies=[Depends(JWTBearer())])
def update_emergency_contact_for_user(user_id: int, contact_id: int, payload: EmergencyContactCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ec_repo = EmergencyContactRepository()
    obj = ec_repo.get(db=db, id=contact_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contacto de emergencia no encontrado para este usuario")
    
    obj = ec_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/emergency-contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_emergency_contact_for_user(user_id: int, contact_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ec_repo = EmergencyContactRepository()
    obj = ec_repo.get(db=db, id=contact_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contacto de emergencia no encontrado para este usuario")
    
    ec_repo.delete(db=db, id=contact_id)
    return

# Dependents for a specific user
@router.post("/{user_id}/dependents/", response_model=DependentOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_dependent_for_user(user_id: int, payload: DependentCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    dep_repo = DependentRepository()
    db_obj = dep_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/dependents/", response_model=List[DependentOut], dependencies=[Depends(JWTBearer())])
def list_dependents_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    dep_repo = DependentRepository()
    return dep_repo.get_by_employee_id(db=db, employee_id=user_id)

@router.get("/{user_id}/dependents/{dependent_id}", response_model=DependentOut, dependencies=[Depends(JWTBearer())])
def get_dependent_for_user(user_id: int, dependent_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    dep_repo = DependentRepository()
    obj = dep_repo.get(db=db, id=dependent_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dependiente no encontrado para este usuario")
    return obj

@router.put("/{user_id}/dependents/{dependent_id}", response_model=DependentOut, dependencies=[Depends(JWTBearer())])
def update_dependent_for_user(user_id: int, dependent_id: int, payload: DependentCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    dep_repo = DependentRepository()
    obj = dep_repo.get(db=db, id=dependent_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dependiente no encontrado para este usuario")
    
    obj = dep_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/dependents/{dependent_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_dependent_for_user(user_id: int, dependent_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    dep_repo = DependentRepository()
    obj = dep_repo.get(db=db, id=dependent_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dependiente no encontrado para este usuario")
    
    dep_repo.delete(db=db, id=dependent_id)
    return

# Employee Documents for a specific user
@router.post("/{user_id}/documents/", response_model=EmployeeDocumentOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_employee_document_for_user(user_id: int, payload: EmployeeDocumentCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    doc_repo = EmployeeDocumentRepository()
    db_obj = doc_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/documents/", response_model=List[EmployeeDocumentOut], dependencies=[Depends(JWTBearer())])
def list_employee_documents_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    doc_repo = EmployeeDocumentRepository()
    return doc_repo.get_by_employee_id(db=db, employee_id=user_id)

@router.get("/{user_id}/documents/{document_id}", response_model=EmployeeDocumentOut, dependencies=[Depends(JWTBearer())])
def get_employee_document_for_user(user_id: int, document_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    doc_repo = EmployeeDocumentRepository()
    obj = doc_repo.get(db=db, id=document_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Documento de empleado no encontrado para este usuario")
    return obj

@router.put("/{user_id}/documents/{document_id}", response_model=EmployeeDocumentOut, dependencies=[Depends(JWTBearer())])
def update_employee_document_for_user(user_id: int, document_id: int, payload: EmployeeDocumentCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    doc_repo = EmployeeDocumentRepository()
    obj = doc_repo.get(db=db, id=document_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Documento de empleado no encontrado para este usuario")
    
    obj = doc_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_employee_document_for_user(user_id: int, document_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    doc_repo = EmployeeDocumentRepository()
    obj = doc_repo.get(db=db, id=document_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Documento de empleado no encontrado para este usuario")
    
    doc_repo.delete(db=db, id=document_id)
    return

# Job History for a specific user
@router.post("/{user_id}/job-history/", response_model=JobHistoryOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_job_history_for_user(user_id: int, payload: JobHistoryCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    jh_repo = JobHistoryRepository()
    db_obj = jh_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/job-history/", response_model=List[JobHistoryOut], dependencies=[Depends(JWTBearer())])
def list_job_history_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    jh_repo = JobHistoryRepository()
    return jh_repo.get_by_employee_id(db=db, employee_id=user_id)

@router.get("/{user_id}/job-history/{history_id}", response_model=JobHistoryOut, dependencies=[Depends(JWTBearer())])
def get_job_history_for_user(user_id: int, history_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    jh_repo = JobHistoryRepository()
    obj = jh_repo.get(db=db, id=history_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de trabajo no encontrado para este usuario")
    return obj

@router.put("/{user_id}/job-history/{history_id}", response_model=JobHistoryOut, dependencies=[Depends(JWTBearer())])
def update_job_history_for_user(user_id: int, history_id: int, payload: JobHistoryCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    jh_repo = JobHistoryRepository()
    obj = jh_repo.get(db=db, id=history_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de trabajo no encontrado para este usuario")
    
    obj = jh_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/job-history/{history_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_job_history_for_user(user_id: int, history_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    jh_repo = JobHistoryRepository()
    obj = jh_repo.get(db=db, id=history_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de trabajo no encontrado para este usuario")
    
    jh_repo.delete(db=db, id=history_id)
    return

# Time Off Balances for a specific user
@router.post("/{user_id}/time-off-balances/", response_model=TimeOffBalanceOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_time_off_balance_for_user(user_id: int, payload: TimeOffBalanceCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    tob_repo = TimeOffBalanceRepository()
    db_obj = tob_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/time-off-balances/", response_model=List[TimeOffBalanceOut], dependencies=[Depends(JWTBearer())])
def list_time_off_balances_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    tob_repo = TimeOffBalanceRepository()
    return tob_repo.get_by_employee_id(db=db, employee_id=user_id)

@router.get("/{user_id}/time-off-balances/{balance_id}", response_model=TimeOffBalanceOut, dependencies=[Depends(JWTBearer())])
def get_time_off_balance_for_user(user_id: int, balance_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    tob_repo = TimeOffBalanceRepository()
    obj = tob_repo.get(db=db, id=balance_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Balance de tiempo libre no encontrado para este usuario")
    return obj

@router.put("/{user_id}/time-off-balances/{balance_id}", response_model=TimeOffBalanceOut, dependencies=[Depends(JWTBearer())])
def update_time_off_balance_for_user(user_id: int, balance_id: int, payload: TimeOffBalanceCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    tob_repo = TimeOffBalanceRepository()
    obj = tob_repo.get(db=db, id=balance_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Balance de tiempo libre no encontrado para este usuario")
    
    obj = tob_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/time-off-balances/{balance_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_time_off_balance_for_user(user_id: int, balance_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    tob_repo = TimeOffBalanceRepository()
    obj = tob_repo.get(db=db, id=balance_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Balance de tiempo libre no encontrado para este usuario")
    
    tob_repo.delete(db=db, id=balance_id)
    return

# Employee Benefits for a specific user
@router.post("/{user_id}/benefits/", response_model=EmployeeBenefitOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_employee_benefit_for_user(user_id: int, payload: EmployeeBenefitCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    eb_repo = EmployeeBenefitRepository()
    db_obj = eb_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/benefits/", response_model=List[EmployeeBenefitOut], dependencies=[Depends(JWTBearer())])
def list_employee_benefits_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    eb_repo = EmployeeBenefitRepository()
    return eb_repo.get_by_employee_id(db=db, employee_id=user_id)

@router.get("/{user_id}/benefits/{benefit_id}", response_model=EmployeeBenefitOut, dependencies=[Depends(JWTBearer())])
def get_employee_benefit_for_user(user_id: int, benefit_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    eb_repo = EmployeeBenefitRepository()
    obj = eb_repo.get(db=db, id=benefit_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Beneficio de empleado no encontrado para este usuario")
    return obj

@router.put("/{user_id}/benefits/{benefit_id}", response_model=EmployeeBenefitOut, dependencies=[Depends(JWTBearer())])
def update_employee_benefit_for_user(user_id: int, benefit_id: int, payload: EmployeeBenefitCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    eb_repo = EmployeeBenefitRepository()
    obj = eb_repo.get(db=db, id=benefit_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Beneficio de empleado no encontrado para este usuario")
    
    obj = eb_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/benefits/{benefit_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_employee_benefit_for_user(user_id: int, benefit_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    eb_repo = EmployeeBenefitRepository()
    obj = eb_repo.get(db=db, id=benefit_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Beneficio de empleado no encontrado para este usuario")
    
    eb_repo.delete(db=db, id=benefit_id)
    return

# Horarios Base for a specific user
@router.post("/{user_id}/horarios-base/", response_model=HorarioBaseOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_horario_base_for_user(user_id: int, payload: HorarioBaseCreate, db: Session = Depends(get_db)):
    if user_id != payload.empleado_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    hb_repo = HorarioBaseRepository()
    db_obj = hb_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/horarios-base/", response_model=List[HorarioBaseOut], dependencies=[Depends(JWTBearer())])
def list_horarios_base_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    hb_repo = HorarioBaseRepository()
    return hb_repo.get_by_empleado_id(db=db, empleado_id=user_id)

@router.get("/{user_id}/horarios-base/{horario_id}", response_model=HorarioBaseOut, dependencies=[Depends(JWTBearer())])
def get_horario_base_for_user(user_id: int, horario_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    hb_repo = HorarioBaseRepository()
    obj = hb_repo.get(db=db, id=horario_id)
    if not obj or obj.empleado_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario base no encontrado para este usuario")
    return obj

@router.put("/{user_id}/horarios-base/{horario_id}", response_model=HorarioBaseOut, dependencies=[Depends(JWTBearer())])
def update_horario_base_for_user(user_id: int, horario_id: int, payload: HorarioBaseCreate, db: Session = Depends(get_db)):
    if user_id != payload.empleado_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    hb_repo = HorarioBaseRepository()
    obj = hb_repo.get(db=db, id=horario_id)
    if not obj or obj.empleado_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario base no encontrado para este usuario")
    
    obj = hb_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/horarios-base/{horario_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_horario_base_for_user(user_id: int, horario_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    hb_repo = HorarioBaseRepository()
    obj = hb_repo.get(db=db, id=horario_id)
    if not obj or obj.empleado_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario base no encontrado para este usuario")
    
    hb_repo.delete(db=db, id=horario_id)
    return

# Horarios Excepcion for a specific user
@router.post("/{user_id}/horarios-excepcion/", response_model=HorarioExcepcionOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_horario_excepcion_for_user(user_id: int, payload: HorarioExcepcionCreate, db: Session = Depends(get_db)):
    if user_id != payload.empleado_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    he_repo = HorarioExcepcionRepository()
    db_obj = he_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/horarios-excepcion/", response_model=List[HorarioExcepcionOut], dependencies=[Depends(JWTBearer())])
def list_horarios_excepcion_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    he_repo = HorarioExcepcionRepository()
    return he_repo.get_by_empleado_id(db=db, empleado_id=user_id)

@router.get("/{user_id}/horarios-excepcion/{horario_excepcion_id}", response_model=HorarioExcepcionOut, dependencies=[Depends(JWTBearer())])
def get_horario_excepcion_for_user(user_id: int, horario_excepcion_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    he_repo = HorarioExcepcionRepository()
    obj = he_repo.get(db=db, id=horario_excepcion_id)
    if not obj or obj.empleado_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario de excepción no encontrado para este usuario")
    return obj

@router.put("/{user_id}/horarios-excepcion/{horario_excepcion_id}", response_model=HorarioExcepcionOut, dependencies=[Depends(JWTBearer())])
def update_horario_excepcion_for_user(user_id: int, horario_excepcion_id: int, payload: HorarioExcepcionCreate, db: Session = Depends(get_db)):
    if user_id != payload.empleado_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    he_repo = HorarioExcepcionRepository()
    obj = he_repo.get(db=db, id=horario_excepcion_id)
    if not obj or obj.empleado_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario de excepción no encontrado para este usuario")
    
    obj = he_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/horarios-excepcion/{horario_excepcion_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_horario_excepcion_for_user(user_id: int, horario_excepcion_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    he_repo = HorarioExcepcionRepository()
    obj = he_repo.get(db=db, id=horario_excepcion_id)
    if not obj or obj.empleado_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Horario de excepción no encontrado para este usuario")
    
    he_repo.delete(db=db, id=horario_excepcion_id)
    return

# Auditoria Horarios for a specific user
@router.post("/{user_id}/auditoria-horarios/", response_model=AuditoriaHorariosOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_auditoria_horarios_for_user(user_id: int, payload: AuditoriaHorariosCreate, db: Session = Depends(get_db)):
    if user_id != payload.empleado_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ah_repo = AuditoriaHorariosRepository()
    db_obj = ah_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/auditoria-horarios/", response_model=List[AuditoriaHorariosOut], dependencies=[Depends(JWTBearer())])
def list_auditoria_horarios_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ah_repo = AuditoriaHorariosRepository()
    return ah_repo.get_by_empleado_id(db=db, empleado_id=user_id)

@router.get("/{user_id}/auditoria-horarios/{auditoria_id}", response_model=AuditoriaHorariosOut, dependencies=[Depends(JWTBearer())])
def get_auditoria_horarios_for_user(user_id: int, auditoria_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ah_repo = AuditoriaHorariosRepository()
    obj = ah_repo.get(db=db, id=auditoria_id)
    if not obj or obj.empleado_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Auditoría de horario no encontrada para este usuario")
    return obj

@router.put("/{user_id}/auditoria-horarios/{auditoria_id}", response_model=AuditoriaHorariosOut, dependencies=[Depends(JWTBearer())])
def update_auditoria_horarios_for_user(user_id: int, auditoria_id: int, payload: AuditoriaHorariosCreate, db: Session = Depends(get_db)):
    if user_id != payload.empleado_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ah_repo = AuditoriaHorariosRepository()
    obj = ah_repo.get(db=db, id=auditoria_id)
    if not obj or obj.empleado_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Auditoría de horario no encontrada para este usuario")
    
    obj = ah_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/auditoria-horarios/{auditoria_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_auditoria_horarios_for_user(user_id: int, auditoria_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ah_repo = AuditoriaHorariosRepository()
    obj = ah_repo.get(db=db, id=auditoria_id)
    if not obj or obj.empleado_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Auditoría de horario no encontrada para este usuario")
    
    ah_repo.delete(db=db, id=auditoria_id)
    return

# Payroll History for a specific user
@router.post("/{user_id}/payroll-history/", response_model=PayrollHistoryOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_payroll_history_for_user(user_id: int, payload: PayrollHistoryCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ph_repo = PayrollHistoryRepository()
    db_obj = ph_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/payroll-history/", response_model=List[PayrollHistoryOut], dependencies=[Depends(JWTBearer())])
def list_payroll_history_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ph_repo = PayrollHistoryRepository()
    return ph_repo.get_by_employee_id(db=db, employee_id=user_id)

@router.get("/{user_id}/payroll-history/{payroll_id}", response_model=PayrollHistoryOut, dependencies=[Depends(JWTBearer())])
def get_payroll_history_for_user(user_id: int, payroll_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ph_repo = PayrollHistoryRepository()
    obj = ph_repo.get(db=db, id=payroll_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de nómina no encontrado para este usuario")
    return obj

@router.put("/{user_id}/payroll-history/{payroll_id}", response_model=PayrollHistoryOut, dependencies=[Depends(JWTBearer())])
def update_payroll_history_for_user(user_id: int, payroll_id: int, payload: PayrollHistoryCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ph_repo = PayrollHistoryRepository()
    obj = ph_repo.get(db=db, id=payroll_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de nómina no encontrado para este usuario")
    
    obj = ph_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/payroll-history/{payroll_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_payroll_history_for_user(user_id: int, payroll_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ph_repo = PayrollHistoryRepository()
    obj = ph_repo.get(db=db, id=payroll_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de nómina no encontrado para este usuario")
    
    ph_repo.delete(db=db, id=payroll_id)
    return

# Absence Requests for a specific user
@router.post("/{user_id}/absence-requests/", response_model=AbsenceRequestOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_absence_request_for_user(user_id: int, payload: AbsenceRequestCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ar_repo = AbsenceRequestRepository()
    db_obj = ar_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/absence-requests/", response_model=List[AbsenceRequestOut], dependencies=[Depends(JWTBearer())])
def list_absence_requests_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ar_repo = AbsenceRequestRepository()
    return ar_repo.get_by_employee_id(db=db, employee_id=user_id)

@router.get("/{user_id}/absence-requests/{request_id}", response_model=AbsenceRequestOut, dependencies=[Depends(JWTBearer())])
def get_absence_request_for_user(user_id: int, request_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ar_repo = AbsenceRequestRepository()
    obj = ar_repo.get(db=db, id=request_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud de ausencia no encontrada para este usuario")
    return obj

@router.put("/{user_id}/absence-requests/{request_id}", response_model=AbsenceRequestOut, dependencies=[Depends(JWTBearer())])
def update_absence_request_for_user(user_id: int, request_id: int, payload: AbsenceRequestCreate, db: Session = Depends(get_db)):
    if user_id != payload.employee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ar_repo = AbsenceRequestRepository()
    obj = ar_repo.get(db=db, id=request_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud de ausencia no encontrada para este usuario")
    
    obj = ar_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/absence-requests/{request_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_absence_request_for_user(user_id: int, request_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ar_repo = AbsenceRequestRepository()
    obj = ar_repo.get(db=db, id=request_id)
    if not obj or obj.employee_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud de ausencia no encontrada para este usuario")
    
    ar_repo.delete(db=db, id=request_id)
    return

# Approval History for a specific user
@router.post("/{user_id}/approval-history/", response_model=ApprovalHistoryOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_approval_history_for_user(user_id: int, payload: ApprovalHistoryCreate, db: Session = Depends(get_db)):
    if user_id != payload.approver_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Approver ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ah_repo = ApprovalHistoryRepository()
    db_obj = ah_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/approval-history/", response_model=List[ApprovalHistoryOut], dependencies=[Depends(JWTBearer())])
def list_approval_history_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ah_repo = ApprovalHistoryRepository()
    return ah_repo.get_by_approver_id(db=db, approver_id=user_id)

@router.get("/{user_id}/approval-history/{history_id}", response_model=ApprovalHistoryOut, dependencies=[Depends(JWTBearer())])
def get_approval_history_for_user(user_id: int, history_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ah_repo = ApprovalHistoryRepository()
    obj = ah_repo.get(db=db, id=history_id)
    if not obj or obj.approver_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de aprobación no encontrado para este usuario")
    return obj

@router.put("/{user_id}/approval-history/{history_id}", response_model=ApprovalHistoryOut, dependencies=[Depends(JWTBearer())])
def update_approval_history_for_user(user_id: int, history_id: int, payload: ApprovalHistoryCreate, db: Session = Depends(get_db)):
    if user_id != payload.approver_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Approver ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ah_repo = ApprovalHistoryRepository()
    obj = ah_repo.get(db=db, id=history_id)
    if not obj or obj.approver_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de aprobación no encontrado para este usuario")
    
    obj = ah_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/approval-history/{history_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_approval_history_for_user(user_id: int, history_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    ah_repo = ApprovalHistoryRepository()
    obj = ah_repo.get(db=db, id=history_id)
    if not obj or obj.approver_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historial de aprobación no encontrado para este usuario")
    
    ah_repo.delete(db=db, id=history_id)
    return

# Notifications for a specific user
@router.post("/{user_id}/notifications/", response_model=NotificationOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(JWTBearer())])
def create_notification_for_user(user_id: int, payload: NotificationCreate, db: Session = Depends(get_db)):
    if user_id != payload.user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    n_repo = NotificationRepository()
    db_obj = n_repo.create(db=db, obj_in=payload)
    return db_obj

@router.get("/{user_id}/notifications/", response_model=List[NotificationOut], dependencies=[Depends(JWTBearer())])
def list_notifications_for_user(user_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    n_repo = NotificationRepository()
    return n_repo.get_by_user_id(db=db, user_id=user_id)

@router.get("/{user_id}/notifications/{notification_id}", response_model=NotificationOut, dependencies=[Depends(JWTBearer())])
def get_notification_for_user(user_id: int, notification_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    n_repo = NotificationRepository()
    obj = n_repo.get(db=db, id=notification_id)
    if not obj or obj.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notificación no encontrada para este usuario")
    return obj

@router.put("/{user_id}/notifications/{notification_id}", response_model=NotificationOut, dependencies=[Depends(JWTBearer())])
def update_notification_for_user(user_id: int, notification_id: int, payload: NotificationCreate, db: Session = Depends(get_db)):
    if user_id != payload.user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User ID in payload must match user_id in path")
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    n_repo = NotificationRepository()
    obj = n_repo.get(db=db, id=notification_id)
    if not obj or obj.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notificación no encontrada para este usuario")
    
    obj = n_repo.update(db=db, db_obj=obj, obj_in=payload)
    return obj

@router.delete("/{user_id}/notifications/{notification_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(JWTBearer())])
def delete_notification_for_user(user_id: int, notification_id: int, db: Session = Depends(get_db)):
    user = repo.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    n_repo = NotificationRepository()
    obj = n_repo.get(db=db, id=notification_id)
    if not obj or obj.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notificación no encontrada para este usuario")
    
    n_repo.delete(db=db, id=notification_id)
    return
