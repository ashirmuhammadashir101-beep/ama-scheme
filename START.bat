@echo off
REM AMA Scheme - Quick Start Script

echo.
echo ========================================
echo    AMA Scheme - Betting Quiz Platform
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Node.js is installed
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo [✓] npm is installed
npm --version

REM Create data directory if it doesn't exist
if not exist "data" (
    echo.
    echo Creating data directory...
    mkdir data
    echo [✓] Data directory created
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo.
    echo Installing dependencies... This may take a few minutes
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo [✓] Dependencies installed
) else (
    echo [✓] Dependencies already installed
)

echo.
echo ========================================
echo    Starting AMA Scheme Server
echo ========================================
echo.
echo Server will start on http://localhost:3000
echo.
echo Open your browser and visit:
echo   - Home: http://localhost:3000
echo   - Login: http://localhost:3000/pages/login.html
echo   - Register: http://localhost:3000/pages/register.html
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

pause
