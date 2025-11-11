# app/repositories/notification_repository.py
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.notification import Notification
from typing import List

class NotificationRepository(BaseRepository[Notification]):
    def __init__(self):
        super().__init__(Notification)

    def get_by_user_id(self, db: Session, user_id: int) -> List[Notification]:
        return db.query(self.model).filter(self.model.user_id == user_id).all()
