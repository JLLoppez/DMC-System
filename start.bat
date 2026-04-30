@echo off
echo.
echo DMC System -- Digital Management Consultant
echo MVP v1.0.0
echo.

echo Starting backend...
cd backend
start /B python app.py
echo Backend starting on http://localhost:5000

timeout /t 3 /nobreak >nul

echo Starting frontend...
cd ..\frontend
start /B npm start
echo Frontend starting on http://localhost:3000

echo.
echo DMC System is starting...
echo Open http://localhost:3000 in your browser
echo.
pause
