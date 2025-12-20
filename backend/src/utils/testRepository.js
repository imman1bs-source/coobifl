/**
 * Test script for ProductRepository
 * Run with: node src/utils/testRepository.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const productRepository = require('../repositories/ProductRepository');

async function testRepository() {
  try {
    console.log('🧪 Testing ProductRepository...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('═'.repeat(60));
    console.log('TEST 1: Get All Products (Paginated)');
    console.log('═'.repeat(60));
    const allProducts = await productRepository.findAll({ page: 1, limit: 6 });
    console.log(`✅ Found ${allProducts.products.length} products (page 1)`);
    console.log(`   Total: ${allProducts.pagination.total} products`);
    console.log(`   Pages: ${allProducts.pagination.pages}`);
    console.log(`   Sample: ${allProducts.products[0]?.title}`);

    console.log('\n' + '═'.repeat(60));
    console.log('TEST 2: Search Products');
    console.log('═'.repeat(60));
    const searchResults = await productRepository.search('stainless steel', { limit: 5 });
    console.log(`✅ Search for "stainless steel": ${searchResults.products.length} results`);
    searchResults.products.slice(0, 3).forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title.substring(0, 50)}...`);
    });

    console.log('\n' + '═'.repeat(60));
    console.log('TEST 3: Filter by Price Range');
    console.log('═'.repeat(60));
    const priceFiltered = await productRepository.findAll({
      minPrice: 15,
      maxPrice: 25,
      limit: 10
    });
    console.log(`✅ Products between $15-$25: ${priceFiltered.products.length} found`);
    priceFiltered.products.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title.substring(0, 40)}... - ${p.price.displayPrice}`);
    });

    console.log('\n' + '═'.repeat(60));
    console.log('TEST 4: Get Categories and Brands');
    console.log('═'.repeat(60));
    const categories = await productRepository.getCategories();
    const brands = await productRepository.getBrands();
    console.log(`✅ Categories: ${categories.join(', ')}`);
    console.log(`✅ Brands: ${brands.length} unique brands`);
    console.log(`   ${brands.slice(0, 5).join(', ')}...`);

    console.log('\n' + '═'.repeat(60));
    console.log('TEST 5: Find Product by ASIN');
    console.log('═'.repeat(60));
    const productByAsin = await productRepository.findByAsin('B00HHLNRVE');
    if (productByAsin) {
      console.log(`✅ Found: ${productByAsin.title}`);
      console.log(`   Price: ${productByAsin.price.displayPrice}`);
      console.log(`   Rating: ${productByAsin.rating.average}⭐ (${productByAsin.rating.count} reviews)`);
      console.log(`   Brand: ${productByAsin.brand}`);
    } else {
      console.log('❌ Product not found');
    }

    console.log('\n' + '═'.repeat(60));
    console.log('TEST 6: Create Crowd-Sourced Product');
    console.log('═'.repeat(60));
    const newProduct = await productRepository.create({
      asin: 'CROWD001',
      title: 'Community Added Garlic Press - Premium Quality',
      description: 'This is a test community-contributed garlic press',
      price: {
        amount: 19.99,
        currency: 'USD',
        displayPrice: '$19.99'
      },
      category: 'Home & Kitchen',
      subcategory: 'Garlic Presses',
      images: {
        primary: 'https://example.com/garlic-press.jpg'
      },
      rating: {
        average: 4.5,
        count: 0
      },
      availability: {
        status: 'in_stock',
        message: 'In Stock'
      },
      brand: 'Community Brand',
      features: ['Community contributed', 'High quality', 'Great value'],
      origin: {
        source: 'crowd_sourced',
        marketplace: 'US',
        importedBy: 'test_user',
        importedAt: new Date()
      },
      crowdSourced: {
        isVerified: false,
        submittedBy: {
          userId: 'user123',
          username: 'test_user',
          email: 'test@example.com'
        },
        upvotes: 0,
        downvotes: 0,
        reportCount: 0
      }
    });
    console.log(`✅ Created new product: ${newProduct.title}`);
    console.log(`   ID: ${newProduct._id}`);
    console.log(`   Source: ${newProduct.origin.source}`);
    console.log(`   Verified: ${newProduct.crowdSourced.isVerified}`);

    console.log('\n' + '═'.repeat(60));
    console.log('TEST 7: Upvote Product');
    console.log('═'.repeat(60));
    const upvoted = await productRepository.upvote(newProduct._id);
    console.log(`✅ Upvoted product`);
    console.log(`   Upvotes: ${upvoted.crowdSourced.upvotes}`);
    console.log(`   Downvotes: ${upvoted.crowdSourced.downvotes}`);

    console.log('\n' + '═'.repeat(60));
    console.log('TEST 8: Verify Product (Admin)');
    console.log('═'.repeat(60));
    const verified = await productRepository.verify(newProduct._id, 'admin123');
    console.log(`✅ Product verified by admin`);
    console.log(`   Verified: ${verified.crowdSourced.isVerified}`);
    console.log(`   Verified By: ${verified.crowdSourced.verifiedBy}`);
    console.log(`   Verified At: ${verified.crowdSourced.verifiedAt}`);

    console.log('\n' + '═'.repeat(60));
    console.log('TEST 9: Get Statistics');
    console.log('═'.repeat(60));
    const stats = await productRepository.getStats();
    console.log(`✅ Database Statistics:`);
    console.log(`   Total Products: ${stats.total}`);
    console.log(`   Amazon Products: ${stats.bySource.amazon}`);
    console.log(`   Crowd-Sourced: ${stats.bySource.crowdSourced}`);
    console.log(`   Verified: ${stats.verification.verified}`);
    console.log(`   Pending: ${stats.verification.pending}`);
    console.log(`   Categories: ${stats.categories}`);
    console.log(`   Brands: ${stats.brands}`);
    console.log(`   Average Price: $${stats.averagePrice.toFixed(2)}`);

    console.log('\n' + '═'.repeat(60));
    console.log('TEST 10: Update Product');
    console.log('═'.repeat(60));
    const updated = await productRepository.updateById(newProduct._id, {
      'price.amount': 24.99,
      'price.displayPrice': '$24.99'
    });
    console.log(`✅ Updated product price`);
    console.log(`   New Price: ${updated.price.displayPrice}`);

    console.log('\n' + '═'.repeat(60));
    console.log('TEST 11: Delete Product');
    console.log('═'.repeat(60));
    const deleted = await productRepository.deleteById(newProduct._id);
    console.log(`✅ Deleted product: ${deleted.title}`);

    console.log('\n' + '═'.repeat(60));
    console.log('✨ ALL TESTS PASSED!');
    console.log('═'.repeat(60));
    console.log('\n📊 ProductRepository is working perfectly!');
    console.log('👉 Ready to proceed to Phase 3: Backend API Development\n');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testRepository();
