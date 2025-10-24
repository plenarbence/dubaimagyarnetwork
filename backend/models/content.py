from sqlalchemy import Column, Integer, String, Text
from database import Base

class Content(Base):
    __tablename__ = "content"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)   # pl. "terms"
    value = Column(Text, nullable=False)                 # itt a tényleges HTML / text
