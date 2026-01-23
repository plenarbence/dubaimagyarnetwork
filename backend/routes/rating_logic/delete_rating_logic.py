from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from backend.models.rating import Rating


async def delete_rating_logic(
    db: AsyncSession,
    user_id: int,
    rating_id: int,
):
    """
    Saját rating törlése.
    """

    # -------------------------
    # Rating létezik?
    # -------------------------
    stmt = select(Rating).where(Rating.id == rating_id)
    result = await db.execute(stmt)
    rating = result.scalar_one_or_none()

    if not rating:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rating nem található.",
        )

    # -------------------------
    # Jogosultság ellenőrzés
    # -------------------------
    if rating.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nincs jogosultságod ezt az értékelést törölni.",
        )

    # -------------------------
    # Törlés
    # -------------------------
    await db.delete(rating)
    await db.commit()

    return {"detail": "Rating törölve."}
