const path = require('path');
const fs = require('fs');

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../../../.env.production')
  : path.join(__dirname, '../../../.env');

if (fs.existsSync(envFile)) {
  require('dotenv').config({ path: envFile });
  console.log(`Loaded environment from: ${envFile}`);
} else {
  console.log(`No .env file found at: ${envFile}`);
}

/**
 * Environment configuration
 */
module.exports = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,

  // Database
  MONGODB_URI: (() => {
    console.log('DEBUG: Checking MongoDB connection variables...');
    console.log('DEBUG: ALL ENV VARS:', JSON.stringify(Object.keys(process.env).sort()));
    console.log('DEBUG: MONGODB_URI =', process.env.MONGODB_URI);
    console.log('DEBUG: MONGO_URL =', process.env.MONGO_URL);
    console.log('DEBUG: MONGOUSER =', process.env.MONGOUSER);
    console.log('DEBUG: MONGOHOST =', process.env.MONGOHOST);
    console.log('DEBUG: TEST_VAR =', process.env.TEST_VAR);

    // Check environment variables in order of preference
    if (process.env.MONGODB_URI) {
      console.log('DEBUG: Using MONGODB_URI');
      return process.env.MONGODB_URI;
    }
    if (process.env.MONGO_URL) {
      console.log('DEBUG: Using MONGO_URL');
      return process.env.MONGO_URL;
    }

    // Build from Railway's MongoDB plugin variables
    if (process.env.MONGOUSER && process.env.MONGOPASSWORD && process.env.MONGOHOST) {
      const port = process.env.MONGOPORT || 27017;
      const url = `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@${process.env.MONGOHOST}:${port}/coobifl`;
      console.log('DEBUG: Built from components:', url);
      return url;
    }

    // Local development fallback
    console.log('DEBUG: Using localhost fallback');
    return 'mongodb://localhost:27017/amazon_product_hub';
  })(),

  // Redis (optional for caching)
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

  // Amazon PA-API (to be configured later)
  AMAZON_ACCESS_KEY: process.env.AMAZON_ACCESS_KEY || '',
  AMAZON_SECRET_KEY: process.env.AMAZON_SECRET_KEY || '',
  AMAZON_PARTNER_TAG: process.env.AMAZON_PARTNER_TAG || '',
  AMAZON_REGION: process.env.AMAZON_REGION || 'US',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),

  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || '36'), // 6x6 grid
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || '100'),

  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
