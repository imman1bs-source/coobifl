const { getJson } = require('serpapi');

/**
 * Walmart Product Fetcher using SerpAPI
 * Fetches product data from Walmart including reviews for COO extraction
 */

class WalmartFetcher {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Search Walmart products by query
   * @param {string} query - Search query (e.g., "garlic press")
   * @param {number} page - Page number (default: 1)
   * @param {string} sort - Sort order: 'best_seller', 'best_match', 'price_low', 'price_high', 'rating_high'
   * @returns {Promise<Array>} Array of product objects
   */
  async searchProducts(query, page = 1, sort = 'best_seller') {
    try {
      const params = {
        engine: 'walmart',
        query: query,
        page: page,
        sort_by: sort,
        api_key: this.apiKey
      };

      const response = await getJson(params);

      if (!response.organic_results) {
        return [];
      }

      // Filter and sort by review count to get most reviewed products
      let products = response.organic_results.map(product => this.transformProduct(product));

      // Sort by review count (most reviewed first)
      products.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));

      return products;
    } catch (error) {
      console.error('Error fetching Walmart products:', error);
      throw error;
    }
  }

  /**
   * Get product details including reviews
   * @param {string} productId - Walmart product ID
   * @returns {Promise<Object>} Product details with reviews
   */
  async getProductDetails(productId) {
    try {
      const params = {
        engine: 'walmart_product',
        product_id: productId,
        api_key: this.apiKey
      };

      const response = await getJson(params);
      return response;
    } catch (error) {
      console.error('Error fetching Walmart product details:', error);
      throw error;
    }
  }

  /**
   * Get product reviews
   * @param {string} productId - Walmart product ID
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Array>} Array of reviews
   */
  async getProductReviews(productId, page = 1) {
    try {
      const params = {
        engine: 'walmart_product_reviews',
        product_id: productId,
        page: page,
        api_key: this.apiKey
      };

      const response = await getJson(params);
      return response.reviews || [];
    } catch (error) {
      console.error('Error fetching Walmart product reviews:', error);
      throw error;
    }
  }

  /**
   * Transform SerpAPI product to our schema format
   * @param {Object} product - SerpAPI product object
   * @returns {Object} Transformed product object
   */
  transformProduct(product) {
    return {
      // Use Walmart product ID as ASIN equivalent
      asin: product.product_id || product.us_item_id || '',
      title: product.title || '',
      brand: this.extractBrand(product.title),
      description: product.description || '',

      price: {
        amount: product.primary_offer?.offer_price || product.price || 0,
        currency: 'USD',
        displayPrice: product.primary_offer?.offer_price
          ? `$${product.primary_offer.offer_price}`
          : product.price
            ? `$${product.price}`
            : '$0.00'
      },

      images: {
        primary: product.thumbnail || product.image || '',
        gallery: product.images || []
      },

      rating: {
        average: product.rating || 0,
        count: product.reviews || product.reviews_count || product.rating_count || 0
      },

      availability: {
        inStock: product.stock_status === 'in_stock' || product.delivery_option !== 'out_of_stock',
        message: product.stock_status || 'Available'
      },

      specifications: {
        'Brand': this.extractBrand(product.title),
        'Model': product.model_number || '',
        'UPC': product.upc || '',
        // COO will be extracted from reviews later
      },

      affiliateLink: product.link || product.product_page_url || '',
      source: 'walmart',

      metadata: {
        walmartId: product.product_id || product.us_item_id,
        seller: product.seller_name || 'Walmart',
        fulfillment: product.fulfillment_type || 'standard'
      }
    };
  }

  /**
   * Extract brand from product title
   * @param {string} title - Product title
   * @returns {string} Extracted brand name
   */
  extractBrand(title) {
    if (!title) return '';

    // Common brand patterns
    const brands = [
      'OXO', 'Joseph Joseph', 'Kuhn Rikon', 'Zyliss', 'Alpha Grillers',
      'Dreamfarm', 'Orblue', 'ORBLUE', 'Norpro', 'Cuisinart', 'KitchenAid',
      'Prepara', 'ROSLE', 'Rösle', 'E-Jen', 'Trudeau', 'Adoric', 'Zulay'
    ];

    for (const brand of brands) {
      if (title.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }

    // If no known brand found, try to extract first word
    const firstWord = title.split(' ')[0];
    return firstWord || '';
  }
}

module.exports = WalmartFetcher;
