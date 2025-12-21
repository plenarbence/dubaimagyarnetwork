from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from backend.models.listing import Listing


async def get_listing_by_id_logic(
    db: AsyncSession,
    listing_id: int,
    user_id: int | None = None,
):
    """
    Egy listing lekérése ID alapján.
    Edit page-hez: képek betöltve (eager).
    """

    stmt = (
        select(Listing)
        .where(Listing.id == listing_id)
        .options(
            selectinload(Listing.category), 
            selectinload(Listing.images),   # ✅ képek kellenek edithez
            selectinload(Listing.ratings),  # ⬅️ benne lehet, nem árt
        )
    )

    result = await db.execute(stmt)
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing nem található.",
        )

    # 🔒 opcionális tulajdonos-ellenőrzés (edit page-hez hasznos)
    if user_id is not None and listing.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nincs jogosultságod ehhez a hirdetéshez.",
        )

    return listing
