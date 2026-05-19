const app = require('../src/app');
const connectDB = require('../src/config/db');

// Connect to MongoDB Atlas (Production)
connectDB();

module.exports = app;
