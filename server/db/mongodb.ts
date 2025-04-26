import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { log } from '../vite';

// Load environment variables from .env file
dotenv.config();

// Get MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Connection options with timeout to prevent hanging
const connectionOptions = {
  serverSelectionTimeoutMS: 5000, // Give up initial connection after 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 10000, // Give up connecting to a single server after 10 seconds
  family: 4 // Use IPv4, skip trying IPv6
};

// Function to connect to MongoDB
export async function connectToMongoDB() {
  if (!MONGODB_URI) {
    log('MongoDB connection string is missing. Please check your .env file', 'mongodb');
    return false;
  }

  try {
    // Set a timeout for the connection attempt
    const connectionPromise = mongoose.connect(MONGODB_URI, connectionOptions);
    
    // Use Promise.race to set an overall timeout
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
  try {
    await mongoose.connection.close();
    log('MongoDB connection closed due to app termination', 'mongodb');
  } catch (error) {
    log(`Error closing MongoDB connection: ${error}`, 'mongodb');
  }
  process.exit(0);
});