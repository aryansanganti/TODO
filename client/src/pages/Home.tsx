import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Todo } from "@shared/schema";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";
import TodoFilters from "@/components/TodoFilters";
import { AlertCircle } from "lucide-react";

type FilterType = "all" | "active" | "completed";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [error, setError] = useState<string | null>(null);

  // Fetch todos
  const { 
    data: todos = [], 
    isLoading, 
    isError 
  } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
  });

  // Filter todos based on active filter
  const filteredTodos = todos.filter(todo => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return !todo.completed;
    return todo.completed;
  });

  // Add todo mutation
  const addTodoMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await apiRequest("POST", "/api/todos", { text, completed: false });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setError(null);
    },
    onError: (err) => {
      setError(`Failed to add todo: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  });

  // Toggle todo completion mutation
  const toggleTodoMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      const res = await apiRequest("PUT", `/api/todos/${todo.id}`, { 
        completed: !todo.completed 
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setError(null);
    },
    onError: (err) => {
      setError(`Failed to update todo: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId: number) => {
      await apiRequest("DELETE", `/api/todos/${todoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setError(null);
    },
    onError: (err) => {
      setError(`Failed to delete todo: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  });

  // Clear completed todos mutation
  const clearCompletedMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/todos");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setError(null);
    },
    onError: (err) => {
      setError(`Failed to clear completed todos: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  });

  // Handle adding a new todo
  const handleAddTodo = (text: string) => {
    if (text.trim()) {
      addTodoMutation.mutate(text);
    }
  };

  // Handle toggling a todo's completion status
  const handleToggleTodo = (todo: Todo) => {
    toggleTodoMutation.mutate(todo);
  };

  // Handle deleting a todo
  const handleDeleteTodo = (todoId: number) => {
    deleteTodoMutation.mutate(todoId);
  };

  // Handle clearing all completed todos
  const handleClearCompleted = () => {
    clearCompletedMutation.mutate();
  };

  // Calculate remaining active todos
  const remainingTodos = todos.filter(todo => !todo.completed).length;

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">Tasks</h1>
          <p className="text-[#6B7280]">Manage your tasks efficiently</p>
        </header>

        <TodoInput onAddTodo={handleAddTodo} isLoading={addTodoMutation.isPending} />

        <TodoFilters 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
          todoCount={remainingTodos}
        />

        <TodoList 
          todos={filteredTodos} 
          isLoading={isLoading || toggleTodoMutation.isPending || deleteTodoMutation.isPending} 
          onToggleTodo={handleToggleTodo} 
          onDeleteTodo={handleDeleteTodo}
          activeFilter={activeFilter}
        />

        {todos.some(todo => todo.completed) && (
          <div className="mt-6 flex justify-end">
            <button 
              className="text-[#6B7280] hover:text-[#3B82F6] transition-colors text-sm focus:outline-none focus:underline"
              onClick={handleClearCompleted}
              disabled={clearCompletedMutation.isPending}
            >
              Clear completed
            </button>
          </div>
        )}

        {(error || isError) && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span>{error || "Error connecting to server. Please try again."}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
