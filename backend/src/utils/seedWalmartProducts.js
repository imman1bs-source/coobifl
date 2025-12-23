const WalmartFetcher = require('./walmartFetcher');
const COOExtractor = require('./cooExtractor');

/**
 * Seed database with Walmart products
 * Fetches products from Walmart, extracts COO from reviews, and returns formatted data
 */

async function seedWalmartProducts(category = 'garlic press', limit = 20) {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    throw new Error('SERPAPI_KEY environment variable is required');
  }

  const fetcher = new WalmartFetcher(apiKey);
  const extractor = new COOExtractor();

  console.log(`🔍 Fetching ${limit} ${category} products from Walmart (Best Sellers & Most Reviewed)...`);

  try {
    // Step 1: Search for products (sorted by best sellers with most reviews)
    const products = await fetcher.searchProducts(category, 1, 'best_seller');

    if (products.length === 0) {
      console.log('❌ No products found');
      return [];
    }

    console.log(`✅ Found ${products.length} products (sorted by reviews: ${products[0]?.rating?.count || 0} to ${products[products.length-1]?.rating?.count || 0})`);

    // Step 2: Fetch reviews for each product and extract COO
    const productsWithCOO = [];
    const maxProducts = Math.min(products.length, limit);

    for (let i = 0; i < maxProducts; i++) {
      const product = products[i];
      const productId = product.metadata?.walmartId;

      if (!productId) {
        console.log(`⚠️  Skipping product ${i + 1}: No product ID`);
        continue;
      }

      console.log(`📦 Processing ${i + 1}/${maxProducts}: ${product.title.substring(0, 50)}...`);

      try {
        // Try to extract COO from description and title (reviews API not reliable)
        const cooResult = extractor.extractCOO({
          reviews: [],  // Reviews API not working for Walmart
          description: product.description,
          specifications: product.specifications,
          title: product.title  // Also check product title
        });

        if (cooResult.country && cooResult.confidence > 0.4) {
          product.specifications['Country of Origin'] = cooResult.country;
          product.cooMetadata = {
            confidence: cooResult.confidence,
            source: cooResult.source
          };
          console.log(`   ✅ COO extracted: ${cooResult.country} (confidence: ${(cooResult.confidence * 100).toFixed(0)}% from ${cooResult.source})`);
        } else {
          // Apply common default COO for kitchen products (most are from China)
          // User can manually update these later via the product detail page
          console.log(`   ⚠️  COO not found - will need manual entry`);
        }

        productsWithCOO.push(product);

        // Rate limiting reduced since we're not calling reviews API
        if (i < maxProducts - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));  // Reduced from 1000ms
        }

      } catch (error) {
        console.error(`   ❌ Error processing product: ${error.message}`);
        // Continue with next product even if this one fails
        productsWithCOO.push(product);
      }
    }

    console.log(`\n✅ Successfully processed ${productsWithCOO.length} products`);
    console.log(`📊 Products with COO: ${productsWithCOO.filter(p => p.specifications['Country of Origin']).length}`);

    return productsWithCOO;

  } catch (error) {
    console.error('❌ Error seeding Walmart products:', error);
    throw error;
  }
}

/**
 * Manual seed data for immediate use (without API)
 * Use this while waiting for SerpAPI approval or during development
 */
function getManualWalmartProducts() {
  return [
    {
      asin: 'WM-001',
      title: 'Mainstays Stainless Steel Garlic Press',
      brand: 'Mainstays',
      description: 'Easy-to-use garlic press with comfortable grip handles. Stainless steel construction for durability.',
      price: {
        amount: 5.97,
        currency: 'USD',
        displayPrice: '$5.97'
      },
      images: {
        primary: 'https://i5.walmartimages.com/asr/placeholder.jpg',
        gallery: []
      },
      rating: {
        average: 4.2,
        count: 342
      },
      availability: {
        inStock: true,
        message: 'In Stock'
      },
      specifications: {
        'Material': 'Stainless Steel',
        'Dimensions': '7.5 x 2.5 x 1.5 inches',
        'Country of Origin': 'China'
      },
      affiliateLink: 'https://www.walmart.com/',
      source: 'walmart'
    },
    {
      asin: 'WM-002',
      title: 'OXO Good Grips Soft-Handled Garlic Press',
      brand: 'OXO',
      description: 'Efficient garlic press with soft, comfortable non-slip handles and built-in cleaner.',
      price: {
        amount: 19.99,
        currency: 'USD',
        displayPrice: '$19.99'
      },
      images: {
        primary: 'https://i5.walmartimages.com/asr/placeholder.jpg',
        gallery: []
      },
      rating: {
        average: 4.6,
        count: 1523
      },
      availability: {
        inStock: true,
        message: 'In Stock'
      },
      specifications: {
        'Material': 'Stainless Steel/Plastic',
        'Dimensions': '8 x 3 x 2 inches',
        'Country of Origin': 'China'
      },
      affiliateLink: 'https://www.walmart.com/',
      source: 'walmart'
    },
    {
      asin: 'WM-003',
      title: 'Zyliss Susi 3 Garlic Press',
      brand: 'Zyliss',
      description: 'Swiss-designed garlic press with unique chamber design for easy cleaning.',
      price: {
        amount: 24.99,
        currency: 'USD',
        displayPrice: '$24.99'
      },
      images: {
        primary: 'https://i5.walmartimages.com/asr/placeholder.jpg',
        gallery: []
      },
      rating: {
        average: 4.5,
        count: 892
      },
      availability: {
        inStock: true,
        message: 'In Stock'
      },
      specifications: {
        'Material': 'Die-Cast Aluminum',
        'Dimensions': '7.5 x 2.75 x 2 inches',
        'Country of Origin': 'Switzerland'
      },
      affiliateLink: 'https://www.walmart.com/',
      source: 'walmart'
    },
    {
      asin: 'WM-004',
      title: 'KitchenAid Classic Garlic Press',
      brand: 'KitchenAid',
      description: 'Professional-grade garlic press with large capacity chamber and removable insert for easy cleaning.',
      price: {
        amount: 16.99,
        currency: 'USD',
        displayPrice: '$16.99'
      },
      images: {
        primary: 'https://i5.walmartimages.com/asr/placeholder.jpg',
        gallery: []
      },
      rating: {
        average: 4.4,
        count: 654
      },
      availability: {
        inStock: true,
        message: 'In Stock'
      },
      specifications: {
        'Material': 'Stainless Steel',
        'Dimensions': '8.5 x 2.5 x 1.75 inches',
        'Country of Origin': 'China'
      },
      affiliateLink: 'https://www.walmart.com/',
      source: 'walmart'
    },
    {
      asin: 'WM-005',
      title: 'Joseph Joseph Easy-Clean Garlic Crusher',
      brand: 'Joseph Joseph',
      description: 'Innovative design with integrated cleaning tool. Crushes garlic with minimal effort.',
      price: {
        amount: 12.99,
        currency: 'USD',
        displayPrice: '$12.99'
      },
      images: {
        primary: 'https://i5.walmartimages.com/asr/placeholder.jpg',
        gallery: []
      },
      rating: {
        average: 4.3,
        count: 445
      },
      availability: {
        inStock: true,
        message: 'In Stock'
      },
      specifications: {
        'Material': 'Nylon/Stainless Steel',
        'Dimensions': '7 x 2.5 x 2 inches',
        'Country of Origin': 'China'
      },
      affiliateLink: 'https://www.walmart.com/',
      source: 'walmart'
    }
  ];
}

module.exports = {
  seedWalmartProducts,
  getManualWalmartProducts
};
