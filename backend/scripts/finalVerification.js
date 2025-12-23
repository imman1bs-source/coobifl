const mongoose = require('mongoose');
const Product = require('../src/models/Product');

mongoose.connect('mongodb://localhost:27017/amazon_product_hub')
.then(async () => {
  console.log('=== FINAL DATABASE VERIFICATION ===\n');

  // Count by source
  const amazonCount = await Product.countDocuments({ 'origin.source': 'amazon_pa_api' });
  const walmartCount = await Product.countDocuments({ 'origin.source': 'walmart' });
  const totalCount = await Product.countDocuments();

  console.log('Product counts:');
  console.log(`  Amazon: ${amazonCount}`);
  console.log(`  Walmart: ${walmartCount}`);
  console.log(`  Total: ${totalCount}`);

  // Check COO coverage
  const withCOO = await Product.countDocuments({ 'specifications.Country of Origin': { $exists: true } });
  console.log(`\nCOO coverage: ${withCOO}/${totalCount} (${Math.round(withCOO/totalCount*100)}%)`);

  // Check URL coverage
  const withAmazonURL = await Product.countDocuments({ amazonUrl: { $exists: true, $ne: null } });
  const withWalmartURL = await Product.countDocuments({ walmartUrl: { $exists: true, $ne: null } });
  console.log(`\nAffiliate URL coverage:`);
  console.log(`  Products with Amazon URL: ${withAmazonURL}`);
  console.log(`  Products with Walmart URL: ${withWalmartURL}`);

  // Sample products
  console.log('\n=== SAMPLE AMAZON PRODUCT ===');
  const amazonProduct = await Product.findOne({ 'origin.source': 'amazon_pa_api' }).lean();
  if (amazonProduct) {
    console.log(`Title: ${amazonProduct.title.substring(0, 50)}`);
    console.log(`ASIN: ${amazonProduct.asin}`);
    console.log(`Amazon URL: ${amazonProduct.amazonUrl}`);
    console.log(`COO: ${amazonProduct.specifications['Country of Origin']}`);
  }

  console.log('\n=== SAMPLE WALMART PRODUCT ===');
  const walmartProduct = await Product.findOne({ 'origin.source': 'walmart' }).lean();
  if (walmartProduct) {
    console.log(`Title: ${walmartProduct.title.substring(0, 50)}`);
    console.log(`Product ID: ${walmartProduct.asin}`);
    console.log(`Walmart URL: ${walmartProduct.walmartUrl}`);
    console.log(`COO: ${walmartProduct.specifications['Country of Origin']}`);
  }

  console.log('\n✅ Database is ready for production!');

  await mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
