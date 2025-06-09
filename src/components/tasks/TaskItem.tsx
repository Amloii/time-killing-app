import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';
import { Check, Trash, Clock, Star, ChevronDown, ChevronUp, Scissors } from 'lucide-react';
import { Task } from '../../types';
import { useAppStore } from '../../store';
import { getPointsForTimeRange } from '../../utils/pointsCalculator';

interface TaskItemProps {
  task: Task;
  index: number;
  isDraggable?: boolean;
  onChopTask?: (task: Task) => void;
  onTaskComplete?: (taskId: string) => void;
  allowCompletion?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  index, 
  isDraggable = true, 
  onChopTask, 
  onTaskComplete,
  allowCompletion = false 
}) => {
  const { completeTask, deleteTask } = useAppStore();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const pointsRange = getPointsForTimeRange(task.estimatedTime || 30);
  
  const handleCompleteTask = () => {
    if (!allowCompletion) return;
    
    if (onTaskComplete) {
      onTaskComplete(task.id);
    } else {
      completeTask(task.id);
    }
  };
  
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
          
          {task.subTasks && task.subTasks.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="text-sm text-gray-600 flex items-center hover:text-gray-800"
              >
                {showSubtasks ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                {task.subTasks.length} subtasks
              </button>
              
              {showSubtasks && (
                <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-200">
                  {task.subTasks.map((subtask) => (
                    <div key={subtask.id} className="text-sm">
                      <div className="font-medium text-gray-800">{subtask.summary}</div>
                      <div className="text-gray-600 mt-1">{subtask.description}</div>
                      <div className="flex items-center gap-4 mt-1 text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {subtask.estimatedTime} min
                        </span>
                        <span>{subtask.type}</span>
                        <span className="flex">
                          {'★'.repeat(subtask.difficulty)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
            <div className="flex items-center text-sm text-green-600 font-medium">
              <span>💰 {pointsRange.min}-{pointsRange.max} pts</span>
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
          {onChopTask && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              onClick={() => onChopTask(task)}
              title="Chop into smaller tasks"
            >
              <Scissors className="w-5 h-5" />
            </motion.button>
          )}
          
          {allowCompletion ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
              onClick={handleCompleteTask}
              title="Complete task"
            >
              <Check className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              className="p-1 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed"
              title="Tasks can only be completed during battle"
              disabled
            >
              <Check className="w-5 h-5" />
            </motion.button>
          )}
          
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