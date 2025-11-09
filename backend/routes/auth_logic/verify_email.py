from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from backend.models.user import User


def verify_email(current_email: str, db: Session):
    """
    Egyszerű (átmeneti) e-mail verifikáció:
    - token alapján azonosítja a usert
    - is_verified = True
    """
    user = db.query(User).filter(User.email == current_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Felhasználó nem található.",
        )

    user.is_verified = True
    db.commit()
    db.refresh(user)

    return {"message": "Email verified successfully", "is_verified": user.is_verified}
