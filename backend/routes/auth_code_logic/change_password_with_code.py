from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.user import User
from backend.models.auth_code import AuthCode, AuthCodePurpose
from backend.routes.auth_logic.hashing import hash_password
from backend.routes.auth_logic.validate_password import validate_password

import hashlib


def _hash_code(code: str) -> str:
    return hashlib.sha256(code.encode()).hexdigest()


async def change_password_with_code(
    db: AsyncSession,
    email: str,
    code: str,
    new_password: str,
    new_password_confirm: str,
) -> None:
    """
    Jelszó visszaállítása auth kód alapján:
    - user keresése email alapján
    - auth code validálása (password_reset)
    - új jelszó egyezés
    - új jelszó validálás
    - jelszó csere + auth code used_at
    """

    now = datetime.utcnow()

    # 1️⃣ User betöltése
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # 2️⃣ Auth code ellenőrzése (password_reset)
    code_hash = _hash_code(code)

    stmt = select(AuthCode).where(
        AuthCode.email == email,
        AuthCode.purpose == AuthCodePurpose.password_reset,
        AuthCode.used_at.is_(None),
        AuthCode.expires_at > now,
    )

    result = await db.execute(stmt)
    auth_codes = result.scalars().all()

    matched_code: AuthCode | None = None

    for auth_code in auth_codes:
        if auth_code.code_hash == code_hash:
            matched_code = auth_code
            break

    if matched_code is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired code",
        )

    # 3️⃣ Új jelszó egyezés
    if new_password != new_password_confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Az új jelszavak nem egyeznek",
        )

    # 4️⃣ Új jelszó validálás
    validate_password(new_password)

    # 5️⃣ Jelszó hash + mentés
    user.password_hash = hash_password(new_password)

    # 6️⃣ Auth code megjelölése használtként
    matched_code.used_at = now

    await db.commit()
