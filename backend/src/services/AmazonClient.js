/**
 * Amazon Product Advertising API Client
 * Implements AWS Signature Version 4 signing
 */

const crypto = require('crypto');
const axios = require('axios');
const amazonConfig = require('../config/amazon');

class AmazonClient {
  constructor() {
    this.accessKey = amazonConfig.accessKey;
    this.secretKey = amazonConfig.secretKey;
    this.partnerTag = amazonConfig.partnerTag;
    this.region = amazonConfig.region;
    this.marketplace = amazonConfig.marketplace;
    this.endpoint = amazonConfig.endpoints[this.region];
    this.service = 'ProductAdvertisingAPI';
    this.requestsPerSecond = amazonConfig.requestsPerSecond;
    this.lastRequestTime = 0;
  }

  /**
   * Check if API credentials are configured
   */
  isConfigured() {
    return !!(this.accessKey && this.secretKey && this.partnerTag);
  }

  /**
   * Rate limiting - ensure we don't exceed API limits
   */
  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 1000 / this.requestsPerSecond;

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Generate AWS Signature V4
   */
  generateSignature(method, uri, headers, payload, timestamp) {
    const dateStamp = timestamp.substring(0, 8);

    // Task 1: Create canonical request
    const canonicalUri = uri;
    const canonicalQuerystring = '';
    const canonicalHeaders = Object.keys(headers)
      .sort()
      .map(key => `${key.toLowerCase()}:${headers[key]}\n`)
      .join('');
    const signedHeaders = Object.keys(headers)
      .sort()
      .map(key => key.toLowerCase())
      .join(';');

    const payloadHash = crypto
      .createHash('sha256')
      .update(payload)
      .digest('hex');

    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQuerystring,
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n');

    // Task 2: Create string to sign
    const credentialScope = `${dateStamp}/${this.region}/${this.service}/aws4_request`;
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      timestamp,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    // Task 3: Calculate signature
    const kDate = crypto
      .createHmac('sha256', `AWS4${this.secretKey}`)
      .update(dateStamp)
      .digest();
    const kRegion = crypto
      .createHmac('sha256', kDate)
      .update(this.region)
      .digest();
    const kService = crypto
      .createHmac('sha256', kRegion)
      .update(this.service)
      .digest();
    const kSigning = crypto
      .createHmac('sha256', kService)
      .update('aws4_request')
      .digest();
    const signature = crypto
      .createHmac('sha256', kSigning)
      .update(stringToSign)
      .digest('hex');

    // Task 4: Add signing information to request
    const authorizationHeader = [
      `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`
    ].join(', ');

    return authorizationHeader;
  }

  /**
   * Make signed request to Amazon PA-API
   */
  async makeRequest(operation, payload) {
    if (!this.isConfigured()) {
      throw new Error(
        'Amazon PA-API not configured. Please set AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, and AMAZON_PARTNER_TAG in .env file'
      );
    }

    await this.enforceRateLimit();

    const timestamp = new Date()
      .toISOString()
      .replace(/[:-]|\.\d{3}/g, '');
    const payloadString = JSON.stringify(payload);

    const headers = {
      'content-encoding': 'amz-1.0',
      'content-type': 'application/json; charset=utf-8',
      host: new URL(this.endpoint).host,
      'x-amz-date': timestamp,
      'x-amz-target': `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`
    };

    const authorization = this.generateSignature(
      'POST',
      '/paapi5/searchitems',
      headers,
      payloadString,
      timestamp
    );

    headers.Authorization = authorization;

    try {
      const response = await axios.post(this.endpoint, payloadString, {
        headers,
        timeout: 30000
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Amazon API Error:', error.response.data);
        throw new Error(
          `Amazon API Error: ${error.response.data.Errors?.[0]?.Message || error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Search for items by keywords
   * @param {String} keywords - Search query
   * @param {Object} options - Search options
   */
  async searchItems(keywords, options = {}) {
    const payload = {
      PartnerTag: this.partnerTag,
      PartnerType: amazonConfig.partnerType,
      Marketplace: this.marketplace,
      Keywords: keywords,
      ItemCount: options.itemCount || amazonConfig.searchDefaults.itemCount,
      Resources: options.resources || amazonConfig.searchDefaults.resources
    };

    if (options.searchIndex) {
      payload.SearchIndex = options.searchIndex;
    }

    if (options.minPrice) {
      payload.MinPrice = options.minPrice;
    }

    if (options.maxPrice) {
      payload.MaxPrice = options.maxPrice;
    }

    return await this.makeRequest('SearchItems', payload);
  }

  /**
   * Get items by ASINs
   * @param {Array} asins - Array of ASINs
   */
  async getItems(asins) {
    if (!Array.isArray(asins) || asins.length === 0) {
      throw new Error('ASINs must be a non-empty array');
    }

    // Amazon allows max 10 ASINs per request
    if (asins.length > 10) {
      asins = asins.slice(0, 10);
    }

    const payload = {
      PartnerTag: this.partnerTag,
      PartnerType: amazonConfig.partnerType,
      Marketplace: this.marketplace,
      ItemIds: asins,
      Resources: amazonConfig.searchDefaults.resources
    };

    return await this.makeRequest('GetItems', payload);
  }

  /**
   * Search items by category
   * @param {String} category - Amazon search index (category)
   * @param {Object} options - Search options
   */
  async searchByCategory(category, options = {}) {
    return await this.searchItems('', {
      ...options,
      searchIndex: category
    });
  }
}

module.exports = new AmazonClient();
