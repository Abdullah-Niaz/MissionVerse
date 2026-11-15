@echo off
title MissionVerse Dev Launcher
echo ==========================================================
echo   MissionVerse — Junior Astronaut Mission Trainer
echo ==========================================================
echo.
echo Starting FastAPI Backend and Vite Frontend...
echo.

start "MissionVerse Backend" powershell -NoExit -Command "cd backend; .venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
start "MissionVerse Frontend" powershell -NoExit -Command "cd frontend; npm run dev"

echo.
echo Launching browser to http://localhost:5173 in 3 seconds...
timeout /t 3 >nul
start http://localhost:5173
echo.
echo Both servers running! Close the command windows to stop them.
pause
