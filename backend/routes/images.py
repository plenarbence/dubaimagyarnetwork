from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.image import Image
from models.listing import Listing
from schemas.image_schema import ImageResponse
from routes.auth import get_current_user
import os
from datetime import datetime
from typing import List

router = APIRouter(prefix="/images", tags=["Images"])

# -----------------------------
# ✅ DB session kezelése
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 📁 ha nincs env-ben megadva, automatikusan a 'uploads' mappába ment
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")


@router.post("/", response_model=ImageResponse)
async def upload_image(
    listing_id: int,
    file: UploadFile = File(...),
    is_main: bool = False,  # ✅ új paraméter: lehetőség fő képet megjelölni
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Feltöltés bejelentkezett user saját hirdetéséhez"""
    listing = db.query(Listing).filter(
        Listing.id == listing_id, Listing.user_id == current_user.id
    ).first()
    if not listing:
        raise HTTPException(status_code=403, detail="No permission to modify this listing")

    # 📸 max 10 kép / listing
    count = db.query(Image).filter(Image.listing_id == listing_id).count()
    if count >= 10:
        raise HTTPException(status_code=400, detail="Maximum 10 images allowed per listing")

    # 📁 feltöltési mappa biztosítása
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filename = f"{datetime.utcnow().timestamp()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # fájl mentése lokálisan
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    url = f"/{UPLOAD_DIR}/{filename}"  # később CDN-re cserélhető .env-ből

    # ✅ ha ez a kép lesz a fő, előtte a többinél töröljük a flaget
    if is_main:
        db.query(Image).filter(Image.listing_id == listing_id).update({"is_main": False})

    new_image = Image(
        listing_id=listing_id,
        url=url,
        filename=filename,
        is_main=is_main,  # ✅ új mező mentése
    )
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    return new_image


@router.get("/{listing_id}", response_model=List[ImageResponse])
def get_images(listing_id: int, db: Session = Depends(get_db)):
    """Publikus képek lekérése egy hirdetéshez"""
    images = db.query(Image).filter(Image.listing_id == listing_id).all()
    return images


# -------------------------------------------------------
# ✅ Új, végleges route: fő kép beállítása (biztonságos verzió)
# -------------------------------------------------------
@router.post("/{image_id}/set_main")
def set_main_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Egy kép megjelölése fő képként (is_main=True)"""
    # keresd meg a képet
    image = db.query(Image).get(image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # ellenőrzés: a kép a bejelentkezett user hirdetéséhez tartozik?
    listing = db.query(Listing).filter(Listing.id == image.listing_id).first()
    if not listing or listing.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No permission to modify this listing")

    # előző fő képek kikapcsolása
    db.query(Image).filter(Image.listing_id == listing.id).update({"is_main": False})
    image.is_main = True

    db.commit()
    db.refresh(image)

    return {"message": "Main image updated successfully"}
