from fastapi import HTTPException, status, Request
from jose import jwt, JWTError
from backend.config import JWT_SECRET, JWT_ALGORITHM


# ================================
# ✅ Admin token ellenőrzése (HEADER-ből)
# ================================
def verify_admin_token(request: Request) -> dict:
    """
    Beolvassa a tokent az Authorization headerből ('Bearer <token>'),
    dekódolja és ellenőrzi, hogy az 'sub' mező 'admin'-e.
    Hibás, lejárt vagy nem-admin token esetén HTTP hibát dob.
    """

    # 1️⃣ Header beolvasása
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hiányzik vagy hibás Authorization header",
        )

    # 2️⃣ Token kivágása
    token = auth_header.split(" ")[1]

    # 3️⃣ Token dekódolás és ellenőrzés
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        subject = payload.get("sub")

        if subject != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Nincs jogosultság az admin művelethez."
            )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Érvénytelen vagy lejárt token.",
        )
