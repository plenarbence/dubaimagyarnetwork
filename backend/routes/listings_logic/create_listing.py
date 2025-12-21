from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.listing import Listing, ListingStatus
from backend.schemas.listing_schema import ListingCreate
from datetime import datetime


async def create_listing_logic(
    db: AsyncSession,
    user_id: int,
    data: ListingCreate
):
    """
    Új hirdetés létrehozása (draft státuszban).
    """

    # új Listing ORM objektum
    new_listing = Listing(
        title=data.title,
        description=data.description,

        email=data.email,
        phone_number=data.phone_number,
        website=data.website,
        whatsapp=data.whatsapp,
        instagram=data.instagram,
        tiktok=data.tiktok,
        facebook=data.facebook,
        youtube=data.youtube,
        location=data.location,
        company=data.company,
        tags=data.tags,

        user_id=user_id,
        category_id=data.category_id,

        status=ListingStatus.draft,
        created_at=datetime.utcnow()
    )

    db.add(new_listing)
    await db.commit()
    await db.refresh(new_listing)

    # 🔥 NAGYON FONTOS: detach (expunge)
    db.expunge(new_listing)

    return new_listing
