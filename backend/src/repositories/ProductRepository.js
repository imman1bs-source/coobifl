/**
 * ProductRepository
 * Data access layer for Product operations
 */

const Product = require('../models/Product');

class ProductRepository {
  /**
   * Find all products with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Products and pagination info
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 36,
      sort = '-createdAt',
      category,
      minPrice,
      maxPrice,
      verified,
      source,
      country
    } = options;

    const query = {};

    // Apply filters
    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseFloat(maxPrice);
    }

    if (verified !== undefined) {
      query['crowdSourced.isVerified'] = verified;
    }

    if (source) {
      query['origin.source'] = source;
    }

    if (country) {
      query['specifications.Country of Origin'] = country;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Find product by ID
   * @param {String} id - Product ID
   * @returns {Promise<Object>} Product
   */
  async findById(id) {
    return await Product.findById(id).lean();
  }

  /**
   * Find product by ASIN
   * @param {String} asin - Amazon ASIN
   * @returns {Promise<Object>} Product
   */
  async findByAsin(asin) {
    return await Product.findOne({ asin }).lean();
  }

  /**
   * Search products by text
   * @param {String} query - Search query
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Search results
   */
  async search(query, options = {}) {
    const {
      page = 1,
      limit = 36,
      category,
      minPrice,
      maxPrice,
      country
    } = options;

    // Use regex search instead of text index (fallback for disk space issues)
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } }
      ]
    };

    // Apply additional filters
    if (category) {
      searchQuery.category = category;
    }

    if (minPrice || maxPrice) {
      searchQuery['price.amount'] = {};
      if (minPrice) searchQuery['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) searchQuery['price.amount'].$lte = parseFloat(maxPrice);
    }

    if (country) {
      searchQuery['specifications.Country of Origin'] = country;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(searchQuery)
        .sort({ 'rating.average': -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(searchQuery)
    ]);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  /**
   * Update product by ASIN
   * @param {String} asin - Amazon ASIN
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated product
   */
  async updateByAsin(asin, updateData) {
    return await Product.findOneAndUpdate(
      { asin },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Update product by ID
   * @param {String} id - Product ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated product
   */
  async updateById(id, updateData) {
    return await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete product by ID
   * @param {String} id - Product ID
   * @returns {Promise<Object>} Deleted product
   */
  async deleteById(id) {
    return await Product.findByIdAndDelete(id);
  }

  /**
   * Bulk upsert products (insert or update)
   * @param {Array} products - Array of product data
   * @returns {Promise<Object>} Bulk write result
   */
  async bulkUpsert(products) {
    const operations = products.map(product => ({
      updateOne: {
        filter: { asin: product.asin },
        update: { $set: product },
        upsert: true
      }
    }));

    return await Product.bulkWrite(operations);
  }

  /**
   * Get distinct categories
   * @returns {Promise<Array>} List of categories
   */
  async getCategories() {
    return await Product.distinct('category');
  }

  /**
   * Get distinct brands
   * @returns {Promise<Array>} List of brands
   */
  async getBrands() {
    return await Product.distinct('brand');
  }

  /**
   * Upvote a product
   * @param {String} id - Product ID
   * @returns {Promise<Object>} Updated product
   */
  async upvote(id) {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { 'crowdSourced.upvotes': 1 } },
      { new: true }
    ).select('crowdSourced.upvotes crowdSourced.downvotes');
  }

  /**
   * Downvote a product
   * @param {String} id - Product ID
   * @returns {Promise<Object>} Updated product
   */
  async downvote(id) {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { 'crowdSourced.downvotes': 1 } },
      { new: true }
    ).select('crowdSourced.upvotes crowdSourced.downvotes');
  }

  /**
   * Report a product
   * @param {String} id - Product ID
   * @param {Object} reportData - Report information
   * @returns {Promise<Object>} Updated product
   */
  async report(id, reportData) {
    return await Product.findByIdAndUpdate(
      id,
      {
        $inc: { 'crowdSourced.reportCount': 1 },
        $push: {
          'crowdSourced.reports': {
            reportedBy: reportData.reportedBy,
            reason: reportData.reason,
            description: reportData.description,
            reportedAt: new Date()
          }
        }
      },
      { new: true }
    );
  }

  /**
   * Verify a product (admin)
   * @param {String} id - Product ID
   * @param {String} adminId - Admin user ID
   * @returns {Promise<Object>} Updated product
   */
  async verify(id, adminId) {
    return await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          'crowdSourced.isVerified': true,
          'crowdSourced.verifiedBy': adminId,
          'crowdSourced.verifiedAt': new Date()
        }
      },
      { new: true }
    );
  }

  /**
   * Get pending (unverified) products
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Pending products
   */
  async getPending(options = {}) {
    const { page = 1, limit = 36 } = options;
    const skip = (page - 1) * limit;

    const query = {
      'origin.source': 'crowd_sourced',
      'crowdSourced.isVerified': false
    };

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get statistics
   * @returns {Promise<Object>} Database statistics
   */
  async getStats() {
    const [
      total,
      amazonProducts,
      crowdSourcedProducts,
      verifiedProducts,
      pendingProducts,
      categories,
      brands
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ 'origin.source': 'amazon_pa_api' }),
      Product.countDocuments({ 'origin.source': 'crowd_sourced' }),
      Product.countDocuments({ 'crowdSourced.isVerified': true }),
      Product.countDocuments({
        'origin.source': 'crowd_sourced',
        'crowdSourced.isVerified': false
      }),
      Product.distinct('category'),
      Product.distinct('brand')
    ]);

    const avgPrice = await Product.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price.amount' } } }
    ]);

    return {
      total,
      bySource: {
        amazon: amazonProducts,
        crowdSourced: crowdSourcedProducts
      },
      verification: {
        verified: verifiedProducts,
        pending: pendingProducts
      },
      categories: categories.length,
      brands: brands.length,
      averagePrice: avgPrice[0]?.avgPrice || 0
    };
  }
}

module.exports = new ProductRepository();
