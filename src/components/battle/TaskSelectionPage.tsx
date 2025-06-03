import React, { useState } from 'react';
import { ArrowLeft, Plus, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useAppStore } from '../../store';
import Button from '../common/Button'; 
import { useNavigateToTab } from '../../hooks/useNavigateToTab';
import { Task } from '../../types';

interface TaskSelectionPageProps {
  selectedTaskIds: string[];
  selectedSubtaskIds: string[];
  onTaskSelect: (taskId: string, subtaskIds?: string[]) => void;
  onBack: () => void;
}

const TaskSelectionPage: React.FC<TaskSelectionPageProps> = ({
  selectedTaskIds,
  selectedSubtaskIds,
  onTaskSelect,
  onBack,
}) => {
  const { tasks } = useAppStore();
  const navigateToTab = useNavigateToTab();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTasks, setExpandedTasks] = React.useState<string[]>([]);
  const [hoveredTaskId, setHoveredTaskId] = React.useState<string | null>(null);
  
  const availableTasks = tasks.filter(task => 
    !task.completed && 
    !selectedTaskIds.includes(task.id) &&
    (searchQuery
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true)
  );

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      } else if (e.key === '/') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onBack]);
  
  const handleTaskSelect = (taskId: string) => {
    // Handle full task selection
    if (selectedTaskIds.includes(taskId)) {
      // If already selected, remove it
      onTaskSelect(taskId);
    } else {
      // Select it
      onTaskSelect(taskId);
    }
  };
  
  const handleSubtaskSelect = (taskId: string, subtaskId: string) => {
    // Toggle only the clicked subtask
    const isSelected = selectedSubtaskIds.includes(subtaskId);
    const updatedSubtaskIds = isSelected
      ? selectedSubtaskIds.filter(id => id !== subtaskId)
      : [...selectedSubtaskIds, subtaskId];
    
    onTaskSelect('', updatedSubtaskIds);
  };
  
  const handleSelectAllSubtasks = (task: Task) => {
    if (!task.subTasks) return;
    
    const allSubtaskIds = task.subTasks.map(st => st.id);
    const allSelected = allSubtaskIds.every(id => selectedSubtaskIds.includes(id));
    
    // If all are selected, deselect all, otherwise select all
    onTaskSelect(task.id, allSubtaskIds);
  };
  
  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };
  
  const renderTask = (task: Task) => {
    const hasSubtasks = task.subTasks && task.subTasks.length > 0;
    const isExpanded = expandedTasks.includes(task.id);
    const isTaskSelected = selectedTaskIds.includes(task.id);
    const allSubtasksSelected = hasSubtasks && 
      task.subTasks.every(st => selectedSubtaskIds.includes(st.id));
    
    return (
      <div key={task.id} className="mb-4">
        <div className={`bg-white p-4 rounded-lg border ${isTaskSelected ? 'border-red-300 bg-red-50' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 flex items-start">
              <div 
                className={`w-6 h-6 mr-3 border rounded flex items-center justify-center cursor-pointer ${
                  isTaskSelected ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 bg-white'
                }`}
                onClick={() => handleTaskSelect(task.id)}
              >
                {isTaskSelected && <Check className="w-4 h-4" />}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {hasSubtasks && (
                <button
                  onClick={() => toggleTaskExpansion(task.id)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              )}
              {hasSubtasks && (
                <Button
                  size="sm"
                  variant={allSubtasksSelected ? "secondary" : "primary"}
                  onClick={() => handleSelectAllSubtasks(task)}
                >
                  {allSubtasksSelected ? "Deselect All" : "Select All"}
                </Button>
              )}
            </div>
          </div>
          
          {hasSubtasks && isExpanded && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200">
              {task.subTasks.map(subtask => {
                const isSelected = selectedSubtaskIds.includes(subtask.id);
                
                return (
                  <div
                    key={subtask.id}
                    className={`p-3 mb-2 rounded-lg border ${
                      isSelected 
                        ? 'bg-red-50 border-red-200 shadow-sm' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    onMouseEnter={() => setHoveredTaskId(task.id)}
                    onMouseLeave={() => setHoveredTaskId(null)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div 
                          className={`w-5 h-5 mr-3 border rounded flex items-center justify-center cursor-pointer ${
                            isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 bg-white'
                          }`}
                          onClick={() => handleSubtaskSelect(task.id, subtask.id)}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {subtask.summary}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {subtask.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{subtask.estimatedTime} min</span>
                            <span>{subtask.type}</span>
                            <span>{'★'.repeat(subtask.difficulty)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="flex items-center gap-4 w-full">
          <Button
            onClick={onBack}
            variant="secondary"
            icon={<ArrowLeft className="w-5 h-5" />}
          >
            Back to Battle
          </Button>
          
          <div className="flex-1 relative">
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks... (Press '/' to focus)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Select Tasks</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Choose tasks to add to your battle</p>
          <div className="text-sm text-gray-500">
            <kbd className="px-2 py-1 bg-gray-100 rounded-md mr-2">/</kbd>
            to search
            <kbd className="px-2 py-1 bg-gray-100 rounded-md mx-2">Esc</kbd>
            to go back
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        {availableTasks.length > 0 && (
          <div className="flex justify-between mb-4">
            <div className="text-sm text-gray-600">
              {selectedTaskIds.length > 0 || selectedSubtaskIds.length > 0 ? (
                <span>
                  Selected: {selectedTaskIds.length} tasks, {selectedSubtaskIds.length} subtasks
                </span>
              ) : (
                <span>No items selected</span>
              )}
            </div>
            
            <Button
              onClick={() => {
                // Get all subtask IDs from available tasks
                const allSubtaskIds = availableTasks
                  .flatMap(task => task.subTasks || [])
                  .map(st => st.id);
                
                // Check if all are already selected
                const allSelected = allSubtaskIds.length > 0 && 
                  allSubtaskIds.every(id => selectedSubtaskIds.includes(id));
                
                // If all selected, deselect all, otherwise select all
                onTaskSelect('', allSelected ? allSubtaskIds : []);
              }}
            >
              {availableTasks.flatMap(task => task.subTasks || []).every(
                st => selectedSubtaskIds.includes(st.id)
              ) 
                ? "Deselect All Subtasks" 
                : "Select All Subtasks"}
            </Button>
          </div>
        )}
        {availableTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No tasks available for battle</p>
            <Button
              variant="secondary"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => navigateToTab('tasks')}
            >
              Create New Task
            </Button>
          </div>
        ) : (
          <div>{availableTasks.map(renderTask)}</div>
        )}
      </div>
    </div>
  );
};

export default TaskSelectionPage;