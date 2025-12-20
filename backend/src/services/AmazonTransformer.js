/**
 * Amazon Data Transformer
 * Maps Amazon PA-API response format to our Product schema
 */

class AmazonTransformer {
  /**
   * Transform Amazon SearchItems response to our product format
   * @param {Object} amazonResponse - Response from Amazon PA-API
   * @returns {Array} Array of transformed products
   */
  transformSearchResults(amazonResponse) {
    if (!amazonResponse.SearchResult || !amazonResponse.SearchResult.Items) {
      return [];
    }

    return amazonResponse.SearchResult.Items.map(item =>
      this.transformItem(item)
    ).filter(product => product !== null);
  }

  /**
   * Transform Amazon GetItems response to our product format
   * @param {Object} amazonResponse - Response from Amazon PA-API
   * @returns {Array} Array of transformed products
   */
  transformGetItemsResults(amazonResponse) {
    if (!amazonResponse.ItemsResult || !amazonResponse.ItemsResult.Items) {
      return [];
    }

    return amazonResponse.ItemsResult.Items.map(item =>
      this.transformItem(item)
    ).filter(product => product !== null);
  }

  /**
   * Transform single Amazon item to our product format
   * @param {Object} item - Amazon item object
   * @returns {Object|null} Transformed product or null if invalid
   */
  transformItem(item) {
    try {
      // Extract basic info
      const asin = item.ASIN;
      const title = this.extractTitle(item);
      const description = this.extractDescription(item);

      if (!asin || !title) {
        console.warn('Skipping item without ASIN or title:', item);
        return null;
      }

      // Extract images
      const images = this.extractImages(item);

      // Extract price
      const price = this.extractPrice(item);

      // Extract availability
      const availability = this.extractAvailability(item);

      // Extract brand
      const brand = this.extractBrand(item);

      // Extract category
      const category = this.extractCategory(item);

      // Extract features
      const features = this.extractFeatures(item);

      // Extract specifications
      const specifications = this.extractSpecifications(item);

      // Extract rating
      const rating = this.extractRating(item);

      // Build product object
      const product = {
        asin,
        title,
        description,
        price,
        category,
        subcategory: null, // Amazon doesn't provide subcategory directly
        images,
        rating,
        availability,
        brand,
        features,
        specifications,
        amazonUrl: item.DetailPageURL || `https://www.amazon.com/dp/${asin}`,
        origin: {
          source: 'amazon_pa_api',
          marketplace: 'US',
          importedBy: 'amazon_sync',
          importedAt: new Date()
        }
      };

      return product;
    } catch (error) {
      console.error('Error transforming Amazon item:', error, item);
      return null;
    }
  }

  /**
   * Extract title from item
   */
  extractTitle(item) {
    return item.ItemInfo?.Title?.DisplayValue || '';
  }

  /**
   * Extract description/features from item
   */
  extractDescription(item) {
    const features = item.ItemInfo?.Features?.DisplayValues || [];
    if (features.length > 0) {
      return features.join('. ');
    }
    return this.extractTitle(item);
  }

  /**
   * Extract images from item
   */
  extractImages(item) {
    const images = {
      primary: null,
      variants: []
    };

    // Primary image
    if (item.Images?.Primary?.Large?.URL) {
      images.primary = item.Images.Primary.Large.URL;
    } else if (item.Images?.Primary?.Medium?.URL) {
      images.primary = item.Images.Primary.Medium.URL;
    }

    // Variant images
    if (item.Images?.Variants && Array.isArray(item.Images.Variants)) {
      images.variants = item.Images.Variants
        .map(variant => variant.Large?.URL || variant.Medium?.URL)
        .filter(url => url);
    }

    return images;
  }

  /**
   * Extract price information
   */
  extractPrice(item) {
    const price = {
      amount: 0,
      currency: 'USD',
      displayPrice: 'Price not available'
    };

    // Try to get price from various locations
    const listing = item.Offers?.Listings?.[0];
    if (listing?.Price) {
      price.amount = listing.Price.Amount || 0;
      price.currency = listing.Price.Currency || 'USD';
      price.displayPrice = listing.Price.DisplayAmount || `$${price.amount}`;
    } else if (item.ItemInfo?.ManufactureInfo?.Warranty) {
      // Sometimes price info is in different location
      price.displayPrice = 'See Amazon for price';
    }

    return price;
  }

  /**
   * Extract availability information
   */
  extractAvailability(item) {
    const availability = {
      status: 'unknown',
      message: 'Check Amazon for availability'
    };

    const listing = item.Offers?.Listings?.[0];
    if (listing?.Availability) {
      const availMessage = listing.Availability.Message || '';
      const availType = listing.Availability.Type || '';

      availability.message = availMessage;

      // Determine status from message/type
      if (availType === 'Now' || availMessage.toLowerCase().includes('in stock')) {
        availability.status = 'in_stock';
      } else if (availMessage.toLowerCase().includes('out of stock')) {
        availability.status = 'out_of_stock';
      } else if (availMessage.toLowerCase().includes('pre-order')) {
        availability.status = 'pre_order';
      }
    }

    return availability;
  }

  /**
   * Extract brand information
   */
  extractBrand(item) {
    return (
      item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue ||
      item.ItemInfo?.ByLineInfo?.Manufacturer?.DisplayValue ||
      'Unknown'
    );
  }

  /**
   * Extract category information
   */
  extractCategory(item) {
    // Amazon provides BrowseNodeInfo for categories
    if (item.BrowseNodeInfo?.BrowseNodes && item.BrowseNodeInfo.BrowseNodes.length > 0) {
      return item.BrowseNodeInfo.BrowseNodes[0].DisplayName;
    }

    // Fallback to classification
    if (item.ItemInfo?.Classifications?.ProductGroup?.DisplayValue) {
      return item.ItemInfo.Classifications.ProductGroup.DisplayValue;
    }

    return 'General';
  }

  /**
   * Extract features list
   */
  extractFeatures(item) {
    if (item.ItemInfo?.Features?.DisplayValues) {
      return item.ItemInfo.Features.DisplayValues;
    }
    return [];
  }

  /**
   * Extract technical specifications
   */
  extractSpecifications(item) {
    const specs = new Map();

    // Technical info
    if (item.ItemInfo?.TechnicalInfo) {
      const techInfo = item.ItemInfo.TechnicalInfo;

      if (techInfo.Formats?.DisplayValues) {
        specs.set('Format', techInfo.Formats.DisplayValues.join(', '));
      }

      if (techInfo.EnergyEfficiencyClass?.DisplayValue) {
        specs.set('Energy Efficiency', techInfo.EnergyEfficiencyClass.DisplayValue);
      }
    }

    // Product info
    if (item.ItemInfo?.ProductInfo) {
      const productInfo = item.ItemInfo.ProductInfo;

      if (productInfo.Color?.DisplayValue) {
        specs.set('Color', productInfo.Color.DisplayValue);
      }

      if (productInfo.Size?.DisplayValue) {
        specs.set('Size', productInfo.Size.DisplayValue);
      }

      if (productInfo.ItemDimensions) {
        const dims = productInfo.ItemDimensions;
        if (dims.Height && dims.Width && dims.Length) {
          specs.set(
            'Dimensions',
            `${dims.Length.DisplayValue} x ${dims.Width.DisplayValue} x ${dims.Height.DisplayValue}`
          );
        }
        if (dims.Weight?.DisplayValue) {
          specs.set('Weight', dims.Weight.DisplayValue);
        }
      }
    }

    // Manufacture info
    if (item.ItemInfo?.ManufactureInfo) {
      const mfgInfo = item.ItemInfo.ManufactureInfo;

      if (mfgInfo.ItemPartNumber?.DisplayValue) {
        specs.set('Part Number', mfgInfo.ItemPartNumber.DisplayValue);
      }

      if (mfgInfo.Model?.DisplayValue) {
        specs.set('Model', mfgInfo.Model.DisplayValue);
      }

      if (mfgInfo.Warranty?.DisplayValue) {
        specs.set('Warranty', mfgInfo.Warranty.DisplayValue);
      }
    }

    // Note: Country of Origin is rarely provided by Amazon PA-API
    // We'll leave this blank for community contribution
    specs.set('Country of Origin', '');
    specs.set('Materials Used', '');
    specs.set('Sticker Location', '');
    specs.set('Manufacturing Notes', '');

    return specs;
  }

  /**
   * Extract rating information
   */
  extractRating(item) {
    const rating = {
      average: 0,
      count: 0
    };

    if (item.CustomerReviews) {
      const reviews = item.CustomerReviews;

      if (reviews.StarRating?.Value) {
        rating.average = parseFloat(reviews.StarRating.Value) || 0;
      }

      if (reviews.Count) {
        rating.count = parseInt(reviews.Count, 10) || 0;
      }
    }

    return rating;
  }

  /**
   * Validate transformed product
   * @param {Object} product - Transformed product
   * @returns {Boolean} Is valid
   */
  isValidProduct(product) {
    return !!(
      product &&
      product.asin &&
      product.title &&
      product.price &&
      product.category
    );
  }
}

module.exports = new AmazonTransformer();
