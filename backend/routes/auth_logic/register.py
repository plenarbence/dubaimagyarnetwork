from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from backend.models.user import User
from backend.schemas.user_schema import UserCreate, UserResponse
from backend.routes.auth_logic.hashing import hash_password
from backend.routes.auth_logic.validate_password import validate_password


def register_user(user: UserCreate, db: Session) -> UserResponse:
    """
    Új felhasználó regisztrálása:
    - ellenőrzés, hogy e-mail már létezik-e
    - jelszó validálás
    - jelszó hash-elés
    - user mentése adatbázisba
    """
    # 1️⃣ Ellenőrzés: van-e már ilyen e-mail
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ez az e-mail már regisztrálva van.",
        )

    # 2️⃣ Jelszó validálás
    validate_password(user.password)

    # 3️⃣ Hash-elés
    hashed_pw = hash_password(user.password)

    # 4️⃣ Új user mentése (is_verified alapból False)
    new_user = User(email=user.email, password_hash=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
