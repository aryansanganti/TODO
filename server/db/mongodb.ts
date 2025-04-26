import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { log } from '../vite';


dotenv.config();


const MONGODB_URI = process.env.MONGODB_URI;


const connectionOptions = {
  serverSelectionTimeoutMS: 5000, 
  socketTimeoutMS: 45000, 
  connectTimeoutMS: 10000, 
  family: 4 
};


export async function connectToMongoDB() {
  if (!MONGODB_URI) {
    log('MongoDB connection string is missing. Please check your .env file', 'mongodb');
    return false;
  }

  try {
    
    const connectionPromise = mongoose.connect(MONGODB_URI, connectionOptions);
    
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000);
    });
    
    await Promise.race([connectionPromise, timeoutPromise]);
    log('Connected to MongoDB successfully', 'mongodb');
    return true;
  } catch (error) {
    log(`Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`, 'mongodb');
    return false;
  }
}


mongoose.connection.on('connected', () => {
  log('MongoDB connection established', 'mongodb');
});

mongoose.connection.on('error', (err) => {
  log(`MongoDB connection error: ${err}`, 'mongodb');
});

mongoose.connection.on('disconnected', () => {
  log('MongoDB connection disconnected', 'mongodb');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    log('MongoDB connection closed due to app termination', 'mongodb');
  } catch (error) {
    log(`Error closing MongoDB connection: ${error}`, 'mongodb');
  }
  process.exit(0);
});
