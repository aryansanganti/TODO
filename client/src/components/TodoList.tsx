import { Todo } from "@shared/schema";
import TodoItem from "./TodoItem";

type FilterType = "all" | "active" | "completed";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  activeFilter: FilterType;
}

export default function TodoList({ todos, isLoading, onToggleTodo, onDeleteTodo, activeFilter }: TodoListProps) {
  // Show loading state
  if (isLoading && todos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#3B82F6]"></div>
        <span className="ml-2 text-[#6B7280]">Loading tasks...</span>
      </div>
    );
  }

  // Show empty state based on filter
  if (todos.length === 0) {
    let emptyMessage = "No tasks found";
    let emptySubMessage = "Add a new task to get started";
    
    if (activeFilter === "active") {
      emptyMessage = "No active tasks";
      emptySubMessage = "All your tasks are completed!";
    } else if (activeFilter === "completed") {
      emptyMessage = "No completed tasks";
      emptySubMessage = "Complete a task to see it here";
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p className="text-[#6B7280]">{emptyMessage}</p>
        <p className="text-sm text-gray-400 mt-1">{emptySubMessage}</p>
      </div>
    );
  }

  // Show todo list
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo)}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}
    </div>
  );
}
