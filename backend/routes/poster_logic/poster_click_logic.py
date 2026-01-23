from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update

from backend.models.poster import Poster


async def poster_click_logic(
    poster_id: int,
    db: AsyncSession,
) -> None:
    """
    Public poster click (best-effort):
    - click_count increment
    - ha hiba van, lenyeljük
    """

    try:
        await db.execute(
            update(Poster)
            .where(Poster.id == poster_id)
            .values(click_count=Poster.click_count + 1)
        )
        await db.commit()
    except Exception:
        await db.rollback()
        # szándékosan nem dobunk hibát
        return
