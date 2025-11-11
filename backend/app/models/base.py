"""
Base Model with common fields and functionality
"""
from sqlalchemy import Column, Integer, DateTime, String, func
from sqlalchemy.ext.declarative import declared_attr
from datetime import datetime

from app.config.database import Base


class BaseModel(Base):
    """
    Base model with common fields for all tables
    """
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=func.current_timestamp(), nullable=False)
    updated_at = Column(
        DateTime,
        default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False
    )
    
    @declared_attr
    def __tablename__(cls):
        """
        Automatically generate table name from class name
        """
        return cls.__name__.lower()
    
    def to_dict(self):
        """
        Convert model instance to dictionary
        """
        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }
    
    def update_from_dict(self, data: dict):
        """
        Update model instance from dictionary
        """
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)


class AuditableModel(BaseModel):
    """
    Model with audit fields (created_by, updated_by)
    """
    __abstract__ = True
    
    created_by = Column(Integer, nullable=True)
    updated_by = Column(Integer, nullable=True)