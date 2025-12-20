const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const config = require('./config/environment');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Import routes
const productRoutes = require('./routes/productRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const syncRoutes = require('./routes/sync');

// API Routes
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Amazon Product Hub API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      products: '/api/products',
      search: '/api/products/search',
      categories: '/api/categories',
      brands: '/api/brands',
      stats: '/api/stats'
    }
  });
});

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api', utilityRoutes);
app.use('/api/sync', syncRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize sync scheduler
const syncScheduler = require('./services/SyncScheduler');
syncScheduler.start();

// Start server
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log('===========================================');
  console.log(`🚀 Server running in ${config.NODE_ENV} mode`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log('===========================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app;
