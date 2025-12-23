/**
 * Test script to see what data SerpAPI returns for Walmart products
 */

const { getJson } = require('serpapi');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function testWalmartAPI() {
  const apiKey = process.env.SERPAPI_KEY;

  console.log('Testing SerpAPI Walmart integration...\n');
  console.log(`API Key: ${apiKey.substring(0, 10)}...`);

  try {
    // Test 1: Search for products
    console.log('\n=== TEST 1: Search Products ===');
    const searchParams = {
      engine: 'walmart',
      query: 'garlic press',
      page: 1,
      sort_by: 'best_seller',
      api_key: apiKey
    };

    const searchResults = await getJson(searchParams);

    if (searchResults.organic_results && searchResults.organic_results.length > 0) {
      console.log(`✅ Found ${searchResults.organic_results.length} products`);

      // Show details of first product
      const firstProduct = searchResults.organic_results[0];
      console.log('\nFirst Product Data:');
      console.log('- Title:', firstProduct.title);
      console.log('- Product ID:', firstProduct.product_id);
      console.log('- US Item ID:', firstProduct.us_item_id);
      console.log('- Rating:', firstProduct.rating);
      console.log('- Reviews Count:', firstProduct.reviews_count);
      console.log('- Rating Count:', firstProduct.rating_count);
      console.log('- Reviews:', firstProduct.reviews);
      console.log('\nFull first product object keys:');
      console.log(Object.keys(firstProduct));

      // Test 2: Get product reviews
      console.log('\n\n=== TEST 2: Get Product Reviews ===');
      const productId = firstProduct.product_id || firstProduct.us_item_id;

      if (productId) {
        console.log(`Fetching reviews for product ID: ${productId}`);

        try {
          const reviewsParams = {
            engine: 'walmart_product_reviews',
            product_id: productId,
            page: 1,
            api_key: apiKey
          };

          const reviewsResults = await getJson(reviewsParams);

          if (reviewsResults.reviews && reviewsResults.reviews.length > 0) {
            console.log(`✅ Found ${reviewsResults.reviews.length} reviews`);
            console.log('\nFirst Review Sample:');
            console.log('- Rating:', reviewsResults.reviews[0].rating);
            console.log('- Title:', reviewsResults.reviews[0].title);
            console.log('- Text:', reviewsResults.reviews[0].text?.substring(0, 200) + '...');
          } else {
            console.log('❌ No reviews returned from API');
            console.log('Response keys:', Object.keys(reviewsResults));
          }
        } catch (reviewError) {
          console.error('❌ Error fetching reviews:', reviewError.message);
        }
      } else {
        console.log('❌ No product ID found');
      }

      // Test 3: Get detailed product info
      console.log('\n\n=== TEST 3: Get Product Details ===');

      if (productId) {
        try {
          const detailsParams = {
            engine: 'walmart_product',
            product_id: productId,
            api_key: apiKey
          };

          const detailsResults = await getJson(detailsParams);

          console.log('Product Details Retrieved:');
          console.log('- Title:', detailsResults.product_result?.title);
          console.log('- Rating:', detailsResults.product_result?.rating);
          console.log('- Reviews Count:', detailsResults.product_result?.reviews_count);
          console.log('- Specifications available:', !!detailsResults.product_result?.specifications);

          if (detailsResults.product_result?.specifications) {
            console.log('- Specifications keys:', Object.keys(detailsResults.product_result.specifications));
          }
        } catch (detailError) {
          console.error('❌ Error fetching product details:', detailError.message);
        }
      }

    } else {
      console.log('❌ No products found in search results');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testWalmartAPI()
  .then(() => {
    console.log('\n✅ Test complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
