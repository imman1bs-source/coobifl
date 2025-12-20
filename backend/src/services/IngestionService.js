/**
 * Product Ingestion Service
 * Handles fetching products from Amazon and storing them in MongoDB
 */

const amazonClient = require('./AmazonClient');
const amazonTransformer = require('./AmazonTransformer');
const productRepository = require('../repositories/ProductRepository');
const amazonConfig = require('../config/amazon');

class IngestionService {
  constructor() {
    this.isRunning = false;
    this.stats = {
      lastSync: null,
      totalFetched: 0,
      totalSaved: 0,
      errors: 0
    };
  }

  /**
   * Get current sync status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      stats: this.stats,
      isConfigured: amazonClient.isConfigured()
    };
  }

  /**
   * Sync products by keyword search
   * @param {String} keywords - Search keywords
   * @param {Object} options - Search options
   */
  async syncByKeywords(keywords, options = {}) {
    if (!amazonClient.isConfigured()) {
      throw new Error('Amazon PA-API is not configured. Please add credentials to .env file');
    }

    console.log(`🔍 Searching Amazon for: "${keywords}"`);

    try {
      // Search Amazon
      const amazonResponse = await amazonClient.searchItems(keywords, options);

      // Transform response
      const products = amazonTransformer.transformSearchResults(amazonResponse);

      console.log(`✅ Found ${products.length} products from Amazon`);

      // Save to database
      const savedCount = await this.saveProducts(products);

      console.log(`💾 Saved ${savedCount} products to database`);

      this.stats.totalFetched += products.length;
      this.stats.totalSaved += savedCount;
      this.stats.lastSync = new Date();

      return {
        success: true,
        fetched: products.length,
        saved: savedCount,
        keywords
      };
    } catch (error) {
      console.error('❌ Error syncing products:', error.message);
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * Sync products by category
   * @param {String} category - Amazon category/search index
   * @param {Object} options - Search options
   */
  async syncByCategory(category, options = {}) {
    if (!amazonClient.isConfigured()) {
      throw new Error('Amazon PA-API is not configured. Please add credentials to .env file');
    }

    console.log(`📁 Syncing category: ${category}`);

    try {
      // Search by category
      const amazonResponse = await amazonClient.searchByCategory(category, options);

      // Transform response
      const products = amazonTransformer.transformSearchResults(amazonResponse);

      console.log(`✅ Found ${products.length} products in ${category}`);

      // Save to database
      const savedCount = await this.saveProducts(products);

      console.log(`💾 Saved ${savedCount} products to database`);

      this.stats.totalFetched += products.length;
      this.stats.totalSaved += savedCount;
      this.stats.lastSync = new Date();

      return {
        success: true,
        fetched: products.length,
        saved: savedCount,
        category
      };
    } catch (error) {
      console.error('❌ Error syncing category:', error.message);
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * Update existing products by ASINs
   * @param {Array} asins - Array of ASINs to update
   */
  async updateByAsins(asins) {
    if (!amazonClient.isConfigured()) {
      throw new Error('Amazon PA-API is not configured. Please add credentials to .env file');
    }

    console.log(`🔄 Updating ${asins.length} products by ASIN`);

    try {
      // Get items from Amazon
      const amazonResponse = await amazonClient.getItems(asins);

      // Transform response
      const products = amazonTransformer.transformGetItemsResults(amazonResponse);

      console.log(`✅ Fetched ${products.length} products from Amazon`);

      // Update in database
      const updatedCount = await this.updateProducts(products);

      console.log(`💾 Updated ${updatedCount} products in database`);

      this.stats.totalFetched += products.length;
      this.stats.totalSaved += updatedCount;
      this.stats.lastSync = new Date();

      return {
        success: true,
        fetched: products.length,
        updated: updatedCount
      };
    } catch (error) {
      console.error('❌ Error updating products:', error.message);
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * Full sync - sync all configured categories
   */
  async fullSync() {
    if (this.isRunning) {
      throw new Error('Sync is already running');
    }

    if (!amazonClient.isConfigured()) {
      throw new Error('Amazon PA-API is not configured. Please add credentials to .env file');
    }

    this.isRunning = true;
    console.log('🚀 Starting full sync...');

    const results = {
      startTime: new Date(),
      categories: [],
      totalFetched: 0,
      totalSaved: 0,
      errors: []
    };

    try {
      // Sync each configured category
      for (const category of amazonConfig.categoriesToSync) {
        try {
          const result = await this.syncByCategory(category, {
            itemCount: 10 // Get 10 items per category
          });

          results.categories.push(result);
          results.totalFetched += result.fetched;
          results.totalSaved += result.saved;

          // Wait between categories to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`❌ Error syncing category ${category}:`, error.message);
          results.errors.push({
            category,
            error: error.message
          });
        }
      }

      results.endTime = new Date();
      results.duration = results.endTime - results.startTime;

      console.log(`✅ Full sync completed in ${results.duration}ms`);
      console.log(`📊 Fetched: ${results.totalFetched}, Saved: ${results.totalSaved}`);

      return results;
    } catch (error) {
      console.error('❌ Full sync failed:', error.message);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Incremental sync - update existing products
   */
  async incrementalSync() {
    if (this.isRunning) {
      throw new Error('Sync is already running');
    }

    if (!amazonClient.isConfigured()) {
      throw new Error('Amazon PA-API is not configured. Please add credentials to .env file');
    }

    this.isRunning = true;
    console.log('🔄 Starting incremental sync...');

    try {
      // Get products from Amazon source that haven't been updated in 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const products = await productRepository.findAll({
        source: 'amazon_pa_api',
        limit: 50, // Limit to 50 products per incremental sync
        sort: 'updatedAt'
      });

      if (products.products.length === 0) {
        console.log('No products to update');
        this.isRunning = false;
        return { success: true, updated: 0 };
      }

      // Extract ASINs
      const asins = products.products.map(p => p.asin).filter(asin => asin);

      // Update products in batches of 10 (Amazon limit)
      let totalUpdated = 0;
      for (let i = 0; i < asins.length; i += 10) {
        const batch = asins.slice(i, i + 10);
        const result = await this.updateByAsins(batch);
        totalUpdated += result.updated;

        // Wait between batches
        if (i + 10 < asins.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      console.log(`✅ Incremental sync completed. Updated ${totalUpdated} products`);

      return {
        success: true,
        updated: totalUpdated
      };
    } catch (error) {
      console.error('❌ Incremental sync failed:', error.message);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Save products to database (bulk upsert)
   * @param {Array} products - Array of products to save
   */
  async saveProducts(products) {
    if (!products || products.length === 0) {
      return 0;
    }

    try {
      const result = await productRepository.bulkUpsert(products);
      return result.upsertedCount + result.modifiedCount;
    } catch (error) {
      console.error('Error saving products:', error);
      throw error;
    }
  }

  /**
   * Update existing products (preserving crowd-sourced data)
   * @param {Array} products - Array of products to update
   */
  async updateProducts(products) {
    if (!products || products.length === 0) {
      return 0;
    }

    let updatedCount = 0;

    for (const product of products) {
      try {
        // Get existing product
        const existing = await productRepository.findByAsin(product.asin);

        if (existing) {
          // Preserve crowd-sourced specifications
          const preservedSpecs = existing.specifications || new Map();
          const newSpecs = product.specifications || new Map();

          // Merge specifications, keeping crowd-sourced values
          const mergedSpecs = new Map([...newSpecs]);
          if (preservedSpecs.get('Country of Origin')) {
            mergedSpecs.set('Country of Origin', preservedSpecs.get('Country of Origin'));
          }
          if (preservedSpecs.get('Materials Used')) {
            mergedSpecs.set('Materials Used', preservedSpecs.get('Materials Used'));
          }
          if (preservedSpecs.get('Sticker Location')) {
            mergedSpecs.set('Sticker Location', preservedSpecs.get('Sticker Location'));
          }
          if (preservedSpecs.get('Manufacturing Notes')) {
            mergedSpecs.set('Manufacturing Notes', preservedSpecs.get('Manufacturing Notes'));
          }

          // Update product with merged data
          const updateData = {
            ...product,
            specifications: mergedSpecs,
            // Preserve crowd-sourced data
            crowdSourced: existing.crowdSourced
          };

          await productRepository.updateByAsin(product.asin, updateData);
          updatedCount++;
        } else {
          // Product doesn't exist, create it
          await productRepository.create(product);
          updatedCount++;
        }
      } catch (error) {
        console.error(`Error updating product ${product.asin}:`, error.message);
      }
    }

    return updatedCount;
  }
}

module.exports = new IngestionService();
