# Walmart API Integration - Setup & Usage Guide

## Overview

This integration allows you to fetch Walmart product data and automatically extract Country of Origin (COO) information from product reviews. It supports both:

1. **API Mode**: Fetch real Walmart products using SerpAPI (requires API key)
2. **Manual Mode**: Use pre-configured sample products (no API key needed)

## Quick Start

### Option 1: Manual Mode (No API Key Required)

Use the manual seed data to get started immediately:

```bash
# Add 5 sample Walmart garlic press products to your database
curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{"manual": true}'
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully seeded 5 Walmart products",
  "inserted": 5,
  "method": "manual",
  "productsWithCOO": 5
}
```

### Option 2: API Mode (SerpAPI Integration)

For real-time Walmart data with automatic COO extraction:

#### Step 1: Get SerpAPI Key

1. Sign up at: https://serpapi.com/
2. **Free Tier**: 100 searches/month (perfect for testing)
3. **Paid**: $50/month for 5,000 searches
4. Copy your API key from the dashboard

#### Step 2: Add API Key to Environment

Add to your Railway environment variables:

```bash
SERPAPI_KEY=your_serpapi_key_here
```

Or for local development, add to `.env` file:

```bash
SERPAPI_KEY=your_serpapi_key_here
```

#### Step 3: Install Required Package

```bash
cd backend
npm install serpapi
```

#### Step 4: Seed Walmart Products

```bash
# Fetch 20 garlic press products from Walmart with COO extraction
curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{
    "category": "garlic press",
    "limit": 20,
    "manual": false
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully seeded 18 Walmart products",
  "inserted": 18,
  "method": "api",
  "productsWithCOO": 14
}
```

## How It Works

### 1. Product Fetching (`walmartFetcher.js`)

Fetches products from Walmart using SerpAPI:

```javascript
const WalmartFetcher = require('./utils/walmartFetcher');
const fetcher = new WalmartFetcher(process.env.SERPAPI_KEY);

// Search for products
const products = await fetcher.searchProducts('garlic press', 1);

// Get product reviews for COO extraction
const reviews = await fetcher.getProductReviews(productId, 1);
```

**Supported Data:**
- Product title, brand, description
- Prices and availability
- Images (primary + gallery)
- Ratings and review counts
- Product specifications
- Walmart product IDs

### 2. COO Extraction (`cooExtractor.js`)

Automatically extracts Country of Origin from:

**Pattern Matching:**
- "Made in China"
- "Manufactured in Germany"
- "Product of Switzerland"
- "Country of origin: USA"
- "Imported from India"
- And 10+ more patterns

**Confidence Scoring:**
- Specifications: 95% confidence
- Product description: 50-90% (based on mentions)
- Reviews: 30-85% (based on percentage of reviews)

**Example:**
```javascript
const COOExtractor = require('./utils/cooExtractor');
const extractor = new COOExtractor();

const result = extractor.extractCOO({
  reviews: [
    { text: "Great product! Made in China but excellent quality." },
    { text: "Works well, came from China" }
  ],
  description: "Premium stainless steel garlic press",
  specifications: {}
});

// Result:
// {
//   country: 'China',
//   confidence: 0.65,
//   source: 'reviews'
// }
```

### 3. Database Seeding (`seedWalmartProducts.js`)

Orchestrates the entire process:

1. Search Walmart for products
2. Fetch reviews for each product
3. Extract COO from reviews
4. Add products to database with COO data

## API Endpoints

### POST `/api/seed-walmart`

Seed database with Walmart products.

**Request Body:**
```json
{
  "category": "garlic press",
  "limit": 20,
  "manual": false
}
```

**Parameters:**
- `category` (string): Search query for Walmart products (default: "garlic press")
- `limit` (number): Maximum products to fetch (default: 20)
- `manual` (boolean): Use manual seed data instead of API (default: false if SERPAPI_KEY exists)

**Response:**
```json
{
  "success": true,
  "message": "Successfully seeded 18 Walmart products",
  "inserted": 18,
  "method": "api",
  "productsWithCOO": 14
}
```

## Cost Analysis

### SerpAPI Pricing

| Plan | Monthly Cost | Searches/Month | Cost per Search |
|------|--------------|----------------|-----------------|
| Free | $0 | 100 | $0 |
| Starter | $50 | 5,000 | $0.01 |
| Professional | $250 | 30,000 | $0.0083 |

### Usage Estimates

**Bootstrap Phase (First Month):**
- 20 product searches = 20 searches
- 20 products × 1 review page = 20 searches
- **Total: 40 searches** (fits in free tier!)

**Growth Phase (Monthly):**
- 100 product searches = 100 searches
- 100 products × 2 review pages = 200 searches
- **Total: 300 searches** (still within free tier or $50/month plan)

## Manual Seed Data

The integration includes 5 pre-configured Walmart garlic press products:

1. **Mainstays Stainless Steel Garlic Press** - $5.97 (China)
2. **OXO Good Grips Soft-Handled Garlic Press** - $19.99 (China)
3. **Zyliss Susi 3 Garlic Press** - $24.99 (Switzerland)
4. **KitchenAid Classic Garlic Press** - $16.99 (China)
5. **Joseph Joseph Easy-Clean Garlic Crusher** - $12.99 (China)

Perfect for:
- Testing the integration without API keys
- Demonstrating COO badges in your UI
- Building initial product catalog

## Next Steps

### Phase 1: Test with Manual Data ✅

```bash
curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -d '{"manual": true}'
```

### Phase 2: Get SerpAPI Free Account

1. Sign up: https://serpapi.com/
2. Get API key
3. Add to Railway environment variables

### Phase 3: Fetch Real Walmart Data

```bash
curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{"category": "garlic press", "limit": 20}'
```

### Phase 4: Expand to Other Categories

```bash
# Kitchen tools
curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{"category": "can opener", "limit": 15}'

# Home goods
curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{"category": "cutting board", "limit": 15}'
```

### Phase 5: Apply for Amazon Associates

Once you have:
- 50+ Walmart products
- Steady traffic to your site
- Good COO data coverage

Apply for Amazon Associates and transition to Amazon PA-API for richer product data.

## Troubleshooting

### Error: "SERPAPI_KEY environment variable is required"

**Solution**: Add SERPAPI_KEY to your environment variables or use manual mode:

```bash
curl -X POST .../api/seed-walmart -d '{"manual": true}'
```

### Error: "No products found"

**Causes:**
- Invalid search query
- No Walmart results for that category
- API rate limit exceeded

**Solution**: Try a different category or wait 1 minute if rate limited.

### Low COO Extraction Rate

**Causes:**
- Products don't have reviews mentioning COO
- Generic product descriptions
- New products with few reviews

**Solution:**
- Increase review page count in code
- Focus on categories where COO is commonly mentioned (electronics, tools)
- Manually verify/add COO data for popular products

## File Structure

```
backend/src/
├── utils/
│   ├── walmartFetcher.js       # Fetches Walmart products via SerpAPI
│   ├── cooExtractor.js          # Extracts COO from reviews/descriptions
│   └── seedWalmartProducts.js   # Orchestrates seeding process
├── controllers/
│   └── productController.js     # Added seedWalmartProducts controller
└── routes/
    └── utilityRoutes.js         # Added POST /api/seed-walmart route
```

## Support

- **SerpAPI Docs**: https://serpapi.com/walmart-search-api
- **Walmart Affiliate**: https://affiliate.walmart.com/
- **GitHub Issues**: [Your repo]/issues

## License

MIT
