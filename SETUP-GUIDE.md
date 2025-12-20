# Setup Guide - Prerequisites & Installation

## Overview

This guide lists everything you need to download and install to start developing the Amazon Product Information application.

---

## Required Software

### 1. Node.js (Required)

**What**: JavaScript runtime environment for running the application

**Version**: 18.x or higher (LTS recommended)

**Download**: [https://nodejs.org/](https://nodejs.org/)

**Windows Installation**:
- Download the Windows Installer (.msi) for LTS version
- Run the installer
- Follow the setup wizard (keep default settings)
- Verify installation:
  ```bash
  node --version    # Should show v18.x.x or higher
  npm --version     # Should show 9.x.x or higher
  ```

**Why**: Node.js is the foundation for both frontend and backend services

---

### 2. MongoDB (Required)

**What**: NoSQL database for storing product information

**Version**: 6.x or higher

**Option A: Local Installation (For Development)**

**Download**: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

**Windows Installation**:
- Download MongoDB Community Server (MSI package)
- Run the installer
- Choose "Complete" installation
- Install MongoDB as a Service (check the box)
- Install MongoDB Compass (GUI tool - optional but recommended)
- Verify installation:
  ```bash
  mongo --version   # Should show version 6.x.x or higher
  ```

**MongoDB Compass** (GUI - Recommended):
- Included in MongoDB installer or download separately
- [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
- Useful for viewing and managing data visually

**Option B: MongoDB Atlas (Cloud - Recommended for Production)**

**Setup**:
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a free M0 cluster (512MB storage, free forever)
4. Set up database user and password
5. Add your IP address to whitelist (or allow access from anywhere for development: 0.0.0.0/0)
6. Get connection string

**Why**: MongoDB stores all product data with flexible schema support

---

### 3. Git (Required)

**What**: Version control system

**Version**: Latest

**Download**: [https://git-scm.com/downloads](https://git-scm.com/downloads)

**Windows Installation**:
- Download Git for Windows
- Run installer
- Use recommended settings
- Choose your preferred text editor
- Verify installation:
  ```bash
  git --version
  ```

**Why**: For version control and collaboration

---

### 4. Code Editor (Required)

**Recommended: Visual Studio Code (VS Code)**

**Download**: [https://code.visualstudio.com/](https://code.visualstudio.com/)

**Windows Installation**:
- Download the Windows installer
- Run and follow setup wizard
- Install recommended extensions (see below)

**Recommended VS Code Extensions**:
```
1. ESLint - Code linting
2. Prettier - Code formatter
3. MongoDB for VS Code - MongoDB integration
4. Docker - Docker support
5. GitLens - Enhanced Git features
6. REST Client - API testing
7. Thunder Client - Alternative API testing
8. JavaScript (ES6) code snippets
9. Path Intellisense - File path autocomplete
10. Auto Rename Tag - HTML/JSX tag renaming
```

**Alternative Editors**:
- WebStorm (JetBrains) - [https://www.jetbrains.com/webstorm/](https://www.jetbrains.com/webstorm/)
- Sublime Text - [https://www.sublimetext.com/](https://www.sublimetext.com/)
- Atom - [https://atom.io/](https://atom.io/)

**Why**: For writing and editing code efficiently

---

### 5. Postman or Insomnia (Recommended)

**What**: API testing tool

**Option A: Postman**
- Download: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
- Free version available
- Great for API development and testing

**Option B: Insomnia**
- Download: [https://insomnia.rest/download](https://insomnia.rest/download/)
- Lightweight alternative

**Option C: VS Code Extensions**
- Thunder Client (VS Code extension)
- REST Client (VS Code extension)

**Why**: Test API endpoints without building the frontend first

---

### 6. Docker Desktop (Optional - Recommended)

**What**: Containerization platform

**Version**: Latest

**Download**: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

**Windows Requirements**:
- Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
- OR Windows 11 64-bit
- Enable WSL 2 (Windows Subsystem for Linux)

**Windows Installation**:
1. Download Docker Desktop for Windows
2. Run installer
3. Enable WSL 2 during installation
4. Restart computer
5. Start Docker Desktop
6. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

**Why**:
- Run MongoDB and Redis locally without installing them
- Containerize your application
- Consistent development environment

---

### 7. Redis (Optional - For Caching)

**What**: In-memory cache for performance optimization

**Option A: Windows Installation (Development)**

Since Redis doesn't officially support Windows, use one of these options:

**Option 1: Docker (Recommended)**
```bash
docker run --name redis -p 6379:6379 -d redis:7-alpine
```

**Option 2: WSL (Windows Subsystem for Linux)**
```bash
# In WSL terminal
sudo apt update
sudo apt install redis-server
sudo service redis-server start
redis-cli --version
```

**Option 3: Memurai (Windows Native)**
- Download: [https://www.memurai.com/get-memurai](https://www.memurai.com/get-memurai)
- Redis-compatible for Windows
- Free developer edition available

**Option B: Cloud Redis (Production)**
- Redis Labs (Cloud): [https://redis.com/try-free/](https://redis.com/try-free/)
- AWS ElastiCache
- Azure Cache for Redis

**Why**: Improves application performance by caching frequently accessed data

---

### 8. Windows Terminal (Optional - Recommended)

**What**: Modern terminal application for Windows

**Download**: [Microsoft Store - Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)

**Why**: Better terminal experience with tabs, themes, and customization

---

## Amazon Product Advertising API Setup

### 1. Amazon Associate Account

**Steps**:
1. Go to [https://affiliate-program.amazon.com/](https://affiliate-program.amazon.com/)
2. Sign up for Amazon Associates program
3. Complete the application process
4. Get approved (may take 1-3 days)

### 2. Product Advertising API Access

**Steps**:
1. Once Associates account is approved, go to [https://webservices.amazon.com/paapi5/documentation/](https://webservices.amazon.com/paapi5/documentation/)
2. Sign in with your Amazon Associates credentials
3. Navigate to "Manage Your Apps"
4. Click "Add a new app"
5. Get your credentials:
   - **Access Key**
   - **Secret Key**
   - **Associate Tag** (from your Associates account)

**Important Notes**:
- You need to generate at least 3 sales within 180 days to maintain API access
- For testing, you can use the Product Advertising API Scratchpad
- Keep your credentials secure (never commit to Git)

**Alternative for Testing**:
- Use dummy data initially
- Create a seed script with sample products
- Switch to real API once approved

---

## Development Tools & Utilities

### 1. npm Packages (Global - Optional)

Install these globally for convenience:

```bash
# Nodemon - Auto-restart server on file changes
npm install -g nodemon

# PM2 - Production process manager
npm install -g pm2

# ESLint - JavaScript linter
npm install -g eslint

# TypeScript (if using TypeScript)
npm install -g typescript

# Jest - Testing framework
npm install -g jest
```

### 2. Browser Extensions (For Testing)

**Chrome/Edge Extensions**:
- JSON Formatter - Pretty print JSON responses
- React Developer Tools (if using React)
- Redux DevTools (if using Redux)
- Wappalyzer - Identify technologies used

---

## Cloud Services Setup (Optional - For Deployment)

### 1. AWS Account

**Setup**:
1. Go to [https://aws.amazon.com/](https://aws.amazon.com/)
2. Click "Create an AWS Account"
3. Follow the registration process
4. Set up billing alerts
5. Install AWS CLI:
   - Download: [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/)
   - Configure: `aws configure`

**Free Tier Includes**:
- 750 hours of EC2 (for 12 months)
- 25GB of DynamoDB storage
- 5GB of S3 storage

### 2. GitHub Account

**Setup**:
1. Go to [https://github.com/](https://github.com/)
2. Sign up for free account
3. Create new repository for your project
4. Set up SSH keys (optional but recommended)

---

## System Requirements

### Minimum Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **OS** | Windows 10 64-bit | Windows 11 64-bit |
| **RAM** | 8GB | 16GB or more |
| **Storage** | 20GB free | 50GB+ SSD |
| **CPU** | Dual-core | Quad-core or better |
| **Internet** | Broadband | High-speed broadband |

---

## Installation Checklist

### Phase 1: Essential Tools

- [ ] Node.js v18+ installed and verified
- [ ] npm v9+ installed and verified
- [ ] Git installed and configured
- [ ] VS Code (or preferred editor) installed
- [ ] MongoDB installed (local or Atlas account created)

### Phase 2: Development Tools

- [ ] Postman or Insomnia installed
- [ ] MongoDB Compass installed (optional)
- [ ] Windows Terminal installed (optional)
- [ ] Docker Desktop installed (optional)
- [ ] Redis installed or Docker setup (optional)

### Phase 3: API Access

- [ ] Amazon Associates account created
- [ ] Amazon Product Advertising API access requested
- [ ] API credentials obtained (Access Key, Secret Key, Associate Tag)

### Phase 4: Cloud Services (For Later)

- [ ] GitHub account created
- [ ] Repository created
- [ ] AWS account created (optional)
- [ ] AWS CLI installed and configured (optional)

---

## Verification Commands

Run these commands to verify your setup:

```bash
# Node.js and npm
node --version
npm --version

# Git
git --version

# MongoDB (if installed locally)
mongo --version
# OR
mongod --version

# Docker (if installed)
docker --version
docker-compose --version

# Redis (if installed via WSL)
redis-cli --version

# AWS CLI (if installed)
aws --version
```

**Expected Output Example**:
```
C:\Users\imman\Coobifl> node --version
v18.17.0

C:\Users\imman\Coobifl> npm --version
9.8.1

C:\Users\imman\Coobifl> git --version
git version 2.41.0.windows.1

C:\Users\imman\Coobifl> docker --version
Docker version 24.0.5, build ced0996
```

---

## Quick Start After Installation

Once everything is installed, you can start the project:

```bash
# 1. Create project directory
mkdir amazon-product-app
cd amazon-product-app

# 2. Initialize Git repository
git init

# 3. Create project structure
mkdir backend frontend ingestion architecture scripts

# 4. Initialize Node.js projects
cd backend
npm init -y
cd ../frontend
npm init -y
cd ../ingestion
npm init -y
cd ..

# 5. Install VS Code extensions
code .
# Then install recommended extensions from the Extensions panel
```

---

## Troubleshooting Common Issues

### Issue 1: Node.js not recognized
**Solution**:
- Restart terminal after installation
- Check if Node.js is in PATH environment variable
- Reinstall Node.js with "Add to PATH" option checked

### Issue 2: MongoDB connection refused
**Solution**:
- Check if MongoDB service is running: `services.msc` → MongoDB Server
- Start service: `net start MongoDB`
- Check connection string in your code

### Issue 3: Docker won't start on Windows
**Solution**:
- Enable Hyper-V and WSL 2 in Windows Features
- Update Windows to latest version
- Check BIOS virtualization settings

### Issue 4: npm install fails with permission errors
**Solution**:
- Run terminal as Administrator (Windows)
- OR use `npm install --no-optional`
- Clear npm cache: `npm cache clean --force`

### Issue 5: Port already in use
**Solution**:
```bash
# Find process using port 3000 (or 4000)
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <process_id> /F
```

---

## Useful Resources

### Documentation

- **Node.js**: [https://nodejs.org/docs/](https://nodejs.org/docs/)
- **Express.js**: [https://expressjs.com/](https://expressjs.com/)
- **MongoDB**: [https://docs.mongodb.com/](https://docs.mongodb.com/)
- **Mongoose**: [https://mongoosejs.com/docs/](https://mongoosejs.com/docs/)
- **Amazon PA-API 5.0**: [https://webservices.amazon.com/paapi5/documentation/](https://webservices.amazon.com/paapi5/documentation/)
- **Docker**: [https://docs.docker.com/](https://docs.docker.com/)

### Learning Resources

- **Node.js Tutorial**: [https://www.freecodecamp.org/news/learn-node-js/](https://www.freecodecamp.org/news/learn-node-js/)
- **MongoDB University**: [https://university.mongodb.com/](https://university.mongodb.com/)
- **Express.js Tutorial**: [https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)

### Communities

- **Stack Overflow**: [https://stackoverflow.com/](https://stackoverflow.com/)
- **Reddit r/node**: [https://www.reddit.com/r/node/](https://www.reddit.com/r/node/)
- **MongoDB Community**: [https://www.mongodb.com/community/forums/](https://www.mongodb.com/community/forums/)

---

## Next Steps

Once you have everything installed:

1. ✅ Verify all installations using the verification commands
2. ✅ Set up your code editor with extensions
3. ✅ Create GitHub repository
4. ✅ Clone/initialize your project
5. ✅ Proceed to **Phase 1: Project Setup & Foundation** (see [implementation-phases.md](architecture/implementation-phases.md))

---

## Need Help?

If you encounter issues during setup:

1. Check the troubleshooting section above
2. Search for the specific error message online
3. Check official documentation
4. Ask in relevant community forums (Stack Overflow, Reddit)

---

## Summary: Download Links

**Essential (Required)**:
- ✅ [Node.js v18+](https://nodejs.org/)
- ✅ [Git](https://git-scm.com/downloads)
- ✅ [VS Code](https://code.visualstudio.com/)
- ✅ [MongoDB Community Server](https://www.mongodb.com/try/download/community) OR [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register)

**Highly Recommended**:
- ⭐ [Postman](https://www.postman.com/downloads/)
- ⭐ [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- ⭐ [MongoDB Compass](https://www.mongodb.com/try/download/compass)
- ⭐ [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)

**Optional (For Later)**:
- [AWS CLI](https://aws.amazon.com/cli/)
- [Memurai (Redis for Windows)](https://www.memurai.com/get-memurai)

You're now ready to start building!
