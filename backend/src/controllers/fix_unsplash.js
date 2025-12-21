// Replace the updateUnsplashImages function with correct URLs
const fixedFunction = `
exports.updateUnsplashImages = async (req, res, next) => {
  try {
    const Product = require('../models/Product');

    // Curated working Unsplash image URLs with correct format
    const kitchenImages = [
      { primary: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=800&q=80', variants: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', variants: ['https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80', variants: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1584990347449-39b5e727c443?auto=format&fit=crop&w=800&q=80', variants: ['https://images.unsplash.com/photo-1584990347449-39b5e727c443?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1584990347449-39b5e727c443?auto=format&fit=crop&w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', variants: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?auto=format&fit=crop&w=800&q=80', variants: ['https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?auto=format&fit=crop&w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1585516173406-a450ab2be648?auto=format&fit=crop&w=800&q=80', variants: ['https://images.unsplash.com/photo-1585516173406-a450ab2be648?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1585516173406-a450ab2be648?auto=format&fit=crop&w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?auto=format&fit=crop&w=800&q=80', variants: ['https://images.unsplash.com/photo-1603189343302-e603f7add05a?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?auto=format&fit=crop&w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?auto=format&fit=crop&w=800&q=80', variants: ['https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?auto=format&fit=crop&w=400&q=80'] },
      { primary: 'https://images.unsplash.com/photo-1556910636-196e58bd14f9?auto=format&fit=crop&w=800&q=80', variants: ['https://images.unsplash.com/photo-1556910636-196e58bd14f9?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1556910636-196e58bd14f9?auto=format&fit=crop&w=400&q=80'] }
    ];

    const products = await Product.find({});
    let updated = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageSet = kitchenImages[i % kitchenImages.length];
      product.images = imageSet;
      await product.save();
      updated++;
    }

    res.status(200).json({
      success: true,
      message: 'Updated all products with working Unsplash images',
      updated: updated,
      total: products.length
    });
  } catch (error) {
    next(error);
  }
};
`;
console.log(fixedFunction);
