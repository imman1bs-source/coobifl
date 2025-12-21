/**
 * Country of Origin (COO) Extractor
 * Extracts COO information from product reviews, descriptions, and specifications
 */

class COOExtractor {
  constructor() {
    // Common country patterns in reviews
    this.countryPatterns = [
      // Explicit mentions
      /made in ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /manufactured in ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /produced in ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /country of origin[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /ships from ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /from ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*) factory/gi,

      // Common variations
      /Product of ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /imported from ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /sourced from ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    ];

    // Valid country names (common ones)
    this.validCountries = new Set([
      'China', 'USA', 'United States', 'Germany', 'Japan', 'Switzerland',
      'India', 'Vietnam', 'Taiwan', 'South Korea', 'Mexico', 'Canada',
      'Italy', 'France', 'United Kingdom', 'UK', 'Australia', 'Spain',
      'Thailand', 'Indonesia', 'Malaysia', 'Philippines', 'Brazil',
      'Turkey', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Portugal'
    ]);

    // Country normalization map
    this.countryNormalization = {
      'United States': 'USA',
      'United Kingdom': 'UK',
      'South Korea': 'Korea',
      'PRC': 'China',
      'ROC': 'Taiwan',
      'Peoples Republic of China': 'China',
      'Republic of China': 'Taiwan'
    };
  }

  /**
   * Extract COO from multiple sources
   * @param {Object} options - { reviews, description, specifications }
   * @returns {Object} { country, confidence, source }
   */
  extractCOO({ reviews = [], description = '', specifications = {} }) {
    const results = [];

    // 1. Check specifications first (highest confidence)
    const specCOO = this.extractFromSpecifications(specifications);
    if (specCOO) {
      results.push({ country: specCOO, confidence: 0.95, source: 'specifications' });
    }

    // 2. Check product description
    const descCOO = this.extractFromText(description);
    if (descCOO.country) {
      results.push({ ...descCOO, source: 'description' });
    }

    // 3. Check reviews (aggregate multiple mentions)
    const reviewCOO = this.extractFromReviews(reviews);
    if (reviewCOO.country) {
      results.push({ ...reviewCOO, source: 'reviews' });
    }

    // Return highest confidence result
    if (results.length === 0) {
      return { country: null, confidence: 0, source: null };
    }

    results.sort((a, b) => b.confidence - a.confidence);
    return results[0];
  }

  /**
   * Extract COO from product specifications
   * @param {Object} specifications - Product specifications object
   * @returns {string|null} Country name or null
   */
  extractFromSpecifications(specifications) {
    const cooKeys = [
      'Country of Origin',
      'countryOfOrigin',
      'country_of_origin',
      'Made In',
      'made_in',
      'origin',
      'Origin'
    ];

    for (const key of cooKeys) {
      if (specifications[key]) {
        const country = this.normalizeCountry(specifications[key]);
        if (this.isValidCountry(country)) {
          return country;
        }
      }
    }

    return null;
  }

  /**
   * Extract COO from text using regex patterns
   * @param {string} text - Text to analyze
   * @returns {Object} { country, confidence }
   */
  extractFromText(text) {
    if (!text) {
      return { country: null, confidence: 0 };
    }

    const mentions = new Map();

    for (const pattern of this.countryPatterns) {
      const matches = text.matchAll(pattern);

      for (const match of matches) {
        const country = this.normalizeCountry(match[1]);

        if (this.isValidCountry(country)) {
          mentions.set(country, (mentions.get(country) || 0) + 1);
        }
      }
    }

    if (mentions.size === 0) {
      return { country: null, confidence: 0 };
    }

    // Get most mentioned country
    const sortedMentions = Array.from(mentions.entries())
      .sort((a, b) => b[1] - a[1]);

    const [country, count] = sortedMentions[0];

    // Confidence based on number of mentions
    const confidence = Math.min(0.9, 0.5 + (count * 0.1));

    return { country, confidence };
  }

  /**
   * Extract COO from reviews (aggregate multiple reviews)
   * @param {Array} reviews - Array of review objects
   * @returns {Object} { country, confidence }
   */
  extractFromReviews(reviews) {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return { country: null, confidence: 0 };
    }

    const mentions = new Map();
    let totalReviews = 0;

    for (const review of reviews) {
      totalReviews++;

      // Check review title and body
      const text = `${review.title || ''} ${review.text || review.body || review.review || ''}`;
      const result = this.extractFromText(text);

      if (result.country) {
        mentions.set(result.country, (mentions.get(result.country) || 0) + 1);
      }
    }

    if (mentions.size === 0) {
      return { country: null, confidence: 0 };
    }

    // Get most mentioned country
    const sortedMentions = Array.from(mentions.entries())
      .sort((a, b) => b[1] - a[1]);

    const [country, count] = sortedMentions[0];

    // Confidence based on percentage of reviews mentioning it
    const percentage = count / Math.min(totalReviews, 100);
    const confidence = Math.min(0.85, 0.3 + (percentage * 0.55));

    return { country, confidence };
  }

  /**
   * Normalize country name
   * @param {string} country - Country name to normalize
   * @returns {string} Normalized country name
   */
  normalizeCountry(country) {
    if (!country) return '';

    let normalized = country.trim();

    // Apply normalization map
    if (this.countryNormalization[normalized]) {
      normalized = this.countryNormalization[normalized];
    }

    return normalized;
  }

  /**
   * Check if country name is valid
   * @param {string} country - Country name to validate
   * @returns {boolean} True if valid
   */
  isValidCountry(country) {
    if (!country) return false;
    return this.validCountries.has(country);
  }

  /**
   * Extract COO from multiple products in batch
   * @param {Array} products - Array of product objects with reviews
   * @returns {Array} Array of products with COO added
   */
  async batchExtract(products) {
    return products.map(product => {
      const cooResult = this.extractCOO({
        reviews: product.reviews || [],
        description: product.description || '',
        specifications: product.specifications || {}
      });

      // Add COO to specifications if found with good confidence
      if (cooResult.country && cooResult.confidence > 0.5) {
        product.specifications = product.specifications || {};
        product.specifications['Country of Origin'] = cooResult.country;
        product.cooMetadata = {
          confidence: cooResult.confidence,
          source: cooResult.source
        };
      }

      return product;
    });
  }
}

module.exports = COOExtractor;
