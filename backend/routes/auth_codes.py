# backend/routes/auth_codes.py

from fastapi import APIRouter, Depends, status, Body, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.schemas.auth_code_schema import AuthCodeRequestIn, AuthCodeVerifyIn
from backend.routes.auth_code_logic.request_auth_code import request_auth_code
from backend.routes.auth_code_logic.send_auth_code_email import send_auth_code_email
from backend.routes.auth_code_logic.verify_auth_code import verify_auth_code
from backend.routes.auth_code_logic.verify_email_logic import verify_email_logic
from backend.models.auth_code import AuthCodePurpose
from backend.routes.auth_logic.jwt_handler import verify_access_token
from backend.routes.auth_code_logic.check_auth_code import check_auth_code
from backend.routes.auth_code_logic.change_password_with_code import change_password_with_code


router = APIRouter(prefix="/auth-codes", tags=["Auth Codes"])



# ============================================================
# ✅ AUTH – email verifikációs kód igénylése (JWT-ből)
# ============================================================
@router.post("/request-email-verification", status_code=status.HTTP_204_NO_CONTENT)
async def request_email_verification_code_endpoint(
    email: str = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    raw_code = await request_auth_code(
        db=db,
        email=email,
        purpose=AuthCodePurpose.email_verify,
    )

    if raw_code:
        await send_auth_code_email(
            email=email,
            code=raw_code,
            purpose=AuthCodePurpose.email_verify,
        )

    return None


# ============================================================
# ✅ AUTH – email cím verifikálása (JWT-ből, csak kód input)
# ============================================================
@router.post("/verify-email", status_code=status.HTTP_204_NO_CONTENT)
async def verify_email_endpoint(
    code: str = Body(..., embed=True),
    email: str = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    is_valid = await verify_auth_code(
        db=db,
        email=email,
        code=code,
        purpose=AuthCodePurpose.email_verify,
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired code",
        )


    await verify_email_logic(
        db=db,
        email=email,
    )

    return None




# ============================================================
# ✅ PUBLIC – password reset auth code igénylése 
# ============================================================
@router.post("/request-password-reset", status_code=status.HTTP_204_NO_CONTENT)
async def request_password_reset_code_endpoint(
    email: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
):
    raw_code = await request_auth_code(
        db=db,
        email=email,
        purpose=AuthCodePurpose.password_reset,
    )

    if raw_code:
        await send_auth_code_email(
            email=email,
            code=raw_code,
            purpose=AuthCodePurpose.password_reset,
        )

    return None




# ============================================================
# ✅ PUBLIC – password reset kód ellenőrzése (read-only)
# ============================================================
@router.post("/check-password-reset-code", status_code=status.HTTP_204_NO_CONTENT)
async def check_password_reset_code_endpoint(
    email: str = Body(..., embed=True),
    code: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
):
    is_valid = await check_auth_code(
        db=db,
        email=email,
        code=code,
        purpose=AuthCodePurpose.password_reset,
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired code",
        )

    return None



# ============================================================
# ✅ PUBLIC – jelszó visszaállítása auth kóddal
# ============================================================
@router.post("/reset-password-with-code", status_code=status.HTTP_204_NO_CONTENT)
async def reset_password_with_code_endpoint(
    email: str = Body(..., embed=True),
    code: str = Body(..., embed=True),
    new_password: str = Body(..., embed=True),
    new_password_confirm: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
):
    await change_password_with_code(
        db=db,
        email=email,
        code=code,
        new_password=new_password,
        new_password_confirm=new_password_confirm,
    )

    return None