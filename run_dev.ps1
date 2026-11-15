Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  MissionVerse — Junior Astronaut Mission Trainer" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = Get-Location

# 1. Start Backend in background
Write-Host "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$rootPath\backend'; .\.venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload" -PassThru

# 2. Start Frontend in background
Write-Host "[2/2] Starting React + Phaser Frontend on http://localhost:5173..." -ForegroundColor Green
$frontendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$rootPath\frontend'; npm run dev" -PassThru

Write-Host ""
Write-Host "MissionVerse is launching!" -ForegroundColor Cyan
Write-Host "  Backend API:  http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "  Game Web App: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Enter to stop servers when finished..." -ForegroundColor Gray
Read-Host
Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
