from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.user import User
from auth_logic.hashing import verify_password
from auth_logic.jwt_handler import create_access_token


def login_user(form_data, db: Session):
    """
    Bejelentkezés logikája:
    - user lekérdezése
    - jelszó ellenőrzés
    - last_login frissítés
    - JWT token generálása
    """
    # e-mail alapján megkeressük a usert
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hibás e-mail vagy jelszó.",
        )

    # last_login frissítése
    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)

    # JWT token generálása
    access_token = create_access_token(data={"sub": user.email})

    return {"access_token": access_token, "token_type": "bearer"}
