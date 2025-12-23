/**
 * Fix affiliate links - separate Amazon and Walmart products
 * Amazon products get amazonUrl, Walmart products get walmartUrl
 */

const mongoose = require('mongoose');
const Product = require('../src/models/Product');

async function fixAffiliateLinks() {
  try {
    await mongoose.connect('mongodb://localhost:27017/amazon_product_hub');
    console.log('✅ Connected to MongoDB\n');

    // Associate tags
    const AMAZON_ASSOCIATE_TAG = 'coobifl-20';
    const WALMART_AFFILIATE_ID = 'your-walmart-affiliate-id'; // TODO: Get Walmart affiliate ID

    const products = await Product.find().lean();

    let amazonCount = 0;
    let walmartCount = 0;

    for (const product of products) {
      const asin = product.asin;

      // Check if this is a real Amazon ASIN (starts with B and is 10 characters)
      const isAmazonProduct = asin.length === 10 && /^B[0-9A-Z]{9}$/.test(asin);

      if (isAmazonProduct) {
        // This is an Amazon product
        const amazonUrl = `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}`;

        await Product.updateOne(
          { _id: product._id },
          {
            $set: {
              amazonUrl: amazonUrl,
              'origin.source': 'amazon_pa_api',
              'origin.marketplace': 'US'
            },
            $unset: {
              walmartUrl: ''
            }
          }
        );

        amazonCount++;
      } else {
        // This is a Walmart product
        // Walmart URL format: https://www.walmart.com/ip/{product-slug}/{product-id}
        // For affiliate: add ?affcamid={affiliate-id}
        const walmartUrl = `https://www.walmart.com/ip/${asin}`;

        await Product.updateOne(
          { _id: product._id },
          {
            $set: {
              walmartUrl: walmartUrl,
              'origin.source': 'walmart',
              'origin.marketplace': 'US'
            },
            $unset: {
              amazonUrl: ''
            }
          }
        );

        walmartCount++;
      }
    }

    console.log('=== UPDATE COMPLETE ===');
    console.log(`Amazon products: ${amazonCount}`);
    console.log(`Walmart products: ${walmartCount}`);
    console.log(`Total: ${products.length}`);

    console.log('\nSample Amazon URL:', `https://www.amazon.com/dp/B00HHLNRVE?tag=${AMAZON_ASSOCIATE_TAG}`);
    console.log('Sample Walmart URL:', `https://www.walmart.com/ip/54TRWQG9RBF7`);

    console.log('\n⚠️  IMPORTANT: Update WALMART_AFFILIATE_ID in this script once you get Walmart affiliate approval!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAffiliateLinks();
