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
        <span className="text-4xl font-bold font-mono text-red-600">{formatTime(seconds)}</span>
        <div className="text-sm text-gray-600 mt-1">
          {seconds < 300 ? 'Final stretch!' : 'Keep going!'}
        </div>
      </div>
      
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${
            seconds < 300 ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' : 'bg-gradient-to-r from-green-500 to-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-center mt-2 text-xs text-gray-500">
        {Math.round(progress)}% remaining
      </div>
    </div>
  );
};

export default BattleTimer;