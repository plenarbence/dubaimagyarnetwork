from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from backend.models.image import Image
from backend.models.listing import Listing


async def set_main_image_logic(
    *,
    db: AsyncSession,
    image_id: int,
    user_id: int,
):
    # 1️⃣ kép lekérése
    result = await db.execute(
        select(Image).where(Image.id == image_id)
    )
    image = result.scalar_one_or_none()

    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # 2️⃣ listing + tulajdonjog ellenőrzése
    result = await db.execute(
        select(Listing).where(Listing.id == image.listing_id)
    )
    listing = result.scalar_one_or_none()

    if not listing or listing.user_id != user_id:
        raise HTTPException(status_code=403, detail="No permission to modify this listing")

    # 3️⃣ minden kép is_main=False ugyanennél a listingnél
    await db.execute(
        update(Image)
        .where(Image.listing_id == listing.id)
        .values(is_main=False)
    )

    # 4️⃣ kiválasztott kép main-re állítása
    image.is_main = True

    await db.commit()
    await db.refresh(image)

    return {"message": "Main image updated successfully"}
