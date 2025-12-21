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
 * Create database indexes
 * POST /api/create-indexes
 */
exports.createIndexes = async (req, res, next) => {
  try {
    const Product = require('../models/Product');

    // Create all indexes defined in the schema
    await Product.createIndexes();

    res.status(200).json({
      success: true,
      message: 'Indexes created successfully'
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
    const garlicPressProducts = require('../utils/seedGarlicPresses');

    // Skip index creation to avoid disk space issues on Railway free tier
    // Indexes will be created automatically by Mongoose when needed

    // Clear existing products
    const deleteResult = await Product.deleteMany({});

    // Insert all 16 garlic press products
    const insertedProducts = await Product.insertMany(garlicPressProducts);

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully with all garlic press products',
      deleted: deleteResult.deletedCount,
      inserted: insertedProducts.length
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Update product images to Amazon widget URLs
 * POST /api/update-images
 */
exports.updateProductImages = async (req, res, next) => {
  try {
    const Product = require('../models/Product');

    // Generate Amazon widget image URLs
    function generateAmazonImageUrls(asin) {
      const baseUrl = 'https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8';
      return {
        primary: `${baseUrl}&ASIN=${asin}&Format=_SL500_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1`,
        variants: [
          `${baseUrl}&ASIN=${asin}&Format=_SL400_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1`,
          `${baseUrl}&ASIN=${asin}&Format=_SL300_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1`
        ]
      };
    }

    // Get all products
    const products = await Product.find({});
    let updated = 0;

    // Update each product
    for (const product of products) {
      if (product.asin) {
        product.images = generateAmazonImageUrls(product.asin);
        await product.save();
        updated++;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Product images updated successfully',
      updated: updated,
      total: products.length
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Restore original Amazon CDN images from seed data
 * POST /api/restore-images
 */
exports.restoreOriginalImages = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const seedProducts = require('../utils/seedGarlicPresses');

    let updated = 0;
    const dbProducts = await Product.find({});

    for (const dbProduct of dbProducts) {
      const seedProduct = seedProducts.find(sp => sp.asin === dbProduct.asin);

      if (seedProduct && seedProduct.images) {
        dbProduct.images = seedProduct.images;
        await dbProduct.save();
        updated++;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Original Amazon CDN images restored successfully',
      updated: updated,
      total: dbProducts.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update all products with Unsplash images
 * POST /api/update-unsplash-images
 */
exports.updateUnsplashImages = async (req, res, next) => {
  try {
    const Product = require('../models/Product');

    // Curated working Unsplash image URLs
    const kitchenImages = [
      { primary: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80', variants: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80', 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80', variants: ['https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80', variants: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=800&q=80', variants: ['https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=600&q=80', 'https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', variants: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=800&q=80', variants: ['https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=600&q=80', 'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=800&q=80', variants: ['https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=600&q=80', 'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=800&q=80', variants: ['https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=600&q=80', 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?w=800&q=80', variants: ['https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?w=600&q=80', 'https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1556910636-196e58bd14f9?w=800&q=80', variants: ['https://images.unsplash.com/photo-1556910636-196e58bd14f9?w=600&q=80', 'https://images.unsplash.com/photo-1556910636-196e58bd14f9?w=400&q=80'] }
    ];

    const products = await Product.find({});
    let updated = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageSet = kitchenImages[i % kitchenImages.length];
      product.images = imageSet;
      await product.save();
      updated++;
    }

    res.status(200).json({
      success: true,
      message: 'Updated all products with Unsplash images',
      updated: updated,
      total: products.length
    });
  } catch (error) {
    next(error);
  }
};
