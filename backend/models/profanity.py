from sqlalchemy import Column, Integer, String
from backend.database import Base


class Profanity(Base):
    __tablename__ = "profanities"

    id = Column(Integer, primary_key=True)
    text = Column(String(100), nullable=False, unique=True)
