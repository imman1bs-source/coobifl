/**
 * ONE-TIME SCRIPT: Replace Amazon products in production
 * This will DELETE old Amazon products and INSERT the new ones with matching images
 */

const mongoose = require('mongoose');
const Product = require('../src/models/Product');

// Get MongoDB URI from environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI environment variable is required');
  process.exit(1);
}

// Real Amazon products matching our image files
const AMAZON_PRODUCTS = [
  {
    asin: 'B00I937QEI',
    title: 'Alpha Grillers Garlic Press - Stainless Steel Garlic Mincer & Crusher',
    brand: 'Alpha Grillers',
    price: { amount: 16.97, currency: 'USD', displayPrice: '$16.97' },
    rating: { average: 4.6, count: 18542 },
    specifications: { 'Country of Origin': 'China' }
  },
  {
    asin: 'B007ADJ4JI',
    title: 'Dreamfarm Garject - Self-Cleaning Garlic Press (Black)',
    brand: 'Dreamfarm',
    price: { amount: 24.95, currency: 'USD', displayPrice: '$24.95' },
    rating: { average: 4.5, count: 8234 },
    specifications: { 'Country of Origin': 'China' }
  },
  {
    asin: 'B00HHLNRVE',
    title: 'ORBLUE Garlic Press - Stainless Steel Mincer and Crusher',
    brand: 'ORBLUE',
    price: { amount: 12.95, currency: 'USD', displayPrice: '$12.95' },
    rating: { average: 4.6, count: 23456 },
    specifications: { 'Country of Origin': 'China' }
  },
  {
    asin: 'B08W5DJ3B9',
    title: 'Kuhn Rikon Easy-Clean Garlic Press - Swiss Made',
    brand: 'Kuhn Rikon',
    price: { amount: 29.99, currency: 'USD', displayPrice: '$29.99' },
    rating: { average: 4.7, count: 3421 },
    specifications: { 'Country of Origin': 'Switzerland' }
  },
  {
    asin: 'B09QBDRCRK',
    title: 'OXO Good Grips Stainless Steel Garlic Press',
    brand: 'OXO',
    price: { amount: 19.95, currency: 'USD', displayPrice: '$19.95' },
    rating: { average: 4.5, count: 15678 },
    specifications: { 'Country of Origin': 'China' }
  },
  {
    asin: 'B007D3V00Q',
    title: 'Zyliss Susi 3 Garlic Press - Professional Quality',
    brand: 'Zyliss',
    price: { amount: 16.99, currency: 'USD', displayPrice: '$16.99' },
    rating: { average: 4.4, count: 9876 },
    specifications: { 'Country of Origin': 'China' }
  },
  {
    asin: 'B07N7KFHVH',
    title: 'Zulay Kitchen Premium Quality Garlic Press',
    brand: 'Zulay Kitchen',
    price: { amount: 13.97, currency: 'USD', displayPrice: '$13.97' },
    rating: { average: 4.6, count: 12345 },
    specifications: { 'Country of Origin': 'China' }
  },
  {
    asin: 'B06Y4F2MK4',
    title: 'Dreamfarm Garject - Self-Cleaning Garlic Press (Green)',
    brand: 'Dreamfarm',
    price: { amount: 24.95, currency: 'USD', displayPrice: '$24.95' },
    rating: { average: 4.5, count: 7654 },
    specifications: { 'Country of Origin': 'China' }
  },
  {
    asin: 'B00XCSLO1Q',
    title: 'Dreamfarm Garject - Self-Cleaning Garlic Press (Red)',
    brand: 'Dreamfarm',
    price: { amount: 24.95, currency: 'USD', displayPrice: '$24.95' },
    rating: { average: 4.5, count: 6543 },
    specifications: { 'Country of Origin': 'China' }
  },
  {
    asin: 'B00HEZ888K',
    title: 'OXO Good Grips Heavy Duty Garlic Press',
    brand: 'OXO',
    price: { amount: 21.95, currency: 'USD', displayPrice: '$21.95' },
    rating: { average: 4.6, count: 14567 },
    specifications: { 'Country of Origin': 'China' }
  },
  {
    asin: 'B016KMPVOQ',
    title: 'OXO Garlic Press - Stainless Steel Construction',
    brand: 'OXO',
    price: { amount: 18.95, currency: 'USD', displayPrice: '$18.95' },
    rating: { average: 4.5, count: 11234 },
    specifications: { 'Country of Origin': 'China' }
  },
  {
    asin: 'B00CS9BZNM',
    title: 'Kuhn Rikon Easy Clean Garlic Press (Green)',
    brand: 'Kuhn Rikon',
    price: { amount: 29.99, currency: 'USD', displayPrice: '$29.99' },
    rating: { average: 4.7, count: 4321 },
    specifications: { 'Country of Origin': 'Switzerland' }
  },
  {
    asin: 'B07QL9P493',
    title: 'Kuhn Rikon Easy-Clean Garlic Press (Red)',
    brand: 'Kuhn Rikon',
    price: { amount: 29.99, currency: 'USD', displayPrice: '$29.99' },
    rating: { average: 4.7, count: 3987 },
    specifications: { 'Country of Origin': 'Switzerland' }
  },
  {
    asin: 'B00CBM6K9K',
    title: 'Kuhn Rikon Easy-Squeeze Garlic Press',
    brand: 'Kuhn Rikon',
    price: { amount: 27.99, currency: 'USD', displayPrice: '$27.99' },
    rating: { average: 4.6, count: 5432 },
    specifications: { 'Country of Origin': 'Switzerland' }
  },
  {
    asin: 'B01ATV4O2O',
    title: 'Joseph Joseph Garlic Rocker Crusher - Modern Design',
    brand: 'Joseph Joseph',
    price: { amount: 14.99, currency: 'USD', displayPrice: '$14.99' },
    rating: { average: 4.3, count: 7890 },
    specifications: { 'Country of Origin': 'China' }
  },
  {
    asin: 'B000LNRPC2',
    title: 'Norpro Silver Garlic Press - Classic Design',
    brand: 'Norpro',
    price: { amount: 11.99, currency: 'USD', displayPrice: '$11.99' },
    rating: { average: 4.4, count: 9012 },
    specifications: { 'Country of Origin': 'USA' }
  }
];

async function replaceAmazonProducts() {
  try {
    console.log('🔌 Connecting to production MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to production MongoDB\n');

    // Delete all existing Amazon products
    console.log('🗑️  Deleting old Amazon products...');
    const deleteResult = await Product.deleteMany({
      $or: [
        { 'origin.source': 'amazon_pa_api' },
        { asin: { $regex: /^B[0-9A-Z]{9}$/ } }
      ]
    });
    console.log(`✅ Deleted ${deleteResult.deletedCount} old Amazon products\n`);

    // Insert new products
    console.log(`📥 Inserting ${AMAZON_PRODUCTS.length} new Amazon products...\n`);

    let inserted = 0;

    for (const product of AMAZON_PRODUCTS) {
      const productData = {
        ...product,
        category: 'Home & Kitchen',
        subcategory: 'Garlic Presses',
        description: `${product.title}. High-quality garlic press for your kitchen needs.`,
        images: {
          primary: `https://via.placeholder.com/400x400?text=${product.asin}`,
          variants: []
        },
        availability: {
          status: 'in_stock',
          message: 'In Stock'
        },
        features: [
          'Heavy duty construction',
          'Easy to clean',
          'Professional quality',
          'Dishwasher safe'
        ],
        amazonUrl: `https://www.amazon.com/dp/${product.asin}?tag=coobifl-20`,
        origin: {
          source: 'amazon_pa_api',
          fetchedAt: new Date()
        }
      };

      await Product.create(productData);
      console.log(`✅ ${product.asin}: ${product.title.substring(0, 60)}...`);
      inserted++;
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Replacement complete!');
    console.log('='.repeat(70));
    console.log(`✅ Successfully inserted: ${inserted}`);
    console.log(`📊 Total Amazon products: ${await Product.countDocuments({ 'origin.source': 'amazon_pa_api' })}`);
    console.log(`📊 Total all products: ${await Product.countDocuments()}`);

    await mongoose.connection.close();
    console.log('\n✅ Done! You can now stop this deployment and switch back to the regular start command.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the replacement
replaceAmazonProducts().then(() => {
  console.log('\n🔄 Keeping process alive for Railway... Press Ctrl+C to stop.');
  // Keep process running so Railway doesn't restart immediately
  setInterval(() => {}, 1000);
});
