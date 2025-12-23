const mongoose = require('mongoose');
const Product = require('../src/models/Product');

mongoose.connect('mongodb://localhost:27017/amazon_product_hub')
.then(async () => {
  const all = await Product.find().lean();

  let withCOO = 0;
  let withoutCOO = 0;
  const countries = {};

  all.forEach(p => {
    const coo = p.specifications && p.specifications['Country of Origin'];
    if (coo && coo.trim() !== '') {
      withCOO++;
      countries[coo] = (countries[coo] || 0) + 1;
    } else {
      withoutCOO++;
    }
  });

  console.log('Total products:', all.length);
  console.log('Products WITH COO:', withCOO);
  console.log('Products WITHOUT COO:', withoutCOO);
  console.log('\nCountries breakdown:');
  Object.entries(countries).sort((a, b) => b[1] - a[1]).forEach(([country, count]) => {
    console.log(`  ${country}: ${count}`);
  });

  await mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
