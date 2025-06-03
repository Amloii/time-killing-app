import React from 'react';
import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';
import { Check, Trash, Clock, Star } from 'lucide-react';
import { Task } from '../../types';
import { useAppStore } from '../../store';

interface TaskItemProps {
  task: Task;
  index: number;
  isDraggable?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, isDraggable = true }) => {
  const { completeTask, deleteTask } = useAppStore();
  
  // Render difficulty stars
  const renderDifficulty = () => (
    <div className="flex space-x-1">
      <span className="text-yellow-500">{'★'.repeat(task.difficulty)}</span>
      <span className="text-gray-300">{'★'.repeat(5 - task.difficulty)}</span>
    </div>
  );

  const taskContent = (
    <div className="p-2 sm:p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
            {task.estimatedTime && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>{task.estimatedTime} min</span>
              </div>
            )}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-1">Difficulty:</span>
              {renderDifficulty()}
            </div>
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
            onClick={() => completeTask(task.id)}
          >
            <Check className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
            onClick={() => deleteTask(task.id)}
          >
            <Trash className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );

  if (!isDraggable) {
    return taskContent;
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2"
        >
          {taskContent}
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;