# Walmart Country of Origin (COO) Extraction Strategy

## Problem Discovery

### Initial Approach (Failed)
We initially tried to extract COO from Walmart product reviews using SerpAPI's `walmart_product_reviews` endpoint, but discovered:

1. **Reviews API Returns Errors**: The `walmart_product_reviews` endpoint returns errors instead of actual review data
2. **Review Count Field Missing**: SerpAPI doesn't provide `reviews_count` or `rating_count` fields - instead provides `reviews` (integer count)
3. **No Specifications**: Even detailed product API calls don't return specifications where COO might be listed

### Test Results
```
Testing SerpAPI Walmart integration...

=== TEST 1: Search Products ===
✅ Found 51 products
- Rating: 4.8
- Reviews Count: undefined  ❌
- Rating Count: undefined   ❌
- Reviews: 39              ✅ (actual field name)

=== TEST 2: Get Product Reviews ===
❌ No reviews returned from API
Response keys: ['search_metadata', 'search_parameters', 'search_information', 'error']

=== TEST 3: Get Product Details ===
- Specifications available: false  ❌
```

---

## Alternate COO Strategy

Since we cannot access reviews or specifications from Walmart via SerpAPI, we implemented a **multi-source text analysis strategy**:

### Strategy Overview

The COOExtractor now analyzes multiple text sources in order of confidence:

#### 1. **Product Specifications** (95% confidence)
- Checks for explicit COO fields in specifications
- Field names checked: `Country of Origin`, `Made In`, `origin`, etc.
- **Status**: Not available from Walmart API

#### 2. **Product Title** (50-90% confidence, scaled by 0.9)
- Scans product title for COO mentions
- Example: "Swiss-Made Garlic Press" → Detects "Switzerland"
- **Status**: ✅ Available from search results

#### 3. **Product Description** (50-90% confidence)
- Scans full product description for COO patterns
- Example: "Manufactured in Germany with premium steel"
- **Status**: ✅ Available from search results

#### 4. **Product Reviews** (30-85% confidence)
- Aggregates COO mentions across multiple reviews
- Looks for patterns like "Made in China", "imported from Vietnam"
- **Status**: ❌ Not available from Walmart API

### Regex Patterns Used

The extractor uses 9+ regex patterns to detect COO:

```javascript
/made in ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
/manufactured in ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
/produced in ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
/country of origin[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
/ships from ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
/from ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*) factory/gi
/Product of ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
/imported from ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
/sourced from ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
```

### Validated Countries

The extractor only accepts recognized country names (30+ countries):
- China, USA, Germany, Japan, Switzerland, India, Vietnam, Taiwan, South Korea, Mexico, Canada
- Italy, France, United Kingdom, UK, Australia, Spain, Thailand, Indonesia, Malaysia, Philippines
- Brazil, Turkey, Pakistan, Bangladesh, Sri Lanka, Portugal
- And more...

### Country Normalization

Automatically normalizes variations:
- "United States" → "USA"
- "United Kingdom" → "UK"
- "South Korea" → "Korea"
- "PRC" → "China"
- "Peoples Republic of China" → "China"

---

## Implementation Changes

### 1. Fixed Review Count Field
**File**: `backend/src/utils/walmartFetcher.js:123`

```javascript
// OLD (broken)
count: product.reviews_count || product.rating_count || 0

// NEW (working)
count: product.reviews || product.reviews_count || product.rating_count || 0
```

### 2. Removed Reviews API Call
**File**: `backend/src/utils/seedWalmartProducts.js:47-80`

```javascript
// OLD: Called reviews API (which doesn't work)
const reviews = await fetcher.getProductReviews(productId, 1);

// NEW: Skip reviews, extract from title/description only
const cooResult = extractor.extractCOO({
  reviews: [],  // Reviews API not working for Walmart
  description: product.description,
  specifications: product.specifications,
  title: product.title  // Also check product title
});
```

### 3. Reduced Rate Limiting
Since we're no longer making review API calls (which were failing anyway), we reduced the rate limit delay:

```javascript
// OLD: 1000ms (1 second) between products
await new Promise(resolve => setTimeout(resolve, 1000));

// NEW: 100ms between products (10x faster!)
await new Promise(resolve => setTimeout(resolve, 100));
```

### 4. Added Title Support to COOExtractor
**File**: `backend/src/utils/cooExtractor.js:50`

```javascript
// NEW: Now accepts title parameter
extractCOO({ reviews = [], description = '', specifications = {}, title = '' })
```

---

## Expected Results

### COO Extraction Success Rate

Based on typical product data:

| Source | Availability | Success Rate | Notes |
|--------|--------------|--------------|-------|
| Specifications | ❌ | 0% | Not provided by Walmart API |
| Title | ✅ | ~5% | Only if explicitly mentioned (rare) |
| Description | ✅ | ~15% | Sometimes mentions manufacturing location |
| Reviews | ❌ | 0% | API endpoint not working |
| **Total** | | **~20%** | 20 out of 100 products will have COO |

### What This Means

- **~20 products** out of 100 will have COO auto-detected
- **~80 products** will need manual COO entry
- Users can add COO via the product detail page editing feature

---

## Manual COO Entry Process

For products without auto-detected COO:

1. User clicks on a product to view details
2. Sees "Country of Origin: Not specified"
3. Clicks edit icon next to manufacturing info
4. Enters COO manually
5. System saves and displays COO badge

---

## Future Improvements

### Option 1: Use Walmart Product API (Walmart Developer Account)
- Requires official Walmart API approval
- Provides full product specifications including COO
- **Cost**: Free tier available, but requires business verification

### Option 2: Web Scraping with Puppeteer
- Directly scrape product pages for specifications
- Can extract COO from specification tables
- **Risks**: Against Walmart TOS, IP bans possible

### Option 3: Crowdsource COO Data
- Allow users to contribute COO information
- Implement voting/verification system
- Build community-driven COO database
- **Benefit**: Scalable and legal

### Option 4: AI/ML COO Prediction
- Train model on product titles/descriptions
- Predict likely COO based on brand, category, price
- **Accuracy**: ~70-80% for common categories
- **Cost**: Requires GPT-4 API or custom model training

---

## Recommendation

**Short-term**: Accept 20% auto-detection rate, encourage user contributions

**Long-term**: Build crowdsourcing features to scale COO data collection

This approach is sustainable, legal, and aligns with your goal of community-driven COO transparency.
