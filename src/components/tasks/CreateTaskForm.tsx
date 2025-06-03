import React, { useState } from 'react';
import { PlusCircle, Clock, Star, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import { useAppStore } from '../../store';

const CreateTaskForm: React.FC = () => {
  const { addTask } = useAppStore();
  
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<number | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleAISuggestion = async () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    setIsGenerating(true);
    // AI integration will be added here
    setIsGenerating(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    
    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      estimatedTime,
      difficulty,
    });
    
    // Reset form
    setTitleError(false);
    setTitle('');
    setDescription('');
    setEstimatedTime(undefined);
    setDifficulty(3);
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Create New Task</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Task Title*
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(false);
            }}
            className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
              titleError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter task title"
            required
          />
          {titleError && (
            <p className="mt-1 text-sm text-red-600">Task title is required</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="Enter task description"
            rows={2}
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleAISuggestion}
            disabled={isGenerating}
            icon={<Sparkles className="w-4 h-4" />}
          >
            AI Suggestion
          </Button>
        </div>
        
        <div>
          <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Estimated Time (minutes)</span>
            </div>
          </label>
          <input
            id="estimatedTime"
            type="number"
            value={estimatedTime || ''}
            onChange={(e) => setEstimatedTime(e.target.value ? parseInt(e.target.value) : undefined)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="Enter estimated time"
            min={1}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              <span>Difficulty Level</span>
            </div>
          </label>
          <div className="flex space-x-2 mt-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level as 1 | 2 | 3 | 4 | 5)}
                className={`p-2 rounded-md ${
                  difficulty === level 
                    ? 'bg-yellow-100 text-yellow-700 border-yellow-300' 
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                } border`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <Button type="submit" fullWidth icon={<PlusCircle className="w-4 h-4" />}>
          Add Task
        </Button>
      </div>
    </form>
  );
};

export default CreateTaskForm;