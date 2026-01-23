# backend/auth_code_logic/check_auth_code.py

import hashlib
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.auth_code import AuthCode, AuthCodePurpose


def _hash_code(code: str) -> str:
    return hashlib.sha256(code.encode()).hexdigest()


async def check_auth_code(
    db: AsyncSession,
    email: str,
    code: str,
    purpose: AuthCodePurpose,
) -> bool:
    """
    Auth kód ellenőrzése.
    - hash-eli a megadott kódot
    - megkeresi az érvényes (nem lejárt, nem használt) kódokat
    - ha bármelyik egyezik → valid
    """

    now = datetime.utcnow()
    code_hash = _hash_code(code)

    stmt = select(AuthCode).where(
        AuthCode.email == email,
        AuthCode.purpose == purpose,
        AuthCode.used_at.is_(None),
        AuthCode.expires_at > now,
    )

    result = await db.execute(stmt)
    codes = result.scalars().all()

    for auth_code in codes:
        if auth_code.code_hash == code_hash:
            return True

    return False
