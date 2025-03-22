@echo off
echo Starting Jungle Safari Inventory Management System...
echo.
echo Starting backend server...
start cmd /k "cd backend && npm run dev"
echo.
echo Starting frontend server...
start cmd /k "cd frontend && npm start"
echo.
echo Both servers are starting. Please wait...
echo Backend will be available at http://localhost:5000
echo Frontend will be available at http://localhost:3000
echo.
echo To stop the servers, close the command prompt windows or press Ctrl+C in each window. 