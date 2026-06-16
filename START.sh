#!/bin/bash

# AMA Scheme - Quick Start Script for Mac/Linux

echo ""
echo "========================================"
echo "   AMA Scheme - Betting Quiz Platform"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[✓] Node.js is installed"
node --version

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed"
    exit 1
fi

echo "[✓] npm is installed"
npm --version

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    echo ""
    echo "Creating data directory..."
    mkdir -p data
    echo "[✓] Data directory created"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Installing dependencies... This may take a few minutes"
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
    echo "[✓] Dependencies installed"
else
    echo "[✓] Dependencies already installed"
fi

echo ""
echo "========================================"
echo "   Starting AMA Scheme Server"
echo "========================================"
echo ""
echo "Server will start on http://localhost:3000"
echo ""
echo "Open your browser and visit:"
echo "  - Home: http://localhost:3000"
echo "  - Login: http://localhost:3000/pages/login.html"
echo "  - Register: http://localhost:3000/pages/register.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
