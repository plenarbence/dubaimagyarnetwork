@echo off
echo ===============================
echo Switching to project root...
echo ===============================
cd /d C:\Users\plena\projects\dubaimagyarnetwork

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
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
pause
