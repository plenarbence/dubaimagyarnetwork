@echo off
echo ===============================
echo Switching to project root...
echo ===============================
cd /d C:\Users\plena\projects\dubaimagyarnetwork\admin

echo ===============================
echo Starting admin...
echo ===============================
start cmd /k npm run dev

echo ===============================
echo Opening browser...
echo ===============================
timeout /t 2 >nul
start http://localhost:3001

pause
