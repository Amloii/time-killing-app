import React from 'react';
import { Filter, Clock, Star, Tag } from 'lucide-react';
import Button from '../common/Button';

interface TaskFiltersProps {
  filters: {
    duration: 'all' | 'short' | 'medium' | 'long';
    difficulty: 'all' | '1' | '2' | '3' | '4' | '5';
    category: 'all' | string;
  };
  onFilterChange: (filters: any) => void;
  availableCategories: string[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  availableCategories
}) => {
  const durationOptions = [
    { value: 'all', label: 'All Durations' },
    { value: 'short', label: '≤ 25 min' },
    { value: 'medium', label: '26-60 min' },
    { value: 'long', label: '> 60 min' },
  ];
  
  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: '1', label: '★' },
    { value: '2', label: '★★' },
    { value: '3', label: '★★★' },
    { value: '4', label: '★★★★' },
    { value: '5', label: '★★★★★' },
  ];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold">Filter Tasks</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Duration Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Duration
          </label>
          <select
            value={filters.duration}
            onChange={(e) => onFilterChange({ ...filters, duration: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            {durationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Star className="w-4 h-4 inline mr-1" />
            Difficulty
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => onFilterChange({ ...filters, difficulty: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            {difficultyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="all">All Categories</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onFilterChange({
            duration: 'all',
            difficulty: 'all',
            category: 'all'
          })}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default TaskFilters;