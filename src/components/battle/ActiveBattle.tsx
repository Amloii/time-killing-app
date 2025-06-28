import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ArrowRight, Trophy, Target } from 'lucide-react';
import { useAppStore } from '../../store';
import BattleTimer from './BattleTimer';
import TaskVerification from './TaskVerification';
import Button from '../common/Button';
import SamuraiMascot from '../common/SamuraiMascot';
import { toast } from 'sonner';
import { getPointsForTimeRange } from '../../utils/pointsCalculator';

const ActiveBattle: React.FC = () => {
  const { 
    tasks, 
    currentSession, 
    currentTaskIndex, 
    completeTask,
    completeSubTask,
    awardPoints,
    awardSubTaskPoints,
    nextTask, 
    endBattle,
    userProfile
  } = useAppStore();
  
  const [showVerification, setShowVerification] = useState(false);
  const [taskToVerify, setTaskToVerify] = useState<string | null>(null);
  const [subtaskToVerify, setSubtaskToVerify] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [completedSubtasks, setCompletedSubtasks] = useState<string[]>([]);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [battleStartTime] = useState(Date.now());
  
  if (!currentSession) return null;
  
  const currentTaskId = currentSession.taskIds[currentTaskIndex];
  const currentTask = tasks.find(task => task.id === currentTaskId);
  const timeElapsed = Math.floor((Date.now() - battleStartTime) / 1000);
  const isLastTask = currentTaskIndex >= currentSession.taskIds.length - 1;
  
  if (!currentTask) {
    return (
      <div className="text-center p-8">
        <SamuraiMascot mood="victory\" size={160} />
        <h2 className="text-2xl font-bold mt-4 mb-2">Battle Complete!</h2>
        <p className="text-gray-600 mb-4">All tasks have been completed.</p>
        <Button onClick={() => endBattle(true)} variant="primary" className="mt-4">
          Finish Battle
        </Button>
      </div>
    );
  }
  
  const handleCompleteTask = (taskId: string) => {
    setTaskToVerify(taskId);
    setShowVerification(true);
  };
  
  const handleCompleteSubtask = (taskId: string, subtaskId: string) => {
    setTaskToVerify(taskId);
    setSubtaskToVerify(subtaskId);
    setShowVerification(true);
  };
  
  const handleTaskVerification = (taskId: string, verified: boolean, notes?: string) => {
    setShowVerification(false);
    setTaskToVerify(null);
    
    if (verified) {
      if (subtaskToVerify) {
        // Complete subtask
        const result = awardSubTaskPoints(taskId, subtaskToVerify);
        completeSubTask(taskId, subtaskToVerify);
        setCompletedSubtasks(prev => [...prev, subtaskToVerify]);
        
        if (result.pointsBreakdown) {
          setPointsEarned(prev => prev + result.pointsBreakdown.total);
          const subtask = currentTask.subTasks?.find(st => st.id === subtaskToVerify);
          toast.success(`Subtask "${subtask?.summary}" completed! +${result.pointsBreakdown.total} points earned!`);
        }
      } else {
        // Complete full task
        const result = awardPoints(taskId);
        completeTask(taskId);
        setCompletedTasks(prev => [...prev, taskId]);
        
        if (result.pointsBreakdown) {
          setPointsEarned(prev => prev + result.pointsBreakdown.total);
          toast.success(`Task completed! +${result.pointsBreakdown.total} points earned!`);
        }
        
        // Move to next task or end battle
        if (isLastTask) {
          setTimeout(() => endBattle(true), 1500);
        } else {
          setTimeout(() => nextTask(), 1000);
        }
      }
    } else {
      toast.info(subtaskToVerify ? 'Continue working on this subtask' : 'Continue working on this task');
    }
    
    setTaskToVerify(null);
    setSubtaskToVerify(null);
  };

  const pointsRange = getPointsForTimeRange(currentTask.estimatedTime || 30);
  
  // Motivational messages based on battle progress
  const getMotivationalMessage = () => {
    const progress = (currentTaskIndex / currentSession.taskIds.length) * 100;
    const timeElapsed = Math.floor((Date.now() - battleStartTime) / 60000); // minutes
    
    if (progress === 0) {
      return "Begin with courage!";
    } else if (progress < 25) {
      return "Strong start, warrior!";
    } else if (progress < 50) {
      return "You're gaining momentum!";
    } else if (progress < 75) {
      return "Victory is within reach!";
    } else {
      return "Final push to glory!";
    }
  };
  
  // Task-specific encouragement
  const getTaskEncouragement = () => {
    const difficulty = currentTask.difficulty;
    const estimatedTime = currentTask.estimatedTime || 30;
    
    if (difficulty >= 4) {
      return "🔥 This challenge will forge your strength!";
    } else if (estimatedTime >= 60) {
      return "⏰ Patience and persistence lead to mastery!";
    } else if (currentTask.subTasks && currentTask.subTasks.length > 0) {
      return "🎯 Break it down, conquer each piece!";
    } else {
      return "⚡ Swift and focused - you've got this!";
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Timer */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl fight-time-heading mb-4 text-black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            BATTLE IN PROGRESS
          </motion.h1>
          
          <div className="mb-6">
            <BattleTimer />
          </div>
          
          {/* Battle Progress */}
          <div className="flex justify-center items-center space-x-6 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Session
            </div>
            <div className="text-sm text-gray-600">
              Task {currentTaskIndex + 1} of {currentSession.taskIds.length}
            </div>
            <div className="text-sm text-green-600 font-medium">
              +{pointsEarned} points earned
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round((currentTaskIndex / currentSession.taskIds.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentTaskIndex / currentSession.taskIds.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Main Task Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mascot and Stats */}
          <div className="lg:col-span-1 flex flex-col items-center space-y-6">
            {/* Motivational Mascot */}
            <div className="text-center">
              <div className="relative">
                <SamuraiMascot mood="focused" size={160} useActiveWarrior={true} />
                
                {/* Motivational Speech Bubble */}
                <motion.div
                  className="absolute -top-4 -right-8 bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <div className="text-sm font-medium text-gray-800 mb-1">
                    {getMotivationalMessage()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Stay focused, warrior!
                  </div>
                  {/* Speech bubble tail */}
                  <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200"></div>
                </motion.div>
              </div>
              
              {/* Battle Stats Card */}
              <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-2">Battle Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-bold text-green-600">{completedTasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-bold text-blue-600">{currentSession.taskIds.length - currentTaskIndex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Points:</span>
                    <span className="font-bold text-yellow-600">+{pointsEarned}</span>
                  </div>
                </div>
              </div>
              
              {/* Warrior Encouragement */}
              <motion.div
                className="mt-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <div className="text-xs text-red-700 font-medium text-center">
                  {getTaskEncouragement()}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Current Task */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTask.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-8"
              >
                {/* Task Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                    {currentTaskIndex + 1}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentTask.title}
                  </h2>
                  {currentTask.description && (
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {currentTask.description}
                    </p>
                  )}
                  {!currentTask.description && (
                    <p className="text-gray-500 text-base italic">
                      Focus on completing this task with dedication and mindfulness.
                    </p>
                  )}
                </div>

                {/* Task Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Estimated Time</div>
                    <div className="font-bold text-blue-600">
                      {currentTask.estimatedTime || 30} min
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Target className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Difficulty</div>
                    <div className="font-bold text-yellow-600">
                      {'★'.repeat(currentTask.difficulty)}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Trophy className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Reward</div>
                    <div className="font-bold text-green-600">
                      {pointsRange.min}-{pointsRange.max} pts
                    </div>
                  </div>
                </div>

                {/* Subtasks if available */}
                {currentTask.subTasks && currentTask.subTasks.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Subtasks:</h3>
                    <div className="space-y-3">
                      {currentTask.subTasks.map((subtask, index) => (
                        <div key={subtask.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{subtask.summary}</div>
                            <div className="text-sm text-gray-600 mt-1">{subtask.description}</div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span>{subtask.estimatedTime} min</span>
                              <span>{subtask.type}</span>
                              <span>{'★'.repeat(subtask.difficulty)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {currentTask.tags && currentTask.tags.length > 0 && (
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                      {currentTask.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    onClick={() => handleCompleteTask(currentTask.id)}
                    icon={<CheckCircle className="w-5 h-5" />}
                    size="lg"
                    fullWidth
                  >
                    {isLastTask ? 'Complete Battle' : 'Complete Task'}
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

                {/* Next Task Preview */}
                {!isLastTask && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      <span className="font-medium">Next task:</span>
                      <span className="ml-2">
                        {tasks.find(t => t.id === currentSession.taskIds[currentTaskIndex + 1])?.title}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
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
      </div>
    </div>
  );
};

export default ActiveBattle;