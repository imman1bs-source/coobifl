/**
 * Export all products from local MongoDB to JSON file
 * This can then be imported to production
 */

const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const fs = require('fs');
const path = require('path');

async function exportProducts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/amazon_product_hub');
    console.log('✅ Connected to local MongoDB\n');

    const products = await Product.find().lean();

    console.log(`Found ${products.length} products to export`);

    // Save to JSON file
    const outputPath = path.join(__dirname, '../db-export-products.json');
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

    console.log(`\n✅ Exported ${products.length} products to:`);
    console.log(`   ${outputPath}`);

    // Summary
    const amazonCount = products.filter(p => p.origin?.source === 'amazon_pa_api').length;
    const walmartCount = products.filter(p => p.origin?.source === 'walmart').length;
    const withCOO = products.filter(p => p.specifications && p.specifications['Country of Origin']).length;

    console.log('\n📊 Export Summary:');
    console.log(`   Total products: ${products.length}`);
    console.log(`   Amazon products: ${amazonCount}`);
    console.log(`   Walmart products: ${walmartCount}`);
    console.log(`   Products with COO: ${withCOO}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

exportProducts();
