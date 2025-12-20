const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Debug: Log ALL environment variables
console.log('=== Environment Debug ===');
console.log('Total env vars:', Object.keys(process.env).length);
console.log('All env var keys:', Object.keys(process.env).sort());
console.log('MONGODB_URI value:', process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('========================');

/**
 * Environment configuration
 */
module.exports = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,

  // Database
  // Railway workaround: Build MongoDB URL from individual components if MONGODB_URI not set
  MONGODB_URI: process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    (process.env.MONGOUSER && process.env.MONGOPASSWORD && process.env.MONGOHOST
      ? `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@${process.env.MONGOHOST}:${process.env.MONGOPORT || 27017}`
      : 'mongodb://localhost:27017/amazon_product_hub'),

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
