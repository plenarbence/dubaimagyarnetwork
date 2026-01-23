# backend/routes/auth_logic/change_password.py

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.user import User
from backend.routes.auth_logic.hashing import verify_password, hash_password
from backend.routes.auth_logic.validate_password import validate_password


async def change_password(
    db: AsyncSession,
    email: str,
    old_password: str,
    new_password: str,
    new_password_confirm: str,
) -> None:
    """
    Bejelentkezett felhasználó jelszavának megváltoztatása:
    - régi jelszó ellenőrzése
    - új jelszó validálása
    - új jelszó megerősítés egyezés
    - hash + mentés
    """

    # 1️⃣ User betöltése
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # 2️⃣ Régi jelszó ellenőrzés
    if not verify_password(old_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hibás jelenlegi jelszó",
        )

    # 3️⃣ Új jelszó egyezés
    if new_password != new_password_confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Az új jelszavak nem egyeznek",
        )

    # 4️⃣ Új jelszó validálás
    validate_password(new_password)

    # 5️⃣ Hash + mentés
    user.password_hash = hash_password(new_password)
    await db.commit()
