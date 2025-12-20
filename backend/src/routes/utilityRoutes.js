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

// Create database indexes
router.post('/create-indexes', productController.createIndexes);

// Seed database with garlic press products
router.post('/seed', productController.seedDatabase);

// Update product images to Amazon widget URLs
router.post('/update-images', productController.updateProductImages);

module.exports = router;
