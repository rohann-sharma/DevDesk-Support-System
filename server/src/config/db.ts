import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

// Helper function to safely redact sensitive database URI credentials in logs
const sanitizeUri = (uri: string): string => {
  try {
    return uri.replace(/\/\/(.*?)@/, '//***:***@');
  } catch {
    return 'MongoDB URI';
  }
};

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    // A specific MONGODB_URI is configured (e.g. MongoDB Atlas)
    const sanitized = sanitizeUri(uri);
    console.log(`Connecting to configured MongoDB database (${sanitized})...`);
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000, // 10 seconds for cloud/Atlas connections
      });
      console.log(`Successfully connected to configured MongoDB database (${sanitized})!`);
    } catch (err: any) {
      console.error(`ERROR: Failed to connect to configured MongoDB database (${sanitized}).`);
      console.error(`Reason: ${err.message}`);
      console.error(`Please check your connection string, database user permissions, and IP whitelist on MongoDB Atlas.`);
      process.exit(1);
    }
  } else {
    // No MONGODB_URI configured: try local MongoDB, then fallback to MongoMemoryServer
    const defaultLocalUri = 'mongodb://127.0.0.1:27017/devdesk';
    console.log(`No MONGODB_URI configured. Attempting connection to local MongoDB (${defaultLocalUri})...`);
    try {
      await mongoose.connect(defaultLocalUri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('Successfully connected to local MongoDB database!');
    } catch (err: any) {
      console.warn(`Local MongoDB connection failed (${err.message}). Initializing MongoMemoryServer fallback...`);
      try {
        mongoMemoryServer = await MongoMemoryServer.create();
        const memoryUri = mongoMemoryServer.getUri();
        await mongoose.connect(memoryUri);
        console.log(`Successfully connected to MongoMemoryServer in-memory database!`);
      } catch (memErr: any) {
        console.error('Failed to initialize in-memory database:', memErr);
        process.exit(1);
      }
    }
  }
};
