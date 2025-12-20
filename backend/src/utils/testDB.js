/**
 * Test script to verify database creation
 * Run with: node src/utils/testDB.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

async function testDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create a test product
    const testProduct = new Product({
      asin: 'TEST123456',
      title: 'Test Product - Wireless Headphones',
      description: 'This is a test product to verify database creation',
      price: {
        amount: 99.99,
        currency: 'USD',
        displayPrice: '$99.99'
      },
      category: 'Electronics',
      subcategory: 'Audio',
      images: {
        primary: 'https://example.com/image.jpg',
        variants: ['https://example.com/image2.jpg']
      },
      rating: {
        average: 4.5,
        count: 100
      },
      availability: {
        status: 'in_stock',
        message: 'In Stock'
      },
      brand: 'TestBrand',
      features: ['Noise Canceling', 'Bluetooth 5.0', '30 Hour Battery'],
      amazonUrl: 'https://amazon.com/test',
      origin: {
        source: 'amazon_pa_api',
        marketplace: 'US',
        importedBy: 'test_script',
        importedAt: new Date()
      }
    });

    // Save to database
    await testProduct.save();
    console.log('✅ Test product created successfully!');
    console.log('Product ID:', testProduct._id);

    // Verify it exists
    const count = await Product.countDocuments();
    console.log(`✅ Total products in database: ${count}`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database test completed successfully!');
    console.log('\n👉 Now refresh MongoDB Compass - you should see the amazon_product_hub database!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testDatabase();
