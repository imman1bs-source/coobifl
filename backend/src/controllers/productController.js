/**
 * Product Controller
 * Handles all product-related HTTP requests
 */

const productRepository = require('../repositories/ProductRepository');
const { validationResult } = require('express-validator');

/**
 * Get all products with pagination and filters
 * GET /api/products
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, sort, category, minPrice, maxPrice, verified, source, country } = req.query;

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 36,
      sort: sort || '-createdAt',
      category,
      minPrice,
      maxPrice,
      verified: verified !== undefined ? verified === 'true' : undefined,
      source,
      country
    };

    const result = await productRepository.findAll(options);

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search products by text
 * GET /api/products/search
 */
exports.searchProducts = async (req, res, next) => {
  try {
    const { q, page, limit, category, minPrice, maxPrice, country } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 36,
      category,
      minPrice,
      maxPrice,
      country
    };

    const result = await productRepository.search(q, options);

    res.status(200).json({
      success: true,
      query: q,
      data: result.products,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productRepository.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get similar products by category and rating
 * GET /api/products/:id/similar
 */
exports.getSimilarProducts = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productRepository.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Find similar products by category and rating (within ±0.5 range)
    const Product = require('../models/Product');
    const ratingAvg = product.rating?.average || 0;
    const ratingMin = Math.max(0, ratingAvg - 0.5);
    const ratingMax = Math.min(5, ratingAvg + 0.5);

    const similarProducts = await Product.find({
      category: product.category,
      'rating.average': { $gte: ratingMin, $lte: ratingMax },
      _id: { $ne: id }
    })
    .limit(5)
    .sort('-rating.average')
    .lean();

    res.status(200).json({
      success: true,
      data: similarProducts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ASIN
 * GET /api/products/asin/:asin
 */
exports.getProductByAsin = async (req, res, next) => {
  try {
    const { asin } = req.params;

    const product = await productRepository.findByAsin(asin);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product (crowd-sourcing)
 * POST /api/products
 */
exports.createProduct = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Set origin and crowd-sourcing metadata
    const productData = {
      ...req.body,
      origin: {
        source: 'crowd_sourced',
        marketplace: req.body.marketplace || 'US',
        importedBy: req.body.submittedBy?.username || 'anonymous',
        importedAt: new Date()
      },
      crowdSourced: {
        isVerified: false,
        submittedBy: {
          userId: req.body.submittedBy?.userId || 'anonymous',
          username: req.body.submittedBy?.username || 'anonymous',
          email: req.body.submittedBy?.email || ''
        },
        upvotes: 0,
        downvotes: 0,
        reportCount: 0,
        reports: []
      }
    };

    const product = await productRepository.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully. Awaiting verification.',
      data: product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Product with this ASIN already exists'
      });
    }
    next(error);
  }
};

/**
 * Update product
 * PUT /api/products/:id
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const product = await productRepository.updateById(id, req.body);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 * DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productRepository.deleteById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upvote product
 * POST /api/products/:id/upvote
 */
exports.upvoteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productRepository.upvote(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product upvoted successfully',
      data: {
        upvotes: product.crowdSourced.upvotes,
        downvotes: product.crowdSourced.downvotes
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Downvote product
 * POST /api/products/:id/downvote
 */
exports.downvoteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productRepository.downvote(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product downvoted successfully',
      data: {
        upvotes: product.crowdSourced.upvotes,
        downvotes: product.crowdSourced.downvotes
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Report product
 * POST /api/products/:id/report
 */
exports.reportProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, description, reportedBy } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Report reason is required'
      });
    }

    const reportData = {
      reportedBy: reportedBy || 'anonymous',
      reason,
      description: description || ''
    };

    const product = await productRepository.report(id, reportData);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product reported successfully',
      data: {
        reportCount: product.crowdSourced.reportCount
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify product (admin)
 * POST /api/products/:id/verify
 */
exports.verifyProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;

    const product = await productRepository.verify(id, adminId || 'admin');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product verified successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pending products (admin)
 * GET /api/products/pending
 */
exports.getPendingProducts = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 36
    };

    const result = await productRepository.getPending(options);

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get categories
 * GET /api/categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await productRepository.getCategories();

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get brands
 * GET /api/brands
 */
exports.getBrands = async (req, res, next) => {
  try {
    const brands = await productRepository.getBrands();

    res.status(200).json({
      success: true,
      data: brands
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get database statistics
 * GET /api/stats
 */
exports.getStats = async (req, res, next) => {
  try {
    const stats = await productRepository.getStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Seed database with garlic press products
 * POST /api/seed
 */
exports.seedDatabase = async (req, res, next) => {
  try {
    const Product = require('../models/Product');

    // Garlic press products data
    const garlicPressProducts = [
      {
        asin: 'B0001WVH3I',
        title: 'Joseph Joseph Rocker Garlic Crusher - Stainless Steel',
        description: 'The Joseph Joseph Rocker garlic crusher features a unique rocking motion that makes crushing garlic cloves quick and easy. Made from high-quality stainless steel with a comfortable ergonomic design. Simply rock back and forth over peeled garlic cloves to crush them efficiently.',
        price: { amount: 14.99, currency: 'USD', displayPrice: '$14.99' },
        category: 'Home & Kitchen',
        subcategory: 'Garlic Presses',
        images: {
          primary: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
          variants: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop']
        },
        rating: { average: 4.5, count: 3247 },
        availability: { status: 'in_stock', message: 'In Stock' },
        brand: 'Joseph Joseph',
        features: [
          'Unique rocking motion for easy crushing',
          'Stainless steel construction',
          'Ergonomic design',
          'Dishwasher safe',
          'No need to touch garlic'
        ],
        specifications: new Map([
          ['Material', 'Stainless Steel'],
          ['Dimensions', '5.5 x 2.4 x 1.2 inches'],
          ['Weight', '4.8 ounces'],
          ['Dishwasher Safe', 'Yes'],
          ['Country of Origin', 'China'],
          ['Materials Used', 'Stainless Steel 18/10, Food-grade plastic handle'],
          ['Sticker Location', 'Bottom of handle grip'],
          ['Manufacturing Notes', 'Quality tested, BPA-free materials']
        ]),
        amazonUrl: 'https://www.amazon.com/dp/B0001WVH3I',
        origin: {
          source: 'amazon_pa_api',
          marketplace: 'US',
          importedBy: 'seed_script',
          importedAt: new Date()
        }
      },
      {
        asin: 'B00HHLNRVE',
        title: 'Alpha Grillers Garlic Press - Stainless Steel Garlic Mincer & Crusher',
        description: 'Heavy duty stainless steel garlic press with comfortable non-slip handles. Large chamber fits multiple cloves at once. Easy to clean with included cleaning brush. Built to last with premium materials and solid construction.',
        price: { amount: 18.97, currency: 'USD', displayPrice: '$18.97' },
        category: 'Home & Kitchen',
        subcategory: 'Garlic Presses',
        images: {
          primary: 'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=400&h=400&fit=crop',
          variants: ['https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=400&h=400&fit=crop']
        },
        rating: { average: 4.7, count: 12589 },
        availability: { status: 'in_stock', message: 'In Stock' },
        brand: 'Alpha Grillers',
        features: [
          'Heavy duty stainless steel',
          'Non-slip handles',
          'Large garlic chamber',
          'Dishwasher safe',
          'Includes cleaning brush',
          'Lifetime warranty'
        ],
        specifications: new Map([
          ['Material', '304 Stainless Steel'],
          ['Dimensions', '7.5 x 2.5 x 1.5 inches'],
          ['Weight', '7.2 ounces'],
          ['Warranty', 'Lifetime'],
          ['Country of Origin', 'China'],
          ['Materials Used', '304 Stainless Steel, Non-slip silicone grip'],
          ['Sticker Location', 'Inside handle near hinge'],
          ['Manufacturing Notes', 'Heavy-duty construction, FDA approved materials']
        ]),
        amazonUrl: 'https://www.amazon.com/dp/B00HHLNRVE',
        origin: {
          source: 'amazon_pa_api',
          marketplace: 'US',
          importedBy: 'seed_script',
          importedAt: new Date()
        }
      }
      // Add more products as needed - keeping it short for initial seed
    ];

    // Clear existing products
    const deleteResult = await Product.deleteMany({});

    // Insert new products
    const insertedProducts = await Product.insertMany(garlicPressProducts);

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      deleted: deleteResult.deletedCount,
      inserted: insertedProducts.length
    });
  } catch (error) {
    next(error);
  }
};
