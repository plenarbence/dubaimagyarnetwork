from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.poster import Poster
from backend.utils.r2_storage_poster import R2PosterStorage


async def delete_poster_logic(
    poster_id: int,
    db: AsyncSession,
):
    """
    Admin poster törlés:
    - DB rekord törlése
    - R2 objektum törlése cdn_key alapján
    """

    result = await db.execute(
        select(Poster).where(Poster.id == poster_id)
    )
    poster = result.scalars().first()

    if not poster:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poster not found.",
        )

    storage = R2PosterStorage()
    cdn_key = poster.cdn_key

    await db.delete(poster)

    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while deleting poster.",
        )

    # DB sikeres → R2 törlés
    try:
        storage.delete_poster(cdn_key)
    except Exception:
        # CDN orphan elfogadható ebben a fázisban
        pass

    return {"status": "ok"}
