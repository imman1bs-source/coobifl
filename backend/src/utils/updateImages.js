/**
 * Update product images with working URLs
 * Run with: node src/utils/updateImages.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

async function updateImages() {
  try {
    console.log('🖼️  Updating product images...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products\n`);

    // Image URLs using reliable placeholder service
    const imageUrls = [
      'https://placehold.co/400x400/667eea/white?text=Garlic+Press+1',
      'https://placehold.co/400x400/764ba2/white?text=Garlic+Press+2',
      'https://placehold.co/400x400/f093fb/white?text=Garlic+Press+3',
      'https://placehold.co/400x400/4facfe/white?text=Garlic+Press+4',
      'https://placehold.co/400x400/00f2fe/white?text=Garlic+Press+5',
      'https://placehold.co/400x400/43e97b/white?text=Garlic+Press+6',
      'https://placehold.co/400x400/38f9d7/white?text=Garlic+Press+7',
      'https://placehold.co/400x400/fa709a/white?text=Garlic+Press+8',
      'https://placehold.co/400x400/fee140/white?text=Garlic+Press+9',
      'https://placehold.co/400x400/30cfd0/white?text=Garlic+Press+10',
      'https://placehold.co/400x400/a8edea/white?text=Garlic+Press+11',
      'https://placehold.co/400x400/ff6b6b/white?text=Garlic+Press+12',
      'https://placehold.co/400x400/4ecdc4/white?text=Garlic+Press+13',
      'https://placehold.co/400x400/95e1d3/white?text=Garlic+Press+14',
      'https://placehold.co/400x400/ffd93d/white?text=Garlic+Press+15',
      'https://placehold.co/400x400/6bcf7f/white?text=Garlic+Press+16'
    ];

    // Update each product with a unique image
    let updated = 0;
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageUrl = imageUrls[i % imageUrls.length];

      product.images = {
        primary: imageUrl,
        variants: [imageUrl]
      };

      await product.save();
      updated++;
      console.log(`✅ Updated: ${product.title.substring(0, 50)}...`);
    }

    console.log(`\n🎉 Successfully updated ${updated} products!`);
    console.log('👉 Refresh your browser to see the images\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateImages();
