@echo off
echo ===============================
echo Activating virtual environment...
echo ===============================
call venv\Scripts\activate

echo ===============================
echo Updating requirements.txt...
echo ===============================
pip freeze > requirements.txt

echo ===============================
echo Starting FastAPI backend...
echo ===============================
uvicorn main:app --reload --host 127.0.0.1 --port 8000