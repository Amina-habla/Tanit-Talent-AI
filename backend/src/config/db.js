const mongoose = require('mongoose');
require('dotenv').config();

const sanitizeMongoUri = (uri) => {
  if (!uri) return '';
  // Remove BOM (Byte Order Mark) and other control/non-printable/whitespace characters
  let clean = uri.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  
  // Strip any accidental leading characters (like 'N' or carriage returns) before mongodb
  const mongoIndex = clean.indexOf('mongodb');
  if (mongoIndex !== -1) {
    clean = clean.substring(mongoIndex);
  }
  
  // Clean all whitespace, newlines, carriage returns
  clean = clean.replace(/\s+/g, '');
  
  return clean;
};

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    const rawUri = process.env.MONGODB_URI || '';
    const cleanUri = sanitizeMongoUri(rawUri);
    
    const conn = await mongoose.connect(cleanUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Throw instead of calling process.exit(1) so Vercel can handle the error without crashing the function container
    throw error;
  }
};

module.exports = connectDB;
