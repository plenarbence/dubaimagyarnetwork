# backend/routes/image_logic/upload_image_logic.py

from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from backend.models.listing import Listing
from backend.models.image import Image
from backend.utils.r2_storage import R2ImageStorage


MAX_IMAGES_PER_LISTING = 10


async def upload_image_logic(
    db: AsyncSession,
    *,
    listing_id: int,
    user_id: int,
    file_obj,
):
    """
    Kép feltöltése egy listinghez.
    Szabályok:
    - csak a saját listinghez
    - max 10 kép / listing
    - első kép automatikusan is_main = True
    - R2-be mentés, DB-be cdn_key + url
    """

    # 1) jogosultság: listing a useré
    stmt = select(Listing).where(
        Listing.id == listing_id,
        Listing.user_id == user_id,
    )
    res = await db.execute(stmt)
    listing = res.scalar_one_or_none()

    if not listing:
        raise HTTPException(status_code=403, detail="No permission to modify this listing")

    # 2) max képszám ellenőrzés
    count_stmt = select(func.count(Image.id)).where(Image.listing_id == listing_id)
    res = await db.execute(count_stmt)
    image_count = res.scalar_one()

    if image_count >= MAX_IMAGES_PER_LISTING:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {MAX_IMAGES_PER_LISTING} images allowed per listing",
        )

    # 3) storage init + feltöltés
    storage = R2ImageStorage()
    cdn_key, url = storage.save_image(
        file_obj=file_obj,
        listing_id=listing_id,
    )

    # 4) első kép → is_main = True
    is_main = image_count == 0

    # ha mégis main, nullázzuk a többit (biztonság)
    if is_main:
        await db.execute(
            update(Image)
            .where(Image.listing_id == listing_id)
            .values(is_main=False)
        )

    # 5) DB rekord létrehozása
    image = Image(
        listing_id=listing_id,
        cdn_key=cdn_key,
        url=url,
        filename=cdn_key.split("/")[-1],
        is_main=is_main,
    )

    db.add(image)
    await db.commit()
    await db.refresh(image)
    db.expunge(image)

    return image
