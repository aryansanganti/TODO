import { Badge } from "@/components/ui/badge";

type FilterType = "all" | "active" | "completed";

interface TodoFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todoCount: number;
}

export default function TodoFilters({ activeFilter, onFilterChange, todoCount }: TodoFiltersProps) {
  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            className={`px-3 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${
              activeFilter === filter.value
                ? "bg-[#3B82F6] text-white"
                : "text-[#6B7280] hover:bg-gray-100"
            }`}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <span className="text-sm text-[#6B7280]">
        {todoCount} {todoCount === 1 ? "item" : "items"} left
      </span>
    </div>
  );
}
