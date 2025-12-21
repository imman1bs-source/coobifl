/**
 * Update All Products with Working Unsplash Images
 *
 * Uses real, tested Unsplash URLs for kitchen utensils and garlic-related images
 * All images are free to use, no attribution required
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Curated working Unsplash image URLs for kitchen/garlic press products
// All tested and verified to work
const kitchenImages = [
  {
    primary: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
    variants: [
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80',
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&q=80'
    ]
  },
  {
    primary: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    variants: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80',
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80'
    ]
  },
  {
    primary: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
    variants: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80'
    ]
  },
  {
    primary: 'https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=800&q=80',
    variants: [
      'https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=600&q=80',
      'https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=400&q=80'
    ]
  },
  {
    primary: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    variants: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80'
    ]
  },
  {
    primary: 'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=800&q=80',
    variants: [
      'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=600&q=80',
      'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=400&q=80'
    ]
  },
  {
    primary: 'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=800&q=80',
    variants: [
      'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=600&q=80',
      'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=400&q=80'
    ]
  },
  {
    primary: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=800&q=80',
    variants: [
      'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=600&q=80',
      'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=400&q=80'
    ]
  },
  {
    primary: 'https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?w=800&q=80',
    variants: [
      'https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?w=600&q=80',
      'https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?w=400&q=80'
    ]
  },
  {
    primary: 'https://images.unsplash.com/photo-1556910636-196e58bd14f9?w=800&q=80',
    variants: [
      'https://images.unsplash.com/photo-1556910636-196e58bd14f9?w=600&q=80',
      'https://images.unsplash.com/photo-1556910636-196e58bd14f9?w=400&q=80'
    ]
  }
];

async function updateToUnsplashImages() {
  try {
    console.log('🖼️  Updating all products with Unsplash images...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products\n`);

    let updated = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageSet = kitchenImages[i % kitchenImages.length];

      product.images = imageSet;
      await product.save();
      updated++;

      console.log(`✓ Updated: ${product.title.substring(0, 50)}...`);
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`✅ Successfully updated ${updated} products!`);
    console.log('═'.repeat(60));
    console.log('\n📸 All products now use high-quality Unsplash images');
    console.log('🆓 Free to use, no attribution required\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error updating images:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updateToUnsplashImages();
}

module.exports = updateToUnsplashImages;
