from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import auth, users, listings, categories, admin, images

# ---------------------------------------
# ✅ Adatbázis inicializálás
# ---------------------------------------
Base.metadata.create_all(bind=engine)

# ---------------------------------------
# ✅ FastAPI app
# ---------------------------------------
app = FastAPI(title="Dubai Magyar Network API")

# ---------------------------------------
# ✅ CORS beállítás
# ---------------------------------------
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://dubaimagyarnetwork.com",
    "https://admin.dubaimagyarnetwork.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------
# ✅ ROUTE-k regisztrálása
# ---------------------------------------
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(listings.router)
app.include_router(categories.router)
app.include_router(admin.router)
app.include_router(images.router)

# ---------------------------------------
# ✅ Statikus fájlok kiszolgálása CSAK lokális módban
# ---------------------------------------
from fastapi.staticfiles import StaticFiles
import os

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local").strip().lower()

if STORAGE_BACKEND == "local":
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ---------------------------------------
# ✅ Root endpoint
# ---------------------------------------
@app.get("/")
def root():
    return {"message": "Dubai Magyar Network API működik 🚀"}
