@echo off
echo ========================================
echo   NOVINAR - Backend Server
echo ========================================
echo.

cd backend

echo Provjeravam dependencies...
if not exist "node_modules\" (
    echo Instaliram dependencies (ovo moze trajati 2-3 minute)...
    npm install
)

echo.
echo Pokrecem backend server...
echo.
echo Backend ce biti dostupan na: http://localhost:5000
echo.
npm start

pause
