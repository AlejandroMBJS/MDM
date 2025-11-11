"""
Base Repository with CRUD operations
"""
from typing import Generic, TypeVar, Type, Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_
from fastapi.encoders import jsonable_encoder

from app.models.base import BaseModel

ModelType = TypeVar("ModelType", bound=BaseModel)


class BaseRepository(Generic[ModelType]):
    """
    Base repository with common CRUD operations
    """
    
    def __init__(self, model: Type[ModelType]):
        self.model = model
    
    def get(self, db: Session, id: int) -> Optional[ModelType]:
        """Get a single record by ID"""
        return db.query(self.model).filter(self.model.id == id).first()
    
    def get_multi(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None,
        order_by: Optional[str] = None
    ) -> List[ModelType]:
        """Get multiple records with pagination and filters"""
        query = db.query(self.model)
        
        # Apply filters
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    if isinstance(value, list):
                        query = query.filter(getattr(self.model, key).in_(value))
                    else:
                        query = query.filter(getattr(self.model, key) == value)
        
        # Apply ordering
        if order_by:
            if order_by.startswith('-'):
                query = query.order_by(getattr(self.model, order_by[1:]).desc())
            else:
                query = query.order_by(getattr(self.model, order_by))
        
        return query.offset(skip).limit(limit).all()
    
    def create(self, db: Session, obj_in: Dict[str, Any]) -> ModelType:
        """Create a new record"""
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self,
        db: Session,
        db_obj: ModelType,
        obj_in: Dict[str, Any]
    ) -> ModelType:
        """Update an existing record"""
        obj_data = jsonable_encoder(db_obj)
        update_data = obj_in if isinstance(obj_in, dict) else obj_in.dict(exclude_unset=True)
        
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def delete(self, db: Session, id: int) -> ModelType:
        """Delete a record"""
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj
    
    def count(self, db: Session, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count records with optional filters"""
        query = db.query(func.count(self.model.id))
        
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    query = query.filter(getattr(self.model, key) == value)
        
        return query.scalar()
    
    def search(
        self,
        db: Session,
        search_term: str,
        search_fields: List[str],
        skip: int = 0,
        limit: int = 100
    ) -> List[ModelType]:
        """Search records across multiple fields"""
        query = db.query(self.model)
        
        if search_term:
            search_filters = []
            for field in search_fields:
                if hasattr(self.model, field):
                    search_filters.append(
                        getattr(self.model, field).ilike(f"%{search_term}%")
                    )
            
            if search_filters:
                query = query.filter(or_(*search_filters))
        
        return query.offset(skip).limit(limit).all()
    
    def bulk_create(self, db: Session, objects: List[Dict[str, Any]]) -> List[ModelType]:
        """Bulk create multiple records"""
        db_objects = [self.model(**obj) for obj in objects]
        db.bulk_save_objects(db_objects)
        db.commit()
        return db_objects
    
    def bulk_update(self, db: Session, updates: List[Dict[str, Any]]) -> int:
        """Bulk update multiple records"""
        count = 0
        for update in updates:
            if 'id' in update:
                obj_id = update.pop('id')
                db.query(self.model).filter(self.model.id == obj_id).update(update)
                count += 1
        db.commit()
        return count
    
    def exists(self, db: Session, id: int) -> bool:
        """Check if a record exists"""
        return db.query(
            db.query(self.model).filter(self.model.id == id).exists()
        ).scalar()