/**
 * Amazon Product Advertising API Configuration
 *
 * To use this integration:
 * 1. Sign up for Amazon Associates program: https://affiliate-program.amazon.com/
 * 2. Register for Product Advertising API access
 * 3. Get your Access Key, Secret Key, and Associate Tag
 * 4. Add these to your .env file
 */

module.exports = {
  // Amazon PA-API Credentials
  accessKey: process.env.AMAZON_ACCESS_KEY || '',
  secretKey: process.env.AMAZON_SECRET_KEY || '',
  partnerTag: process.env.AMAZON_PARTNER_TAG || '',

  // API Configuration
  region: process.env.AMAZON_REGION || 'us-east-1',
  marketplace: process.env.AMAZON_MARKETPLACE || 'www.amazon.com',
  partnerType: 'Associates',

  // API Endpoints
  endpoints: {
    'us-east-1': 'https://webservices.amazon.com/paapi5/searchitems',
    'us-west-2': 'https://webservices.amazon.com/paapi5/searchitems',
    'eu-west-1': 'https://webservices.amazon.co.uk/paapi5/searchitems',
  },

  // Rate Limiting
  requestsPerSecond: 1, // Amazon allows 1 request per second for free tier
  maxRetries: 3,
  retryDelay: 1000, // ms

  // Search Configuration
  searchDefaults: {
    itemCount: 10,
    resources: [
      'Images.Primary.Large',
      'Images.Variants.Large',
      'ItemInfo.Title',
      'ItemInfo.Features',
      'ItemInfo.ProductInfo',
      'ItemInfo.TechnicalInfo',
      'ItemInfo.ManufactureInfo',
      'Offers.Listings.Price',
      'Offers.Listings.Availability',
      'CustomerReviews.StarRating',
      'CustomerReviews.Count'
    ]
  },

  // Categories to sync
  categoriesToSync: [
    'HomeAndKitchen',
    'Tools',
    'Electronics',
    'Sports',
    'AutomotiveParts'
  ],

  // Sync Configuration
  syncIntervals: {
    full: '0 2 * * *', // Daily at 2 AM (cron format)
    incremental: '0 */6 * * *' // Every 6 hours (cron format)
  }
};
