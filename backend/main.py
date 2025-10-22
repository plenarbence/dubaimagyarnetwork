from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from database import Base, engine
from routes import auth, admin

# -----------------------------
# ✅ Környezeti változók betöltése (.env.local)
# -----------------------------
load_dotenv(".env.local")

# -----------------------------
# ✅ FastAPI app létrehozása
# -----------------------------
app = FastAPI(title="Dubai Magyar Network API", version="1.0-dev")

# -----------------------------
# ✅ CORS beállítás (.env-ből)
# -----------------------------
origins = os.getenv("CORS_ORIGINS", "*").split(",")


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# ✅ Adatbázis inicializálás
# -----------------------------
Base.metadata.create_all(bind=engine)

# -----------------------------
# ✅ Route-ok regisztrálása
# -----------------------------
app.include_router(auth.router)
app.include_router(admin.router)

# -----------------------------
# ✅ Teszt endpoint
# -----------------------------
@app.get("/")
def read_root():
    return {"message": "Backend működik ✅", "environment": os.getenv("CORS_ORIGINS")}
