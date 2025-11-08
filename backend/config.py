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
# API base
# -----------------------------
API_BASE_URL = os.getenv("API_BASE_URL")

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
STORAGE_BACKEND = os.getenv("STORAGE_BACKEND")  # local | cdn
UPLOAD_DIR = os.getenv("UPLOAD_DIR")

CDN_UPLOAD_URL = os.getenv("CDN_UPLOAD_URL")
CDN_DELIVERY_BASE = os.getenv("CDN_DELIVERY_BASE")
CDN_API_KEY = os.getenv("CDN_API_KEY")





# ---------- REQUIRED ENV CHECK ----------
_required_vars = {
    "DATABASE_URL": DATABASE_URL,
    "API_BASE_URL": API_BASE_URL,
    "JWT_SECRET": JWT_SECRET,
    "JWT_ALGORITHM": JWT_ALGORITHM,
    "ACCESS_TOKEN_EXPIRE_MINUTES": ACCESS_TOKEN_EXPIRE_MINUTES,
    "CORS_ORIGINS": CORS_ORIGINS,
    "ADMIN_USER": ADMIN_USER,
    "ADMIN_PASS": ADMIN_PASS,
    "STORAGE_BACKEND": STORAGE_BACKEND,
    "UPLOAD_DIR": UPLOAD_DIR,
    "CDN_UPLOAD_URL": CDN_UPLOAD_URL,
    "CDN_DELIVERY_BASE": CDN_DELIVERY_BASE,
    "CDN_API_KEY": CDN_API_KEY,
}

_missing = [name for name, val in _required_vars.items() if val in (None, "", [])]

if _missing:
    raise RuntimeError(
        "Missing required environment variables: "
        + ", ".join(_missing)
        + ".\nPlease add them to .env.local or your environment."
    )
# ----------------------------------------
