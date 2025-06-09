import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAppStore } from '../../store';
import BattleTimer from './BattleTimer';
import TaskBreakdown from './TaskBreakdown';
import TaskVerification from './TaskVerification';
import BattleProgress from './BattleProgress';
import Button from '../common/Button';
import SamuraiMascot from '../common/SamuraiMascot';
import { toast } from 'sonner';

const ActiveBattle: React.FC = () => {
  const { 
    tasks, 
    currentSession, 
    currentTaskIndex, 
    completeTask,
    awardPoints,
    nextTask, 
    endBattle,
    userProfile
  } = useAppStore();
  
  const [showVerification, setShowVerification] = useState(false);
  const [taskToVerify, setTaskToVerify] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [battleStartTime] = useState(Date.now());
  
  if (!currentSession) return null;
  
  const currentTaskId = currentSession.taskIds[currentTaskIndex];
  const currentTask = tasks.find(task => task.id === currentTaskId);
  const timeElapsed = Math.floor((Date.now() - battleStartTime) / 1000);
  
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
  
  const handleCompleteTask = (taskId: string) => {
    setTaskToVerify(taskId);
    setShowVerification(true);
  };
  
  const handleSubtaskComplete = (subtaskId: string) => {
    // Award points for subtask completion
    const result = awardPoints(subtaskId);
    if (result.pointsBreakdown) {
      setPointsEarned(prev => prev + result.pointsBreakdown.total);
      toast.success(`+${result.pointsBreakdown.total} points earned!`);
    }
  };
  
  const handleTaskVerification = (taskId: string, verified: boolean, notes?: string) => {
    setShowVerification(false);
    setTaskToVerify(null);
    
    if (verified) {
      // Award points for task completion
      const result = awardPoints(taskId);
      completeTask(taskId);
      setCompletedTasks(prev => [...prev, taskId]);
      
      if (result.pointsBreakdown) {
        setPointsEarned(prev => prev + result.pointsBreakdown.total);
        toast.success(`Task completed! +${result.pointsBreakdown.total} points earned!`);
      }
      
      // Move to next task or end battle
      if (currentTaskIndex + 1 >= currentSession.taskIds.length) {
        setTimeout(() => endBattle(true), 1000);
      } else {
        nextTask();
      }
    } else {
      toast.info('Continue working on this task');
    }
  };
  
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 japanese-brush text-red-600">
            BATTLE IN PROGRESS
          </h1>
          <BattleTimer />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Battle Progress */}
          <div className="lg:col-span-1">
            <BattleProgress
              completedTasks={completedTasks}
              totalTasks={currentSession.taskIds.length}
              pointsEarned={pointsEarned}
              timeElapsed={timeElapsed}
            />
            
            <div className="flex justify-center mb-8">
              <SamuraiMascot mood="focused" size={160} />
            </div>
          </div>
          
          {/* Current Task */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentTask.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-blue-800">
                    Current Task ({currentTaskIndex + 1}/{currentSession.taskIds.length})
                  </h2>
                  <div className="flex items-center text-blue-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {currentTask.estimatedTime || 30} min estimated
                    </span>
                  </div>
                </div>
              </div>
              
              <TaskBreakdown
                task={currentTask}
                onSubtaskComplete={handleSubtaskComplete}
                onTaskComplete={handleCompleteTask}
              />
            </motion.div>
            
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => handleCompleteTask(currentTask.id)}
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
                End Battle
              </Button>
            </div>
          </div>
        </div>
        
        {showVerification && taskToVerify && (
          <TaskVerification
            task={tasks.find(t => t.id === taskToVerify)!}
            onVerify={handleTaskVerification}
            onCancel={() => {
              setShowVerification(false);
              setTaskToVerify(null);
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ActiveBattle;