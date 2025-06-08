import React from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store';
import { calculateLevel, getPointsForNextLevel } from '../../utils/pointsCalculator';

interface PointsDisplayProps {
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ 
  showProgress = true, 
  size = 'md' 
}) => {
  const { userProfile } = useAppStore();
  const currentLevel = calculateLevel(userProfile.points);
  const pointsToNext = getPointsForNextLevel(userProfile.points);
  const progressPercentage = currentLevel === 0 
    ? (userProfile.points / 100) * 100
    : ((50 - pointsToNext) / 50) * 100;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center space-x-3">
      <motion.div 
        className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Coins className={iconSizes[size]} />
        <span className={`font-bold ${sizeClasses[size]}`}>
          {userProfile.points.toLocaleString()}
        </span>
      </motion.div>

      {showProgress && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Level {currentLevel}
            </span>
          </div>
          
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          <span className="text-xs text-gray-500">
            {pointsToNext} to next
          </span>
        </div>
      )}
    </div>
  );
};

export default PointsDisplay;