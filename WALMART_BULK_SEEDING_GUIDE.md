# Bulk Walmart Product Seeding Guide

## How to Fetch 500+ Walmart Products

### Method 1: Multiple Categories (Recommended)

Fetch products across different categories to build a diverse catalog:

```bash
# Kitchen Tools (50 products)
curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{"category": "garlic press", "limit": 20}'

curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{"category": "can opener", "limit": 20}'

curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{"category": "kitchen knife", "limit": 20}'

# Home Goods (100 products)
curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{"category": "cutting board", "limit": 25}'

curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{"category": "mixing bowl", "limit": 25}'

# Electronics (100 products)
curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{"category": "usb cable", "limit": 25}'

# Toys (50 products)
curl -X POST https://coobifl-production.up.railway.app/api/seed-walmart \
  -H "Content-Type: application/json" \
  -d '{"category": "action figure", "limit": 25}'
```

### Method 2: Automated Batch Script

Create a script to automate the process:

**File: `scripts/seed-walmart-bulk.sh`**

```bash
#!/bin/bash

API_URL="https://coobifl-production.up.railway.app/api/seed-walmart"

# Array of categories to fetch
categories=(
  "garlic press:20"
  "can opener:20"
  "kitchen knife:15"
  "cutting board:15"
  "mixing bowl:15"
  "measuring cup:15"
  "spatula:15"
  "whisk:15"
  "peeler:15"
  "grater:15"
  "colander:15"
  "tongs:15"
  "ladle:15"
  "potato masher:10"
  "cheese slicer:10"
  "pizza cutter:10"
  "ice cream scoop:10"
  "bottle opener:10"
  "corkscrew:10"
  "meat tenderizer:10"
)

total=0

for item in "${categories[@]}"; do
  IFS=':' read -r category limit <<< "$item"

  echo "🔍 Fetching $limit products for: $category"

  curl -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"category\": \"$category\", \"limit\": $limit}"

  total=$((total + limit))
  echo ""
  echo "✅ Total products so far: $total"
  echo "⏳ Waiting 60 seconds to avoid rate limits..."
  sleep 60
done

echo "🎉 Done! Seeded approximately $total products"
```

**Run it:**
```bash
chmod +x scripts/seed-walmart-bulk.sh
./scripts/seed-walmart-bulk.sh
```

### Method 3: Pagination (Advanced)

Modify the code to support pagination and fetch 500 products from a single category:

**Current Limitation**: SerpAPI Walmart search returns ~20-40 products per page.

To get 500 products:
1. Fetch page 1: products 1-40
2. Fetch page 2: products 41-80
3. ... continue to page 13

**Code modification needed in `walmartFetcher.js`**:

```javascript
// Add pagination support
async function fetchMultiplePages(category, totalLimit = 500) {
  const productsPerPage = 40;
  const pages = Math.ceil(totalLimit / productsPerPage);

  let allProducts = [];

  for (let page = 1; page <= pages; page++) {
    const products = await fetcher.searchProducts(category, page);
    allProducts.push(...products);

    if (allProducts.length >= totalLimit) break;

    // Rate limiting: 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return allProducts.slice(0, totalLimit);
}
```

## SerpAPI Free Tier Limits

**Important**: Free tier = 100 searches/month

### Cost Breakdown:

| Task | Searches Used | Products Fetched |
|------|---------------|------------------|
| Search for products | 1 per page | 40 products |
| Fetch reviews (per product) | 1 | COO extraction |

**Example**: To get 20 products with COO:
- 1 search = 20 products
- 20 reviews = 20 searches
- **Total: 21 searches** used

### Strategy for 500 Products:

**Option A: Without Reviews (Fast, cheap)**
- 13 searches = 500 products
- ❌ No COO extraction
- ✅ Fits in free tier easily

**Option B: With Reviews (Slow, expensive)**
- 13 searches + 500 reviews = **513 searches**
- ✅ COO extraction for all
- ❌ Requires $50/month plan (5,000 searches)

**Option C: Selective Reviews (Balanced)**
- 13 searches = 500 products
- 87 reviews for top products only (by rating)
- **Total: 100 searches** (fits free tier!)
- ✅ COO for 87 popular products

## Recommended Approach for 500 Products

### Week 1: Free Tier Bootstrap
1. Fetch 20 products from 5 categories = 100 products
2. Get reviews for top 20 products = 20 + 20 = 40 searches
3. **Total: ~45 searches** ✅ Within free tier

### Week 2: Add More Categories
1. Another 100 products = 5 more searches
2. Reviews for top 40 products = 40 searches
3. **Total: ~45 searches** ✅ Within free tier

### Month 1 Total:
- **200 products** with COO data
- **Within free tier** (100 searches/month)

### Month 2+: Upgrade to Paid ($50/month)
- Fetch 500+ products per month
- Full COO extraction for all products
- **5,000 searches** = enough for ~250 products with reviews

## Tracking API Usage

Check your SerpAPI usage:
1. Go to: https://serpapi.com/dashboard
2. View "API Calls This Month"
3. Monitor remaining searches

## Alternative: Mix Data Sources

Combine multiple sources to reach 500 products faster:

1. **Walmart** (via SerpAPI): 200 products
2. **Amazon** (via PA-API after approval): 200 products
3. **AliExpress** (via SerpAPI): 100 products
4. **Manual curation**: 50 premium products

This diversifies your catalog and reduces dependency on one API.
