const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job_portal';
  const allowFallback = process.env.USE_IN_MEMORY_FALLBACK !== 'false';

  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[DB] MongoDB Connected Successfully: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[DB] Direct MongoDB connection failed (${err.message}).`);
    
    if (allowFallback) {
      console.log('[DB] Launching embedded MongoDB Memory Server for seamless local execution...');
      try {
        const cacheDir = process.env.MONGOMS_DOWNLOAD_DIR || path.join(__dirname, '../../.cache');
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
        process.env.MONGOMS_DOWNLOAD_DIR = cacheDir;

        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create({
          binary: {
            version: process.env.MONGOMS_VERSION || '5.0.21',
            downloadDir: cacheDir
          }
        });
        const memUri = memoryServer.getUri();
        await mongoose.connect(memUri);
        console.log(`[DB] In-Memory MongoDB connected at: ${memUri}`);
      } catch (memErr) {
        console.error('[DB] Failed to initialize MongoMemoryServer:', memErr.message);
        throw memErr;
      }
    } else {
      throw err;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (error) {
    console.error('Error during DB disconnect:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
