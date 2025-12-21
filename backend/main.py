# -----------------------------
# ✅ FastAPI és middleware importok
# -----------------------------
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# -----------------------------
# ✅ Saját modulok importja
# -----------------------------
from backend.config import CORS_ORIGINS
from backend import models  # models __init__.py ba be kell importolni minden modelt hogy a relationshipek jol fussanak
from backend.routes import auth, admin, categories, content, listings, images


# -----------------------------
# ✅ FastAPI inicializálás
# -----------------------------
app = FastAPI(
    title="Dubai Magyar Network API",
    description="Backend szolgáltatás a Dubai Magyar Network platformhoz.",
    version="1.0.0"
)


# -----------------------------
# ✅ CORS beállítások
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ---------------------------------------
# ✅ ROUTE-k regisztrálása
# ---------------------------------------
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(categories.router)
app.include_router(content.router)
app.include_router(listings.router)
app.include_router(images.router)



# -----------------------------
# ✅ Root endpoint
# -----------------------------
@app.get("/")
def root():
    return {"message": "Dubai Magyar Network API működik 🚀"}








