@echo off
echo ================================
echo   Novinar App - Quick Deploy
echo ================================
echo.

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Docker nije instaliran ili nije pokrenut
    echo   Download: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if .env exists
if not exist "backend\.env" (
    echo ! backend\.env ne postoji. Kopiram template...
    copy .env.example backend\.env
    echo + Kopirano! Edituj backend\.env sa svojim MongoDB URI!
    echo.
    pause
)

REM Check frontend .env
if not exist "frontend\.env" (
    echo REACT_APP_API_URL=http://localhost:5000/api > frontend\.env
    echo + Frontend .env kreiran
)

echo.
echo Pokrecem Docker containers...
echo.

docker-compose up -d

echo.
echo + Aplikacija pokrenuta!
echo.
echo Frontend: http://localhost
echo Backend:  http://localhost:5000
echo.
echo Logs: docker-compose logs -f
echo Stop:  docker-compose down
echo.
pause
