from pydantic import BaseModel

# -----------------------------
# ✅ Admin belépéshez input séma
# -----------------------------
class AdminLoginRequest(BaseModel):
    username: str
    password: str