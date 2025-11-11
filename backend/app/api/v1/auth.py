# app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.auth_schema import LoginRequest, TokenResponse
from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, create_access_token
from datetime import timedelta
from app.config.settings import settings

router = APIRouter()
user_repo = UserRepository()

@router.post("/login", response_model=TokenResponse)
def login(form: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = user_repo.get_by_email(db=db, email=form.email)
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    # Opción: devolver el JWT también como cookie httpOnly (más seguro)
    if settings.JWT_SET_COOKIE:
        response.set_cookie(key="access_token", value=token, httponly=True, secure=settings.ENVIRONMENT=="production", samesite="lax")
    return {"access_token": token, "token_type": "bearer", "expires_in": 60*24*60}
