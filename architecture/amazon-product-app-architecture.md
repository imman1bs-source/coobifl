# Amazon Product Information Application - Architecture Design

## System Overview

This application fetches product information from Amazon, stores it in MongoDB, and provides a searchable UI built with Node.js.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         Web Browser (User)                               │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │    │
│  │  │  Search Bar     │  │  Product Grid   │  │  Product Details Modal  │  │    │
│  │  │  Component      │  │  Component      │  │  Component              │  │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                           │
│                                      ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    NODE.JS FRONTEND (Express + EJS/React)                │    │
│  │                         Port: 3000                                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │    │
│  │  │ Static Files │  │ View Engine  │  │ Client-side  │                   │    │
│  │  │ (CSS/JS)     │  │ (EJS/React)  │  │ JavaScript   │                   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                   │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ HTTP/REST API Calls
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  API GATEWAY LAYER                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         API Gateway / Load Balancer                      │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │    │
│  │  │ Rate Limiting│  │ Auth/JWT     │  │ Request      │                   │    │
│  │  │              │  │ Validation   │  │ Routing      │                   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                   │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                BACKEND SERVICE LAYER                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────┐    ┌────────────────────────────────────┐   │
│  │      PRODUCT API SERVICE       │    │      DATA INGESTION SERVICE        │   │
│  │         (Node.js/Express)      │    │         (Node.js Worker)           │   │
│  │           Port: 4000           │    │           Port: 4001               │   │
│  │                                │    │                                    │   │
│  │  ┌──────────────────────────┐  │    │  ┌──────────────────────────────┐  │   │
│  │  │ GET /api/products        │  │    │  │ Amazon Product API Client    │  │   │
│  │  │ GET /api/products/:id    │  │    │  │ (PA-API 5.0 / Scraping)      │  │   │
│  │  │ GET /api/products/search │  │    │  └──────────────────────────────┘  │   │
│  │  └──────────────────────────┘  │    │                │                   │   │
│  │              │                 │    │                ▼                   │   │
│  │              ▼                 │    │  ┌──────────────────────────────┐  │   │
│  │  ┌──────────────────────────┐  │    │  │ Data Transformer             │  │   │
│  │  │ Product Controller       │  │    │  │ - Normalize data             │  │   │
│  │  └──────────────────────────┘  │    │  │ - Validate schema            │  │   │
│  │              │                 │    │  └──────────────────────────────┘  │   │
│  │              ▼                 │    │                │                   │   │
│  │  ┌──────────────────────────┐  │    │                ▼                   │   │
│  │  │ Product Service          │  │    │  ┌──────────────────────────────┐  │   │
│  │  │ - Search logic           │  │    │  │ Scheduler (node-cron)        │  │   │
│  │  │ - Pagination             │  │    │  │ - Periodic sync              │  │   │
│  │  │ - Filtering              │  │    │  │ - Bulk insert/update         │  │   │
│  │  └──────────────────────────┘  │    │  └──────────────────────────────┘  │   │
│  │              │                 │    │                │                   │   │
│  └──────────────┼─────────────────┘    └────────────────┼───────────────────┘   │
│                 │                                       │                        │
│                 └───────────────┬───────────────────────┘                        │
│                                 │                                                │
│                                 ▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        DATA ACCESS LAYER (DAL)                           │    │
│  │  ┌──────────────────────────┐  ┌──────────────────────────────────────┐  │    │
│  │  │ Mongoose ODM             │  │ Repository Pattern                   │  │    │
│  │  │ - Schema definitions     │  │ - ProductRepository                  │  │    │
│  │  │ - Model validation       │  │ - Abstract data operations           │  │    │
│  │  └──────────────────────────┘  └──────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           MongoDB Cluster                                │    │
│  │                            Port: 27017                                   │    │
│  │                                                                          │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │    │
│  │  │                     Database: amazon_products                    │    │    │
│  │  │                                                                  │    │    │
│  │  │  ┌────────────────────────────────────────────────────────────┐ │    │    │
│  │  │  │ Collection: products                                       │ │    │    │
│  │  │  │ ┌────────────────────────────────────────────────────────┐ │ │    │    │
│  │  │  │ │ {                                                      │ │ │    │    │
│  │  │  │ │   _id: ObjectId,                                       │ │ │    │    │
│  │  │  │ │   asin: String (indexed, unique),                      │ │ │    │    │
│  │  │  │ │   title: String (text indexed),                        │ │ │    │    │
│  │  │  │ │   description: String (text indexed),                  │ │ │    │    │
│  │  │  │ │   price: { amount: Number, currency: String },         │ │ │    │    │
│  │  │  │ │   category: String (indexed),                          │ │ │    │    │
│  │  │  │ │   images: [String],                                    │ │ │    │    │
│  │  │  │ │   rating: Number,                                      │ │ │    │    │
│  │  │  │ │   reviewCount: Number,                                 │ │ │    │    │
│  │  │  │ │   availability: String,                                │ │ │    │    │
│  │  │  │ │   origin: {                                            │ │ │    │    │
│  │  │  │ │     source: String (enum),                             │ │ │    │    │
│  │  │  │ │     marketplace: String,                               │ │ │    │    │
│  │  │  │ │     importedBy: String,                                │ │ │    │    │
│  │  │  │ │     importedAt: Date                                   │ │ │    │    │
│  │  │  │ │   },                                                   │ │ │    │    │
│  │  │  │ │   createdAt: Date,                                     │ │ │    │    │
│  │  │  │ │   updatedAt: Date                                      │ │ │    │    │
│  │  │  │ │ }                                                      │ │ │    │    │
│  │  │  │ └────────────────────────────────────────────────────────┘ │ │    │    │
│  │  │  └────────────────────────────────────────────────────────────┘ │    │    │
│  │  │                                                                  │    │    │
│  │  │  Indexes:                                                        │    │    │
│  │  │  - Text index on (title, description) for full-text search      │    │    │
│  │  │  - Compound index on (category, price.amount)                   │    │    │
│  │  │  - Index on (asin) - unique                                     │    │    │
│  │  │  - Index on (updatedAt) for sync operations                     │    │    │
│  │  └─────────────────────────────────────────────────────────────────┘    │    │
│  │                                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           Redis Cache (Optional)                         │    │
│  │                             Port: 6379                                   │    │
│  │  ┌──────────────────────────┐  ┌──────────────────────────────────────┐  │    │
│  │  │ Search Results Cache     │  │ Product Details Cache                │  │    │
│  │  │ TTL: 5 minutes           │  │ TTL: 1 hour                          │  │    │
│  │  └──────────────────────────┘  └──────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL SERVICES                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    Amazon Product Advertising API 5.0                    │    │
│  │                                                                          │    │
│  │  Endpoints Used:                                                         │    │
│  │  - SearchItems: Search for products by keywords                          │    │
│  │  - GetItems: Get product details by ASIN                                 │    │
│  │  - GetBrowseNodes: Get category information                              │    │
│  │                                                                          │    │
│  │  Authentication: AWS Signature Version 4                                 │    │
│  │  Rate Limits: Based on revenue tier                                      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Client Layer (Frontend)

**Technology Stack:**
- Node.js with Express.js
- EJS templating engine (or React for SPA)
- Bootstrap/Tailwind CSS for styling
- Axios for API calls

**Key Components:**

| Component | Purpose |
|-----------|---------|
| Search Bar | Text input with autocomplete, filters (category, price range) |
| Product Grid | Responsive grid displaying product cards with pagination, vote buttons |
| Product Details | Modal/page showing full product information, edit option |
| **Add Product Form** | **Multi-step form for users to submit new products** |
| **Edit Product Form** | **Form to edit existing product information** |
| **Verification Badge** | **Visual indicator for verified vs crowd-sourced products** |
| **Vote Buttons** | **Upvote/downvote crowd-sourced products for quality control** |
| **Report Button** | **Flag inappropriate or incorrect product information** |
| Loading States | Skeleton loaders for better UX |

**Folder Structure:**
```
frontend/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
│   ├── layouts/
│   ├── partials/
│   └── pages/
├── routes/
├── app.js
└── package.json
```

---

### 2. API Gateway Layer

**Responsibilities:**
- Request routing and load balancing
- Rate limiting (protect against abuse)
- JWT authentication/validation
- Request/response logging
- CORS handling

**Options:**
- Express middleware (simple setup)
- Nginx (production-grade)
- AWS API Gateway (cloud deployment)

---

### 3. Backend Service Layer

#### Product API Service
**Purpose:** Serve product data to the frontend

**API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (paginated) |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/search?q=` | Full-text search |
| GET | `/api/products/category/:cat` | Filter by category |
| POST | `/api/products/filter` | Advanced filtering |
| **POST** | **`/api/products`** | **Create new product (crowd-sourcing)** |
| **PUT** | **`/api/products/:id`** | **Update existing product (crowd-sourcing)** |
| **DELETE** | **`/api/products/:id`** | **Delete product (admin only)** |
| **POST** | **`/api/products/:id/verify`** | **Mark product as verified (admin)** |
| **GET** | **`/api/products/pending`** | **Get pending/unverified products (admin)** |

**Folder Structure:**
```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── productController.js
│   ├── models/
│   │   └── Product.js
│   ├── routes/
│   │   └── productRoutes.js
│   ├── services/
│   │   └── productService.js
│   ├── repositories/
│   │   └── productRepository.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   └── utils/
├── app.js
└── package.json
```

#### Data Ingestion Service
**Purpose:** Fetch and sync Amazon product data

**Components:**
- Amazon PA-API Client (authenticated API calls)
- Data Transformer (normalize & validate)
- Scheduler (periodic sync with node-cron)
- Queue (optional: Bull/Redis for job processing)

---

### 4. Data Layer

#### MongoDB Schema Design

```javascript
// Product Schema
const productSchema = new Schema({
  asin: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  price: {
    amount: Number,
    currency: { type: String, default: 'USD' },
    displayPrice: String
  },
  category: {
    type: String,
    index: true
  },
  subcategory: String,
  images: {
    primary: String,
    variants: [String]
  },
  rating: {
    average: { type: Number, min: 0, max: 5 },
    count: Number
  },
  availability: {
    status: String,
    message: String
  },
  brand: String,
  features: [String],
  specifications: Map,
  amazonUrl: String,
  origin: {
    source: {
      type: String,
      enum: ['amazon_pa_api', 'manual_import', 'csv_upload', 'scraper', 'crowd_sourced', 'other'],
      required: true,
      default: 'amazon_pa_api'
    },
    sourceId: String,           // Reference ID from source system
    marketplace: {               // Amazon marketplace region
      type: String,
      enum: ['US', 'UK', 'DE', 'FR', 'JP', 'CA', 'IN', 'IT', 'ES', 'MX', 'BR', 'AU'],
      default: 'US'
    },
    importedBy: String,          // User/system that imported
    importedAt: Date             // When it was imported
  },
  crowdSourced: {
    isVerified: {
      type: Boolean,
      default: false             // Admin verification status
    },
    verifiedBy: String,          // Admin who verified
    verifiedAt: Date,            // Verification timestamp
    submittedBy: {
      userId: String,            // User who submitted (optional)
      username: String,          // Username
      email: String              // Contact email
    },
    editHistory: [{
      editedBy: String,
      editedAt: Date,
      changes: Object            // What was changed
    }],
    upvotes: {
      type: Number,
      default: 0                 // Community upvotes
    },
    downvotes: {
      type: Number,
      default: 0                 // Community downvotes
    },
    reportCount: {
      type: Number,
      default: 0                 // Abuse reports
    }
  },
  lastSyncedAt: Date
}, {
  timestamps: true
});

// Text index for search
productSchema.index({
  title: 'text',
  description: 'text',
  brand: 'text'
});

// Compound index for filtering
productSchema.index({
  category: 1,
  'price.amount': 1
});
```

#### Redis Caching Strategy

| Cache Key Pattern | Data | TTL |
|-------------------|------|-----|
| `search:{query}:{page}` | Search results | 5 min |
| `product:{asin}` | Product details | 1 hour |
| `categories:all` | Category list | 24 hours |

---

## Data Flow

### 1. Product Search Flow

```
┌──────┐    ┌─────────┐    ┌─────────┐    ┌───────┐    ┌─────────┐
│ User │───▶│ Frontend│───▶│ Backend │───▶│ Redis │───▶│ MongoDB │
└──────┘    └─────────┘    └─────────┘    └───────┘    └─────────┘
   │             │              │              │             │
   │  1. Enter   │              │              │             │
   │  search     │              │              │             │
   │  query      │              │              │             │
   │─────────────▶              │              │             │
   │             │  2. API call │              │             │
   │             │  /api/search │              │             │
   │             │──────────────▶              │             │
   │             │              │  3. Check    │             │
   │             │              │  cache       │             │
   │             │              │──────────────▶             │
   │             │              │              │             │
   │             │              │  4. Cache    │             │
   │             │              │  miss? Query │             │
   │             │              │──────────────┼────────────▶│
   │             │              │              │             │
   │             │              │  5. Return   │  6. Store   │
   │             │              │  results     │  in cache   │
   │             │◀─────────────│◀─────────────┼─────────────│
   │  7. Display │              │              │             │
   │  results    │              │              │             │
   │◀────────────│              │              │             │
```

### 2. Data Ingestion Flow

```
┌───────────┐    ┌────────────┐    ┌─────────────┐    ┌─────────┐
│ Scheduler │───▶│ Ingestion  │───▶│ Amazon API  │───▶│ MongoDB │
│ (Cron)    │    │ Service    │    │ (PA-API)    │    │         │
└───────────┘    └────────────┘    └─────────────┘    └─────────┘
      │               │                   │                │
      │  1. Trigger   │                   │                │
      │  sync job     │                   │                │
      │───────────────▶                   │                │
      │               │  2. Fetch         │                │
      │               │  products         │                │
      │               │───────────────────▶                │
      │               │                   │                │
      │               │  3. Transform &   │                │
      │               │  validate data    │                │
      │               │◀──────────────────│                │
      │               │                   │                │
      │               │  4. Upsert to DB  │                │
      │               │  (bulk operation) │                │
      │               │────────────────────────────────────▶
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Node.js + Express + EJS | Server-side rendered UI |
| Styling | Bootstrap 5 / Tailwind | Responsive design |
| API Server | Node.js + Express | REST API |
| Database | MongoDB | Product data storage |
| ODM | Mongoose | Data modeling |
| Cache | Redis | Performance optimization |
| Scheduler | node-cron | Periodic data sync |
| External API | Amazon PA-API 5.0 | Product data source |
| Authentication | JWT | API security |

---

## Scalability Considerations

### Horizontal Scaling
```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │    (Nginx)      │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │  Backend    │    │  Backend    │    │  Backend    │
   │  Instance 1 │    │  Instance 2 │    │  Instance N │
   └─────────────┘    └─────────────┘    └─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │  MongoDB        │
                    │  Replica Set    │
                    └─────────────────┘
```

### Performance Optimizations
1. **Database Indexing** - Text indexes for search, compound indexes for filters
2. **Caching** - Redis for frequently accessed data
3. **Pagination** - Limit results per request
4. **Connection Pooling** - Reuse database connections
5. **Compression** - Gzip responses

---

## Security Measures

1. **Input Validation** - Sanitize all user inputs
2. **Rate Limiting** - Prevent API abuse
3. **HTTPS** - Encrypt all traffic
4. **Environment Variables** - Secure credential storage
5. **CORS** - Restrict cross-origin requests
6. **Helmet.js** - HTTP security headers

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS / Cloud                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Route 53  │  │ CloudFront  │  │   S3 (Static)       │  │
│  │   (DNS)     │  │   (CDN)     │  │                     │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘  │
│         │                │                                   │
│         ▼                ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Elastic Load Balancer                   │    │
│  └─────────────────────────┬───────────────────────────┘    │
│                            │                                 │
│  ┌─────────────────────────▼───────────────────────────┐    │
│  │                    ECS / EC2                         │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │  Frontend   │  │  Backend    │  │  Ingestion  │  │    │
│  │  │  Container  │  │  Container  │  │  Worker     │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                 │
│  ┌─────────────────────────▼───────────────────────────┐    │
│  │  ┌─────────────┐       ┌─────────────────────────┐  │    │
│  │  │  ElastiCache│       │  MongoDB Atlas /        │  │    │
│  │  │  (Redis)    │       │  DocumentDB             │  │    │
│  │  └─────────────┘       └─────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB v6+
- Redis v7+ (optional)
- Amazon Product Advertising API credentials

### Environment Variables
```env
# Server
PORT=4000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/amazon_products

# Redis
REDIS_URL=redis://localhost:6379

# Amazon PA-API
AMAZON_ACCESS_KEY=your_access_key
AMAZON_SECRET_KEY=your_secret_key
AMAZON_PARTNER_TAG=your_partner_tag
AMAZON_REGION=us-east-1

# JWT
JWT_SECRET=your_jwt_secret
```

---

## Next Steps

1. **Set up project structure** - Initialize Node.js projects for frontend and backend
2. **Configure MongoDB** - Set up database and create indexes
3. **Implement Amazon API client** - Integrate PA-API 5.0
4. **Build REST API** - Create product endpoints
5. **Develop UI** - Build search interface
6. **Add caching** - Integrate Redis
7. **Testing** - Unit and integration tests
8. **Deployment** - Containerize and deploy
