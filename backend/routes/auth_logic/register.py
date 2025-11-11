from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.models.user import User
from backend.schemas.user_schema import UserCreate, UserResponse
from backend.routes.auth_logic.hashing import hash_password
from backend.routes.auth_logic.validate_password import validate_password


async def register_user(user: UserCreate, db: AsyncSession) -> UserResponse:
    """
    Új felhasználó regisztrálása:
    - ellenőrzés, hogy e-mail már létezik-e
    - jelszó validálás
    - jelszó hash-elés
    - user mentése adatbázisba
    """
    # 1️⃣ Ellenőrzés: van-e már ilyen e-mail
    result = await db.execute(select(User).filter(User.email == user.email))
    existing_user = result.scalar_one_or_none()
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
    await db.commit()
    await db.refresh(new_user)
    db.expunge(new_user)

    return UserResponse.model_validate(new_user)
