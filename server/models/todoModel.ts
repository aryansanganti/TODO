import mongoose, { Document, Schema } from 'mongoose';
import { Todo } from '@shared/schema';

// Define interface for MongoDB document
export interface TodoDocument extends Document, Omit<Todo, 'id'> {
  // MongoDB will handle the _id, we'll map it to id for the API
}

// Create Mongoose schema
const todoSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true, 
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // Add createdAt and updatedAt timestamps
  versionKey: false // Remove the __v field
});

// Create and export the model
export const TodoModel = mongoose.model<TodoDocument>('Todo', todoSchema);