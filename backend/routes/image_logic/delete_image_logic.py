from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from backend.models.image import Image
from backend.models.listing import Listing
from backend.utils.r2_storage import R2ImageStorage


async def delete_image_logic(
    db: AsyncSession,
    *,
    image_id: int,
    user_id: int,
):
    """
    Kép törlése:
    - csak a saját listing képét lehet
    - R2-ből töröl
    - DB-ből töröl
    - ha main kép volt, új main-t jelöl (ha van)
    """

    # 1) kép lekérése
    stmt = (
        select(Image)
        .join(Listing, Listing.id == Image.listing_id)
        .where(
            Image.id == image_id,
            Listing.user_id == user_id,
        )
    )

    res = await db.execute(stmt)
    image = res.scalar_one_or_none()

    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    listing_id = image.listing_id
    was_main = image.is_main
    cdn_key = image.cdn_key

    # 2) DB törlés
    await db.delete(image)
    await db.flush()

    # 3) ha main volt, válassz új main képet (legkorábbi)
    if was_main:
        stmt = (
            select(Image)
            .where(Image.listing_id == listing_id)
            .order_by(Image.uploaded_at.asc())
            .limit(1)
        )
        res = await db.execute(stmt)
        new_main = res.scalar_one_or_none()

        if new_main:
            new_main.is_main = True

    await db.commit()

    # 4) R2 törlés (DB commit UTÁN)
    storage = R2ImageStorage()
    storage.delete_image(cdn_key)

    return {"status": "deleted"}
