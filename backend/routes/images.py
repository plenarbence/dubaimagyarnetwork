# backend/routes/images.py

from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from backend.database import get_db
from backend.routes.auth import get_me
from backend.schemas.image_schema import ImageResponse
from backend.routes.image_logic.upload_image_logic import upload_image_logic
from backend.routes.image_logic.delete_image_logic import delete_image_logic
from backend.routes.image_logic.get_images_by_listing_logic import get_images_by_listing_logic




router = APIRouter(
    prefix="/images",
    tags=["Images"],
)


# -------------------------------------------------------
# ✅ KÉP FELTÖLTÉS listinghez
# -------------------------------------------------------
@router.post("/", response_model=ImageResponse)
async def upload_image(listing_id: int = Form(...), file: UploadFile = File(...), db: AsyncSession = Depends(get_db), current_user=Depends(get_me)):
    return await upload_image_logic(db=db, listing_id=listing_id, user_id=current_user.id, file_obj=file.file)



# -------------------------------------------------------
# ❌ KÉP TÖRLÉS
# -------------------------------------------------------
@router.delete("/{image_id}")
async def delete_image(image_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_me)):
    return await delete_image_logic(db=db, image_id=image_id, user_id=current_user.id)




# -------------------------------------------------------
# 📸 LISTING KÉPEINEK LEKÉRÉSE
# -------------------------------------------------------
@router.get("/listing/{listing_id}", response_model=List[ImageResponse])
async def get_listing_images(listing_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_me)):
    return await get_images_by_listing_logic(db=db, listing_id=listing_id, user_id=current_user.id)
