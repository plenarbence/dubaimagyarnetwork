# backend/models/suggestion.py

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from backend.database import Base
from datetime import datetime


class Suggestion(Base):
    __tablename__ = "suggestions"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(1000), nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    seen_by_admin = Column(Boolean, default=False, nullable=False)
