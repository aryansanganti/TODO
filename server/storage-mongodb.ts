import { IStorage } from './storage';
import { TodoModel, TodoDocument } from './models/todoModel';
import { Todo, InsertTodo, User, InsertUser } from '@shared/schema';
import mongoose from 'mongoose';

// Helper function to convert MongoDB document to Todo object
function convertToTodo(doc: any): Todo {
  return {
    id: Number(doc._id.toString()),
    text: doc.text as string,
    completed: doc.completed as boolean
  };
}

export class MongoDBStorage implements IStorage {
  // User methods (placeholder for future implementation)
  async getUser(id: number): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    throw new Error("Not implemented");
  }

  // Todo methods implementation
  async getTodos(): Promise<Todo[]> {
    const todos = await TodoModel.find().lean();
    return todos.map(convertToTodo);
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    try {
      const todo = await TodoModel.findById(id.toString()).lean();
      if (!todo) return undefined;
      
      return convertToTodo(todo);
    } catch (error) {
      return undefined;
    }
  }

  async createTodo(insertTodo: InsertTodo): Promise<Todo> {
    const newTodo = new TodoModel(insertTodo);
    const savedTodo = await newTodo.save();
    const doc = savedTodo.toObject();
    
    return convertToTodo(doc);
  }

  async updateTodo(id: number, updates: Partial<InsertTodo>): Promise<Todo | undefined> {
    try {
      const updatedTodo = await TodoModel.findByIdAndUpdate(
        id.toString(),
        updates,
        { new: true } // Return the updated document
      ).lean();
      
      if (!updatedTodo) return undefined;
      
      return convertToTodo(updatedTodo);
    } catch (error) {
      return undefined;
    }
  }

  async deleteTodo(id: number): Promise<boolean> {
    try {
      const result = await TodoModel.findByIdAndDelete(id.toString());
      return !!result;
    } catch (error) {
      return false;
    }
  }
}