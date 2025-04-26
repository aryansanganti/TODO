import { useState } from "react";
import { Todo } from "@shared/schema";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDelete = () => {
    setIsExiting(true);
    // Wait for animation to complete before actually deleting
    setTimeout(() => {
      onDelete();
    }, 300);
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md p-4 flex items-center justify-between group hover:shadow-lg transition-all duration-300",
        isExiting && "opacity-0 transform translate-x-5"
      )}
    >
      <div className="flex items-center flex-grow">
        <button
          className={cn(
            "w-5 h-5 rounded-full border-2 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150",
            todo.completed 
              ? "bg-[#10B981] border-[#10B981] flex items-center justify-center focus:ring-[#10B981]" 
              : "border-gray-300 focus:ring-[#3B82F6]"
          )}
          onClick={onToggle}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.completed && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <span 
          className={cn(
            "ml-3", 
            todo.completed 
              ? "text-[#9CA3AF] line-through" 
              : "text-[#111827]"
          )}
        >
          {todo.text}
        </span>
      </div>
      <button
        className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        onClick={handleDelete}
        aria-label="Delete task"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
