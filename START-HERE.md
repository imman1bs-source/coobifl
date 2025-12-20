# 🚀 Quick Start Guide - Amazon Product Hub

Welcome! Phase 1 is complete. Follow these steps to get your application running.

## Prerequisites Check

Before starting, ensure you have these installed:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (v6 or higher)
   - Download: https://www.mongodb.com/try/download/community
   - Start service (Windows): `net start MongoDB`
   - Start service (macOS): `brew services start mongodb-community`

3. **npm** (comes with Node.js)
   - Verify: `npm --version`

## Installation Steps

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 3: Verify Environment Files

Both `.env` files are already created. Just verify they exist:

- [backend/.env](backend/.env) ✅
- [frontend/.env](frontend/.env) ✅

## Running the Application

You'll need TWO terminal windows.

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
===========================================
🚀 Server running in development mode
📡 Listening on port 5000
🔗 API URL: http://localhost:5000/api
💚 Health check: http://localhost:5000/health
===========================================
MongoDB Connected: localhost:27017
Database Name: amazon_product_hub
```

### Terminal 2: Start Frontend Server

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
===========================================
🎨 Frontend server running in development mode
📡 Listening on port 3000
🔗 URL: http://localhost:3000
🔌 API Backend: http://localhost:5000/api
===========================================
```

## Test the Application

### 1. Test Backend Health

Open browser: http://localhost:5000/health

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "...",
  "environment": "development"
}
```

### 2. Test Frontend

Open browser: http://localhost:3000

You should see:
- **Homepage** with "Amazon Product Hub" title
- **Google-style search bar** in the center
- **"Add Product" button**
- **Navigation header** and footer

### 3. Test API Endpoint

Open browser: http://localhost:5000/api

You should see API information.

## Project Structure Overview

```
Coobifl/
├── backend/          # API Server (Port 5000)
├── frontend/         # Web UI (Port 3000)
├── architecture/     # Documentation
├── README.md         # Full documentation
└── PHASE-1-COMPLETE.md  # Phase 1 summary
```

## What You Can Do Now

Currently available (Phase 1):
- ✅ Homepage with search interface
- ✅ Navigation between pages
- ✅ Backend API server running
- ✅ MongoDB connection established
- ✅ Health check endpoints

Coming in Phase 2-5:
- ⏳ Product search functionality
- ⏳ Product display in 6x6 grid
- ⏳ Add product form
- ⏳ Vote/report features
- ⏳ Amazon API integration

## Troubleshooting

### MongoDB Not Running

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Port Already in Use

If port 5000 or 3000 is in use:

1. Kill the process
2. Or change ports in `.env` files

### Dependencies Not Installing

Try:
```bash
npm cache clean --force
npm install
```

## Next Steps

Once both servers are running successfully:

1. Verify both servers are accessible
2. Check MongoDB connection is successful
3. Navigate to http://localhost:3000
4. Confirm no errors in console

**Then proceed to Phase 2: Data Layer & Models**

## Need Help?

- Check [README.md](README.md) for full documentation
- Check [PHASE-1-COMPLETE.md](PHASE-1-COMPLETE.md) for detailed setup
- Review architecture docs in `architecture/` folder

---

**Ready?** Start with Step 1 above and work your way down. Both servers should be running before moving to Phase 2!
