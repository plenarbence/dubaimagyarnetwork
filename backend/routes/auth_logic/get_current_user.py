from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.models.user import User


async def get_current_user(email: str, db: AsyncSession):
    """
    Tokenből az emailt kinyeri, majd visszaadja a hozzá tartozó User objektumot.
    """
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Felhasználó nem található.",
        )
    return user
