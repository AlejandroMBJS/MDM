"""
FastAPI Main Application
Master Admin HRIS System
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time
import logging

from app.config.settings import settings
from app.config.database import engine, Base
from app.core.middleware import AuditMiddleware, SecurityHeadersMiddleware
from app.api.v1 import (
    auth, users, emergency_contacts,
    horarios_base, turnos, dependents, employee_documents, job_history, time_off_balances, employee_benefits, horarios_excepcion, auditoria_horarios, payroll_history, absence_requests, approval_history, notifications
)


import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create FastAPI app
app = FastAPI(
    title="Master Admin HRIS API",
    description="Enterprise HR Information System - Master Administration API",
    version="1.0.0",
    docs_url="/api/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/api/redoc" if settings.ENVIRONMENT != "production" else None,
    openapi_url="/api/openapi.json" if settings.ENVIRONMENT != "production" else None,
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count", "X-Page", "X-Per-Page"],
)

# Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# Audit Logging Middleware
app.add_middleware(AuditMiddleware)

# Trusted Host Middleware (Production only)
if settings.ENVIRONMENT == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS
    )

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),
            "body": exc.body
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting Master Admin HRIS API...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Database: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'configured'}")
    
    # Create tables (in production, use Alembic migrations)
    if settings.ENVIRONMENT == "development":
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created/verified")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Master Admin HRIS API...")

# API Routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(horarios_base.router, prefix="/api/v1/horarios-base", tags=["Base Schedules"])
app.include_router(emergency_contacts.router, prefix="/api/v1/emergency-contacts", tags=["Emergency Contacts"])
app.include_router(dependents.router, prefix="/api/v1/dependents", tags=["Dependents"])
app.include_router(employee_documents.router, prefix="/api/v1/documents", tags=["Documents"])
app.include_router(
    job_history.router, 
    prefix="/api/v1/users/{user_id}/job-history", 
    tags=["Job History"]
)
app.include_router(turnos.router, prefix="/api/v1/turnos", tags=["Turnos"])
app.include_router(time_off_balances.router, prefix="/api/v1/time-off-balances", tags=["Time Off Balances"])
app.include_router(employee_benefits.router, prefix="/api/v1/benefits", tags=["Benefits"])
app.include_router(horarios_excepcion.router, prefix="/api/v1/horarios-excepcion", tags=["Schedule Exceptions"])
app.include_router(auditoria_horarios.router, prefix="/api/v1/auditoria-horarios", tags=["Schedule Audit"])
app.include_router(payroll_history.router, prefix="/api/v1/payroll", tags=["Payroll"])
app.include_router(absence_requests.router, prefix="/api/v1/absence-requests", tags=["Absence Requests"])
app.include_router(approval_history.router, prefix="/api/v1/approval-history", tags=["Approval History"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "service": "Master Admin HRIS API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/api/docs" if settings.ENVIRONMENT != "production" else "disabled"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development"
    )