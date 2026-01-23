from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.poster import Poster
from backend.schemas.poster_schema import PosterAdminSchema
from backend.utils.r2_storage_poster import R2PosterStorage


async def create_poster_logic(
    file,
    link: str,
    db: AsyncSession,
) -> PosterAdminSchema:
    """
    Admin poster létrehozás:
    - kép feltöltése R2-be
    - DB-be mentés
    """

    storage = R2PosterStorage()

    try:
        cdn_key, url = storage.save_poster(file)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload poster image.",
        )

    poster = Poster(
        cdn_key=cdn_key,
        url=url,
        link=link,
    )

    db.add(poster)

    try:
        await db.commit()
        await db.refresh(poster)
        db.expunge(poster)
    except Exception:
        await db.rollback()

        # ha DB hiba van, takarítsuk az R2-t
        try:
            storage.delete_poster(cdn_key)
        except Exception:
            pass

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while creating poster.",
        )

    return PosterAdminSchema.model_validate(poster)
