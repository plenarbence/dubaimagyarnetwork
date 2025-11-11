from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.user import User
from backend.routes.auth_logic.hashing import verify_password
from backend.routes.auth_logic.jwt_handler import create_access_token


async def login_user(form_data, db: AsyncSession):
    """
    Bejelentkezés logikája:
    - user lekérdezése
    - jelszó ellenőrzés
    - last_login frissítés
    - JWT token generálása
    """
    # e-mail alapján megkeressük a usert
    result = await db.execute(select(User).filter(User.email == form_data.username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hibás e-mail vagy jelszó.",
        )

    # last_login frissítése
    user.last_login = datetime.utcnow()
    await db.commit()
    await db.refresh(user)
    db.expunge(user)

    # JWT token generálása
    access_token = create_access_token(data={"sub": user.email})

    return {"access_token": access_token, "token_type": "bearer"}
