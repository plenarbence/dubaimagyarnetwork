from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models.image import Image
from models.listing import Listing
from schemas.image_schema import ImageResponse
from routes.auth import get_current_user
from utils.storage import get_storage_driver     # ✅ új import
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


# -------------------------------------------------------
# ✅ KÉP FELTÖLTÉS — teljesen storage-függetlenül, automatikus fő kép logikával
# -------------------------------------------------------
@router.post("/", response_model=ImageResponse)
async def upload_image(
    listing_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Feltöltés bejelentkezett user saját hirdetéséhez"""

    # 1️⃣ jogosultság ellenőrzés — csak a saját listinghez tölthet fel képet
    listing = (
        db.query(Listing)
        .filter(Listing.id == listing_id, Listing.user_id == current_user.id)
        .first()
    )
    if not listing:
        raise HTTPException(status_code=403, detail="No permission to modify this listing")

    # 2️⃣ max 10 kép / hirdetés
    count = db.query(Image).filter(Image.listing_id == listing_id).count()
    if count >= 10:
        raise HTTPException(status_code=400, detail="Maximum 10 images allowed per listing")

    # 3️⃣ storage-driver inicializálása (.env alapján → local vagy cdn)
    storage = get_storage_driver()

    # 4️⃣ egyedi fájlnév generálása
    filename = f"{int(datetime.utcnow().timestamp())}_{file.filename}"

    # 5️⃣ kép mentése → a storage maga dönti el, hogy hova és hogyan
    # Lokális módban: Pillow feldolgozás, uploads mappa
    # CDN módban (később): Cloudflare API-feltöltés
    url = storage.save_image(file.file, filename)

    # 6️⃣ eldöntjük, hogy ez lesz-e a fő kép
    # ha még nincs egyetlen kép sem a listinghez, ez automatikusan fő lesz
    has_existing_images = db.query(Image).filter(Image.listing_id == listing_id).count() > 0
    is_main = not has_existing_images  # első kép → True, egyébként False

    # 7️⃣ új rekord mentése az adatbázisba
    new_image = Image(
        listing_id=listing_id,
        url=url,            # lehet /uploads/... vagy CDN URL/ID
        filename=filename,
        is_main=is_main,    # backend automatikusan dönti el
    )

    db.add(new_image)
    db.commit()
    db.refresh(new_image)

    # 8️⃣ válasz: a kép metaadatai + elérési út
    return new_image


# -------------------------------------------------------
# ✅ KÉPEK LEKÉRÉSE — publikusan
# -------------------------------------------------------
@router.get("/{listing_id}", response_model=List[ImageResponse])
def get_images(listing_id: int, db: Session = Depends(get_db)):
    images = db.query(Image).filter(Image.listing_id == listing_id).all()
    storage = get_storage_driver()

    # minden képhez felépítjük a végleges URL-t
    for img in images:
        img.url = storage.build_public_url(img.url)

    return images


# -------------------------------------------------------
# ✅ FŐ KÉP BEÁLLÍTÁSA
# -------------------------------------------------------
@router.post("/{image_id}/set_main")
def set_main_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Egy kép megjelölése fő képként (is_main=True)"""

    # 1️⃣ kép lekérése
    image = db.query(Image).get(image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # 2️⃣ tulajdonjog ellenőrzése
    listing = db.query(Listing).filter(Listing.id == image.listing_id).first()
    if not listing or listing.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No permission to modify this listing")

    # 3️⃣ régi fő képek kikapcsolása
    db.query(Image).filter(Image.listing_id == listing.id).update({"is_main": False})
    image.is_main = True

    db.commit()
    db.refresh(image)

    return {"message": "Main image updated successfully"}




# -------------------------------------------------------
# ✅ KÉP TÖRLÉSE
# -------------------------------------------------------
@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Egy kép törlése az adatbázisból és a storage-ból.
       Ha a törölt kép fő kép volt, új fő képet választ automatikusan.
    """
    image = db.query(Image).get(image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Ellenőrzés: a kép a bejelentkezett userhez tartozik?
    listing = db.query(Listing).filter(Listing.id == image.listing_id).first()
    if not listing or listing.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No permission to delete this image")

    was_main = image.is_main  # 🔹 jegyezzük meg, fő kép volt-e

    # Fájl törlése a storage-ból (lokális vagy CDN)
    storage = get_storage_driver()
    try:
        storage.delete_image(image.filename)
    except Exception as e:
        print(f"[WARN] Nem sikerült törölni a képfájlt: {e}")


    # 🔹 Ha a törölt kép fő kép volt → új fő kép beállítása (ha van másik)
    if was_main:
        next_image = (
            db.query(Image)
            .filter(Image.listing_id == listing.id, Image.id != image.id)
            .order_by(Image.uploaded_at.asc())
            .first()
        )
        if next_image:
            next_image.is_main = True
            db.commit()
            print(f"[INFO] Új fő kép beállítva: ID {next_image.id}")

    # DB-ből törlés
    db.delete(image)
    db.commit()

    return None




