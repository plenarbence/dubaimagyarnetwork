from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, status

# import config values
from config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


# ---------------------------
# 🔑 JWT token generálás és ellenőrzés
# ---------------------------

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    JWT token generálása a megadott adatokból.
    A `data` tipikusan tartalmazza a 'sub' kulcsot (pl. felhasználó email vagy ID).
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str) -> dict:
    """
    Token dekódolása és ellenőrzése.
    Hibás vagy lejárt token esetén HTTP_401 hibát dob.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
