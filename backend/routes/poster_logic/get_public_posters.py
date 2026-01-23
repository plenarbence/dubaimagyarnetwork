from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.poster import Poster
from backend.schemas.poster_schema import PosterPublicSchema


async def get_public_posters_logic(db: AsyncSession):
    """
    Publikus poszterek lekérése:
    - csak megjelenítéshez szükséges mezők
    """

    result = await db.execute(
        select(Poster).order_by(Poster.created_at.desc())
    )
    posters = result.scalars().all()

    return [
        PosterPublicSchema(
            id=poster.id,
            url=poster.url,
            link=poster.link,
            click_count=poster.click_count
        )
        for poster in posters
    ]
