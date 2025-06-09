import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import TaskList from '../components/tasks/TaskList';
import CreateTaskForm from '../components/tasks/CreateTaskForm';
import TaskChopModal from '../components/tasks/TaskChopModal';
import BattlePreparation from '../components/battle/BattlePreparation';
import ActiveBattle from '../components/battle/ActiveBattle';
import SettingsPanel from '../components/settings/SettingsPanel';
import { Settings as SettingsIcon } from 'lucide-react';
import SamuraiMascot from '../components/common/SamuraiMascot';
import { Task, SubTask } from '../types';
import { toast } from 'sonner';
import PointsEarnedNotification from '../components/common/PointsEarnedNotification';
import { PointsBreakdown } from '../utils/pointsCalculator';
import Button from '../components/common/Button';

const Dashboard: React.FC = () => {
  const { 
    tasks, 
    battleActive, 
    updateTask, 
    awardPoints, 
    completeTask, 
    setActiveTab,
    selectedBattleTasks,
    addToBattleSelection,
    removeFromBattleSelection
  } = useAppStore();
  const [showSettings, setShowSettings] = useState(false);
  const [chopTask, setChopTask] = useState<Task | null>(null);
  const [pointsNotification, setPointsNotification] = useState<PointsBreakdown | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/').pop() || 'battle';
  
  const uncompletedTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const handleTaskComplete = (taskId: string) => {
    const result = awardPoints(taskId);
    completeTask(taskId);
    
    if (result.pointsBreakdown) {
      setPointsNotification(result.pointsBreakdown);
    }
  };
  
  const handleChopTask = (task: Task) => {
    setChopTask(task);
  };
  
  const handleSaveSubtasks = (subTasks: Omit<SubTask, 'id'>[]) => {
    if (!chopTask) return;
    
    const newSubTasks = subTasks.map(st => ({
      ...st,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }));
    
    updateTask(chopTask.id, {
      subTasks: [...(chopTask.subTasks || []), ...newSubTasks]
    });
    
    toast.success(`Added ${subTasks.length} subtasks to "${chopTask.title}"`);
    setChopTask(null);
  };
  
  const handleAddToBattle = (taskId: string) => {
    if (selectedBattleTasks.includes(taskId)) {
      toast.info('Task already selected for battle');
      return;
    }
    
    addToBattleSelection(taskId);
    toast.success('Task added to battle selection!');
  };
  
  const handleRemoveFromBattle = (taskId: string) => {
    removeFromBattleSelection(taskId);
    toast.info('Task removed from battle selection');
  };
  
  const handleGoToBattle = () => {
    if (selectedBattleTasks.length === 0) {
      toast.error('Please select at least one task for battle');
      return;
    }
    
    setActiveTab('battle');
    navigate('/dashboard/battle');
  };
  
  if (battleActive) {
    return <ActiveBattle />;
  }
  
  return (
    <div className="min-h-screen bg-sakura p-2 sm:p-4">
      <div className="max-w-4xl mx-auto flex justify-end items-center mb-6 pt-4">
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors"
        >
          <SettingsIcon className="w-6 h-6" />
        </button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Show centered mascot on tasks page */}
        {activeTab === 'tasks' && (
          <div className="flex justify-center mb-8">
            <SamuraiMascot mood="ready" size={120} />
          </div>
        )}
        
        {activeTab === 'battle' ? (
          <BattlePreparation />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl fight-time-heading">Tasks</h2>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                    {uncompletedTasks.length}
                  </span>
                </div>
                
                {selectedBattleTasks.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      {selectedBattleTasks.length} selected for battle
                    </span>
                    <Button
                      size="sm"
                      onClick={handleGoToBattle}
                      className="text-sm"
                    >
                      Go to Battle
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 min-h-[400px] max-h-[600px] overflow-y-auto">
                <TaskList
                  tasks={uncompletedTasks}
                  droppableId="dashboard-tasks"
                  emptyMessage="No tasks. Create one to get started!"
                  isDraggable={false}
                  onChopTask={handleChopTask}
                  onTaskComplete={handleTaskComplete}
                  allowCompletion={false}
                  showAddToBattle={true}
                  onAddToBattle={handleAddToBattle}
                  selectedForBattle={selectedBattleTasks}
                  onRemoveFromBattle={handleRemoveFromBattle}
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-lg sm:text-xl fight-time-heading mb-4">Create Task</h2>
              <CreateTaskForm />
              
              {completedTasks.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg sm:text-xl fight-time-heading">Completed</h2>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                      {completedTasks.length}
                    </span>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 max-h-[400px] overflow-y-auto">
                    <TaskList
                      tasks={completedTasks}
                      droppableId="completed-tasks"
                      emptyMessage="No completed tasks yet"
                      isDraggable={false}
                      allowCompletion={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </div>
      )}
      
      {chopTask && (
        <TaskChopModal
          task={chopTask}
          onClose={() => setChopTask(null)}
          onSave={handleSaveSubtasks}
        />
      )}
      
      <PointsEarnedNotification
        pointsBreakdown={pointsNotification}
        onClose={() => setPointsNotification(null)}
      />
    </div>
  );
};

export default Dashboard;