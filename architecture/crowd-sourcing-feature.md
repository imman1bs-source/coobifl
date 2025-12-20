# Crowd-Sourcing Feature - Product Contribution System

## Overview

This document details the crowd-sourcing functionality that allows users to add, edit, and vote on product information in addition to the Amazon API data.

---

## Feature Objectives

1. **Community Contribution** - Allow users to add products not available via Amazon API
2. **Data Enrichment** - Enable users to enhance existing product information
3. **Quality Control** - Implement verification and voting system for data accuracy
4. **User Engagement** - Build community participation through gamification

---

## User Flow Diagrams

### 1. Add Product Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        User Journey                               │
└──────────────────────────────────────────────────────────────────┘

User visits homepage
    │
    ▼
Clicks "Add Product" button
    │
    ▼
┌────────────────────────────────┐
│  Step 1: Basic Information     │
│  - Title                       │
│  - ASIN (optional)             │
│  - Category                    │
│  - Brand                       │
│  - Amazon URL (optional)       │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Step 2: Pricing & Availability│
│  - Price Amount                │
│  - Currency                    │
│  - Availability Status         │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Step 3: Details               │
│  - Description                 │
│  - Features (multiple)         │
│  - Specifications              │
│  - Rating (optional)           │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Step 4: Images                │
│  - Upload/Link Primary Image   │
│  - Upload/Link Additional      │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Step 5: Contributor Info      │
│  - Name/Username (optional)    │
│  - Email (optional)            │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Review & Submit               │
│  - Preview product card        │
│  - Confirm submission          │
└────────────┬───────────────────┘
             │
             ▼
Product saved with "Pending Verification" status
             │
             ▼
Thank you page with submission ID
```

### 2. Edit Product Flow

```
User views product details
    │
    ▼
Clicks "Suggest Edit" button
    │
    ▼
Pre-filled form with current data
    │
    ▼
User modifies fields
    │
    ▼
Submit changes
    │
    ▼
Changes saved to edit history
    │
    ▼
Awaits admin approval (for verified products)
OR
Applied immediately (for unverified products)
```

### 3. Vote & Verify Flow

```
User sees product card
    │
    ├─────────────┬─────────────┐
    │             │             │
    ▼             ▼             ▼
Upvote      Downvote       Report
    │             │             │
    └─────────────┴─────────────┘
                  │
                  ▼
        Vote count updated
                  │
                  ▼
    (If reports > threshold)
                  │
                  ▼
    Flag for admin review
```

---

## UI Components Design

### 1. Product Grid with Crowd-Sourcing Features

```
┌─────────────────────────────────────────────────────────────────┐
│  Search: [_____________________] [Search Button] [+Add Product] │
│                                                                  │
│  Filters: Category ▼ | Price ▼ | Rating ▼ | Source ▼           │
│          Show: ☑ Verified  ☑ Pending  ☑ All                    │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  [IMAGE]     │  │  [IMAGE]     │  │  [IMAGE]     │
│              │  │              │  │              │
│ Product Name │  │ Product Name │  │ Product Name │
│ $99.99       │  │ $79.99       │  │ $149.99      │
│ ⭐⭐⭐⭐⭐ 4.5  │  │ ⭐⭐⭐⭐☆ 4.0  │  │ ⭐⭐⭐⭐⭐ 4.8  │
│              │  │              │  │              │
│ ✓ Verified   │  │ ⏳ Pending   │  │ ✓ Verified   │
│ 👍 45 👎 2   │  │ 👍 12 👎 1   │  │ 👍 89 👎 5   │
│              │  │              │  │              │
│ [Edit] [View]│  │ [Edit] [View]│  │ [Edit] [View]│
└──────────────┘  └──────────────┘  └──────────────┘
```

### 2. Add Product Form (Multi-Step)

```
┌─────────────────────────────────────────────────────────────────┐
│                       Add New Product                            │
│                                                                  │
│  ⚫ Basic Info  ⚪ Pricing  ⚪ Details  ⚪ Images  ⚪ Review      │
│  ────────────────────────────────────────────────────────────── │
│                                                                  │
│  Product Title *                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ASIN (Amazon Standard Identification Number)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ e.g., B07XYZ1234                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Category *                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Electronics                                            ▼ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Brand *                                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Amazon Product URL (Optional)                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ https://www.amazon.com/...                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│                               [Cancel]  [Next: Pricing →]       │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Product Detail View with Edit Option

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Search                        [Edit] [Report] [Share] │
│                                                                  │
│  ┌────────────┐                                                 │
│  │            │  Product Name                                   │
│  │   IMAGE    │  by Brand Name                                  │
│  │            │                                                  │
│  │            │  ⭐⭐⭐⭐⭐ 4.5 (234 reviews)                      │
│  └────────────┘                                                 │
│                  $99.99                                          │
│                  In Stock                                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ✓ Verified Product                                       │   │
│  │ Source: Amazon API | Last synced: 2 hours ago            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  OR                                                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ⏳ Community Contributed                                 │   │
│  │ Submitted by: JohnDoe | On: Jan 15, 2025                 │   │
│  │ Awaiting verification                                    │   │
│  │ Community Rating: 👍 45 👎 2                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Description:                                                    │
│  Lorem ipsum dolor sit amet...                                  │
│                                                                  │
│  Features:                                                       │
│  • Feature 1                                                     │
│  • Feature 2                                                     │
│  • Feature 3                                                     │
│                                                                  │
│  Specifications:                                                 │
│  Dimensions: 10 x 5 x 3 inches                                  │
│  Weight: 2.5 lbs                                                │
│                                                                  │
│  ──────────────────────────────────────────────────────────     │
│                                                                  │
│  Was this information helpful?                                   │
│  [👍 Upvote]  [👎 Downvote]                                     │
│                                                                  │
│  [🔗 View on Amazon]  [✏️ Suggest Edit]                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Updates

### Product Schema (Updated)

```javascript
const productSchema = new Schema({
  // ... (existing fields)

  origin: {
    source: {
      type: String,
      enum: ['amazon_pa_api', 'manual_import', 'csv_upload', 'scraper', 'crowd_sourced', 'other'],
      required: true,
      default: 'amazon_pa_api'
    },
    sourceId: String,
    marketplace: {
      type: String,
      enum: ['US', 'UK', 'DE', 'FR', 'JP', 'CA', 'IN', 'IT', 'ES', 'MX', 'BR', 'AU'],
      default: 'US'
    },
    importedBy: String,
    importedAt: Date
  },

  // NEW: Crowd-sourcing specific fields
  crowdSourced: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: String,
    verifiedAt: Date,
    submittedBy: {
      userId: String,
      username: String,
      email: String
    },
    editHistory: [{
      editedBy: String,
      editedAt: Date,
      fieldChanged: String,
      oldValue: Schema.Types.Mixed,
      newValue: Schema.Types.Mixed,
      approved: { type: Boolean, default: null }
    }],
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    },
    reportCount: {
      type: Number,
      default: 0
    },
    reports: [{
      reportedBy: String,
      reason: String,
      reportedAt: Date
    }]
  },

  lastSyncedAt: Date
}, {
  timestamps: true
});

// Additional indexes for crowd-sourcing
productSchema.index({ 'crowdSourced.isVerified': 1 });
productSchema.index({ 'crowdSourced.submittedBy.userId': 1 });
productSchema.index({ 'origin.source': 1 });
```

---

## API Endpoints (Updated)

### Product Management Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **POST** | `/api/products` | Optional | Create new product (crowd-sourced) |
| **PUT** | `/api/products/:id` | Optional | Update product information |
| **DELETE** | `/api/products/:id` | Admin | Delete product |
| **GET** | `/api/products/pending` | Admin | Get unverified products |
| **POST** | `/api/products/:id/verify` | Admin | Mark product as verified |
| **POST** | `/api/products/:id/reject` | Admin | Reject product submission |

### Vote & Report Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **POST** | `/api/products/:id/upvote` | Optional | Upvote a product |
| **POST** | `/api/products/:id/downvote` | Optional | Downvote a product |
| **POST** | `/api/products/:id/report` | Optional | Report inappropriate content |
| **GET** | `/api/products/top-rated` | Public | Get highest-rated crowd-sourced products |

---

## API Request/Response Examples

### 1. Create Product (POST /api/products)

**Request:**
```json
{
  "asin": "B07XYZ1234",
  "title": "Wireless Bluetooth Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": {
    "amount": 99.99,
    "currency": "USD",
    "displayPrice": "$99.99"
  },
  "category": "Electronics",
  "subcategory": "Audio",
  "brand": "TechBrand",
  "images": {
    "primary": "https://example.com/image1.jpg",
    "variants": [
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg"
    ]
  },
  "features": [
    "Active Noise Cancellation",
    "30-hour battery life",
    "Bluetooth 5.0"
  ],
  "specifications": {
    "weight": "250g",
    "dimensions": "20 x 18 x 8 cm",
    "connectivity": "Bluetooth 5.0"
  },
  "availability": {
    "status": "In Stock",
    "message": "Ships within 2-3 days"
  },
  "amazonUrl": "https://www.amazon.com/dp/B07XYZ1234",
  "origin": {
    "source": "crowd_sourced",
    "marketplace": "US"
  },
  "submittedBy": {
    "username": "JohnDoe",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product submitted successfully! It will be reviewed by our team.",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "asin": "B07XYZ1234",
    "title": "Wireless Bluetooth Headphones",
    "crowdSourced": {
      "isVerified": false,
      "submittedBy": {
        "username": "JohnDoe",
        "email": "john@example.com"
      },
      "upvotes": 0,
      "downvotes": 0
    },
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### 2. Upvote Product (POST /api/products/:id/upvote)

**Request:**
```json
{
  "userId": "user123" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product upvoted successfully",
  "data": {
    "upvotes": 46,
    "downvotes": 2,
    "netScore": 44
  }
}
```

### 3. Report Product (POST /api/products/:id/report)

**Request:**
```json
{
  "reason": "Incorrect pricing information",
  "reportedBy": "user456",
  "details": "The actual price is $79.99, not $99.99"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your report. Our team will review it shortly.",
  "data": {
    "reportCount": 1,
    "status": "under_review"
  }
}
```

---

## Frontend Implementation

### Add Product Form Component (React Example)

```javascript
// components/AddProductForm.jsx
import { useState } from 'react';
import axios from 'axios';

const AddProductForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    asin: '',
    category: '',
    brand: '',
    price: { amount: '', currency: 'USD' },
    description: '',
    features: [''],
    images: { primary: '', variants: [] },
    submittedBy: { username: '', email: '' }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/products', {
        ...formData,
        origin: {
          source: 'crowd_sourced',
          marketplace: 'US'
        }
      });

      alert('Product submitted successfully!');
      // Redirect or show success message
    } catch (error) {
      alert('Error submitting product: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Multi-step form implementation */}
    </form>
  );
};

export default AddProductForm;
```

### Product Card with Voting (React Example)

```javascript
// components/ProductCard.jsx
import { useState } from 'react';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const [votes, setVotes] = useState({
    upvotes: product.crowdSourced?.upvotes || 0,
    downvotes: product.crowdSourced?.downvotes || 0
  });

  const handleVote = async (voteType) => {
    try {
      const response = await axios.post(
        `/api/products/${product._id}/${voteType}`
      );
      setVotes(response.data.data);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="product-card">
      <img src={product.images.primary} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="price">${product.price.amount}</p>
      <div className="rating">⭐ {product.rating?.average || 'N/A'}</div>

      {/* Verification Badge */}
      <div className="verification-badge">
        {product.crowdSourced?.isVerified ? (
          <span className="verified">✓ Verified</span>
        ) : (
          <span className="pending">⏳ Pending</span>
        )}
      </div>

      {/* Voting Buttons */}
      {product.origin.source === 'crowd_sourced' && (
        <div className="vote-buttons">
          <button onClick={() => handleVote('upvote')}>
            👍 {votes.upvotes}
          </button>
          <button onClick={() => handleVote('downvote')}>
            👎 {votes.downvotes}
          </button>
        </div>
      )}

      <div className="actions">
        <button>View Details</button>
        <button>Edit</button>
      </div>
    </div>
  );
};

export default ProductCard;
```

---

## Backend Implementation

### Product Controller (CRUD Operations)

```javascript
// controllers/productController.js
const Product = require('../models/Product');

// Create new product (crowd-sourced)
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      origin: {
        ...req.body.origin,
        source: 'crowd_sourced',
        importedAt: new Date()
      },
      crowdSourced: {
        isVerified: false,
        submittedBy: req.body.submittedBy,
        upvotes: 0,
        downvotes: 0,
        reportCount: 0
      }
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product submitted successfully! It will be reviewed by our team.',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Upvote product
exports.upvoteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.crowdSourced.upvotes += 1;
    await product.save();

    res.json({
      success: true,
      message: 'Product upvoted successfully',
      data: {
        upvotes: product.crowdSourced.upvotes,
        downvotes: product.crowdSourced.downvotes,
        netScore: product.crowdSourced.upvotes - product.crowdSourced.downvotes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error upvoting product',
      error: error.message
    });
  }
};

// Get pending products (admin)
exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      'crowdSourced.isVerified': false,
      'origin.source': 'crowd_sourced'
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending products',
      error: error.message
    });
  }
};

// Verify product (admin)
exports.verifyProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.crowdSourced.isVerified = true;
    product.crowdSourced.verifiedBy = req.user?.username || 'admin';
    product.crowdSourced.verifiedAt = new Date();
    await product.save();

    res.json({
      success: true,
      message: 'Product verified successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying product',
      error: error.message
    });
  }
};
```

---

## Validation Rules

### Product Submission Validation

```javascript
// middleware/validators/productValidator.js
const { body, validationResult } = require('express-validator');

exports.validateProductCreate = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 10, max: 200 }).withMessage('Title must be 10-200 characters'),

  body('category')
    .notEmpty().withMessage('Category is required'),

  body('brand')
    .trim()
    .notEmpty().withMessage('Brand is required'),

  body('price.amount')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('description')
    .trim()
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),

  body('images.primary')
    .isURL().withMessage('Primary image must be a valid URL'),

  body('submittedBy.email')
    .optional()
    .isEmail().withMessage('Must be a valid email'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];
```

---

## Quality Control Mechanisms

### 1. Automatic Moderation

```javascript
// services/moderationService.js
class ModerationService {
  // Auto-flag products based on criteria
  async checkProduct(product) {
    const flags = [];

    // Check for spam keywords
    const spamKeywords = ['buy now', 'click here', 'free money'];
    const text = `${product.title} ${product.description}`.toLowerCase();
    if (spamKeywords.some(keyword => text.includes(keyword))) {
      flags.push('potential_spam');
    }

    // Check for invalid pricing
    if (product.price.amount < 0.01 || product.price.amount > 100000) {
      flags.push('suspicious_pricing');
    }

    // Check image URLs
    if (!product.images.primary || !this.isValidImageUrl(product.images.primary)) {
      flags.push('invalid_image');
    }

    return {
      needsReview: flags.length > 0,
      flags
    };
  }

  isValidImageUrl(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  }
}

module.exports = new ModerationService();
```

### 2. Community-Based Quality

- **Vote Threshold**: Products with net score (upvotes - downvotes) < -5 are hidden
- **Report Threshold**: Products with 3+ reports are flagged for admin review
- **Auto-verification**: Products with 50+ upvotes and <5% downvote ratio can be auto-verified

---

## Admin Dashboard Features

### Pending Products Review

```
┌─────────────────────────────────────────────────────────────────┐
│  Admin Dashboard - Pending Product Review                       │
│                                                                  │
│  Filter: All ▼ | Sort: Newest ▼                   [Refresh]     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Product #1 - Wireless Headphones                                │
│  Submitted by: JohnDoe | On: Jan 15, 2025 10:30 AM              │
│  Community: 👍 12  👎 1  | Reports: 0                           │
│                                                                  │
│  [View Details] [✓ Approve] [✗ Reject] [Edit]                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Product #2 - Smart Watch                                        │
│  Submitted by: JaneSmith | On: Jan 14, 2025 3:45 PM             │
│  Community: 👍 5  👎 8  | Reports: 2  ⚠️                        │
│                                                                  │
│  [View Details] [✓ Approve] [✗ Reject] [Edit]                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases Update

### Phase 5 (Frontend) - Updated with Crowd-Sourcing

- [ ] **Add Product Form**
  - Multi-step wizard (5 steps)
  - Form validation
  - Image upload/URL input
  - Preview before submission

- [ ] **Edit Product Form**
  - Pre-fill with existing data
  - Track changes for history
  - Different flow for verified vs unverified

- [ ] **Verification Badges**
  - Visual indicators (✓ Verified, ⏳ Pending)
  - Tooltips with verification info

- [ ] **Vote Buttons**
  - Upvote/downvote functionality
  - Visual feedback
  - Vote count display

- [ ] **Report System**
  - Report modal with reason selection
  - Confirmation message

### Phase 7 (Security) - Updated

- [ ] **Rate Limiting for Submissions**
  - Max 5 products per day per IP
  - Max 50 votes per day per IP

- [ ] **Content Moderation**
  - Spam detection
  - Profanity filter
  - Image validation

- [ ] **Admin Authentication**
  - Separate admin routes
  - JWT-based auth for admin actions

---

## Summary

The crowd-sourcing feature enables:

✅ **User Contributions** - Community can add missing products
✅ **Data Enrichment** - Users can improve existing information
✅ **Quality Control** - Voting and verification system
✅ **Transparency** - Clear indicators for data source
✅ **Moderation** - Admin dashboard for review
✅ **Engagement** - Gamification through voting

This creates a hybrid system combining official Amazon data with community contributions for comprehensive product coverage.
