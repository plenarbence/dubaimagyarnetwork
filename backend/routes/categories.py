from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

# --- belső importok ---
from backend.database import get_db
from backend.routes.admin_logic.verify_admin import verify_admin_token

# --- sémák és modellek ---
from backend.schemas.category_schema import CategoryCreate, CategoryOut

# --- logikai modulok ---
from backend.routes.categories_logic.create_category import create_category_logic
from backend.routes.categories_logic.delete_category import delete_category_logic
from backend.routes.categories_logic.get_categories import get_categories_logic
from backend.routes.categories_logic.update_category_order import update_category_order_logic
from backend.routes.categories_logic.update_category_name import update_category_name_logic


# --- Router definiálása ---
router = APIRouter(prefix="/categories", tags=["Categories"])


# ============================================================
# ✅ 1️⃣ GET – összes kategória (public)
# ============================================================
@router.get("/", response_model=list[CategoryOut])
async def get_categories_endpoint(db: AsyncSession = Depends(get_db)):
    """
    Összes kategória lekérése, parent_id és order_index szerint rendezve.
    """
    return await get_categories_logic(db)


# ============================================================
# ✅ 2️⃣ POST – új kategória létrehozása (admin)
# ============================================================
@router.post("/", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category_endpoint(
    data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    """
    Új kategória létrehozása (csak admin).
    """
    return await create_category_logic(data, db)


# ============================================================
# ✅ 3️⃣ DELETE – kategória törlése (admin)
# ============================================================
@router.delete("/{cat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category_endpoint(
    cat_id: int,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    """
    Kategória törlése (csak admin).
    """
    await delete_category_logic(cat_id, db)


# ============================================================
# ✅ 4️⃣ PUT – kategória sorrend módosítása (admin)
# ============================================================
@router.put("/{cat_id}/order/{new_order}", status_code=status.HTTP_204_NO_CONTENT)
async def update_category_order_endpoint(
    cat_id: int,
    new_order: int,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    """
    Kategória sorrend (order_index) módosítása.
    """
    await update_category_order_logic(cat_id, new_order, db)


# ============================================================
# ✅ 5️⃣ PUT – kategória nevének módosítása (admin)
# ============================================================
@router.put("/{cat_id}/name/{new_name}", status_code=status.HTTP_204_NO_CONTENT)
async def update_category_name_endpoint(
    cat_id: int,
    new_name: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    """
    Kategória nevének módosítása (csak admin).
    """
    await update_category_name_logic(cat_id, new_name, db)
