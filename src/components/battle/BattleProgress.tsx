import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Star, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import PointsDisplay from '../common/PointsDisplay';

interface BattleProgressProps {
  completedTasks: string[];
  totalTasks: number;
  pointsEarned: number;
  timeElapsed: number;
}

const BattleProgress: React.FC<BattleProgressProps> = ({
  completedTasks,
  totalTasks,
  pointsEarned,
  timeElapsed
}) => {
  const { tasks } = useAppStore();
  
  const completionPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
  const completedTaskObjects = tasks.filter(task => completedTasks.includes(task.id));
  const averageDifficulty = completedTaskObjects.length > 0
    ? completedTaskObjects.reduce((sum, task) => sum + task.difficulty, 0) / completedTaskObjects.length
    : 0;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Battle Progress
        </h2>
        <PointsDisplay showProgress={false} size="sm" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{completedTasks.length}</div>
          <div className="text-sm text-gray-600">Tasks Completed</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">+{pointsEarned}</div>
          <div className="text-sm text-gray-600">Points Earned</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{formatTime(timeElapsed)}</div>
          <div className="text-sm text-gray-600">Time Elapsed</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {'★'.repeat(Math.round(averageDifficulty))}
          </div>
          <div className="text-sm text-gray-600">Avg Difficulty</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-600">
            {completedTasks.length}/{totalTasks} tasks
          </span>
        </div>
        
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        <div className="text-center mt-2">
          <span className="text-lg font-bold text-green-600">
            {Math.round(completionPercentage)}% Complete
          </span>
        </div>
      </div>
      
      {completedTaskObjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Recently Completed</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {completedTaskObjects.slice(-3).reverse().map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center p-2 bg-green-50 rounded-lg border border-green-200"
              >
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800 flex-1">
                  {task.title}
                </span>
                <span className="text-xs text-green-600">
                  {'★'.repeat(task.difficulty)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleProgress;