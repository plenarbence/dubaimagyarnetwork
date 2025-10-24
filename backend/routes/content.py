from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models.content import Content
from routes.admin import get_current_admin  # admin auth
from pydantic import BaseModel

router = APIRouter(prefix="/content", tags=["Content"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schema
class ContentUpdate(BaseModel):
    value: str


@router.get("/{key}")
def get_content(key: str, db: Session = Depends(get_db)):
    content = db.query(Content).filter(Content.key == key).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return {"key": content.key, "value": content.value}


@router.put("/{key}")
def update_content(
    key: str,
    data: ContentUpdate,
    _: dict = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    content = db.query(Content).filter(Content.key == key).first()
    if not content:
        # ha még nincs, létrehozzuk
        content = Content(key=key, value=data.value)
        db.add(content)
    else:
        content.value = data.value
    db.commit()
    db.refresh(content)
    return {"key": content.key, "value": content.value}
