import { IStorage } from './storage';
import { TodoModel } from './models/todoModel';
import { Todo, InsertTodo, User, InsertUser } from '@shared/schema';

export class MongoDBStorage implements IStorage {
  // User methods (placeholder for future implementation)
  async getUser(id: number): Promise<User | undefined> {
    // Not implemented for this example
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Not implemented for this example
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    // Not implemented for this example
    throw new Error('User management not implemented in MongoDB storage');
  }

  // Todo methods implementation
  async getTodos(): Promise<Todo[]> {
    const todos = await TodoModel.find().lean();
    return todos.map(todo => ({
      id: todo._id.toString(),
      text: todo.text,
      completed: todo.completed
    }));
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    try {
      const todo = await TodoModel.findById(id).lean();
      if (!todo) return undefined;
      
      return {
        id: todo._id.toString(),
        text: todo.text,
        completed: todo.completed
      };
    } catch (error) {
      return undefined;
    }
  }

  async createTodo(insertTodo: InsertTodo): Promise<Todo> {
    const newTodo = new TodoModel(insertTodo);
    const savedTodo = await newTodo.save();
    
    return {
      id: savedTodo._id.toString(),
      text: savedTodo.text,
      completed: savedTodo.completed
    };
  }

  async updateTodo(id: number, updates: Partial<InsertTodo>): Promise<Todo | undefined> {
    try {
      const updatedTodo = await TodoModel.findByIdAndUpdate(
        id,
        updates,
        { new: true } // Return the updated document
      ).lean();
      
      if (!updatedTodo) return undefined;
      
      return {
        id: updatedTodo._id.toString(),
        text: updatedTodo.text,
        completed: updatedTodo.completed
      };
    } catch (error) {
      return undefined;
    }
  }

  async deleteTodo(id: number): Promise<boolean> {
    try {
      const result = await TodoModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      return false;
    }
  }
}