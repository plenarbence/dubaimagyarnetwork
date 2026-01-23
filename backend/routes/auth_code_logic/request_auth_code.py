# backend/auth_code_logic/request_auth_code.py

import secrets
import hashlib
from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.auth_code import AuthCode, AuthCodePurpose
from backend.models.user import User


CODE_TTL_MINUTES = 10


def _hash_code(code: str) -> str:
    return hashlib.sha256(code.encode()).hexdigest()


async def request_auth_code(
    db: AsyncSession,
    email: str,
    purpose: AuthCodePurpose,
) -> str | None:
    """
    Kód igénylése email verifikációhoz vagy jelszó resethez.
    - létrehoz egy 6 számjegyű kódot
    - DB-be menti (hash-elve)
    - email küldést az endpoint / service intézi
    """

    # password resetnél ellenőrizzük, hogy létezik-e user
    if purpose == AuthCodePurpose.password_reset:
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        # enumeration védelem: ugyanúgy viselkedünk
        if user is None:
            return

    now = datetime.utcnow()


    # új kód generálása
    raw_code = f"{secrets.randbelow(1_000_000):06d}"
    code_hash = _hash_code(raw_code)

    auth_code = AuthCode(
        email=email,
        code_hash=code_hash,
        purpose=purpose,
        expires_at=now + timedelta(minutes=CODE_TTL_MINUTES),
    )

    db.add(auth_code)
    await db.commit()

    # ⚠️ FONTOS:
    # a raw_code-ot az endpoint kapja vissza / továbbadja
    # email küldéshez (itt nem küldünk emailt)
    return raw_code
