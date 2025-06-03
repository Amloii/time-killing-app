import React from 'react';
import { ArrowLeft, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../../store';
import TaskList from '../tasks/TaskList';
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
  const [expandedTasks, setExpandedTasks] = React.useState<string[]>([]);
  
  const availableTasks = tasks.filter(task => 
    !task.completed && 
    !selectedTaskIds.includes(task.id)
  );
  
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
    
    return (
      <div key={task.id} className="mb-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              )}
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
              <Button
                size="sm"
                onClick={() => onTaskSelect(task.id)}
              >
                Select All
              </Button>
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
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
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
                      <Button
                        size="sm"
                        variant={isSelected ? 'secondary' : 'primary'}
                        onClick={() => onTaskSelect(task.id, [subtask.id])}
                      >
                        {isSelected ? 'Deselect' : 'Select'}
                      </Button>
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
        <Button
          onClick={onBack}
          variant="secondary"
          icon={<ArrowLeft className="w-5 h-5" />}
        >
          Back to Battle
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Select Tasks</h1>
        <p className="text-gray-600">Choose tasks to add to your battle</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
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

export default TaskSelectionPage