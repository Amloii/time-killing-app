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
  const renderDifficulty = () => {
    const stars = [];
    for (let i = 0; i < task.difficulty; i++) {
      stars.push(
        <Star 
          key={i} 
          className="w-4 h-4 text-yellow-500 fill-yellow-500" 
        />
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  const taskContent = (
    <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
          
          <div className="flex items-center mt-2 space-x-4">
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