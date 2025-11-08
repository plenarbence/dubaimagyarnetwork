from passlib.context import CryptContext

# ---------------------------
# 🔐 Jelszó hash-elés és ellenőrzés
# ---------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Bcrypt hash-t generál a jelszóból."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Ellenőrzi, hogy a megadott jelszó megfelel-e a tárolt hash-nek."""
    return pwd_context.verify(plain_password, hashed_password)
