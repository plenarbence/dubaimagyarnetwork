from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔹 belső importok az új struktúrához igazítva
from database import Base, engine
from routes import auth

# FastAPI példány létrehozása
app = FastAPI()

# -------------------------------
# ✅ CORS engedélyezése a frontendhez
# -------------------------------
origins = [
    "http://localhost:3000",                  # helyi fejlesztéshez
    "https://dev.dubaimagyarnetwork.com",     # dev frontend
    "https://dubaimagyarnetwork.com"          # prod frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# ✅ adatbázis inicializálása
# -------------------------------
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"⚠️ DB init error: {e}")

# -------------------------------
# ✅ auth endpointok regisztrálása
# -------------------------------
app.include_router(auth.router)

# -------------------------------
# ✅ teszt endpoint
# -------------------------------
@app.get("/")
def read_root():
    return {"message": "Backend működik ✅"}
