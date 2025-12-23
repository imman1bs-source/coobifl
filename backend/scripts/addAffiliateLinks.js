/**
 * Add Amazon affiliate links to all products
 */

const mongoose = require('mongoose');
const Product = require('../src/models/Product');

async function addAffiliateLinks() {
  try {
    await mongoose.connect('mongodb://localhost:27017/amazon_product_hub');
    console.log('✅ Connected to MongoDB\n');

    // Amazon Associate tag (you'll need to replace this with your actual tag once approved)
    const ASSOCIATE_TAG = 'coobifl-20'; // Placeholder - update after Amazon Associates approval

    // Find all products with ASINs
    const products = await Product.find({ asin: { $exists: true, $ne: '' } }).lean();

    console.log(`Found ${products.length} products with ASINs\n`);

    let updated = 0;

    for (const product of products) {
      // Create Amazon affiliate link
      const affiliateLink = `https://www.amazon.com/dp/${product.asin}?tag=${ASSOCIATE_TAG}`;

      // Update the product
      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            amazonUrl: affiliateLink,
            'origin.source': 'amazon_pa_api',
            'origin.marketplace': 'US'
          }
        }
      );

      updated++;
    }

    console.log('=== UPDATE COMPLETE ===');
    console.log(`Total updated: ${updated}`);
    console.log(`\nSample affiliate link: https://www.amazon.com/dp/${products[0].asin}?tag=${ASSOCIATE_TAG}`);
    console.log('\n⚠️  IMPORTANT: Update the ASSOCIATE_TAG in this script once you get Amazon Associates approval!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addAffiliateLinks();
