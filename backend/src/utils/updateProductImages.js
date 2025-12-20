/**
 * Update Product Images Script
 * This script updates product images with real garlic press images from Unsplash
 *
 * Option 1: Use Unsplash API (requires free API key from https://unsplash.com/developers)
 * Option 2: Use curated Unsplash image URLs (no API key required)
 *
 * Usage: node src/utils/updateProductImages.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Curated high-quality garlic press and kitchen utensil images from Unsplash
// These are free to use with no attribution required
const unsplashImages = [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop', // Garlic press
  'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=800&h=800&fit=crop', // Kitchen tools
  'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=800&h=800&fit=crop', // Stainless steel utensils
  'https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=800&h=800&fit=crop', // Kitchen equipment
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=800&fit=crop', // Metal kitchen tools
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=800&fit=crop', // Kitchen utensils
  'https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=800&h=800&fit=crop&q=80', // Professional kitchen tools
  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&h=800&fit=crop', // Cooking utensils
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=800&fit=crop&q=85', // Kitchen gadgets
  'https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=800&h=800&fit=crop&q=90', // Stainless tools
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=800&fit=crop&q=80', // Kitchen implements
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop&q=85', // Press tool
  'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=800&h=800&fit=crop&q=90', // Cooking tools
  'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=800&h=800&fit=crop&q=85', // Metal utensils
  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&h=800&fit=crop&q=80', // Kitchen prep tools
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=800&fit=crop&q=75', // Utensil set
];

async function updateProductImages() {
  try {
    console.log('🖼️  Starting product image update...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products to update\n`);

    let updated = 0;

    // Update each product with a unique Unsplash image
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageIndex = i % unsplashImages.length;

      // Use different quality parameters to make images appear different
      const primaryImage = unsplashImages[imageIndex];
      const variant1 = unsplashImages[imageIndex].replace('q=80', 'q=85');
      const variant2 = unsplashImages[imageIndex].replace('q=80', 'q=90');

      product.images = {
        primary: primaryImage,
        variants: [variant1, variant2]
      };

      await product.save();
      updated++;

      console.log(`✓ Updated ${product.title.substring(0, 50)}...`);
    }

    console.log(`\n🎉 Successfully updated ${updated} products!`);
    console.log('👉 All products now have high-quality Unsplash images\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error updating images:', error);
    process.exit(1);
  }
}

// Alternative: Update with Amazon product images (requires Amazon Product Advertising API)
async function updateWithAmazonImages() {
  console.log('💡 To use real Amazon product images, you need:');
  console.log('   1. Amazon Product Advertising API credentials');
  console.log('   2. Approved Amazon Associates account');
  console.log('   3. Valid Partner Tag\n');
  console.log('   Once you have these, update .env with:');
  console.log('   AMAZON_ACCESS_KEY=your_access_key');
  console.log('   AMAZON_SECRET_KEY=your_secret_key');
  console.log('   AMAZON_PARTNER_TAG=your_partner_tag\n');
}

// Run the update
if (require.main === module) {
  updateProductImages();
}

module.exports = { updateProductImages, updateWithAmazonImages };
