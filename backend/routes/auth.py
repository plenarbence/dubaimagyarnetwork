from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import SessionLocal
from models.user import User
from schemas.user_schema import UserCreate
from utils.common import (
    validate_password,
    hash_password,
    verify_password,
    create_access_token,
    verify_access_token,
)

router = APIRouter(prefix="", tags=["Auth"])


# ================================
# ✅ DB session kezelése
# ================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================================
# ✅ REGISZTRÁCIÓ
# ================================
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # 1️⃣ Ellenőrzés: van-e már ilyen e-mail
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ez az e-mail már regisztrálva van.",
        )

    # 2️⃣ Jelszó validálás
    validate_password(user.password)

    # 3️⃣ Jelszó hash-elése
    hashed_pw = hash_password(user.password)

    # 4️⃣ Új user mentése adatbázisba
    new_user = User(email=user.email, password_hash=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Sikeres regisztráció", "user_id": new_user.id}


# ================================
# ✅ BEJELENTKEZÉS
# ================================
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # e-mail alapján megkeressük a usert
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hibás e-mail vagy jelszó.",
        )

    # jelszó ellenőrzése
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hibás e-mail vagy jelszó.",
        )

    # token generálása
    access_token = create_access_token(data={"sub": user.email, "role": "user"})

    return {"access_token": access_token, "token_type": "bearer"}


# ================================
# ✅ AKTUÁLIS FELHASZNÁLÓ
# ================================
@router.get("/me")
def get_current_user(email: str = Depends(verify_access_token)):
    return {"current_user": email}
