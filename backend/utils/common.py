from datetime import datetime, timedelta
import re

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

import os
from dotenv import load_dotenv

load_dotenv(".env.local")


# ===============================
# 🔐 JELSZÓ HASH & ELLENŐRZÉS
# ===============================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Visszaadja a jelszó bcrypt-tel hashelt változatát."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Ellenőrzi, hogy a megadott jelszó megfelel-e a hash-nek."""
    return pwd_context.verify(plain_password, hashed_password)

def validate_password(password: str) -> None:
    """Ellenőrzi, hogy a jelszó megfelel-e az alapkövetelményeknek."""
    rules = [
        (re.compile(r".{8,}"), "A jelszónak legalább 8 karakter hosszúnak kell lennie."),
        (re.compile(r"[A-Z]"), "A jelszónak tartalmaznia kell legalább egy nagybetűt."),
        (re.compile(r"[a-z]"), "A jelszónak tartalmaznia kell legalább egy kisbetűt."),
        (re.compile(r"[0-9]"), "A jelszónak tartalmaznia kell legalább egy számot."),
    ]
    for pattern, msg in rules:
        if not pattern.search(password or ""):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)


# ===============================
# 🔑 JWT TOKEN GENERÁLÁS / VALIDÁLÁS
# ===============================
SECRET_KEY = os.getenv("JWT_SECRET")
if not SECRET_KEY:
    raise RuntimeError("❌ JWT_SECRET hiányzik az .env.local fájlból!")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """JWT token generálása"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str = Depends(oauth2_scheme)):
    """JWT token dekódolása és ellenőrzése"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        subject = payload.get("sub")
        if subject is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        return subject
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
