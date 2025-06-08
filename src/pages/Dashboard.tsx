import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import TaskList from '../components/tasks/TaskList';
import CreateTaskForm from '../components/tasks/CreateTaskForm';
import TaskChopModal from '../components/tasks/TaskChopModal';
import { useNavigate } from 'react-router-dom';
import BattlePreparation from '../components/battle/BattlePreparation';
import TaskChopTable from '../components/tasks/TaskChopTable';
import ActiveBattle from '../components/battle/ActiveBattle';
import SettingsPanel from '../components/settings/SettingsPanel';
import Button from '../components/common/Button';
import { Settings as SettingsIcon, Plus, List, Scissors } from 'lucide-react';
import { Task, SubTask } from '../types';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { tasks, battleActive, updateTask } = useAppStore();
  const [showSettings, setShowSettings] = useState(false);
  const [chopTask, setChopTask] = useState<Task | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/').pop() || 'battle';
  
  const uncompletedTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
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
  
  if (battleActive) {
    return <ActiveBattle />;
  }
  
  return (
    <div className="min-h-screen bg-sakura p-2 sm:p-4">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold japanese-brush text-red-600 tracking-wide">
          Fight Mode
        </h1>
        
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors"
        >
          <SettingsIcon className="w-6 h-6" />
        </button>
      </header>
      
      <div className="max-w-4xl mx-auto">
        {activeTab === 'chop' ? (
          <TaskChopTable />
        ) : activeTab === 'battle' ? (
          <BattlePreparation />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">Tasks</h2>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                  {uncompletedTasks.length}
                </span>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 min-h-[300px] overflow-y-auto">
                <TaskList
                  tasks={uncompletedTasks}
                  droppableId="dashboard-tasks"
                  emptyMessage="No tasks. Create one to get started!"
                  isDraggable={false}
                  onChopTask={handleChopTask}
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">Create Task</h2>
              <CreateTaskForm />
              
              {completedTasks.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg sm:text-xl font-bold">Completed</h2>
                    <span className="bg-green-200 text-green-700 px-2 py-1 rounded-full text-sm">
                      {completedTasks.length}
                    </span>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 max-h-[300px] overflow-y-auto">
                    <TaskList
                      tasks={completedTasks}
                      droppableId="completed-tasks"
                      emptyMessage="No completed tasks yet"
                      isDraggable={false}
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
    </div>
  );
};

export default Dashboard;