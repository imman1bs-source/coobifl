/**
 * Bulk Walmart Product Seeding Script
 * Fetches products from multiple categories
 */

const axios = require('axios');

const API_URL = 'http://localhost:5001/api/seed-walmart';

// Categories to fetch
const categories = [
  { name: 'kitchen knife', limit: 10 },
  { name: 'cutting board', limit: 10 },
  { name: 'mixing bowl', limit: 10 },
  { name: 'spatula', limit: 10 },
  { name: 'measuring cup', limit: 10 },
  { name: 'whisk', limit: 10 },
  { name: 'peeler', limit: 10 },
  { name: 'grater', limit: 10 },
  { name: 'colander', limit: 10 },
  { name: 'tongs', limit: 10 }
];

async function seedCategory(category, limit) {
  try {
    console.log(`\n🔍 Fetching ${limit} products for: ${category}`);

    const response = await axios.post(API_URL, {
      category: category,
      limit: limit
    });

    const data = response.data;
    console.log(`✅ ${category}: Inserted ${data.inserted}, Skipped ${data.skipped} duplicates`);

    return {
      category,
      inserted: data.inserted,
      skipped: data.skipped
    };
  } catch (error) {
    console.error(`❌ Error fetching ${category}:`, error.message);
    return {
      category,
      inserted: 0,
      skipped: 0,
      error: error.message
    };
  }
}

async function seedAll() {
  console.log('🚀 Starting bulk Walmart product seeding...\n');
  console.log(`📋 Categories to fetch: ${categories.length}`);
  console.log(`📦 Target products: ${categories.reduce((sum, cat) => sum + cat.limit, 0)}`);

  const results = [];
  let totalInserted = 0;
  let totalSkipped = 0;

  for (let i = 0; i < categories.length; i++) {
    const { name, limit } = categories[i];

    const result = await seedCategory(name, limit);
    results.push(result);

    totalInserted += result.inserted || 0;
    totalSkipped += result.skipped || 0;

    console.log(`📊 Progress: ${i + 1}/${categories.length} categories complete`);
    console.log(`📈 Total so far: ${totalInserted} inserted, ${totalSkipped} skipped`);

    // Rate limiting: wait 2 seconds between requests to avoid SerpAPI limits
    if (i < categories.length - 1) {
      console.log('⏳ Waiting 2 seconds before next category...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Bulk seeding complete!');
  console.log('='.repeat(60));
  console.log(`✅ Total products inserted: ${totalInserted}`);
  console.log(`⚠️  Total duplicates skipped: ${totalSkipped}`);
  console.log(`📊 Success rate: ${((totalInserted / (totalInserted + totalSkipped)) * 100).toFixed(1)}%`);

  console.log('\nResults by category:');
  results.forEach(result => {
    console.log(`  - ${result.category}: ${result.inserted} inserted, ${result.skipped} skipped`);
  });
}

// Run the script
seedAll()
  .then(() => {
    console.log('\n✨ Script finished successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
