from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.listing import Listing, ListingStatus
from backend.schemas.listing_schema import ListingCreate
from fastapi import HTTPException


async def submit_listing_logic(
    db: AsyncSession,
    listing_id: int,
    user_id: int,
    data: ListingCreate,
):
    stmt = select(Listing).where(
        Listing.id == listing_id,
        Listing.user_id == user_id,
    )

    result = await db.execute(stmt)
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(status_code=404, detail="Hirdetés nem található.")

    # -----------------------------
    # 🧾 mezők frissítése
    # -----------------------------
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(listing, field, value)

    # -----------------------------
    # 🔥 ÜZLETI SZABÁLY
    # -----------------------------
    listing.status = ListingStatus.pending_admin

    await db.commit()
    await db.refresh(listing)

    db.expunge(listing)

    return listing
