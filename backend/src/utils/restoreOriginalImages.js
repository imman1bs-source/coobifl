/**
 * Restore Original Amazon CDN Images from Seed Data
 *
 * The seed data already contains real Amazon product images from m.media-amazon.com
 * This script restores those original images
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const seedProducts = require('./seedGarlicPresses');

async function restoreOriginalImages() {
  try {
    console.log('🔄 Restoring original Amazon CDN images...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    let updated = 0;
    let notFound = 0;

    // Get all products from database
    const dbProducts = await Product.find({});

    for (const dbProduct of dbProducts) {
      // Find matching product in seed data by ASIN
      const seedProduct = seedProducts.find(sp => sp.asin === dbProduct.asin);

      if (seedProduct && seedProduct.images) {
        dbProduct.images = seedProduct.images;
        await dbProduct.save();
        updated++;
        console.log(`✓ Restored images for: ${dbProduct.title}`);
      } else {
        notFound++;
        console.log(`⚠ No seed data found for ASIN: ${dbProduct.asin}`);
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`✅ Restored images for: ${updated} products`);
    if (notFound > 0) {
      console.log(`⚠️  No seed data for: ${notFound} products`);
    }
    console.log('═'.repeat(60));
    console.log('\n📸 All products now use real Amazon CDN images!');
    console.log('👉 These images are from m.media-amazon.com\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error restoring images:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  restoreOriginalImages();
}

module.exports = restoreOriginalImages;
