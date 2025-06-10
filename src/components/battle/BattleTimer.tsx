import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store';
import { formatTime } from '../../utils/formatters';

const BattleTimer: React.FC = () => {
  const { currentSession, timeRemaining, endBattle } = useAppStore();
  const [seconds, setSeconds] = useState(timeRemaining);
  
  useEffect(() => {
    if (!currentSession) return;
    
    // Initialize the timer
    setSeconds(timeRemaining);
    
    // Set up timer interval
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          endBattle(true);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    
    // Clean up
    return () => clearInterval(timer);
  }, [currentSession, timeRemaining, endBattle]);
  
  // Calculate progress percentage
  const progress = currentSession 
    ? (seconds / (currentSession.duration * 60)) * 100 
    : 0;
  
  const isLowTime = seconds < 300; // Less than 5 minutes
  const isCriticalTime = seconds < 60; // Less than 1 minute
  
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-2">
        <span className={`text-5xl font-bold font-mono transition-colors ${
          isCriticalTime ? 'text-red-600 animate-pulse' : 
          isLowTime ? 'text-orange-600' : 'text-blue-600'
        }`}>
          {formatTime(seconds)}
        </span>
        <div className="text-sm text-gray-600 mt-1">
          {isCriticalTime ? 'Time almost up!' : 
           isLowTime ? 'Final stretch!' : 'Keep going!'}
        </div>
      </div>
      
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            isCriticalTime ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' :
            isLowTime ? 'bg-gradient-to-r from-orange-500 to-red-500' : 
            'bg-gradient-to-r from-green-500 to-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-center mt-2 text-xs text-gray-500">
        {Math.round(progress)}% time remaining
      </div>
    </div>
  );
};

export default BattleTimer;