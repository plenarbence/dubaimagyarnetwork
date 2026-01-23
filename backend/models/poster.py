from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from backend.database import Base


class Poster(Base):
    __tablename__ = "posters"

    id = Column(Integer, primary_key=True, index=True)

    cdn_key = Column(String, nullable=False)
    url = Column(String, nullable=False)
    link = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    click_count = Column(Integer, nullable=False, default=0)
