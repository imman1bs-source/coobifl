const http = require('http');

http.get('http://localhost:5001/api/products?limit=5', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const response = JSON.parse(data);

    console.log('=== API TEST RESULTS ===\n');

    response.data.forEach((p, i) => {
      console.log(`[${i+1}] ${p.title.substring(0, 50)}`);
      console.log(`    Source: ${p.origin?.source}`);
      console.log(`    Amazon URL: ${p.amazonUrl || 'N/A'}`);
      console.log(`    Walmart URL: ${p.walmartUrl || 'N/A'}`);
      console.log(`    COO: ${p.specifications['Country of Origin']}`);
      console.log('');
    });

    console.log(`Total products returned: ${response.data.length}`);
    console.log(`Total in database: ${response.pagination.total}`);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
