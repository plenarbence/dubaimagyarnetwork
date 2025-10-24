from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from database import SessionLocal
from models.category import Category
from routes.admin import get_current_admin  # admin hitelesítéshez
from pydantic import BaseModel

router = APIRouter(prefix="/categories", tags=["Categories"])


# dependency az adatbázis-sessionhöz
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Pydantic sémák
class CategoryCreate(BaseModel):
    name: str
    parent_id: int | None = None
    order_index: int | None = 0


class CategoryOut(BaseModel):
    id: int
    name: str
    parent_id: int | None
    order_index: int

    class Config:
        orm_mode = True


# ✅ GET - az összes kategória lekérése fastruktúrában
@router.get("/", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    # 🔹 Adattisztítás: ha egy kategória saját magára hivatkozik parentként, nullra állítjuk
    db.query(Category).filter(Category.id == Category.parent_id).update(
        {Category.parent_id: None}, synchronize_session=False
    )
    db.commit()

    categories = db.query(Category).order_by(Category.parent_id, Category.order_index).all()
    return categories


# ✅ POST - új kategória létrehozása
@router.post("/", response_model=CategoryOut)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    new_cat = Category(
        name=data.name,
        parent_id=data.parent_id,
        order_index=data.order_index or 0,
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat


@router.delete("/{cat_id}", status_code=204)
def delete_category(
    cat_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    has_children = db.query(Category).filter(Category.parent_id == cat_id).first()
    if has_children:
        raise HTTPException(
            status_code=409,
            detail="Cannot delete a parent category that has subcategories.",
        )

    db.delete(cat)
    db.commit()
    return Response(status_code=204)
