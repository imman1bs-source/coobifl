/**
 * Frontend Routes
 */

const express = require('express');
const router = express.Router();

// Homepage
router.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Home - Coobifl'
  });
});

// Search page
router.get('/search', (req, res) => {
  const { q, page } = req.query;
  res.render('pages/search', {
    title: q ? `Search Results for "${q}"` : 'All Products',
    query: q || '',
    page: page || 1
  });
});

// Product details page
router.get('/products/:id', (req, res) => {
  res.render('pages/product', {
    title: 'Product Details',
    productId: req.params.id
  });
});

// Add product page
router.get('/add-product', (req, res) => {
  res.render('pages/add-product', {
    title: 'Add Product - Coobifl'
  });
});

// Admin dashboard
router.get('/admin', (req, res) => {
  res.render('pages/admin', {
    title: 'Admin Dashboard - Coobifl'
  });
});

// Privacy Policy
router.get('/privacy', (req, res) => {
  res.render('pages/privacy', {
    title: 'Privacy Policy - Coobifl'
  });
});

// Terms of Service
router.get('/terms', (req, res) => {
  res.render('pages/terms', {
    title: 'Terms of Service - Coobifl'
  });
});

module.exports = router;
