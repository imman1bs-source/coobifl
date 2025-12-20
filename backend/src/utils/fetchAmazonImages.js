/**
 * Fetch Real Amazon Product Images
 *
 * This script helps you get real product images from Amazon.
 * Since you already have ASINs, you can construct Amazon image URLs directly.
 *
 * Amazon image URL format:
 * https://m.media-amazon.com/images/I/{IMAGE_ID}._AC_SL1500_.jpg
 *
 * However, you need the IMAGE_ID which requires either:
 * 1. Amazon Product Advertising API (requires approval)
 * 2. Web scraping (against Amazon TOS)
 * 3. Manual lookup from Amazon product pages
 *
 * For now, this script uses placeholder Unsplash images and shows you
 * how to manually add real Amazon images once you have them.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Better quality kitchen/garlic press images from Unsplash
const kitchenImages = {
  'garlic_press_1': {
    primary: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop&q=80',
    variants: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80'
    ]
  },
  'garlic_press_2': {
    primary: 'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=800&h=800&fit=crop&q=80',
    variants: [
      'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=600&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=400&h=400&fit=crop&q=80'
    ]
  },
  'garlic_press_3': {
    primary: 'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=800&h=800&fit=crop&q=80',
    variants: [
      'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=600&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=400&h=400&fit=crop&q=80'
    ]
  },
  'stainless_steel': {
    primary: 'https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=800&h=800&fit=crop&q=80',
    variants: [
      'https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=600&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-1584990347449-39b5e727c443?w=400&h=400&fit=crop&q=80'
    ]
  },
  'kitchen_tools': {
    primary: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=800&fit=crop&q=80',
    variants: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop&q=80'
    ]
  }
};

async function updateWithPlaceholderImages() {
  try {
    console.log('🖼️  Updating products with high-quality Unsplash images...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products\n`);

    const imageKeys = Object.keys(kitchenImages);
    let updated = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageKey = imageKeys[i % imageKeys.length];

      product.images = kitchenImages[imageKey];
      await product.save();
      updated++;

      console.log(`✓ Updated: ${product.title}`);
    }

    console.log(`\n✅ Updated ${updated} products with placeholder images\n`);

    await mongoose.connection.close();

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Function to show how to add real Amazon images
function showAmazonImageInstructions() {
  console.log('\n📸 How to Get Real Amazon Product Images:\n');
  console.log('Option 1: Manual Method (No API required)');
  console.log('─────────────────────────────────────────');
  console.log('1. Go to Amazon.com and search for each ASIN');
  console.log('2. Right-click on the product image and "Open image in new tab"');
  console.log('3. Copy the URL - it will look like:');
  console.log('   https://m.media-amazon.com/images/I/71ABC123XYZ._AC_SL1500_.jpg');
  console.log('4. Update your product in the database with this URL\n');

  console.log('Option 2: Amazon Product Advertising API');
  console.log('─────────────────────────────────────────');
  console.log('1. Sign up for Amazon Associates program');
  console.log('2. Apply for Product Advertising API access');
  console.log('3. Get your Access Key, Secret Key, and Partner Tag');
  console.log('4. Use the API to fetch product images automatically\n');

  console.log('Option 3: Use Product ASIN Direct URLs');
  console.log('─────────────────────────────────────────');
  console.log('Some Amazon images can be accessed directly via:');
  console.log('https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN={ASIN}&Format=_SL250_\n');

  console.log('For example, for ASIN B00HHLNRVE:');
  console.log('https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00HHLNRVE&Format=_SL250_\n');
}

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'update') {
    updateWithPlaceholderImages();
  } else if (command === 'help') {
    showAmazonImageInstructions();
  } else {
    console.log('Usage:');
    console.log('  node src/utils/fetchAmazonImages.js update  - Update with Unsplash placeholders');
    console.log('  node src/utils/fetchAmazonImages.js help    - Show Amazon image instructions');
  }
}

module.exports = { updateWithPlaceholderImages, showAmazonImageInstructions };
