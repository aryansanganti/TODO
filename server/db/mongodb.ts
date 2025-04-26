import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { log } from '../vite';

// Load environment variables from .env file
dotenv.config();

// Get MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Function to connect to MongoDB
export async function connectToMongoDB() {
  if (!MONGODB_URI) {
    log('MongoDB connection string is missing. Please check your .env file', 'mongodb');
    return false;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    log('Connected to MongoDB successfully', 'mongodb');
    return true;
  } catch (error) {
    log(`Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`, 'mongodb');
    return false;
  }
}

// Connection event handlers
mongoose.connection.on('connected', () => {
  log('MongoDB connection established', 'mongodb');
});

mongoose.connection.on('error', (err) => {
  log(`MongoDB connection error: ${err}`, 'mongodb');
});

mongoose.connection.on('disconnected', () => {
  log('MongoDB connection disconnected', 'mongodb');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  log('MongoDB connection closed due to app termination', 'mongodb');
  process.exit(0);
});