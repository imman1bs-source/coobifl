/**
 * Update Product Images to Amazon Widget URLs
 *
 * Amazon provides widget image URLs that work without API access:
 * https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN={ASIN}&Format=_SL{size}_
 *
 * This script updates all products to use their real Amazon product images
 * via the Amazon Associates widget system.
 *
 * Usage: node src/utils/updateToAmazonWidgetImages.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

/**
 * Generate Amazon widget image URLs for a given ASIN
 */
function generateAmazonImageUrls(asin) {
  const baseUrl = 'https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8';

  return {
    primary: `${baseUrl}&ASIN=${asin}&Format=_SL500_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1`,
    variants: [
      `${baseUrl}&ASIN=${asin}&Format=_SL400_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1`,
      `${baseUrl}&ASIN=${asin}&Format=_SL300_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1`
    ]
  };
}

async function updateAllProductImages() {
  try {
    console.log('🖼️  Updating all products with real Amazon images...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products\n`);

    let updated = 0;
    let failed = 0;

    for (const product of products) {
      try {
        if (product.asin) {
          // Generate Amazon widget URLs
          product.images = generateAmazonImageUrls(product.asin);
          await product.save();
          updated++;
          console.log(`✓ Updated ${product.title} (ASIN: ${product.asin})`);
        } else {
          console.log(`⚠ Skipped ${product.title} - No ASIN`);
          failed++;
        }
      } catch (error) {
        console.error(`✗ Failed to update ${product.title}: ${error.message}`);
        failed++;
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`✅ Successfully updated: ${updated} products`);
    if (failed > 0) {
      console.log(`⚠️  Failed/Skipped: ${failed} products`);
    }
    console.log('═'.repeat(60));

    console.log('\n📸 All products now use real Amazon product images!');
    console.log('👉 Visit ross.coobifl.com/search to see the updated images\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error updating images:', error);
    process.exit(1);
  }
}

// Test the image URL generation
function testImageUrls() {
  console.log('\n🧪 Testing Amazon Widget Image URLs:\n');

  const testASINs = ['B00HHLNRVE', 'B0001WVH3I', 'B0000DJVKQ'];

  testASINs.forEach(asin => {
    console.log(`ASIN: ${asin}`);
    const urls = generateAmazonImageUrls(asin);
    console.log(`  Primary: ${urls.primary}`);
    console.log(`  Variant 1: ${urls.variants[0]}`);
    console.log(`  Variant 2: ${urls.variants[1]}\n`);
  });

  console.log('💡 Tip: Open these URLs in your browser to verify they work!\n');
}

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'test') {
    testImageUrls();
  } else {
    updateAllProductImages();
  }
}

module.exports = { updateAllProductImages, generateAmazonImageUrls };
