# AMA Scheme Setup Guide

## Prerequisites - Node.js Installation

Before running the AMA Scheme application, you need to install Node.js on your system.

### How to Install Node.js

1. **Download Node.js**
   - Visit https://nodejs.org/
   - Download the LTS (Long Term Support) version
   - Choose the Windows installer (.msi)

2. **Install Node.js**
   - Run the downloaded installer
   - Follow the installation wizard
   - Choose default settings (or customize if preferred)
   - Make sure to check "Add to PATH" during installation
   - Complete the installation

3. **Verify Installation**
   - Open Command Prompt or PowerShell
   - Type: `node --version` (should show v14.x.x or higher)
   - Type: `npm --version` (should show a version number)

## Running the AMA Scheme Application

### Step 1: Navigate to Project Directory
```bash
cd "c:\Users\USER\Desktop\ama contest"
```

### Step 2: Install Dependencies
```bash
npm install
```
This will install all required Node.js packages (Express, SQLite, JWT, bcryptjs, etc.)

### Step 3: Start the Server
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

The server will start on **http://localhost:3000**

### Step 4: Access the Application

- **Home Page:** http://localhost:3000
- **Login:** http://localhost:3000/pages/login.html
- **Register:** http://localhost:3000/pages/register.html

## Project Files Created

✅ **Backend Files:**
- backend/server.js - Main server
- backend/database.js - SQLite database setup
- backend/routes/ - API endpoints
- backend/controllers/ - Business logic
- backend/middleware/ - Authentication

✅ **Frontend Files:**
- frontend/index.html - Homepage
- frontend/pages/ - User pages (login, register, dashboard, quiz, withdrawal, analytics, admin)
- frontend/css/style.css - Styling
- frontend/js/ - JavaScript functionality

✅ **Configuration Files:**
- package.json - Dependencies
- .env - Environment variables
- .gitignore - Git ignore rules
- README.md - Documentation

## Features Available

### User Features
✅ Registration with email, phone, password
✅ Login with JWT authentication
✅ 12-question quiz system
✅ Payment verification (Opay)
✅ Dashboard with account stats
✅ Withdrawal requests
✅ Personal analytics

### Admin Features
✅ Admin dashboard with statistics
✅ Withdrawal management (approve/reject)
✅ System analytics and reports
✅ User management

## Important Notes

1. **Database**: SQLite database will be created automatically in the `data/` folder
2. **Payment**: Currently supports manual payment verification. To enable live Opay payments, update the .env file with Opay credentials
3. **JWT Secret**: Change the JWT_SECRET in .env for production use
4. **Default Port**: 3000 (change in .env if needed)

## Testing Checklist

After running npm start, test these flows:

1. **User Registration** → Register with test credentials
2. **Login** → Login with registered credentials
3. **Dashboard** → View account information
4. **Quiz** → Start quiz and attempt questions
5. **Payment** → Verify payment process
6. **Admin** → Login as admin and manage withdrawals

## Troubleshooting

### Issue: npm command not found
**Solution:** Restart your terminal after installing Node.js. If still not working, add Node.js to PATH manually.

### Issue: Port 3000 already in use
**Solution:** Change PORT in .env file to 3001 or another available port

### Issue: Database error
**Solution:** Ensure the `data/` folder exists. Create it manually if needed: `mkdir data`

### Issue: CORS error in browser
**Solution:** Ensure frontend is accessing http://localhost:3000 (check API_URL in frontend/js/app.js)

## Next Steps

1. Install Node.js from nodejs.org
2. Open terminal/PowerShell
3. Navigate to project folder
4. Run `npm install`
5. Run `npm start`
6. Open http://localhost:3000 in browser

Enjoy! 🎯
