import React, { useState } from 'react';
import { Swords, Clock, Plus, Minus, Timer, ListPlus } from 'lucide-react';
import Button from '../common/Button';
import { useAppStore } from '../../store';
import SamuraiMascot from '../common/SamuraiMascot';
import TaskSelectionPage from './TaskSelectionPage';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const BattlePreparation: React.FC = () => {
  const { tasks, settings, createSession, startBattle } = useAppStore();
  
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [duration, setDuration] = useState(settings.defaultSessionDuration);
  const [showTaskSelection, setShowTaskSelection] = useState(false);
  
  const handleRemoveTask = (taskId: string) => {
    setSelectedTaskIds(prev => prev.filter(id => id !== taskId));
  };
  
  const selectedTasks = selectedTaskIds
    .map(id => tasks.find(task => task.id === id))
    .filter((task): task is NonNullable<typeof task> => task !== undefined);
  
  // Calculate estimated total time
  const totalEstimatedTime = selectedTasks.reduce((total, task) => 
    total + (task.estimatedTime || 0), 0
  );
  
  // Handle duration change
  const handleDurationChange = (amount: number) => {
    const newDuration = Math.max(5, Math.min(60, duration + amount));
    setDuration(newDuration);
  };
  
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskIds(prev => [...prev, taskId]);
    setShowTaskSelection(false);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedTaskIds);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedTaskIds(items);
  };
  
  // Start the battle
  const handleStartBattle = () => {
    if (selectedTaskIds.length === 0) return;
    createSession(duration, selectedTaskIds);
    startBattle();
  };
  
  if (showTaskSelection) {
    return (
      <TaskSelectionPage
        selectedTaskIds={selectedTaskIds}
        onTaskSelect={handleTaskSelect}
        onBack={() => setShowTaskSelection(false)}
      />
    );
  }
  
  return (
    <div className="p-4 max-w-4xl mx-auto overflow-hidden text-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">戦闘モード</h1>
        <h2 className="text-2xl mb-4">戦いの準備</h2>
        <p className="text-xl text-gray-600">Select your tasks and set your battle</p>
      </div>
      
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4338020/pexels-photo-4338020.jpeg')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10">
          <SamuraiMascot mood="ready" size={150} />
          
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Battle Duration</h3>
              <div className="flex items-center justify-center space-x-4">
                <Button 
                  onClick={() => handleDurationChange(-5)}
                  variant="secondary"
                  icon={<Minus className="w-4 h-4" />}
                />
                
                <div className="text-center bg-green-50 px-6 py-3 rounded-xl">
                  <span className="text-4xl font-bold text-red-600 font-mono">{duration}</span>
                  <span className="text-lg ml-2">minutes</span>
                </div>
                
                <Button 
                  onClick={() => handleDurationChange(5)}
                  variant="secondary"
                  icon={<Plus className="w-4 h-4" />}
                />
              </div>
            
              <div className="mt-6 bg-white/50 p-4 rounded-xl border border-gray-100">
                <div className="text-lg font-medium mb-2">
                  Battle Stats
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Selected Tasks:</span>
                  <span className="font-bold">{selectedTasks.length}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Estimated Time:</span>
                  <span className="font-bold">{totalEstimatedTime} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Selected Battle Tasks</h2>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
            {selectedTasks.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          {selectedTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks selected for this battle</p>
              <Button
                onClick={() => setShowTaskSelection(true)}
                icon={<Plus className="w-5 h-5" />}
                className="mt-4"
              >
                Add Tasks
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="selected-tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 mb-4"
                  >
                    {selectedTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-all duration-200 ${
                              snapshot.isDragging ? 'scale-105 rotate-1 shadow-lg' : ''
                            }`}
                          >
                            <div className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg hover:shadow-md transition-all">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                                  {task.description && (
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                  )}
                                  <div className="flex items-center mt-2 space-x-4">
                                    {task.estimatedTime && (
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>{task.estimatedTime} min</span>
                                      </div>
                                    )}
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-500 mr-1">Difficulty:</span>
                                      <div className="flex text-yellow-500">
                                        {Array.from({ length: task.difficulty }).map((_, i) => (
                                          <span key={i} className="text-yellow-500">★</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemoveTask(task.id);
                                  }}
                                  className="ml-2 p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Button
                onClick={() => setShowTaskSelection(true)}
                variant="secondary"
                fullWidth
                icon={<Plus className="w-5 h-5" />}
                className="mt-4"
              >
                Add More Tasks
              </Button>
            </DragDropContext>
          )}
        </div>
      </div>
      
      <div className="mt-12 text-center mb-safe">
        <Button 
          onClick={handleStartBattle}
          size="lg"
          disabled={selectedTaskIds.length === 0}
          icon={<Swords className="w-5 h-5" />}
        >
          Begin Battle
        </Button>
        {selectedTaskIds.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">Select at least one task to begin</p>
        )}
      </div>
    </div>
  );
};


export default BattlePreparation;