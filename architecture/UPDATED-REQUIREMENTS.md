# Updated Requirements - Crowd-Sourcing Feature

## Requirements Summary

### Original Requirements
✅ Get product information from Amazon API
✅ Store product data in MongoDB
✅ Search functionality with filters
✅ Display products in a grid layout
✅ Product details view

### NEW Requirements (Crowd-Sourcing)
🆕 **Allow users to add products directly through the UI**
🆕 **Users can edit/improve existing product information**
🆕 **Community voting system (upvote/downvote)**
🆕 **Admin verification for crowd-sourced products**
🆕 **Report inappropriate content**
🆕 **Display verification status (Verified vs Pending)**

---

## Key Changes to Architecture

### 1. Database Schema Updates

**Added to Product Model:**
```javascript
{
  origin: {
    source: 'crowd_sourced', // New enum value
    // ... existing fields
  },

  // NEW: Crowd-sourcing metadata
  crowdSourced: {
    isVerified: Boolean,
    verifiedBy: String,
    verifiedAt: Date,
    submittedBy: {
      userId: String,
      username: String,
      email: String
    },
    editHistory: Array,
    upvotes: Number,
    downvotes: Number,
    reportCount: Number,
    reports: Array
  }
}
```

### 2. New API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/products` | Users can add products |
| PUT | `/api/products/:id` | Users can edit products |
| POST | `/api/products/:id/upvote` | Vote on product quality |
| POST | `/api/products/:id/downvote` | Downvote products |
| POST | `/api/products/:id/report` | Report issues |
| GET | `/api/products/pending` | Admin: view unverified products |
| POST | `/api/products/:id/verify` | Admin: approve products |

### 3. New UI Components

#### User-Facing:
- **Add Product Form** - Multi-step wizard (5 steps)
- **Edit Product Form** - Pre-filled form for editing
- **Verification Badge** - Visual indicator (✓ Verified / ⏳ Pending)
- **Vote Buttons** - Upvote/downvote on product cards
- **Report Button** - Flag inappropriate content
- **Contributor Info** - Show who submitted the product

#### Admin-Facing:
- **Admin Dashboard** - Review pending products
- **Moderation Panel** - Approve/reject submissions
- **Analytics Dashboard** - Track community contributions

### 4. Quality Control Mechanisms

**Automatic:**
- Spam keyword detection
- Price validation (0.01 - 100,000)
- Image URL validation
- Duplicate ASIN detection

**Community-Based:**
- Vote threshold (products with net score < -5 hidden)
- Report threshold (3+ reports → admin review)
- Auto-verification (50+ upvotes + <5% downvote ratio)

**Admin:**
- Manual review and approval
- Bulk approve/reject actions
- Edit history tracking
- Ban/warn contributors

---

## Updated Data Flow

### Product Addition Flow

```
User clicks "Add Product"
    ↓
Fills multi-step form (5 steps)
    ↓
Submits product
    ↓
Backend validates data
    ↓
Saves to MongoDB with:
    - origin.source = 'crowd_sourced'
    - crowdSourced.isVerified = false
    ↓
Product visible with "Pending" badge
    ↓
Admin reviews and approves
    ↓
Product marked as verified
```

### Product Search Flow (Updated)

```
User searches for product
    ↓
Backend queries MongoDB
    ↓
Returns BOTH:
    - Amazon API products (verified)
    - Crowd-sourced products (verified + pending)
    ↓
Frontend displays with badges:
    - ✓ Verified (Amazon or approved)
    - ⏳ Pending (awaiting review)
    ↓
User can vote/report crowd-sourced products
```

---

## Updated Implementation Phases

### Phase 1-4: Core Features (Unchanged)
- Project setup
- Database layer
- Backend API
- Amazon API integration

### Phase 5: Frontend (UPDATED)
- Search and product grid
- **+ Add Product Form**
- **+ Edit Product Form**
- **+ Vote/Report functionality**
- **+ Verification badges**

### Phase 6: Caching & Performance (Unchanged)

### Phase 7: Admin Dashboard (NEW)
- Admin authentication
- Pending product review
- Moderation features
- Analytics dashboard

### Phase 8: Security (UPDATED)
- Rate limiting (5 products/day, 50 votes/day)
- CAPTCHA for submissions
- Content moderation
- Duplicate detection

### Phase 9: Testing (UPDATED)
- Test voting system
- Test submission flow
- Test admin approval workflow

### Phase 10-11: Deployment & Documentation

---

## Security Considerations

### Rate Limiting
- **Product Submissions**: 5 per day per IP
- **Votes**: 50 per day per IP
- **Reports**: 10 per day per IP

### Content Validation
- Title: 10-200 characters
- Description: Minimum 20 characters
- Price: Must be positive number
- Images: Valid URL format required
- Email: Valid format (if provided)

### Spam Prevention
- Google reCAPTCHA on submission form
- Spam keyword filtering
- Duplicate ASIN detection
- Admin review before going live

---

## User Experience Flow

### Adding a Product

```
Homepage
    ↓
Click "Add Product" button (prominent)
    ↓
Step 1: Basic Info (Title, ASIN, Category, Brand)
    ↓
Step 2: Pricing (Amount, Currency, Availability)
    ↓
Step 3: Details (Description, Features, Specs)
    ↓
Step 4: Images (Upload/Link)
    ↓
Step 5: Contributor Info (Optional name/email)
    ↓
Review & Submit
    ↓
Success! "Thank you for contributing. Your submission will be reviewed."
```

### Viewing Products

```
Product Grid shows:
    ┌──────────────┐
    │  [IMAGE]     │
    │ Product Name │
    │ $99.99       │
    │ ⭐⭐⭐⭐⭐ 4.5  │
    │              │
    │ ✓ Verified   │  ← Badge shows verification status
    │ 👍 45 👎 2   │  ← Vote counts (if crowd-sourced)
    │              │
    │ [Edit] [View]│
    └──────────────┘
```

### Product Details View

```
Shows:
- All product information
- Source badge (Amazon API vs Community Contributed)
- If crowd-sourced:
  ✓ Contributor name
  ✓ Submission date
  ✓ Verification status
  ✓ Vote buttons
  ✓ "Suggest Edit" button
  ✓ Report button
```

---

## Admin Dashboard Preview

```
┌─────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                             │
│                                                              │
│  Pending Products: 23                                        │
│  Verified Today: 15                                          │
│  Flagged/Reported: 3                                         │
│  Top Contributor: JohnDoe (12 products)                      │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Pending Products (Awaiting Review)                          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Product: Wireless Headphones                          │  │
│  │ Submitted by: JohnDoe | Jan 15, 2025                  │  │
│  │ Votes: 👍 12  👎 1  | Reports: 0                      │  │
│  │                                                        │  │
│  │ [View Details] [✓ Approve] [✗ Reject] [Edit]          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack (No Changes)

| Component | Technology |
|-----------|------------|
| Frontend | Node.js, Express, EJS |
| Backend API | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Cache | Redis (optional) |
| External API | Amazon PA-API 5.0 |
| Authentication | JWT (for admin) |
| Form Validation | express-validator |
| CAPTCHA | Google reCAPTCHA |

---

## Database Indexes (Updated)

```javascript
// Existing indexes
productSchema.index({ title: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, 'price.amount': 1 });
productSchema.index({ asin: 1 }, { unique: true });

// NEW indexes for crowd-sourcing
productSchema.index({ 'crowdSourced.isVerified': 1 });
productSchema.index({ 'crowdSourced.submittedBy.userId': 1 });
productSchema.index({ 'origin.source': 1 });
productSchema.index({ 'crowdSourced.upvotes': -1 }); // For top-rated products
```

---

## API Response Examples

### Product with Amazon API Source
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "asin": "B07XYZ1234",
  "title": "Wireless Headphones",
  "price": { "amount": 99.99, "currency": "USD" },
  "origin": {
    "source": "amazon_pa_api",
    "marketplace": "US"
  },
  "crowdSourced": null
}
```

### Product with Crowd-Sourced Source
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
  "asin": "B08ABC5678",
  "title": "Smart Watch Pro",
  "price": { "amount": 199.99, "currency": "USD" },
  "origin": {
    "source": "crowd_sourced",
    "marketplace": "US"
  },
  "crowdSourced": {
    "isVerified": false,
    "submittedBy": {
      "username": "JohnDoe",
      "email": "john@example.com"
    },
    "upvotes": 12,
    "downvotes": 1,
    "reportCount": 0
  }
}
```

---

## Documentation Files

### Architecture Documents
1. [amazon-product-app-architecture.md](amazon-product-app-architecture.md) - Overall architecture (UPDATED)
2. [crowd-sourcing-feature.md](crowd-sourcing-feature.md) - Detailed crowd-sourcing specs (NEW)
3. [implementation-phases.md](implementation-phases.md) - Implementation roadmap (UPDATED)
4. [deployment-plan.md](deployment-plan.md) - Deployment strategy

### Setup & Prerequisites
5. [SETUP-GUIDE.md](../SETUP-GUIDE.md) - Installation guide

---

## Next Steps

1. ✅ Review updated architecture
2. ✅ Confirm crowd-sourcing requirements
3. 🔄 Start Phase 1: Project Setup
4. 🔄 Implement database schema with crowd-sourcing fields
5. 🔄 Build CRUD APIs for product management
6. 🔄 Create Add Product form
7. 🔄 Implement voting system
8. 🔄 Build admin dashboard

---

## Summary of Changes

### What's New?
✨ **Community Contribution System**
✨ **Voting & Verification**
✨ **Admin Moderation Dashboard**
✨ **Quality Control Mechanisms**
✨ **Multi-step Product Submission Form**

### What Stays the Same?
✅ Amazon API integration
✅ MongoDB database
✅ Search functionality
✅ Product grid display
✅ Technology stack
✅ Deployment strategy

The application now supports **hybrid data sources** - combining official Amazon product data with community-contributed information!
