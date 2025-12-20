# Coobifl Deployment Checklist

## Pre-Deployment Setup ✅

- [ ] GitHub account created
- [ ] Railway account created (sign up with GitHub)
- [ ] Vercel account created (sign up with GitHub)
- [ ] GoDaddy login credentials ready

---

## Step 1: Push to GitHub (5 min)

- [ ] Open terminal in `C:\Users\imman\Coobifl`
- [ ] Run these commands:

```bash
git init
git add .
git commit -m "Initial commit - Coobifl v1.0"
git branch -M main
```

- [ ] Go to GitHub.com → New Repository → Name: `coobifl`
- [ ] Copy the repository URL
- [ ] Run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/coobifl.git
git push -u origin main
```

- [ ] ✅ Verify code is on GitHub

---

## Step 2: Deploy Backend to Railway (10 min)

### A. Create Project
- [ ] Go to https://railway.app/new
- [ ] Click "Deploy from GitHub repo"
- [ ] Select `coobifl` repository
- [ ] Choose **backend** folder as root

### B. Add MongoDB
- [ ] Click "+ New" → Database → MongoDB
- [ ] Wait for deployment (1-2 min)

### C. Add Environment Variables
- [ ] Click backend service → Variables
- [ ] Add these variables:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=coobifl-2024-production-secret-key-change-this
JWT_EXPIRE=30d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
DEFAULT_PAGE_SIZE=36
MAX_PAGE_SIZE=100
ENABLE_AUTO_SYNC=false
```

### D. Connect MongoDB
- [ ] Click MongoDB service → Connect
- [ ] Copy `MONGO_URL` value
- [ ] Backend service → Variables → Add:
  - Name: `MONGODB_URI`
  - Value: (paste MongoDB URL)

### E. Generate Backend URL
- [ ] Backend service → Settings → Generate Domain
- [ ] Copy URL (save for later): `__________________________`

### F. Test Backend
- [ ] Visit: `https://YOUR-BACKEND-URL.railway.app/health`
- [ ] ✅ Should see JSON response with `success: true`

---

## Step 3: Deploy Frontend to Vercel (8 min)

### A. Import Project
- [ ] Go to https://vercel.com/new
- [ ] Import `coobifl` from GitHub
- [ ] Root Directory → Select `frontend`
- [ ] Framework Preset → Other

### B. Environment Variables
- [ ] Add these before deploying:

```env
API_BASE_URL=https://YOUR-RAILWAY-URL.railway.app/api
NODE_ENV=production
PORT=3000
```

Replace `YOUR-RAILWAY-URL` with backend URL from Step 2E

### C. Deploy
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes
- [ ] Copy Vercel URL: `__________________________`

### D. Test Frontend
- [ ] Visit your Vercel URL
- [ ] ✅ Should see Coobifl homepage

---

## Step 4: Update Backend CORS (2 min)

- [ ] Railway → Backend service → Variables
- [ ] Add:
  - Name: `FRONTEND_URL`
  - Value: (your Vercel URL from Step 3C)
- [ ] Wait 1 minute for redeploy
- [ ] ✅ Test: Search on frontend should work now

---

## Step 5: Connect coobifl.com (10 min)

### A. Add Domain in Vercel
- [ ] Vercel → Your project → Settings → Domains
- [ ] Add domain: `coobifl.com`
- [ ] Also add: `www.coobifl.com`
- [ ] Vercel shows DNS records

### B. Update GoDaddy DNS
- [ ] Login to GoDaddy
- [ ] My Products → coobifl.com → Manage DNS
- [ ] Delete existing A or CNAME records for @ and www

**Add Record 1:**
- [ ] Type: `A`
- [ ] Name: `@`
- [ ] Value: `76.76.21.21`
- [ ] TTL: `600`

**Add Record 2:**
- [ ] Type: `CNAME`
- [ ] Name: `www`
- [ ] Value: `cname.vercel-dns.com`
- [ ] TTL: `600`

- [ ] Click Save

### C. Wait for DNS
- [ ] Check: https://www.whatsmydns.net/?q=coobifl.com
- [ ] Wait until propagated worldwide (15-30 min)

### D. Verify SSL
- [ ] Visit: https://coobifl.com
- [ ] ✅ Should load with 🔒 HTTPS

---

## Step 6: Seed Database (5 min)

### Option A: Local Seed to Production

- [ ] Copy MongoDB URI from Railway
- [ ] Update local `backend/.env`:

```env
MONGODB_URI=mongodb://mongo.railway.internal:27017/...
```

- [ ] Run:

```bash
cd backend
node src/utils/seedGarlicPresses.js
```

### Option B: Railway CLI

```bash
npm install -g @railway/cli
railway link
railway run node src/utils/seedGarlicPresses.js
```

- [ ] ✅ Visit https://coobifl.com/search → Should see products

---

## Final Verification ✅

- [ ] https://coobifl.com loads
- [ ] https://www.coobifl.com redirects correctly
- [ ] Search works
- [ ] Can view product details
- [ ] Can add new products
- [ ] Admin page accessible (/admin)
- [ ] Backend API responds (/health)

---

## Amazon Associates Application

Now that site is live:

- [ ] Go to: https://affiliate-program.amazon.com/signup
- [ ] Website URL: `https://coobifl.com`
- [ ] Description: "Community-driven database tracking product manufacturing origins, materials, and country of origin information"
- [ ] Submit application
- [ ] Wait 1-3 business days for approval

---

## Post-Deployment

### Enable Auto-Deploy
✅ Already enabled! Push to GitHub = Auto-deploy

### Update Code
```bash
git add .
git commit -m "Description"
git push origin main
```

### Monitor
- Railway logs: Dashboard → Service → Logs
- Vercel logs: Dashboard → Deployments → Logs

### Costs
- Railway: ~$5/month
- Vercel: FREE
- Domain: Paid annually
- **Total: $5/month**

---

## 🎉 Success!

Your application is now live at https://coobifl.com

**Next steps:**
1. Apply for Amazon Associates
2. Get PA-API access
3. Add credentials to Railway variables
4. Enable auto-sync
5. Share with friends!

---

## Need Help?

- Deployment Guide: `DEPLOY_COOBIFL.COM.md`
- Amazon Integration: `backend/AMAZON_INTEGRATION.md`
- Full Guide: `DEPLOYMENT_GUIDE.md`
