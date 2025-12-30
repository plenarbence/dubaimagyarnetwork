@echo off

echo ===============================
echo Switching to project root...
echo ===============================
cd /d C:\Users\plena\projects\dubaimagyarnetwork

echo ===============================
echo Checking Docker...
echo ===============================
docker info >nul 2>&1
IF ERRORLEVEL 1 (
    echo Docker Desktop is NOT running!
    echo Please start Docker Desktop and retry.
    pause
    exit /b 1
)

echo ===============================
echo Starting Postgres container...
echo ===============================
docker compose up -d

echo ===============================
echo Activating virtual environment...
echo ===============================
call backend\venv\Scripts\activate

echo ===============================
echo Updating requirements.txt...
echo ===============================
pip freeze > backend\requirements.txt

echo ===============================
echo Starting FastAPI backend...
echo ===============================
alembic upgrade head && uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

pause
