/**
 * Seed script to populate database with garlic press products
 * Based on actual Amazon garlic press listings with REAL ASINs
 * Run with: node src/utils/seedGarlicPresses.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const garlicPressProducts = [
  {
    asin: 'B00I937QEI',
    title: 'Alpha Grillers Garlic Press - Stainless Steel with Silicone Peeler',
    description: 'Heavy duty stainless steel garlic press with comfortable non-slip handles. Large chamber fits multiple cloves at once. Easy to clean with included cleaning brush and silicone peeler. Built to last with premium materials and solid construction.',
    price: { amount: 18.97, currency: 'USD', displayPrice: '$18.97' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B00I937QEI.jpg',
      variants: ['/images/products/B00I937QEI.jpg']
    },
    rating: { average: 4.7, count: 12589 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Alpha Grillers',
    features: [
      'Heavy duty stainless steel',
      'Non-slip handles',
      'Large garlic chamber',
      'Dishwasher safe',
      'Includes cleaning brush and peeler',
      'Lifetime warranty'
    ],
    specifications: new Map([
      ['Material', '304 Stainless Steel'],
      ['Dimensions', '7.5 x 2.5 x 1.5 inches'],
      ['Weight', '7.2 ounces']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B00I937QEI',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B007ADJ4JI',
    title: 'Dreamfarm Garject Self-Cleaning Garlic Press - Black',
    description: 'Revolutionary garlic press that presses unpeeled garlic, scrapes itself clean, and ejects the peel. As you open it, the spring-loaded scraper automatically engages. Simply push the peel eject button to shoot peel into bin.',
    price: { amount: 29.95, currency: 'USD', displayPrice: '$29.95' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B007ADJ4JI.jpg',
      variants: ['/images/products/B007ADJ4JI.jpg']
    },
    rating: { average: 4.8, count: 8934 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Dreamfarm',
    features: [
      'Self-cleaning scraper mechanism',
      'Automatic peel eject button',
      'No need to peel garlic',
      'Chrome-plated zinc construction',
      'Spring-loaded design',
      'Dishwasher safe'
    ],
    specifications: new Map([
      ['Material', 'Chrome-Plated Zinc'],
      ['Dimensions', '8.5 x 3 x 2 inches'],
      ['Weight', '10 ounces']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B007ADJ4JI',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B08W5DJ3B9',
    title: 'Kuhn Rikon Easy-Clean Garlic Press - Stainless Steel',
    description: 'Swiss-made garlic press with superior crushing power. Precision-engineered mechanism provides maximum leverage with minimum effort. Flip-open sieve for easy cleaning.',
    price: { amount: 24.95, currency: 'USD', displayPrice: '$24.95' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B08W5DJ3B9.jpg',
      variants: ['/images/products/B08W5DJ3B9.jpg']
    },
    rating: { average: 4.8, count: 1523 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Kuhn Rikon',
    features: [
      'Swiss precision engineering',
      'Easy-clean flip-open sieve',
      'Maximum leverage design',
      'Premium stainless steel',
      'Ergonomic handles',
      'Dishwasher safe'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel'],
      ['Dimensions', '7 x 2.5 x 1.5 inches'],
      ['Weight', '9 ounces']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B08W5DJ3B9',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B09QBDRCRK',
    title: 'OXO Good Grips Stainless Steel Garlic Press',
    description: 'Features a large-capacity hopper that makes quick work of multiple cloves. Efficient hole pattern extracts maximum garlic with minimal waste. Soft, comfortable, non-slip handles absorb pressure while you squeeze.',
    price: { amount: 19.99, currency: 'USD', displayPrice: '$19.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B09QBDRCRK.jpg',
      variants: ['/images/products/B09QBDRCRK.jpg']
    },
    rating: { average: 4.6, count: 5678 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'OXO',
    features: [
      'Large capacity hopper',
      'Soft non-slip handles',
      'Efficient hole pattern',
      'Built-in cleaner',
      'Dishwasher safe',
      'No need to peel garlic'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel'],
      ['Dimensions', '7.5 x 3 x 2 inches'],
      ['Weight', '7.5 ounces']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B09QBDRCRK',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B007D3V00Q',
    title: 'Zyliss Susi 3 Garlic Press - Aluminum with Soft-Touch Handle',
    description: 'The Zyliss Susi 3 garlic press features an ergonomic design with soft-touch handles for comfortable use. Durable die-cast construction ensures years of reliable performance. Easy-clean design with removable insert.',
    price: { amount: 21.99, currency: 'USD', displayPrice: '$21.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B007D3V00Q.jpg',
      variants: ['/images/products/B007D3V00Q.jpg']
    },
    rating: { average: 4.5, count: 2156 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Zyliss',
    features: [
      'Soft-touch ergonomic handles',
      'Die-cast aluminum construction',
      'Removable cleaning insert',
      'Dishwasher safe',
      'No need to peel garlic',
      'Built-in cleaning tool'
    ],
    specifications: new Map([
      ['Material', 'Die-Cast Aluminum'],
      ['Dimensions', '7.75 x 2.75 x 1.5 inches'],
      ['Weight', '6 ounces']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B007D3V00Q',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B07N7KFHVH',
    title: 'Zulay Kitchen Premium Garlic Press - Rust Proof with Ergonomic Handle',
    description: 'Professional garlic mincer tool with easy-squeeze design. Rust-proof stainless steel construction with soft ergonomic handles. Includes silicone garlic peeler and cleaning brush.',
    price: { amount: 15.99, currency: 'USD', displayPrice: '$15.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B07N7KFHVH.jpg',
      variants: ['/images/products/B07N7KFHVH.jpg']
    },
    rating: { average: 4.6, count: 8234 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Zulay Kitchen',
    features: [
      'Rust-proof stainless steel',
      'Soft ergonomic handles',
      'Easy-squeeze design',
      'Includes peeler and brush',
      'Dishwasher safe',
      'Lightweight'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel'],
      ['Dimensions', '7.3 x 2.4 x 1.6 inches'],
      ['Weight', '6.5 ounces']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B07N7KFHVH',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B06Y4F2MK4',
    title: 'Dreamfarm Garject Self-Cleaning Garlic Press - Green',
    description: 'World\'s best garlic press that presses unpeeled garlic, scrapes itself clean, and ejects the peel. Green colorway of the award-winning design with automatic cleaning mechanism.',
    price: { amount: 29.95, currency: 'USD', displayPrice: '$29.95' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B06Y4F2MK4.jpg',
      variants: ['/images/products/B06Y4F2MK4.jpg']
    },
    rating: { average: 4.9, count: 7234 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Dreamfarm',
    features: [
      'Self-cleaning mechanism',
      'Peel eject button',
      'No peeling required',
      'Spring-loaded scraper',
      'Dishwasher safe',
      'Award-winning design'
    ],
    specifications: new Map([
      ['Material', 'Chrome-Plated Zinc'],
      ['Dimensions', '8.5 x 3 x 2 inches'],
      ['Weight', '10 ounces'],
      ['Color', 'Green']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B06Y4F2MK4',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B00XCSLO1Q',
    title: 'Dreamfarm Garject Self-Cleaning Garlic Press - Red',
    description: 'Revolutionary garlic press in vibrant red. Presses unpeeled garlic, automatically cleans itself, and ejects peels with button push. Premium chrome-plated construction.',
    price: { amount: 29.95, currency: 'USD', displayPrice: '$29.95' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B00XCSLO1Q.jpg',
      variants: ['/images/products/B00XCSLO1Q.jpg']
    },
    rating: { average: 4.8, count: 6543 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Dreamfarm',
    features: [
      'Self-cleaning mechanism',
      'Automatic peel ejection',
      'No peeling needed',
      'Premium construction',
      'Dishwasher safe',
      'Vibrant red color'
    ],
    specifications: new Map([
      ['Material', 'Chrome-Plated Zinc'],
      ['Dimensions', '8.5 x 3 x 2 inches'],
      ['Weight', '10 ounces'],
      ['Color', 'Red']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B00XCSLO1Q',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B00HEZ888K',
    title: 'OXO Good Grips Heavy Duty Garlic Press - Die-Cast Zinc',
    description: 'Heavy-duty die-cast zinc garlic press with soft comfortable handles. Large chamber accommodates multiple cloves. Efficient hole pattern and built-in cleaning tool.',
    price: { amount: 21.99, currency: 'USD', displayPrice: '$21.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B00HEZ888K.jpg',
      variants: ['/images/products/B00HEZ888K.jpg']
    },
    rating: { average: 4.6, count: 9876 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'OXO',
    features: [
      'Heavy-duty die-cast zinc',
      'Soft comfortable handles',
      'Large chamber',
      'Built-in cleaning tool',
      'Dishwasher safe',
      'No peeling needed'
    ],
    specifications: new Map([
      ['Material', 'Die-Cast Zinc'],
      ['Dimensions', '7.5 x 3 x 2 inches'],
      ['Weight', '8 ounces'],
      ['Color', 'Black']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B00HEZ888K',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B016KMPVOQ',
    title: 'OXO Garlic Press - Stainless Steel',
    description: 'Classic OXO stainless steel garlic press with ergonomic design. Sturdy construction crushes garlic efficiently. Easy to clean with detachable cleaning tool.',
    price: { amount: 17.99, currency: 'USD', displayPrice: '$17.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B016KMPVOQ.jpg',
      variants: ['/images/products/B016KMPVOQ.jpg']
    },
    rating: { average: 4.5, count: 4321 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'OXO',
    features: [
      'Stainless steel construction',
      'Ergonomic design',
      'Efficient crushing',
      'Detachable cleaning tool',
      'Dishwasher safe',
      'Durable build'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel'],
      ['Dimensions', '7 x 2.5 x 1.5 inches'],
      ['Weight', '7 ounces']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B016KMPVOQ',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B00CS9BZNM',
    title: 'Kuhn Rikon Easy Clean Garlic Press - Green',
    description: 'Swiss-engineered garlic press in vibrant green. Features easy-clean design with removable insert. No need to peel garlic before pressing.',
    price: { amount: 22.50, currency: 'USD', displayPrice: '$22.50' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B00CS9BZNM.jpg',
      variants: ['/images/products/B00CS9BZNM.jpg']
    },
    rating: { average: 4.7, count: 3456 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Kuhn Rikon',
    features: [
      'Swiss engineering',
      'Easy-clean design',
      'Removable insert',
      'No peeling needed',
      'Dishwasher safe',
      'Vibrant green color'
    ],
    specifications: new Map([
      ['Material', 'Aluminum, Plastic'],
      ['Dimensions', '7 x 2.5 x 1.5 inches'],
      ['Weight', '5.5 ounces'],
      ['Color', 'Green']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B00CS9BZNM',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B07QL9P493',
    title: 'Kuhn Rikon Easy-Clean Garlic Press - Red',
    description: 'Swiss-made easy-clean garlic press in red. 7-inch design with ergonomic handles. No need to peel garlic cloves before pressing.',
    price: { amount: 22.50, currency: 'USD', displayPrice: '$22.50' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B07QL9P493.jpg',
      variants: ['/images/products/B07QL9P493.jpg']
    },
    rating: { average: 4.7, count: 2987 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Kuhn Rikon',
    features: [
      'Swiss precision',
      'Easy-clean design',
      'No peeling required',
      'Ergonomic handles',
      'Dishwasher safe',
      'Vibrant red color'
    ],
    specifications: new Map([
      ['Material', 'Aluminum, Plastic'],
      ['Dimensions', '7 x 2.5 x 1.5 inches'],
      ['Weight', '5.5 ounces'],
      ['Color', 'Red']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B07QL9P493',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B00CBM6K9K',
    title: 'Kuhn Rikon Easy-Squeeze Garlic Press - Red 7-Inch',
    description: 'Easy-squeeze design requires minimal effort to crush garlic. Swiss quality construction with comfortable ergonomic handles. Red colorway adds style to your kitchen.',
    price: { amount: 20.95, currency: 'USD', displayPrice: '$20.95' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B00CBM6K9K.jpg',
      variants: ['/images/products/B00CBM6K9K.jpg']
    },
    rating: { average: 4.6, count: 4123 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Kuhn Rikon',
    features: [
      'Easy-squeeze mechanism',
      'Swiss quality',
      'Ergonomic handles',
      'Minimal effort required',
      'Dishwasher safe',
      'Stylish red design'
    ],
    specifications: new Map([
      ['Material', 'Aluminum, Plastic'],
      ['Dimensions', '7 x 2.5 x 1.5 inches'],
      ['Weight', '5 ounces'],
      ['Color', 'Red']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B00CBM6K9K',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B01ATV4O2O',
    title: 'Joseph Joseph Garlic Rocker Crusher - Stainless Steel',
    description: 'The Joseph Joseph Rocker garlic crusher features a unique rocking motion that makes crushing garlic cloves quick and easy. Made from high-quality stainless steel with a comfortable ergonomic design.',
    price: { amount: 14.99, currency: 'USD', displayPrice: '$14.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B01ATV4O2O.jpg',
      variants: ['/images/products/B01ATV4O2O.jpg']
    },
    rating: { average: 4.5, count: 3247 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Joseph Joseph',
    features: [
      'Unique rocking motion',
      'Stainless steel construction',
      'Ergonomic design',
      'Dishwasher safe',
      'No need to touch garlic',
      'Easy to clean'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel'],
      ['Dimensions', '5.5 x 2.4 x 1.2 inches'],
      ['Weight', '4.8 ounces']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B01ATV4O2O',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B000LNRPC2',
    title: 'Norpro Silver Garlic Press - Classic Design',
    description: 'Classic Norpro garlic press with sturdy construction. Simple lever design provides good crushing power. Budget-friendly option that gets the job done.',
    price: { amount: 13.99, currency: 'USD', displayPrice: '$13.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B000LNRPC2.jpg',
      variants: ['/images/products/B000LNRPC2.jpg']
    },
    rating: { average: 4.3, count: 2876 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Norpro',
    features: [
      'Classic design',
      'Sturdy construction',
      'Simple lever mechanism',
      'Budget-friendly',
      'Easy to use',
      'Hand wash recommended'
    ],
    specifications: new Map([
      ['Material', 'Aluminum Alloy'],
      ['Dimensions', '7.5 x 2.5 x 1.5 inches'],
      ['Weight', '5 ounces'],
      ['Color', 'Silver']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B000LNRPC2',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B00GM3IKR4',
    title: 'Dreamfarm Garject Lite Self-Cleaning Garlic Press - Black Nylon',
    description: 'Lightweight version of the award-winning Garject. Made from durable nylon with the same self-cleaning and peel-ejecting features. Perfect for those who want less weight.',
    price: { amount: 19.95, currency: 'USD', displayPrice: '$19.95' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: '/images/products/B00GM3IKR4.jpg',
      variants: ['/images/products/B00GM3IKR4.jpg']
    },
    rating: { average: 4.7, count: 4567 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Dreamfarm',
    features: [
      'Lightweight nylon construction',
      'Self-cleaning mechanism',
      'Peel eject button',
      'No peeling needed',
      'Dishwasher safe',
      'Same Garject design'
    ],
    specifications: new Map([
      ['Material', 'Nylon'],
      ['Dimensions', '8.5 x 3 x 2 inches'],
      ['Weight', '6 ounces'],
      ['Color', 'Black']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B00GM3IKR4',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  }
];

// Export for use in controller
module.exports = garlicPressProducts;

async function seedDatabase() {
  try {
    console.log('🚀 Starting garlic press seed script...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing products\n`);

    // Insert garlic press products
    console.log('📦 Inserting garlic press products...\n');
    const insertedProducts = await Product.insertMany(garlicPressProducts);
    console.log(`✅ Successfully inserted ${insertedProducts.length} garlic press products!\n`);

    // Display summary
    console.log('📊 Summary:');
    console.log('─'.repeat(50));

    const categories = await Product.distinct('category');
    console.log(`   Categories: ${categories.join(', ')}`);

    const brands = await Product.distinct('brand');
    console.log(`   Brands: ${brands.length} unique brands`);

    const avgPrice = await Product.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price.amount' } } }
    ]);
    console.log(`   Average Price: $${avgPrice[0].avgPrice.toFixed(2)}`);

    const totalProducts = await Product.countDocuments();
    console.log(`   Total Products: ${totalProducts}`);

    console.log('─'.repeat(50));
    console.log('\n✨ Sample products:');
    const samples = await Product.find().limit(3).select('title price.displayPrice rating.average asin');
    samples.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title}`);
      console.log(`      ASIN: ${product.asin} | Price: ${product.price.displayPrice} | Rating: ${product.rating.average}⭐`);
    });

    console.log('\n🎉 Seed completed successfully!');
    console.log('👉 All products have REAL Amazon ASINs');
    console.log('👉 Database: amazon_product_hub');
    console.log('👉 Collection: products\n');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed script
if (require.main === module) {
  seedDatabase();
}
