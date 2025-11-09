from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from backend.models.user import User


def list_users_logic(db: Session):
    """
    Visszaadja az összes regisztrált felhasználót.
    Admin token route oldalon lesz ellenőrizve.
    """
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users  # üres lista esetén is 200 OK

