# Deploy Coobifl.com - Quick Start Guide

**Your Domain:** coobifl.com
**Target:** Live production site in ~30 minutes
**Cost:** ~$5/month

---

## 🚀 Quick Deploy Checklist

### Before You Start (5 min)
- [ ] Create GitHub account: https://github.com/signup
- [ ] Create Railway account: https://railway.app (use GitHub login)
- [ ] Create Vercel account: https://vercel.com (use GitHub login)
- [ ] Have GoDaddy login ready

---

## Step 1: Push to GitHub (5 min)

Open terminal in `C:\Users\imman\Coobifl`:

```bash
# Create .gitignore
echo node_modules/ > .gitignore
echo .env >> .gitignore
echo *.log >> .gitignore

# Initialize and push
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/coobifl.git
git push -u origin main
```

✅ **Check:** Code visible on GitHub

---

## Step 2: Deploy Backend to Railway (10 min)

### A. Create Project
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select `coobifl` repo
4. Choose **backend** folder

### B. Add MongoDB
1. Click "+ New" → Database → MongoDB
2. Automatic! No config needed

### C. Add Environment Variables

Go to backend service → Variables → Add all:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=coobifl-secret-2024-change-this-in-production
JWT_EXPIRE=30d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
DEFAULT_PAGE_SIZE=36
MAX_PAGE_SIZE=100
ENABLE_AUTO_SYNC=false
```

### D. Get MongoDB URL
1. Click MongoDB service → Connect tab
2. Copy the `MONGO_URL` value
3. Back to backend service → Variables
4. Add: `MONGODB_URI` = (paste Mongo URL)

### E. Get Backend URL
1. Backend service → Settings → Generate Domain
2. Copy URL (e.g., `coobifl-production.up.railway.app`)
3. Save this for later!

✅ **Check:** Visit `https://YOUR-BACKEND-URL.railway.app/health`

---

## Step 3: Deploy Frontend to Vercel (8 min)

### A. Import Project
1. Go to https://vercel.com/new
2. Import `coobifl` from GitHub
3. **Root Directory:** Select `frontend`
4. Framework: Other

### B. Environment Variables

Add these before deploying:

```env
API_BASE_URL=https://YOUR-RAILWAY-BACKEND-URL.railway.app/api
NODE_ENV=production
PORT=3000
```

Replace `YOUR-RAILWAY-BACKEND-URL` with the URL from Step 2E.

### C. Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Copy the Vercel URL (e.g., `coobifl.vercel.app`)

✅ **Check:** Visit your Vercel URL - see homepage!

---

## Step 4: Update Backend CORS (2 min)

1. Railway → Backend service → Variables
2. Add new variable:
   ```
   FRONTEND_URL=https://coobifl.vercel.app
   ```
   (or use your exact Vercel URL)

✅ **Check:** Frontend can now call backend API

---

## Step 5: Connect coobifl.com (10 min)

### A. Add Domain in Vercel
1. Vercel → Your project → Settings → Domains
2. Enter: `coobifl.com`
3. Also add: `www.coobifl.com`
4. Vercel shows DNS records needed

### B. Update GoDaddy DNS

Login to GoDaddy → Domains → coobifl.com → Manage DNS

**Delete existing records** (if any A or CNAME for @ or www)

**Add these records:**

#### Record 1 - Root Domain
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 seconds
```

#### Record 2 - WWW Subdomain
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600 seconds
```

Click "Save"

### C. Wait for DNS (15-30 min)

Check propagation: https://www.whatsmydns.net/?q=coobifl.com

Once propagated, Vercel automatically adds FREE SSL certificate!

✅ **Check:** Visit https://coobifl.com 🎉

---

## Step 6: Seed Database (5 min)

### Option A: Run Locally Against Production

Update your local `.env`:
```env
MONGODB_URI=mongodb://mongo.railway.internal:27017/... (from Railway)
```

Then:
```bash
cd backend
node src/utils/seedGarlicPresses.js
```

### Option B: Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Link to project
railway link

# Run seed
railway run node src/utils/seedGarlicPresses.js
```

✅ **Check:** Visit https://coobifl.com/search - see products!

---

## 🎯 Final URLs

Once everything is deployed:

- **Live Site:** https://coobifl.com
- **WWW:** https://www.coobifl.com
- **Backend API:** https://YOUR-APP.railway.app/api
- **Health Check:** https://YOUR-APP.railway.app/health
- **Admin Dashboard:** https://coobifl.com/admin
- **Add Product:** https://coobifl.com/add-product

---

## 📋 Amazon Associates Application

Now that coobifl.com is live:

1. **Apply:** https://affiliate-program.amazon.com/signup
2. **Website URL:** `https://coobifl.com`
3. **Description:**
   > "Coobifl helps consumers discover product manufacturing origins, materials used, and country of origin information. We provide a community-driven database where users can search products and contribute manufacturing details."

4. **Topics:** E-commerce, Product Information, Consumer Resources
5. **Wait 1-3 business days** for approval

**After approval:**
- Apply for PA-API access
- Add credentials to Railway environment variables
- Test sync: `POST /api/sync/keywords`

---

## 🔄 Making Updates

Push changes to auto-deploy:

```bash
# Make code changes
git add .
git commit -m "Description of changes"
git push origin main
```

Both Railway and Vercel redeploy automatically!

---

## 🐛 Quick Troubleshooting

**Site not loading?**
- Check DNS at https://www.whatsmydns.net/?q=coobifl.com
- Wait 30 more minutes

**"API Error" on frontend?**
- Verify `API_BASE_URL` in Vercel
- Check `FRONTEND_URL` in Railway
- View Railway logs for errors

**Products not showing?**
- Run seed script (Step 6)
- Check Railway MongoDB has data

**Need help?**
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support

---

## 💰 Monthly Cost Breakdown

- Railway (Backend + MongoDB): **$5/month**
- Vercel (Frontend + CDN): **FREE**
- SSL Certificate: **FREE** (auto from Vercel)
- Domain (coobifl.com): Already paid annually

**Total: ~$5/month** ✅

---

## 🎉 Success Checklist

- [ ] Code on GitHub
- [ ] Backend deployed to Railway
- [ ] MongoDB connected
- [ ] Frontend deployed to Vercel
- [ ] coobifl.com points to Vercel
- [ ] HTTPS working
- [ ] Products seeded
- [ ] Can search and add products
- [ ] Ready for Amazon Associates!

---

**Need the detailed guide?** See `DEPLOYMENT_GUIDE.md`

Good luck! 🚀
