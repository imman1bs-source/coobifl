const mongoose = require('mongoose');
const Product = require('../src/models/Product');

mongoose.connect('mongodb://localhost:27017/amazon_product_hub')
.then(async () => {
  // Get all products and check their metadata
  const products = await Product.find().limit(10).lean();

  products.forEach((p, i) => {
    console.log(`\n[${i+1}] ${p.title.substring(0, 50)}...`);
    console.log(`  ASIN/ID: ${p.asin}`);
    console.log(`  Source: ${p.source}`);
    console.log(`  Affiliate Link: ${p.affiliateLink ? p.affiliateLink.substring(0, 60) + '...' : 'None'}`);
    console.log(`  Brand: ${p.brand}`);
    if (p.metadata) {
      console.log(`  Metadata:`, p.metadata);
    }
  });

  await mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
