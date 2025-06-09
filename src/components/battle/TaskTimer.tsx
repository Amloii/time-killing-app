import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { formatTime } from '../../utils/formatters';
import Button from '../common/Button';

interface TaskTimerProps {
  taskId: string;
  estimatedTime: number; // in minutes
  onComplete: () => void;
  onTimeUp?: () => void;
}

const TaskTimer: React.FC<TaskTimerProps> = ({
  taskId,
  estimatedTime,
  onComplete,
  onTimeUp
}) => {
  const [timeLeft, setTimeLeft] = useState(estimatedTime * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isCompleted, onTimeUp]);
  
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setTimeLeft(estimatedTime * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };
  
  const handleComplete = () => {
    setIsCompleted(true);
    setIsRunning(false);
    onComplete();
  };
  
  const progress = ((estimatedTime * 60 - timeLeft) / (estimatedTime * 60)) * 100;
  const isOvertime = timeLeft === 0;
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="text-center mb-4">
        <div className={`text-3xl font-mono font-bold ${
          isOvertime ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-900'
        }`}>
          {isOvertime ? 'OVERTIME' : formatTime(timeLeft)}
        </div>
        
        <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors ${
              isOvertime ? 'bg-red-500' : isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <div className="text-sm text-gray-500 mt-1">
          Estimated: {estimatedTime} minutes
        </div>
      </div>
      
      <div className="flex justify-center gap-2">
        {!isCompleted && (
          <>
            {!isRunning ? (
              <Button
                onClick={handleStart}
                icon={<Play className="w-4 h-4" />}
                size="sm"
              >
                Start
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                variant="secondary"
                icon={<Pause className="w-4 h-4" />}
                size="sm"
              >
                Pause
              </Button>
            )}
            
            <Button
              onClick={handleReset}
              variant="secondary"
              icon={<RotateCcw className="w-4 h-4" />}
              size="sm"
            >
              Reset
            </Button>
            
            <Button
              onClick={handleComplete}
              icon={<CheckCircle className="w-4 h-4" />}
              size="sm"
            >
              Complete
            </Button>
          </>
        )}
        
        {isCompleted && (
          <div className="text-green-600 font-medium flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Task Completed!
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTimer;