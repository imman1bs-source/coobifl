/**
 * Fix Review Counts for Existing Walmart Products
 * Updates products that have rating.count = 0 by re-fetching from Walmart
 */

const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const WalmartFetcher = require('../src/utils/walmartFetcher');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function fixReviewCounts() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/amazon_product_hub';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find Walmart products with 0 reviews
    const products = await Product.find({
      source: 'walmart',
      'rating.count': 0
    });

    console.log(`\n📊 Found ${products.length} Walmart products with 0 review counts`);

    if (products.length === 0) {
      console.log('✅ No products need updating!');
      process.exit(0);
    }

    const apiKey = process.env.SERPAPI_KEY;
    const fetcher = new WalmartFetcher(apiKey);

    let updated = 0;
    let failed = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const walmartId = product.metadata?.walmartId || product.asin;

      console.log(`\n[${i + 1}/${products.length}] Updating: ${product.title.substring(0, 50)}...`);
      console.log(`   Walmart ID: ${walmartId}`);

      try {
        // Search for the product to get fresh data
        const searchResults = await fetcher.searchProducts(product.title.split(' ').slice(0, 3).join(' '), 1);

        // Find matching product by ID
        const freshProduct = searchResults.find(p =>
          p.asin === walmartId ||
          p.metadata?.walmartId === walmartId
        );

        if (freshProduct && freshProduct.rating && freshProduct.rating.count > 0) {
          // Update the product
          product.rating.count = freshProduct.rating.count;
          product.rating.average = freshProduct.rating.average || product.rating.average;
          await product.save();

          console.log(`   ✅ Updated: ${freshProduct.rating.count} reviews (rating: ${freshProduct.rating.average})`);
          updated++;
        } else {
          console.log(`   ⚠️  Product not found or still has 0 reviews`);
          failed++;
        }

        // Rate limiting: 1 second between requests
        if (i < products.length - 1) {
          console.log(`   ⏳ Waiting 1 second...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Update Summary:');
    console.log(`   ✅ Successfully updated: ${updated} products`);
    console.log(`   ❌ Failed/No data: ${failed} products`);
    console.log('='.repeat(60));

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
fixReviewCounts();
