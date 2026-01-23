# backend/config.py
import os
from pathlib import Path
from dotenv import load_dotenv

# .env betöltés (először .env.local, ha nincs, akkor .env)
BASE_DIR = Path(__file__).parent
env_file = BASE_DIR / ".env.local"
if env_file.exists():
    load_dotenv(dotenv_path=env_file, override=False)
else:
    load_dotenv(override=False)

def _csv(name: str, default: str = "") -> list[str]:
    return [x.strip() for x in os.getenv(name, default).split(",") if x.strip()]

# -----------------------------
# Database
# -----------------------------
DATABASE_URL = os.getenv("DATABASE_URL")

# -----------------------------
# JWT
# -----------------------------
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# -----------------------------
# CORS
# -----------------------------
CORS_ORIGINS = _csv("CORS_ORIGINS")

# -----------------------------
# Admin login
# -----------------------------
ADMIN_USER = os.getenv("ADMIN_USER")
ADMIN_PASS = os.getenv("ADMIN_PASS")

# -----------------------------
# Storage / CDN
# -----------------------------
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_ENDPOINT = os.getenv("R2_ENDPOINT")
R2_BUCKET = os.getenv("R2_BUCKET")
R2_PUBLIC_BASE = os.getenv("R2_PUBLIC_BASE")
IMAGE_PREFIX = os.getenv("IMAGE_PREFIX")

# -----------------------------
# Email service
# -----------------------------
RESEND_API_KEY = os.getenv("RESEND_API_KEY")



# ---------- REQUIRED ENV CHECK ----------
_required_vars = {
    "DATABASE_URL": DATABASE_URL,
    "JWT_SECRET": JWT_SECRET,
    "JWT_ALGORITHM": JWT_ALGORITHM,
    "ACCESS_TOKEN_EXPIRE_MINUTES": ACCESS_TOKEN_EXPIRE_MINUTES,
    "CORS_ORIGINS": CORS_ORIGINS,
    "ADMIN_USER": ADMIN_USER,
    "ADMIN_PASS": ADMIN_PASS,
    "R2_ACCESS_KEY_ID" : R2_ACCESS_KEY_ID,
    "R2_SECRET_ACCESS_KEY" : R2_SECRET_ACCESS_KEY,
    "R2_ENDPOINT" : R2_ENDPOINT,
    "R2_BUCKET" : R2_BUCKET,
    "R2_PUBLIC_BASE" : R2_PUBLIC_BASE,
    "IMAGE_PREFIX" : IMAGE_PREFIX,
    "RESEND_API_KEY" : RESEND_API_KEY,
}

_missing = [name for name, val in _required_vars.items() if val in (None, "", [])]

if _missing:
    raise RuntimeError(
        "Missing required environment variables: "
        + ", ".join(_missing)
        + ".\nPlease add them to .env.local or your environment."
    )
# ----------------------------------------
