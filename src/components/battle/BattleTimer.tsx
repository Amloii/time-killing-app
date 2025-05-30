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
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-2">
        <span className="text-3xl font-bold font-mono">{formatTime(seconds)}</span>
      </div>
      
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-600 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default BattleTimer;