from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from backend.models.user import User


async def verify_email_logic(
    db: AsyncSession,
    email: str,
) -> None:
    """
    Email cím verifikálása:
    - user lekérése email alapján
    - is_verified = True
    """

    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    user: User | None = result.scalar_one_or_none()

    if user is None:
        # elvileg auth code után ez nem fordulhat elő,
        # de maradjon védett
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # ha már verifikált, nem csinálunk semmit (idempotens)
    if user.is_verified:
        return

    user.is_verified = True
    await db.commit()
