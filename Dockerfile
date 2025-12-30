# -----------------------------
# 🐍 Base image
# -----------------------------
FROM python:3.12-slim

# -----------------------------
# ⚙️ Environment
# -----------------------------
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# -----------------------------
# 📂 Workdir = repo root
# -----------------------------
WORKDIR /app

# -----------------------------
# 📦 System deps
# -----------------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# 📄 Python deps
# -----------------------------
# requirements.txt legyen a backendben
COPY backend/requirements.txt backend/requirements.txt

RUN pip install --upgrade pip \
    && pip install -r backend/requirements.txt

# -----------------------------
# 📁 Copy project
# -----------------------------
COPY . .

# -----------------------------
# 🚀 Startup command
# -----------------------------
# 1️⃣ Alembic migrate
# 2️⃣ Uvicorn start
CMD ["bash", "-c", "alembic upgrade head && uvicorn backend.main:app --host 0.0.0.0 --port 8000"]
