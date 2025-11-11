from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config.settings import settings

# --- Crear motor de base de datos ---
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=settings.DEBUG
)

# --- Crear base declarativa para modelos ---
Base = declarative_base()

# --- Crear fábrica de sesiones ---
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# --- Dependencia para FastAPI ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
