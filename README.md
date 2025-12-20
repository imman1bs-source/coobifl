# Coobifl

**Discover where products are made and what they're made of**

A community-driven platform that helps consumers learn about product manufacturing origins, materials used, and country of origin information.

🌐 **Live Site:** https://coobifl.com

## Features

- 🔍 **Product Search** - Search and filter products by name, category, or country of origin
- 🌍 **Country of Origin Badges** - Visual indicators showing where products are manufactured
- ✏️ **Community Contributions** - Anyone can add products or edit manufacturing information
- 📊 **Admin Dashboard** - Review and approve community submissions
- 👍 **Voting System** - Upvote/downvote product information accuracy
- 🚨 **Reporting** - Flag incorrect or suspicious information
- 🔄 **Amazon Integration** - Automatic product data sync from Amazon PA-API (optional)

## Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API server
- **MongoDB** - NoSQL database with Mongoose ODM
- **Amazon PA-API** - Product data integration
- **JWT** - Authentication
- **node-cron** - Scheduled data synchronization

### Frontend
- **EJS** - Server-side templating
- **Bootstrap 5** - Responsive UI framework
- **Axios** - HTTP client
- **Font Awesome** - Icons

### Deployment
- **Railway** - Backend hosting + MongoDB
- **Vercel** - Frontend hosting with global CDN
- **Custom Domain** - coobifl.com with free SSL

## Project Structure

```
Coobifl/
├── architecture/           # Architecture documentation
│   ├── amazon-product-app-architecture.md
│   ├── implementation-phases.md
│   ├── crowd-sourcing-feature.md
│   ├── deployment-plan.md
│   └── UI-MOCKUPS.md
├── backend/               # Backend API server
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   └── utils/        # Utility functions
│   ├── tests/            # Backend tests
│   └── package.json
├── frontend/             # Frontend web application
│   ├── public/          # Static files
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── views/           # EJS templates
│   │   ├── layouts/
│   │   ├── partials/
│   │   └── pages/
│   ├── routes/          # Frontend routes
│   └── package.json
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **Git**
- **npm** or **yarn**

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Coobifl
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/amazon_product_hub
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:5000/api
```

### 5. Start MongoDB

Ensure MongoDB is running on your system:

```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS/Linux
mongod --config /usr/local/etc/mongod.conf
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm start
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## Implementation Status

- ✅ **Phase 1**: Project Setup & Foundation
- ✅ **Phase 2**: Data Layer & Models
- ✅ **Phase 3**: Backend API Development
- ✅ **Phase 4**: Amazon Data Integration
- ✅ **Phase 5**: Frontend Development (Crowd-sourcing features)
- ⏳ **Phase 6**: Caching & Performance
- ⏳ **Phase 7**: Admin Dashboard (Basic dashboard complete)
- ⏳ **Phase 8**: Security & Authentication
- ⏳ **Phase 9**: Testing & QA
- ✅ **Phase 10**: Deployment (Railway + Vercel)
- ⏳ **Phase 11**: Documentation

See [implementation-phases.md](architecture/implementation-phases.md) for detailed information.

## Deployment

The application is deployed at **https://coobifl.com**

### Quick Deploy Guide

Follow the step-by-step deployment guide: **[DEPLOY_COOBIFL.COM.md](DEPLOY_COOBIFL.COM.md)**

Or see the comprehensive guide: **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

### Deployment Stack
- **Backend:** Railway (https://railway.app)
- **Frontend:** Vercel (https://vercel.com)
- **Database:** MongoDB on Railway
- **Domain:** coobifl.com via GoDaddy
- **Cost:** ~$5/month

---

## API Endpoints

### Products
- `GET /api/products` - List all products (paginated)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search?q=` - Search products
- `POST /api/products` - Add new product (crowd-sourcing)
- `PUT /api/products/:id` - Update product
- `POST /api/products/:id/upvote` - Upvote product
- `POST /api/products/:id/downvote` - Downvote product
- `POST /api/products/:id/report` - Report product

### Admin
- `GET /api/products/pending` - Get pending products
- `POST /api/products/:id/verify` - Verify product

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (Phase 9)
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Documentation

For detailed architecture and design documentation, see the [architecture](architecture/) folder:

- [Architecture Overview](architecture/amazon-product-app-architecture.md)
- [Crowd-Sourcing Feature](architecture/crowd-sourcing-feature.md)
- [Implementation Phases](architecture/implementation-phases.md)
- [Deployment Plan](architecture/deployment-plan.md)
- [UI Mockups](architecture/UI-MOCKUPS.md)
- [Setup Guide](SETUP-GUIDE.md)

## Support

For issues and questions, please open an issue in the repository.
