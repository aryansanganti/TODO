import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage as memStorage } from "./storage";
import { MongoDBStorage } from "./storage-mongodb";
import { insertTodoSchema } from "@shared/schema";
import { z } from "zod";
import mongoose from "mongoose";

// Create MongoDB storage if connected
const mongodbStorage = mongoose.connection.readyState === 1 ? new MongoDBStorage() : null;
// Use MongoDB storage if available, otherwise use memory storage
const storage = mongodbStorage || memStorage;

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Get all todos
  app.get("/api/todos", async (req: Request, res: Response) => {
    try {
      const todos = await storage.getTodos();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: "Error fetching todos" });
    }
  });

  // Get a single todo
  app.get("/api/todos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid todo ID" });
      }
      
      const todo = await storage.getTodo(id);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      
      res.json(todo);
    } catch (error) {
      res.status(500).json({ message: "Error fetching todo" });
    }
  });

  // Create a new todo
  app.post("/api/todos", async (req: Request, res: Response) => {
    try {
      const result = insertTodoSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid todo data" });
      }
      
      const todo = await storage.createTodo(result.data);
      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ message: "Error creating todo" });
    }
  });

  // Update a todo (toggle completion)
  app.put("/api/todos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid todo ID" });
      }
      
      const updateSchema = z.object({
        text: z.string().optional(),
        completed: z.boolean().optional(),
      });
      
      const result = updateSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid update data" });
      }
      
      const todo = await storage.updateTodo(id, result.data);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      
      res.json(todo);
    } catch (error) {
      res.status(500).json({ message: "Error updating todo" });
    }
  });

  // Delete a todo
  app.delete("/api/todos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid todo ID" });
      }
      
      const success = await storage.deleteTodo(id);
      if (!success) {
        return res.status(404).json({ message: "Todo not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting todo" });
    }
  });

  // Clear completed todos
  app.delete("/api/todos", async (req: Request, res: Response) => {
    try {
      const todos = await storage.getTodos();
      const completedIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);
      
      for (const id of completedIds) {
        await storage.deleteTodo(id);
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error clearing completed todos" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
