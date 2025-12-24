/**
 * Import products from JSON file to production MongoDB
 * Run this with: MONGODB_URI=<your-production-uri> node scripts/importProductsToProduction.js
 */

const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const fs = require('fs');
const path = require('path');

async function importProducts() {
  try {
    // Use MONGODB_URI from environment or command line
    const mongoUri = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI;

    if (!mongoUri) {
      console.error('❌ Error: MONGODB_URI environment variable is required');
      console.log('\nUsage:');
      console.log('  MONGODB_URI="your-production-uri" node scripts/importProductsToProduction.js');
      process.exit(1);
    }

    console.log('🔌 Connecting to production MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to production MongoDB\n');

    // Read the exported JSON file
    const jsonPath = path.join(__dirname, '../db-export-products.json');

    if (!fs.existsSync(jsonPath)) {
      console.error('❌ Error: Export file not found at:', jsonPath);
      console.log('\nPlease run exportProductsToJSON.js first!');
      process.exit(1);
    }

    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`📦 Loaded ${productsData.length} products from export file\n`);

    // Check current product count in production
    const currentCount = await Product.countDocuments();
    console.log(`Current products in production database: ${currentCount}`);

    if (currentCount > 0) {
      console.log('\n⚠️  WARNING: Production database already has products!');
      console.log('\nOptions:');
      console.log('1. Delete all existing products and import fresh (recommended)');
      console.log('2. Skip products that already exist (merge)');
      console.log('\nTo delete all and import fresh, set DELETE_EXISTING=true');

      if (process.env.DELETE_EXISTING === 'true') {
        console.log('\n🗑️  Deleting all existing products...');
        await Product.deleteMany({});
        console.log('✅ Deleted all existing products');
      } else {
        console.log('\n⏭️  Skipping deletion. Will try to update existing products.');
      }
    }

    console.log('\n📥 Importing products...\n');

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const productData of productsData) {
      try {
        // Remove _id and __v to avoid conflicts
        const { _id, __v, createdAt, updatedAt, ...cleanData } = productData;

        // Check if product already exists
        const existing = await Product.findOne({ asin: cleanData.asin });

        if (existing) {
          // Product exists - skip it (don't update)
          skipped++;
        } else {
          // Product doesn't exist - create new one
          await Product.create(cleanData);
          imported++;
        }

        if ((imported + skipped) % 10 === 0) {
          process.stdout.write(`  Progress: ${imported + skipped}/${productsData.length}\r`);
        }
      } catch (error) {
        console.error(`\n❌ Error importing product ${productData.asin}:`, error.message);
      }
    }

    console.log(`\n\n✅ Import complete!`);
    console.log(`\n📊 Summary:`);
    console.log(`   New products imported: ${imported}`);
    console.log(`   Existing products skipped (not updated): ${skipped}`);
    console.log(`   Total in database: ${await Product.countDocuments()}`);

    // Verify
    const amazonCount = await Product.countDocuments({ 'origin.source': 'amazon_pa_api' });
    const walmartCount = await Product.countDocuments({ 'origin.source': 'walmart' });
    const withCOO = await Product.countDocuments({ 'specifications.Country of Origin': { $exists: true } });

    console.log(`\n✅ Verification:`);
    console.log(`   Amazon products: ${amazonCount}`);
    console.log(`   Walmart products: ${walmartCount}`);
    console.log(`   Products with COO: ${withCOO}`);

    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

importProducts();
