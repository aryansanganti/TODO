import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface TodoInputProps {
  onAddTodo: (text: string) => void;
  isLoading: boolean;
}

export default function TodoInput({ onAddTodo, isLoading }: TodoInputProps) {
  const [newTodoText, setNewTodoText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim() && !isLoading) {
      onAddTodo(newTodoText);
      setNewTodoText("");
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-md mb-6">
      <CardContent className="p-4">
        <form className="flex items-center space-x-2" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6]"
            disabled={isLoading || !newTodoText.trim()}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              "Add"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
