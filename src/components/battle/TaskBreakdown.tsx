import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, ChevronDown, ChevronUp, Scissors } from 'lucide-react';
import { Task, SubTask } from '../../types';
import Button from '../common/Button';
import TaskTimer from './TaskTimer';
import { getPointsForTimeRange } from '../../utils/pointsCalculator';

interface TaskBreakdownProps {
  task: Task;
  onSubtaskComplete: (subtaskId: string) => void;
  onTaskComplete: (taskId: string) => void;
}

const TaskBreakdown: React.FC<TaskBreakdownProps> = ({
  task,
  onSubtaskComplete,
  onTaskComplete
}) => {
  const [expandedSubtasks, setExpandedSubtasks] = useState<string[]>([]);
  const [completedSubtasks, setCompletedSubtasks] = useState<string[]>([]);
  
  const toggleSubtask = (subtaskId: string) => {
    setExpandedSubtasks(prev =>
      prev.includes(subtaskId)
        ? prev.filter(id => id !== subtaskId)
        : [...prev, subtaskId]
    );
  };
  
  const handleSubtaskComplete = (subtaskId: string) => {
    setCompletedSubtasks(prev => [...prev, subtaskId]);
    onSubtaskComplete(subtaskId);
    
    // Check if all subtasks are completed
    if (task.subTasks && completedSubtasks.length + 1 === task.subTasks.length) {
      setTimeout(() => onTaskComplete(task.id), 500);
    }
  };
  
  const pointsRange = getPointsForTimeRange(task.estimatedTime || 30);
  const hasSubtasks = task.subTasks && task.subTasks.length > 0;
  
  // Auto-break down long tasks into 25-minute chunks
  const autoBreakdown = React.useMemo(() => {
    if (!task.estimatedTime || task.estimatedTime <= 25 || hasSubtasks) return null;
    
    const chunks = Math.ceil(task.estimatedTime / 25);
    const chunkTime = Math.ceil(task.estimatedTime / chunks);
    
    return Array.from({ length: chunks }, (_, i) => ({
      id: `auto-${task.id}-${i}`,
      summary: `${task.title} - Part ${i + 1}`,
      description: `Work on ${task.title} for ${chunkTime} minutes`,
      estimatedTime: chunkTime,
      difficulty: task.difficulty,
      type: 'Development' as const,
    }));
  }, [task, hasSubtasks]);
  
  const subtasksToShow = hasSubtasks ? task.subTasks : autoBreakdown;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
        {task.description && (
          <p className="text-gray-600 mb-4">{task.description}</p>
        )}
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">
              {task.estimatedTime} minutes
            </span>
          </div>
          
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            <span className="text-sm text-gray-600">
              Difficulty: {'★'.repeat(task.difficulty)}
            </span>
          </div>
          
          <div className="text-sm text-green-600 font-medium">
            💰 {pointsRange.min}-{pointsRange.max} pts
          </div>
        </div>
        
        {!hasSubtasks && autoBreakdown && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center text-blue-800">
              <Scissors className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                Auto-broken into {autoBreakdown.length} manageable chunks (≤25 min each)
              </span>
            </div>
          </div>
        )}
      </div>
      
      {!subtasksToShow ? (
        <TaskTimer
          taskId={task.id}
          estimatedTime={task.estimatedTime || 30}
          onComplete={() => onTaskComplete(task.id)}
        />
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {hasSubtasks ? 'Subtasks' : 'Breakdown'} 
            ({completedSubtasks.length}/{subtasksToShow.length} completed)
          </h3>
          
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(completedSubtasks.length / subtasksToShow.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {subtasksToShow.map((subtask, index) => {
            const isCompleted = completedSubtasks.includes(subtask.id);
            const isExpanded = expandedSubtasks.includes(subtask.id);
            const isActive = !isCompleted && completedSubtasks.length === index;
            
            return (
              <motion.div
                key={subtask.id}
                className={`border rounded-lg p-4 ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : isActive 
                    ? 'bg-blue-50 border-blue-300 shadow-md' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isActive 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      <h4 className="font-medium">{subtask.summary}</h4>
                      {isActive && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {subtask.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {subtask.estimatedTime} min
                      </span>
                      <span>{'★'.repeat(subtask.difficulty)}</span>
                      <span>{subtask.type}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleSubtask(subtask.id)}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {isExpanded && isActive && !isCompleted && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <TaskTimer
                      taskId={subtask.id}
                      estimatedTime={subtask.estimatedTime}
                      onComplete={() => handleSubtaskComplete(subtask.id)}
                    />
                  </div>
                )}
                
                {isCompleted && (
                  <div className="mt-2 text-green-600 font-medium flex items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2"
                    >
                      ✓
                    </motion.div>
                    Completed!
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskBreakdown;