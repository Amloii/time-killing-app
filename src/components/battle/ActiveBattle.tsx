import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import BattleTimer from './BattleTimer';
import Button from '../common/Button';
import SamuraiMascot from '../common/SamuraiMascot';

const ActiveBattle: React.FC = () => {
  const { 
    tasks, 
    currentSession, 
    currentTaskIndex, 
    completeTask, 
    nextTask, 
    endBattle 
  } = useAppStore();
  
  if (!currentSession) return null;
  
  const currentTaskId = currentSession.taskIds[currentTaskIndex];
  const currentTask = tasks.find(task => task.id === currentTaskId);
  
  if (!currentTask) {
    return (
      <div className="text-center">
        <p>No tasks available for this battle session.</p>
        <Button onClick={() => endBattle(false)} variant="danger" className="mt-4">
          End Battle
        </Button>
      </div>
    );
  }
  
  const handleCompleteTask = () => {
    completeTask(currentTask.id);
    nextTask();
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">BATTLE IN PROGRESS</h1>
        <BattleTimer />
      </div>
      
      <div className="flex justify-center mb-8">
        <SamuraiMascot mood="focused" size={150} />
      </div>
      
      <motion.div
        key={currentTask.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8"
      >
        <h2 className="text-xl font-bold mb-2">Current Task:</h2>
        <h3 className="text-2xl font-bold mb-4">{currentTask.title}</h3>
        
        {currentTask.description && (
          <p className="mb-4 text-gray-600">{currentTask.description}</p>
        )}
        
        <div className="flex items-center mb-4">
          <span className="font-medium mr-2">Difficulty:</span>
          <div className="flex">
            {Array.from({ length: currentTask.difficulty }).map((_, i) => (
              <span key={i} className="text-yellow-500">★</span>
            ))}
          </div>
        </div>
        
        {currentTask.estimatedTime && (
          <p className="mb-4">
            <span className="font-medium">Estimated time:</span> {currentTask.estimatedTime} minutes
          </p>
        )}
      </motion.div>
      
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={handleCompleteTask}
          icon={<CheckCircle className="w-5 h-5" />}
          size="lg"
        >
          Complete Task
        </Button>
        
        <Button 
          onClick={() => endBattle(false)}
          variant="danger"
          icon={<XCircle className="w-5 h-5" />}
          size="lg"
        >
          Surrender
        </Button>
      </div>
    </motion.div>
  );
};

export default ActiveBattle;