import mongoose, { Schema, Document } from 'mongoose';
import { Todo } from '@shared/schema';

// Interface for MongoDB document with Todo fields
export interface TodoDocument extends Document, Omit<Todo, 'id'> {
  // MongoDB will handle the _id, we'll map it to id for the API
}

// Create a schema for Todo documents
const todoSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the model
export const TodoModel = mongoose.model<TodoDocument>('Todo', todoSchema);