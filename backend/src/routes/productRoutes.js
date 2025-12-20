/**
 * Product Routes
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateCreateProduct, validateUpdateProduct } = require('../middleware/validators');
const { submissionLimiter, voteLimiter, reportLimiter } = require('../middleware/rateLimiter');

// Public routes

// Get all products (with filters and pagination)
router.get('/', productController.getAllProducts);

// Search products
router.get('/search', productController.searchProducts);

// Get pending products (admin)
router.get('/pending', productController.getPendingProducts);

// Get product by ASIN
router.get('/asin/:asin', productController.getProductByAsin);

// Get single product by ID (must be after /pending and /search)
router.get('/:id', productController.getProductById);

// Get similar products
router.get('/:id/similar', productController.getSimilarProducts);

// Create new product (crowd-sourcing)
router.post('/', submissionLimiter, validateCreateProduct, productController.createProduct);

// Update product
router.put('/:id', validateUpdateProduct, productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

// Vote on product
router.post('/:id/upvote', voteLimiter, productController.upvoteProduct);
router.post('/:id/downvote', voteLimiter, productController.downvoteProduct);

// Report product
router.post('/:id/report', reportLimiter, productController.reportProduct);

// Verify product (admin)
router.post('/:id/verify', productController.verifyProduct);

module.exports = router;
