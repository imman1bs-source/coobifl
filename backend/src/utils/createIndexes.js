/**
 * Script to create database indexes
 * Run with: node src/utils/createIndexes.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

async function createIndexes() {
  try {
    console.log('🔧 Creating database indexes...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📊 Creating indexes for Product collection...\n');

    // Create all indexes defined in the schema
    await Product.createIndexes();

    console.log('✅ All indexes created successfully!\n');

    // List all indexes
    const indexes = await Product.collection.getIndexes();
    console.log('📋 Current indexes:');
    console.log('─'.repeat(60));
    Object.keys(indexes).forEach((indexName) => {
      console.log(`   ${indexName}`);
      console.log(`   ${JSON.stringify(indexes[indexName])}\n`);
    });

    console.log('✨ Index creation complete!');
    console.log('👉 You can now run search queries\n');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
    process.exit(1);
  }
}

createIndexes();
