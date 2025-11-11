from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DB_TYPE: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    JWT_SECRET: str
    JWT_SET_COOKIE: bool = False

    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # ✅ Agrega esto:
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    @property
    def DATABASE_URL(self):
        return f"{self.DB_TYPE}+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = "/home/amb/MDM/backend/.env"


settings = Settings()
