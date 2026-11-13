const mongoose = require('mongoose');

let isConnected = false;
let isInMemoryFallback = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vasanth_tech_blog';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1200,
    });
    isConnected = true;
    isInMemoryFallback = false;
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Local MongoDB server not detected (${error.message}).`);
    console.log('[Database] -> Auto-activating Embedded Zero-Config Storage with local JSON persistence.');
    console.log('[Database] -> No MongoDB installation or setup required! Everything works 100% out-of-the-box.');
    isInMemoryFallback = true;
    return null;
  }
};

const getDbStatus = () => ({
  isConnected,
  isInMemoryFallback,
});

module.exports = {
  connectDB,
  getDbStatus,
};
