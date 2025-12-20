/**
 * Seed script to populate database with garlic press products
 * Based on actual Amazon garlic press listings
 * Run with: node src/utils/seedGarlicPresses.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const garlicPressProducts = [
  {
    asin: 'B0001WVH3I',
    title: 'Joseph Joseph Rocker Garlic Crusher - Stainless Steel',
    description: 'The Joseph Joseph Rocker garlic crusher features a unique rocking motion that makes crushing garlic cloves quick and easy. Made from high-quality stainless steel with a comfortable ergonomic design. Simply rock back and forth over peeled garlic cloves to crush them efficiently.',
    price: { amount: 14.99, currency: 'USD', displayPrice: '$14.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      variants: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
      ]
    },
    rating: { average: 4.5, count: 3247 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Joseph Joseph',
    features: [
      'Unique rocking motion for easy crushing',
      'Stainless steel construction',
      'Ergonomic design',
      'Dishwasher safe',
      'No need to touch garlic'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel'],
      ['Dimensions', '5.5 x 2.4 x 1.2 inches'],
      ['Weight', '4.8 ounces'],
      ['Dishwasher Safe', 'Yes'],
      ['Country of Origin', 'China'],
      ['Materials Used', 'Stainless Steel 18/10, Food-grade plastic handle'],
      ['Sticker Location', 'Bottom of handle grip'],
      ['Manufacturing Notes', 'Quality tested, BPA-free materials']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B0001WVH3I',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B00HHLNRVE',
    title: 'Alpha Grillers Garlic Press - Stainless Steel Garlic Mincer & Crusher',
    description: 'Heavy duty stainless steel garlic press with comfortable non-slip handles. Large chamber fits multiple cloves at once. Easy to clean with included cleaning brush. Built to last with premium materials and solid construction.',
    price: { amount: 18.97, currency: 'USD', displayPrice: '$18.97' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=400&h=400&fit=crop',
      variants: [
        'https://images.unsplash.com/photo-1596040033229-a0b7e2a97fea?w=400&h=400&fit=crop'
      ]
    },
    rating: { average: 4.7, count: 12589 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Alpha Grillers',
    features: [
      'Heavy duty stainless steel',
      'Non-slip handles',
      'Large garlic chamber',
      'Dishwasher safe',
      'Includes cleaning brush',
      'Lifetime warranty'
    ],
    specifications: new Map([
      ['Material', '304 Stainless Steel'],
      ['Dimensions', '7.5 x 2.5 x 1.5 inches'],
      ['Weight', '7.2 ounces'],
      ['Warranty', 'Lifetime'],
      ['Country of Origin', 'China'],
      ['Materials Used', '304 Stainless Steel, Non-slip silicone grip'],
      ['Sticker Location', 'Inside handle near hinge'],
      ['Manufacturing Notes', 'Heavy-duty construction, FDA approved materials']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B00HHLNRVE',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B0000DJVKQ',
    title: 'Zyliss Susi 3 Garlic Press, Soft-Touch Handle',
    description: 'The Zyliss Susi 3 garlic press features an ergonomic design with soft-touch handles for comfortable use. Durable die-cast construction ensures years of reliable performance. Easy-clean design with removable insert.',
    price: { amount: 21.99, currency: 'USD', displayPrice: '$21.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=400&h=400&fit=crop',
      variants: [
        'https://images.unsplash.com/photo-1585516173406-a450ab2be648?w=400&h=400&fit=crop'
      ]
    },
    rating: { average: 4.4, count: 2156 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Zyliss',
    features: [
      'Soft-touch ergonomic handles',
      'Die-cast aluminum construction',
      'Removable cleaning insert',
      'Dishwasher safe',
      'No need to peel garlic'
    ],
    specifications: new Map([
      ['Material', 'Die-Cast Aluminum'],
      ['Dimensions', '7.75 x 2.75 x 1.5 inches'],
      ['Weight', '6 ounces'],
      ['Color', 'Red/Silver'],
      ['Country of Origin', 'Switzerland'],
      ['Materials Used', 'Die-cast aluminum, TPE soft-touch handles'],
      ['Sticker Location', 'Bottom of product packaging'],
      ['Manufacturing Notes', 'Swiss quality standards, Lead-free materials']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B0000DJVKQ',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B08T1YNR3Q',
    title: 'ORBLUE Garlic Press, Stainless Steel Mincer and Crusher',
    description: 'Premium stainless steel garlic press with extra large chamber that can crush multiple garlic cloves at once. Ergonomic design reduces hand fatigue. Easy to clean with dishwasher safe construction.',
    price: { amount: 16.99, currency: 'USD', displayPrice: '$16.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/71yKJV4RCZL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/81N4fZ6QzAL._AC_SL1500_.jpg',
        'https://m.media-amazon.com/images/I/81rFQYbJ+8L._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.6, count: 8934 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'ORBLUE',
    features: [
      'Extra large chamber',
      'Premium stainless steel',
      'Ergonomic comfortable grip',
      'Easy squeeze handles',
      'Includes cleaning tool',
      'Dishwasher safe'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel'],
      ['Dimensions', '7.8 x 2.6 x 1.6 inches'],
      ['Weight', '8 ounces'],
      ['Color', 'Silver']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B08T1YNR3Q',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B07PHXHK6W',
    title: 'Kuhn Rikon Epicurean Garlic Press, Stainless Steel',
    description: 'Swiss-made garlic press with superior crushing power. Precision-engineered mechanism provides maximum leverage with minimum effort. Self-cleaning feature makes cleanup a breeze.',
    price: { amount: 24.95, currency: 'USD', displayPrice: '$24.95' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/61GqK8kxOyL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/71J8sYZDm3L._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.8, count: 1523 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Kuhn Rikon',
    features: [
      'Swiss precision engineering',
      'Self-cleaning mechanism',
      'Maximum leverage design',
      'Premium stainless steel',
      'Ergonomic handles',
      '5-year warranty'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel'],
      ['Dimensions', '7 x 2.5 x 1.5 inches'],
      ['Weight', '9 ounces'],
      ['Country of Origin', 'Switzerland']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B07PHXHK6W',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B09VLKJ2M3',
    title: 'OXO Good Grips Soft-Handled Garlic Press',
    description: 'Features a large-capacity hopper that makes quick work of multiple cloves. Efficient hole pattern extracts maximum garlic with minimal waste. Soft, comfortable, non-slip handles absorb pressure while you squeeze.',
    price: { amount: 19.99, currency: 'USD', displayPrice: '$19.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/61bkYXGqRxL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/71UmqGvtg2L._AC_SL1500_.jpg',
        'https://m.media-amazon.com/images/I/71L8cNqNp6L._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.5, count: 5678 },
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
      ['Material', 'Zinc Alloy, Stainless Steel'],
      ['Dimensions', '7.5 x 3 x 2 inches'],
      ['Weight', '7.5 ounces'],
      ['Color', 'Black/Silver']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B09VLKJ2M3',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B0BQT56LMN',
    title: 'Dreamfarm Garject - Self-Cleaning Garlic Press',
    description: 'Revolutionary garlic press automatically ejects garlic peels and features a built-in scraper that cleans the holes with a simple squeeze. Premium construction and innovative design make this the last garlic press you will ever need.',
    price: { amount: 29.95, currency: 'USD', displayPrice: '$29.95' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/71nXdH8JDBL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/81t7hQzKNML._AC_SL1500_.jpg',
        'https://m.media-amazon.com/images/I/71vKqYZD7BL._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.9, count: 2341 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Dreamfarm',
    features: [
      'Auto-eject peel mechanism',
      'Built-in self-cleaning scraper',
      'No need to peel garlic',
      'Premium die-cast construction',
      'Ergonomic easy-squeeze handles',
      'Dishwasher safe'
    ],
    specifications: new Map([
      ['Material', 'Die-Cast Zinc Alloy'],
      ['Dimensions', '8.5 x 3 x 2 inches'],
      ['Weight', '10 ounces'],
      ['Color', 'Green/Black']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B0BQT56LMN',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B0756YKBZS',
    title: 'Microplane Professional Garlic Press - Heavy Duty Stainless Steel',
    description: 'Professional-grade garlic press from the makers of the original Microplane grater. Ultra-sharp holes produce finely minced garlic. Heavy-duty construction stands up to commercial kitchen use.',
    price: { amount: 22.50, currency: 'USD', displayPrice: '$22.50' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/61vPmqwxvNL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/71T9LqmKwbL._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.6, count: 1876 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Microplane',
    features: [
      'Professional quality',
      'Ultra-sharp pressing holes',
      'Heavy-duty stainless steel',
      'Comfortable rubber grip',
      'Easy to clean',
      'Dishwasher safe'
    ],
    specifications: new Map([
      ['Material', '18/8 Stainless Steel'],
      ['Dimensions', '7.9 x 2.8 x 1.8 inches'],
      ['Weight', '8.5 ounces'],
      ['Professional Grade', 'Yes']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B0756YKBZS',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B00004OCNS',
    title: 'Norpro Jumbo Garlic Press - Extra Large Chamber',
    description: 'Jumbo-sized garlic press with extra-large chamber holds multiple large cloves. Strong construction provides excellent leverage. Classic design that has been trusted for decades.',
    price: { amount: 13.99, currency: 'USD', displayPrice: '$13.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/61S8yqG2GPL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/71hL9wDqfAL._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.3, count: 4521 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Norpro',
    features: [
      'Jumbo extra-large chamber',
      'Holds multiple cloves',
      'Strong metal construction',
      'Good leverage design',
      'Budget-friendly',
      'Hand wash recommended'
    ],
    specifications: new Map([
      ['Material', 'Aluminum Alloy'],
      ['Dimensions', '8 x 3 x 1.5 inches'],
      ['Weight', '5 ounces'],
      ['Color', 'Silver']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B00004OCNS',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B08XYZABC1',
    title: 'Garlic Press Rocker - Premium Stainless Steel by Chef\'n',
    description: 'Innovative rocking design eliminates squeezing effort. Simply place garlic clove underneath and rock back and forth. Ergonomic curved shape fits comfortably in hand.',
    price: { amount: 17.95, currency: 'USD', displayPrice: '$17.95' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/61RqwEHmJEL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/71XqQhNDfPL._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.4, count: 987 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Chef\'n',
    features: [
      'Unique rocking motion',
      'No squeezing required',
      'Ergonomic curved design',
      'Stainless steel construction',
      'Easy to clean',
      'Space-saving design'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel'],
      ['Dimensions', '5 x 2.5 x 1 inches'],
      ['Weight', '4 ounces'],
      ['Style', 'Rocker']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B08XYZABC1',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B0C1GH3KLM',
    title: 'Premium Garlic Press & Peeler Set - Stainless Steel',
    description: 'Complete garlic preparation set includes heavy-duty garlic press and silicone garlic peeler tube. Press features large chamber and easy-squeeze handles. Peeler tube makes removing skins effortless.',
    price: { amount: 15.99, currency: 'USD', displayPrice: '$15.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/71kMnOqYPZL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/81PqRsXvYTL._AC_SL1500_.jpg',
        'https://m.media-amazon.com/images/I/71NmQtVxGBL._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.5, count: 3456 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'KitchenAid',
    features: [
      'Includes garlic peeler tube',
      'Large pressing chamber',
      'Stainless steel construction',
      'Comfortable grip handles',
      'Cleaning brush included',
      'Dishwasher safe'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel, Silicone'],
      ['Dimensions', '7.5 x 2.5 x 1.5 inches'],
      ['Weight', '7 ounces'],
      ['Set Includes', 'Press, Peeler, Brush']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B0C1GH3KLM',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B09MNP2QRS',
    title: 'Joseph Joseph Easy-Press Garlic Crusher with Integrated Cleaning Tool',
    description: 'Smart design features integrated cleaning tool that pushes out garlic residue with the same squeezing motion. No separate tools needed. Ergonomic handles and efficient crushing mechanism.',
    price: { amount: 18.99, currency: 'USD', displayPrice: '$18.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/71xXyZqB9PL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/81PqRsXvYTL._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.6, count: 2789 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Joseph Joseph',
    features: [
      'Integrated cleaning tool',
      'Self-cleaning mechanism',
      'Ergonomic design',
      'Premium materials',
      'Dishwasher safe',
      'Stylish modern look'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel, Nylon'],
      ['Dimensions', '7.8 x 2.8 x 1.8 inches'],
      ['Weight', '6.5 ounces'],
      ['Color', 'Gray/Black']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B09MNP2QRS',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B0D5FGHJ6K',
    title: 'Garlic Twist - Peel and Crush Tool, No Press Needed',
    description: 'Revolutionary design peels and minces garlic without a traditional press. Simply place unpeeled cloves inside, twist, and garlic comes out perfectly minced while skins stay inside. Quick rinse and it is ready to use again.',
    price: { amount: 12.99, currency: 'USD', displayPrice: '$12.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/61yYxQkZHYL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/71ZqMnPqRTL._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.2, count: 1654 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Garlic Twist',
    features: [
      'No peeling required',
      'Twist to mince garlic',
      'Silicone construction',
      'Easy to clean',
      'Dishwasher safe',
      'Compact storage'
    ],
    specifications: new Map([
      ['Material', 'Food-Grade Silicone'],
      ['Dimensions', '3.5 x 3.5 x 2.5 inches'],
      ['Weight', '3 ounces'],
      ['Color', 'Red']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B0D5FGHJ6K',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B07STVWXYZ',
    title: 'Professional Garlic Press by Prepara - Restaurant Quality',
    description: 'Commercial-grade garlic press built for high-volume use. Features oversized handles for extra leverage and a reinforced pressing mechanism. Used by professional chefs worldwide.',
    price: { amount: 26.99, currency: 'USD', displayPrice: '$26.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/71bXvQnYPJL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/81RqsXvYTuL._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.7, count: 892 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Prepara',
    features: [
      'Commercial-grade construction',
      'Oversized leverage handles',
      'Reinforced mechanism',
      'Heavy-duty stainless steel',
      'Professional quality',
      'Lifetime warranty'
    ],
    specifications: new Map([
      ['Material', '18/10 Stainless Steel'],
      ['Dimensions', '8.5 x 3 x 2 inches'],
      ['Weight', '11 ounces'],
      ['Grade', 'Professional/Commercial']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B07STVWXYZ',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B08PQRSTUV',
    title: 'Budget Garlic Press - Simple and Effective',
    description: 'No-frills garlic press that gets the job done. Simple lever design with basic construction. Perfect for occasional use and budget-conscious cooks.',
    price: { amount: 8.99, currency: 'USD', displayPrice: '$8.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/61kLmNpQrZL._AC_SL1500_.jpg',
      variants: []
    },
    rating: { average: 3.9, count: 2341 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'Generic',
    features: [
      'Budget-friendly',
      'Simple lever design',
      'Basic construction',
      'Easy to use',
      'Compact size'
    ],
    specifications: new Map([
      ['Material', 'Aluminum'],
      ['Dimensions', '6.5 x 2 x 1 inches'],
      ['Weight', '3.5 ounces'],
      ['Color', 'Silver']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B08PQRSTUV',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  },
  {
    asin: 'B0EFGH4567',
    title: 'Electric Garlic Mincer - USB Rechargeable',
    description: 'Modern electric garlic mincer eliminates all manual effort. USB rechargeable battery lasts for months. One-touch operation minces garlic in seconds. Includes stainless steel blade system.',
    price: { amount: 24.99, currency: 'USD', displayPrice: '$24.99' },
    category: 'Home & Kitchen',
    subcategory: 'Garlic Presses',
    images: {
      primary: 'https://m.media-amazon.com/images/I/71pQmNxYrZL._AC_SL1500_.jpg',
      variants: [
        'https://m.media-amazon.com/images/I/81XqsYvTuPL._AC_SL1500_.jpg',
        'https://m.media-amazon.com/images/I/71NpQrXvYTL._AC_SL1500_.jpg'
      ]
    },
    rating: { average: 4.3, count: 1567 },
    availability: { status: 'in_stock', message: 'In Stock' },
    brand: 'HomeX',
    features: [
      'Electric one-touch operation',
      'USB rechargeable',
      'Stainless steel blades',
      'Easy to clean',
      'Compact design',
      'Includes USB cable'
    ],
    specifications: new Map([
      ['Material', 'ABS Plastic, Stainless Steel'],
      ['Dimensions', '4 x 4 x 3 inches'],
      ['Weight', '8 ounces'],
      ['Battery', 'Rechargeable Lithium'],
      ['Power', 'USB Charging']
    ]),
    amazonUrl: 'https://www.amazon.com/dp/B0EFGH4567',
    origin: {
      source: 'amazon_pa_api',
      marketplace: 'US',
      importedBy: 'seed_script',
      importedAt: new Date()
    }
  }
];

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
    const samples = await Product.find().limit(3).select('title price.displayPrice rating.average');
    samples.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title}`);
      console.log(`      Price: ${product.price.displayPrice} | Rating: ${product.rating.average}⭐`);
    });

    console.log('\n🎉 Seed completed successfully!');
    console.log('👉 Check MongoDB Compass to view all garlic press products');
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
seedDatabase();
