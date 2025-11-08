from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.user import User


def get_current_user(email: str, db: Session):
    """
    Tokenből az emailt kinyeri, majd visszaadja a hozzá tartozó User objektumot.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Felhasználó nem található.",
        )
    return user
