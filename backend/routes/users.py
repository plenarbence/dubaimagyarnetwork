from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import SessionLocal
from models.user import User
from schemas.user_schema import UserResponse
from routes.admin import get_current_admin  # 🔒 csak admin férhet hozzá


# -----------------------------
# ✅ Router beállítása
# -----------------------------
router = APIRouter(prefix="/admin", tags=["Users"])


# -----------------------------
# ✅ DB session kezelése
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------
# ✅ FELHASZNÁLÓK LISTÁZÁSA (Admin)
# -----------------------------
@router.get("/users", response_model=list[UserResponse])
def list_users(
    _: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Visszaadja az összes regisztrált felhasználót (csak admin tokennel)."""
    users = db.query(User).order_by(User.created_at.desc()).all()
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nincsenek felhasználók az adatbázisban."
        )
    return users
