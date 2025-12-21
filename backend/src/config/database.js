const mongoose = require('mongoose');
const config = require('./environment');

/**
 * MongoDB connection configuration
 */
const connectDB = async () => {
  try {
    // Set mongoose to always use new connection methods
    mongoose.set('strictQuery', false);

    const options = {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      autoIndex: false, // Don't build indexes automatically to save disk space
      retryWrites: true,
      w: 'majority',
      heartbeatFrequencyMS: 10000, // Check connection health every 10s
      serverSelectionRetryMS: 5000
    };

    const conn = await mongoose.connect(config.MONGODB_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB - attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('Mongoose reconnected to MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Will retry connection in 5 seconds...');
    // Don't crash the app, just retry
    return setTimeout(() => connectDB(), 5000);
  }
};

module.exports = connectDB;
