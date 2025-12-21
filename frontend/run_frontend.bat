@echo off
echo ===============================
echo Switching to project root...
echo ===============================
cd /d C:\Users\plena\projects\dubaimagyarnetwork\frontend

echo ===============================
echo Starting frontend...
echo ===============================
start cmd /k npm run dev

echo ===============================
echo Opening browser...
echo ===============================
timeout /t 2 >nul
start http://localhost:3000

pause
