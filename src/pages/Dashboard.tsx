import React, { useState } from 'react';
import { useAppStore } from '../store';
import TaskList from '../components/tasks/TaskList';
import CreateTaskForm from '../components/tasks/CreateTaskForm';
import BattlePreparation from '../components/battle/BattlePreparation';
import TaskChopTable from '../components/tasks/TaskChopTable';
import ActiveBattle from '../components/battle/ActiveBattle';
import SettingsPanel from '../components/settings/SettingsPanel';
import Button from '../components/common/Button';
import { Settings as SettingsIcon, Plus, List, Scissors } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { tasks, battleActive } = useAppStore();
  const { activeTab, setActiveTab } = useAppStore();
  const [showSettings, setShowSettings] = useState(false);
  
  const uncompletedTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
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
        <div className="mb-6 border-b-2 border-red-200">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('battle')}
              className={`py-3 px-4 border-b-2 font-medium ${
                activeTab === 'battle'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-red-500'
              }`}
            >
              Prepare for Battle
            </button>
            
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-3 px-4 border-b-2 font-medium flex items-center ${
                activeTab === 'tasks'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4 mr-1" />
              Task Management
            </button>
            
            <button
              onClick={() => setActiveTab('chop')}
              className={`py-3 px-4 border-b-2 font-medium flex items-center ${
                activeTab === 'chop'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Scissors className="w-4 h-4 mr-1" />
              Task Chop
            </button>
          </nav>
        </div>
        
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
    </div>
  );
};

export default Dashboard;