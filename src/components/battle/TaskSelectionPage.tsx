import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAppStore } from '../../store';
import TaskList from '../tasks/TaskList';
import Button from '../common/Button';

interface TaskSelectionPageProps {
  selectedTaskIds: string[];
  onTaskSelect: (taskId: string) => void;
  onBack: () => void;
}

const TaskSelectionPage: React.FC<TaskSelectionPageProps> = ({
  selectedTaskIds,
  onTaskSelect,
  onBack,
}) => {
  const { tasks } = useAppStore();
  const availableTasks = tasks.filter(task => !task.completed && !selectedTaskIds.includes(task.id));

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
            <p className="text-gray-500 mb-4">No available tasks</p>
            <Button
              variant="secondary"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => window.location.hash = 'tasks'}
            >
              Create New Task
            </Button>
          </div>
        ) : (
          <TaskList
            tasks={availableTasks}
            droppableId="task-selection"
            isDraggable={false}
            onTaskClick={onTaskSelect}
          />
        )}
      </div>
    </div>
  );
};