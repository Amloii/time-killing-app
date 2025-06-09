import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';
import { Check, Trash, Clock, Star, ChevronDown, ChevronUp, Scissors, Swords } from 'lucide-react';
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
  showAddToBattle?: boolean;
  onAddToBattle?: (taskId: string) => void;
  selectedForBattle?: string[];
  onRemoveFromBattle?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  index, 
  isDraggable = true, 
  onChopTask, 
  onTaskComplete,
  allowCompletion = false,
  showAddToBattle = false,
  onAddToBattle,
  selectedForBattle = [],
  onRemoveFromBattle
}) => {
  const { completeTask, deleteTask } = useAppStore();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const pointsRange = getPointsForTimeRange(task.estimatedTime || 30);
  const isSelectedForBattle = selectedForBattle.includes(task.id);
  
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
    <div className="p-2 sm:p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
          
          {/* Task metadata in a more organized way */}
          <div className="flex flex-wrap items-center gap-3 mt-3 p-2 bg-gray-50 rounded-md">
            {task.estimatedTime && (
              <div className="flex items-center text-xs text-gray-600">
                <Clock className="w-3 h-3 mr-1" />
                <span>{task.estimatedTime}min</span>
              </div>
            )}
            <div className="flex items-center text-xs text-gray-600">
              <Star className="w-3 h-3 mr-1 text-yellow-500" />
              <span>{'★'.repeat(task.difficulty)}</span>
            </div>
            <div className="text-xs text-green-600 font-medium">
              💰 {pointsRange.min}-{pointsRange.max} pts
            </div>
          </div>
          
          {task.subTasks && task.subTasks.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="text-sm text-blue-600 flex items-center hover:text-blue-800 font-medium"
              >
                {showSubtasks ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                {task.subTasks.length} subtasks
              </button>
              
              {showSubtasks && (
                <div className="mt-3 space-y-2 pl-4 border-l-2 border-blue-200 bg-blue-50 rounded-r-md py-2">
                  {task.subTasks.map((subtask) => (
                    <div key={subtask.id} className="text-sm">
                      <div className="font-medium text-gray-800">{subtask.summary}</div>
                      <div className="text-gray-600 mt-1">{subtask.description}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
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
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-1 ml-3">
          {showAddToBattle && onAddToBattle && (
            <>
              {!isSelectedForBattle ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  onClick={() => onAddToBattle(task.id)}
                  title="Add to battle"
                >
                  <Swords className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                  onClick={() => onRemoveFromBattle?.(task.id)}
                  title="Remove from battle"
                >
                  <Check className="w-4 h-4" />
                </motion.button>
              )}
            </>
          )}
          
          {onChopTask && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              onClick={() => onChopTask(task)}
              title="Chop into smaller tasks"
            >
              <Scissors className="w-4 h-4" />
            </motion.button>
          )}
          
          {allowCompletion ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              onClick={handleCompleteTask}
              title="Complete task"
            >
              <Check className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              className="p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
              title="Tasks can only be completed during battle"
              disabled
            >
              <Check className="w-4 h-4" />
            </motion.button>
          )}
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            onClick={() => deleteTask(task.id)}
            title="Delete task"
          >
            <Trash className="w-4 h-4" />
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