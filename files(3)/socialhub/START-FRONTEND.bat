@echo off
echo ========================================
echo   NOVINAR - Frontend App
echo ========================================
echo.

cd frontend

echo Provjeravam dependencies...
if not exist "node_modules\" (
    echo Instaliram dependencies (ovo moze trajati 2-3 minute)...
    npm install
)

echo.
echo Pokrecem frontend...
echo Browser ce se automatski otvoriti na: http://localhost:3000
echo.
npm start

pause
