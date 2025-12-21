/**
 * Utility Routes
 * For categories, brands, stats, etc.
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all categories
router.get('/categories', productController.getCategories);

// Get all brands
router.get('/brands', productController.getBrands);

// Get database statistics
router.get('/stats', productController.getStats);

// Check environment variables (temporary debug endpoint)
router.get('/env-check', (req, res) => {
  // Get all env var keys that might be relevant
  const allKeys = Object.keys(process.env);
  const relevantKeys = allKeys.filter(key =>
    key.includes('SERP') ||
    key.includes('API') ||
    key.includes('KEY') ||
    key.includes('MONGO') ||
    key === 'NODE_ENV'
  );

  res.json({
    hasSerpApiKey: !!process.env.SERPAPI_KEY,
    serpApiKeyLength: process.env.SERPAPI_KEY ? process.env.SERPAPI_KEY.length : 0,
    serpApiKeyFirst10: process.env.SERPAPI_KEY ? process.env.SERPAPI_KEY.substring(0, 10) + '...' : null,
    nodeEnv: process.env.NODE_ENV,
    envVarsCount: allKeys.length,
    relevantEnvVars: relevantKeys
  });
});

// Create database indexes
router.post('/create-indexes', productController.createIndexes);

// Seed database with garlic press products
router.post('/seed', productController.seedDatabase);

// Seed database with Walmart products (with COO extraction)
router.post('/seed-walmart', productController.seedWalmartProducts);

// Update product images to Amazon widget URLs
router.post('/update-images', productController.updateProductImages);

// Restore original Amazon CDN images from seed data
router.post('/restore-images', productController.restoreOriginalImages);

// Update all products with Unsplash images
router.post('/update-unsplash-images', productController.updateUnsplashImages);

// Update all products with working placeholder images
router.post('/update-placeholder-images', productController.updatePlaceholderImages);

module.exports = router;

// Update all products with local image paths
router.post('/update-local-images', productController.updateLocalImages);


// Update all products with ASIN-based local images
router.post('/update-asin-images', productController.updateAsinImages);

