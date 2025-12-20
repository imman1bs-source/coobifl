# Coobifl Deployment Guide
## Railway + Vercel with Custom Domain

This guide will walk you through deploying Coobifl to production using Railway (backend) and Vercel (frontend) with your custom domain.

---

## 📋 Prerequisites

- [ ] GitHub account
- [ ] GoDaddy domain (or any domain provider)
- [ ] Railway account (sign up at https://railway.app)
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Git installed on your computer

**Estimated Time:** 30-45 minutes
**Cost:** ~$5/month (Railway only, Vercel is free)

---

## Part 1: Prepare Your Code

### Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click "New Repository"
3. Name it: `coobifl`
4. Keep it **Public** (required for free Vercel tier)
5. Click "Create repository"

### Step 2: Push Code to GitHub

Open your terminal in the Coobifl folder:

```bash
# Initialize git (if not already done)
git init

# Create .gitignore file
echo "node_modules/
.env
*.log
.DS_Store" > .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit - Coobifl application"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/coobifl.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ **Checkpoint:** Visit your GitHub repository - you should see all your code!

---

## Part 2: Deploy Backend to Railway

### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `coobifl` repository
4. Railway will ask which folder to deploy

### Step 3: Configure Backend Service

1. Railway detects multiple folders - select the **backend** folder
2. Click "Add variables" to add environment variables
3. Add the following variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=(we'll add this in next step)
JWT_SECRET=your-super-secret-production-key-change-this-to-random-string
JWT_EXPIRE=30d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
DEFAULT_PAGE_SIZE=36
MAX_PAGE_SIZE=100
FRONTEND_URL=(we'll add this after Vercel deployment)
ENABLE_AUTO_SYNC=false
```

### Step 4: Add MongoDB Database

1. In Railway dashboard, click "New"
2. Select "Database" → "MongoDB"
3. Railway creates MongoDB automatically
4. Copy the connection string:
   - Click on MongoDB service
   - Click "Connect"
   - Copy the **MONGO_URL** value
5. Go back to your backend service
6. Add variable: `MONGODB_URI` = (paste MongoDB URL)

### Step 5: Deploy Backend

1. Click "Deploy" or Railway auto-deploys
2. Wait 2-3 minutes for build
3. Once deployed, click "Settings" → "Domains"
4. Click "Generate Domain"
5. Copy the URL (e.g., `coobifl-backend.up.railway.app`)

✅ **Checkpoint:** Visit `https://your-backend-url.railway.app/health` - should return JSON with success!

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Import your `coobifl` repository
3. Vercel detects it's a monorepo

### Step 3: Configure Frontend Deployment

1. **Root Directory:** Click "Edit" next to root directory
2. Select `frontend` folder
3. **Framework Preset:** Other (or leave auto-detect)
4. **Build Command:** Leave as `npm run build` (or empty)
5. **Output Directory:** Leave as `public` (or empty for Express)
6. **Install Command:** `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```env
API_BASE_URL=https://your-railway-backend-url.railway.app/api
NODE_ENV=production
PORT=3000
```

Replace `your-railway-backend-url` with the Railway backend URL from Part 2, Step 5.

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Vercel gives you a URL like `coobifl.vercel.app`

✅ **Checkpoint:** Visit your Vercel URL - you should see Coobifl homepage!

---

## Part 4: Update Backend CORS

Now that frontend is deployed, update Railway backend:

1. Go to Railway dashboard
2. Click your backend service
3. Click "Variables"
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://coobifl.vercel.app
   ```
5. Railway auto-redeploys (wait 1-2 minutes)

---

## Part 5: Connect Your Custom Domain

### Step 1: Add Domain to Vercel

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Enter your domain (e.g., `yourdomain.com`)
4. Click "Add"

Vercel will show DNS records you need to add.

### Step 2: Configure DNS at GoDaddy

1. Log into GoDaddy
2. Go to "My Products" → Your domain → "DNS"
3. Add the records Vercel provided:

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

### Step 3: Wait for DNS Propagation

- DNS changes take 5 minutes to 48 hours
- Usually works in 15-30 minutes
- Check status at: https://www.whatsmydns.net

### Step 4: Enable SSL (Automatic)

Once DNS propagates:
1. Vercel automatically provisions SSL certificate
2. Your site will be available at `https://yourdomain.com`

✅ **Checkpoint:** Visit `https://yourdomain.com` - Coobifl should load with HTTPS! 🎉

---

## Part 6: Seed Database with Products

### Option 1: Via Railway Dashboard

1. Go to Railway → MongoDB service
2. Click "Data" tab
3. Or use MongoDB Compass to connect

### Option 2: Run Seed Script Locally

Update your local `.env` to point to Railway MongoDB:

```env
MONGODB_URI=mongodb://mongo.railway.internal:27017/...
```

Then run:
```bash
cd backend
node src/utils/seedGarlicPresses.js
```

---

## Part 7: Update Frontend API URL

Update backend URL in Vercel:

1. Vercel dashboard → Your project → Settings → Environment Variables
2. Update `API_BASE_URL` to:
   ```
   API_BASE_URL=https://your-backend.railway.app/api
   ```
3. Redeploy: Deployments → Latest → Redeploy

---

## 🎯 Final Configuration Checklist

### Railway (Backend)
- [x] Deployed from GitHub
- [x] MongoDB connected
- [x] Environment variables set
- [x] Custom domain generated
- [x] CORS configured for frontend URL

### Vercel (Frontend)
- [x] Deployed from GitHub
- [x] API_BASE_URL points to Railway
- [x] Custom domain connected
- [x] SSL enabled (automatic)
- [x] Site accessible via HTTPS

### Domain (GoDaddy)
- [x] A record points to Vercel
- [x] CNAME for www configured
- [x] DNS propagated
- [x] SSL certificate active

---

## 🚀 You're Live!

Your app should now be accessible at:
- **Your Domain:** https://yourdomain.com
- **Vercel URL:** https://coobifl.vercel.app (backup)
- **Backend API:** https://your-app.railway.app/api
- **API Health:** https://your-app.railway.app/health

---

## 📝 Next Steps for Amazon Associates

Now that your site is live:

1. **Apply for Amazon Associates:**
   - Go to: https://affiliate-program.amazon.com
   - Use your live URL: `https://yourdomain.com`
   - Describe your site: "Product origin and manufacturing information database"
   - Wait for approval (1-3 days)

2. **After Associates Approval:**
   - Apply for PA-API access
   - Add credentials to Railway environment variables
   - Enable auto-sync: `ENABLE_AUTO_SYNC=true`

---

## 🔧 Maintenance & Updates

### Deploy Updates

Code changes auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Updated features"
git push origin main
```

Railway and Vercel automatically rebuild and deploy!

### View Logs

- **Railway:** Dashboard → Service → Logs tab
- **Vercel:** Dashboard → Deployments → Click deployment → Logs

### Rollback Deployment

- **Railway:** Deployments → Previous → Redeploy
- **Vercel:** Deployments → Previous → Promote to Production

---

## 💰 Monthly Costs

- **Railway:** ~$5/month (includes MongoDB)
- **Vercel:** FREE (Hobby plan)
- **Domain:** Already paid annually
- **SSL Certificate:** FREE (auto from Vercel)

**Total:** ~$5/month

---

## 🆘 Troubleshooting

### Backend won't start
- Check Railway logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend can't connect to backend
- Verify `API_BASE_URL` in Vercel settings
- Check CORS settings in Railway backend
- Ensure Railway backend is deployed and running

### Domain not working
- Wait 30 minutes for DNS propagation
- Verify DNS records at GoDaddy match Vercel requirements
- Use https://www.whatsmydns.net to check propagation

### SSL certificate not working
- Ensure DNS is fully propagated first
- Vercel auto-provisions SSL (can take 24 hours)
- Check Vercel dashboard for certificate status

---

## 📞 Support Resources

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **GoDaddy DNS Help:** https://www.godaddy.com/help
- **Project Issues:** Create issue in your GitHub repo

---

## 🎉 Congratulations!

You've successfully deployed Coobifl to production! Your app is now live on the internet with:

✅ Professional domain
✅ HTTPS security
✅ Auto-scaling backend
✅ Global CDN frontend
✅ Production database
✅ Auto-deploy from GitHub

Ready to apply for Amazon Associates! 🚀
