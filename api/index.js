const app = require('../src/app');
const connectDB = require('../src/config/db');

// Serverless-safe handler:
// Connect to DB lazily on first request (connection is cached/reused by Mongoose).
// Never crash the container — catch DB errors and let Express respond normally.
let dbConnected = false;

module.exports = async (req, res) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (err) {
      console.error('DB connection failed:', err.message);
      // Do NOT crash — let the request proceed;
      // individual route handlers will fail gracefully if DB is down.
    }
  }
  return app(req, res);
};
