/**
 * Extract COO from existing products that don't have it
 * Uses descriptions and titles to extract Country of Origin
 */

const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const COOExtractor = require('../src/utils/cooExtractor');

async function extractMissingCOO() {
  try {
    await mongoose.connect('mongodb://localhost:27017/amazon_product_hub');
    console.log('✅ Connected to MongoDB\n');

    const extractor = new COOExtractor();

    // Find all products without COO
    const productsWithoutCOO = await Product.find({
      $or: [
        { 'specifications.Country of Origin': { $exists: false } },
        { 'specifications.Country of Origin': '' },
        { 'specifications.Country of Origin': null }
      ]
    }).lean();

    console.log(`Found ${productsWithoutCOO.length} products without COO`);
    console.log('Starting COO extraction...\n');

    let updated = 0;
    let skipped = 0;

    for (let i = 0; i < productsWithoutCOO.length; i++) {
      const product = productsWithoutCOO[i];
      const progress = `[${i + 1}/${productsWithoutCOO.length}]`;

      console.log(`${progress} Processing: ${product.title.substring(0, 60)}...`);

      // Extract COO from title and description
      const cooResult = extractor.extractCOO({
        reviews: [],
        description: product.description || '',
        specifications: product.specifications || {},
        title: product.title || ''
      });

      if (cooResult.country && cooResult.confidence > 0.4) {
        // Update the product in database
        await Product.updateOne(
          { _id: product._id },
          {
            $set: {
              'specifications.Country of Origin': cooResult.country,
              cooMetadata: {
                confidence: cooResult.confidence,
                source: cooResult.source,
                extractedAt: new Date()
              }
            }
          }
        );

        console.log(`  ✅ COO extracted: ${cooResult.country} (${(cooResult.confidence * 100).toFixed(0)}% confidence from ${cooResult.source})`);
        updated++;
      } else {
        console.log(`  ⚠️  No COO found - will need manual entry`);
        skipped++;
      }
    }

    console.log('\n=== EXTRACTION COMPLETE ===');
    console.log(`Total processed: ${productsWithoutCOO.length}`);
    console.log(`Successfully extracted: ${updated}`);
    console.log(`Needs manual entry: ${skipped}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

extractMissingCOO();
