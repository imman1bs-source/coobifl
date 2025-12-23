# Coobifl Project Context

## Project Overview
Product origin tracker for Amazon and Walmart products. Users can browse products and see Country of Origin (COO) information to make informed purchasing decisions.

## Architecture

### Deployment Setup
- **Frontend**: Vercel (https://coobifl.vercel.app or similar)
- **Backend API**: Railway (https://coobifl-production.up.railway.app)
- **Database**: MongoDB on Railway (internal network)

### Technology Stack
- **Backend**: Node.js + Express.js
- **Frontend**: EJS templates
- **Database**: MongoDB
- **Deployment**: Railway (backend + DB), Vercel (frontend)

## Current Database State
- **Total Products**: 129
  - 16 Amazon products (real ASINs starting with B)
  - 113 Walmart products (from SerpAPI)
- **COO Coverage**: 100% (all 129 products have Country of Origin data)
- **Affiliate Links**:
  - Amazon products have `amazonUrl` with tag `coobifl-20`
  - Walmart products have `walmartUrl`

## Railway-Specific Configuration

### CRITICAL: Server Binding
The Express server **MUST** bind to `0.0.0.0` (not localhost) for Railway's proxy to work:
```javascript
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => { ... });
```

### Environment Variables (Railway Backend Service)

**IMPORTANT**: Do NOT manually set `PORT` - Railway auto-provides it.

Required variables in Railway dashboard (Backend service → Variables):

1. **NODE_ENV**: `production`
   - Sets application to production mode

2. **MONGODB_URI**: `mongodb://mongo:NnXINgtEIdVcHxQGIPDnXooGQjVwZIFm@mongodb.railway.internal:27017`
   - Railway internal MongoDB connection
   - Do NOT add database name to URL (connects to "test" database by default)
   - Password is specific to your Railway MongoDB instance

3. **SERPAPI_KEY**: `your-serpapi-key-here`
   - Used for fetching Walmart products via SerpAPI
   - Get from https://serpapi.com

4. **FRONTEND_URL**: `https://your-vercel-app.vercel.app`
   - Your Vercel frontend URL
   - Used for CORS configuration
   - Can be comma-separated list for multiple domains

5. **JWT_SECRET**: `your-secret-key-change-in-production`
   - Secret for JWT token signing
   - Use a strong random string in production

6. **PORT**: ⚠️ **DO NOT SET MANUALLY**
   - Railway automatically provides this
   - If you see it set to 5000, DELETE it
   - Railway needs to control the PORT for its proxy to work

### Database Connection
- Uses Railway's internal MongoDB: `mongodb.railway.internal:27017`
- Connects to database name: `test` (default)
- Connection string does NOT include database name in URL

## Deployment Process

### Railway Backend Deployment
1. Code pushed to GitHub triggers auto-deploy on Railway
2. Railway runs: `npm run build` (installs backend dependencies)
3. Railway runs: `npm start` which executes:
   - `node backend/scripts/importProductsToProduction.js` (imports 129 products)
   - `&& node backend/src/app.js` (starts Express server)
4. Server binds to `0.0.0.0:PORT` (Railway auto-provides PORT)

### Important Files
- **Root `package.json`**: Railway uses this for build/start commands
- **`railway.toml`**: Deployment configuration
- **`backend/db-export-products.json`**: Contains all 129 products with COO data
- **`backend/scripts/importProductsToProduction.js`**: Imports products on deployment

## Product Data Structure

### Product Model Fields
- `asin`: Product identifier
- `title`: Product name
- `brand`: Brand name
- `specifications`: Map containing COO and other specs
  - `specifications['Country of Origin']`: COO value
- `amazonUrl`: Amazon affiliate link (if Amazon product)
- `walmartUrl`: Walmart product link (if Walmart product)
- `origin.source`: Either 'amazon_pa_api' or 'walmart'

### COO Data Strategy
- COO extracted from product descriptions/titles using regex
- Default COO assigned based on brand research when not found
- All 129 products now have COO data (126 China, 2 Switzerland, 1 USA)

## Known Issues & Solutions

### Issue: Railway 502 Errors
**Cause**: Server not binding to `0.0.0.0`
**Solution**: Always bind Express to `0.0.0.0:PORT` in production

### Issue: Products Not Importing
**Cause**: Import script not running or `process.exit()` killing process chain
**Solution**:
- Import script runs via root `package.json` start command
- Import script does NOT call `process.exit()` - lets process complete naturally
- Uses `mongoose.connection.close()` to clean up

### Issue: Start Command Not Working
**Cause**: Railway uses root `package.json`, not `backend/package.json`
**Solution**: Root `package.json` has the production start command

### Issue: SERPAPI Products Missing COO
**Cause**: Walmart API doesn't provide product reviews/descriptions needed for COO extraction
**Solution**: Set default COO based on brand research

## Local Development

### Running Locally
```bash
# Backend
cd backend
npm install
npm run dev

# Import products to local DB
node scripts/exportProductsToJSON.js  # Export from local MongoDB
```

### Environment Variables (Local)
Backend uses `.env` file in development mode (see `backend/src/config/environment.js`)

## Future Considerations

### Before Next Deployment
- Consider if import should run on EVERY deployment (current setup)
- May want to separate import as a one-time setup script
- Change root `package.json` start back to `node backend/src/app.js` after initial import

### Important: Changing Start Command
After products are imported, you may want to update root `package.json`:
```json
"start": "node backend/src/app.js"
```
This prevents re-importing on every deployment.

## API Endpoints
- `GET /health` - Health check
- `GET /api` - API info
- `GET /api/products` - List products
- `GET /api/products/:asin` - Get product by ASIN
- `GET /api/products/search` - Search products

## Contact & Links
- Backend: https://coobifl-production.up.railway.app
- GitHub: (your repo URL)
- Amazon Associates Tag: `coobifl-20`
