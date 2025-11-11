from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.models.user import User


async def verify_email(current_email: str, db: AsyncSession):
    """
    Egyszerű (átmeneti) e-mail verifikáció:
    - token alapján azonosítja a usert
    - is_verified = True
    """
    result = await db.execute(select(User).filter(User.email == current_email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Felhasználó nem található.",
        )

    user.is_verified = True
    await db.commit()
    await db.refresh(user)
    db.expunge(user)

    return {"message": "Email verified successfully", "is_verified": user.is_verified}
