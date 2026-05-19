const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Throw instead of calling process.exit(1) so Vercel can handle the error without crashing the function container
    throw error;
  }
};

module.exports = connectDB;
