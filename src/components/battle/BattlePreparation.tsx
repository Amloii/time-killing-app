import React, { useState } from 'react';
import { Swords, Clock, Plus, Minus, Timer, ListPlus } from 'lucide-react';
import Button from '../common/Button';
import { useAppStore } from '../../store';
import SamuraiMascot from '../common/SamuraiMascot';
import TaskSelectionPage from './TaskSelectionPage';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const BattlePreparation: React.FC = () => {
  const { 
    tasks, 
    settings, 
    createSession, 
    startBattle, 
    setActiveTab,
    selectedBattleTasks,
    removeFromBattleSelection,
    clearBattleSelection
  } = useAppStore();
  
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(selectedBattleTasks);
  const [selectedSubtaskIds, setSelectedSubtaskIds] = useState<string[]>([]);
  const [duration, setDuration] = useState(settings.defaultSessionDuration);
  const [showTaskSelection, setShowTaskSelection] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Sync with store's selected battle tasks
  React.useEffect(() => {
    setSelectedTaskIds(selectedBattleTasks);
  }, [selectedBattleTasks]);
  
  // Get selected tasks and their subtasks
  const selectedItems = React.useMemo(() => {
    const selectedTasks = selectedTaskIds
      .map(id => tasks.find(task => task.id === id))
      .filter((task): task is NonNullable<typeof task> => task !== undefined);
      
    const selectedSubtasks = tasks
      .flatMap(task => task.subTasks || [])
      .filter(subtask => selectedSubtaskIds.includes(subtask.id));
      
    return { selectedTasks, selectedSubtasks };
  }, [tasks, selectedTaskIds, selectedSubtaskIds]);
  
  // Calculate estimated total time
  const totalEstimatedTime = React.useMemo(() => {
    const taskTime = selectedItems.selectedTasks.reduce(
      (total, task) => total + (task.estimatedTime || 0), 
      0
    );
    const subtaskTime = selectedItems.selectedSubtasks.reduce(
      (total, subtask) => total + subtask.estimatedTime,
      0
    );
    return taskTime + subtaskTime;
  }, [selectedItems]);
  
  // Handle duration change
  const handleDurationChange = (amount: number) => {
    const newDuration = Math.max(5, Math.min(60, duration + amount));
    setDuration(newDuration);
  };

  const handleRemoveTask = (taskId: string) => {
    setSelectedTaskIds(prev => prev.filter(id => id !== taskId));
    removeFromBattleSelection(taskId);
    // Also remove any selected subtasks from this task
    const task = tasks.find(t => t.id === taskId);
    if (task?.subTasks) {
      setSelectedSubtaskIds(prev => 
        prev.filter(id => !task.subTasks?.some(st => st.id === id))
      );
    }
  };
  
  const handleRemoveSubtask = (subtaskId: string) => {
    setSelectedSubtaskIds(prev => prev.filter(id => id !== subtaskId));
  };
  
  const handleTaskSelect = (taskId: string, subtaskIds?: string[]) => {
    if (taskId && !subtaskIds) {
      setSelectedTaskIds(prev => {
        const isSelected = prev.includes(taskId);
        return isSelected 
          ? prev.filter(id => id !== taskId) 
          : [...prev, taskId];
      });
      
      const task = tasks.find(t => t.id === taskId);
      if (task?.subTasks) {
        setSelectedSubtaskIds(prev => 
          prev.filter(id => !task.subTasks?.some(st => st.id === id))
        );
      }
    } else if (subtaskIds && subtaskIds.length > 0) {
      // Handle "Select All" or "Deselect All" for a task's subtasks
      if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task?.subTasks) {
          const allSelected = task.subTasks.every(st => selectedSubtaskIds.includes(st.id));
          setSelectedSubtaskIds(prev => 
            allSelected
              ? prev.filter(id => !task.subTasks?.some(st => st.id === id))
              : [...prev, ...task.subTasks.map(st => st.id)]
          );
        }
      } else {
        // Handle individual subtask selection
        const subtaskId = subtaskIds[0];
        setSelectedSubtaskIds(prev => 
          prev.includes(subtaskId)
            ? prev.filter(id => id !== subtaskId)
            : [...prev, subtaskId]
        );
      }
    }
    
    setShowTaskSelection(false);
  };

  const handleGoToTasks = () => {
    setActiveTab('tasks');
    window.history.pushState(null, '', '/dashboard/tasks');
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
    if (totalEstimatedTime > duration * 60) {
      setShowConfirmation(true);
      return;
    }
    
    // Combine selected tasks and parent tasks of selected subtasks
    const allTaskIds = new Set([
      ...selectedTaskIds,
      ...selectedItems.selectedSubtasks.map(st => 
        tasks.find(t => t.subTasks?.some(s => s.id === st.id))?.id
      ).filter((id): id is string => id !== undefined)
    ]);
    
    createSession(duration, Array.from(allTaskIds));
    startBattle();
    clearBattleSelection();
  };
  
  if (showTaskSelection) {
    return (
      <TaskSelectionPage
        selectedTaskIds={selectedTaskIds}
        selectedSubtaskIds={selectedSubtaskIds}
        onTaskSelect={handleTaskSelect}
        onBack={() => setShowTaskSelection(false)}
      />
    );
  }
  
  return (
    <div className="p-4 max-w-4xl mx-auto overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Prepare for Battle</h1>
        <p className="text-gray-600">Select your tasks and set your battle duration</p>
      </div>
      
      <div className="mb-8 flex justify-center">
        <SamuraiMascot mood="ready" size={120} />
      </div>
      
      <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Timer className="w-5 h-5 mr-2" />
            Battle Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Battle Duration</h3>
              <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg">
                <Button 
                  onClick={() => handleDurationChange(-5)}
                  variant="secondary"
                  icon={<Minus className="w-4 h-4" />}
                />
                
                <div className="mx-4 text-center">
                  <span className="text-4xl font-bold text-red-600">{duration}</span>
                  <span className="text-lg ml-2">minutes</span>
                </div>
                
                <Button 
                  onClick={() => handleDurationChange(5)}
                  variant="secondary"
                  icon={<Plus className="w-4 h-4" />}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Battle Stats</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Selected Items:</span>
                  <span className="font-bold">
                    {selectedItems.selectedTasks.length + selectedItems.selectedSubtasks.length}
                  </span>
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
            {selectedItems.selectedTasks.length + selectedItems.selectedSubtasks.length}
          </span>
        </div>
        
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          {selectedItems.selectedTasks.length === 0 && selectedItems.selectedSubtasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks selected for this battle</p>
              <Button
                onClick={handleGoToTasks}
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
                    {selectedItems.selectedTasks.map((task, index) => (
                      <Draggable 
                        key={task.id} 
                        draggableId={task.id} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-all duration-200 ${
                              snapshot.isDragging ? 'scale-105 rotate-1 shadow-lg' : ''
                            }`}
                          >
                            <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md">
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
                                      <div className="flex">
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

              {/* Selected Subtasks */}
              {selectedItems.selectedSubtasks.length > 0 && (
                <div className="space-y-2 mb-4">
                  {selectedItems.selectedSubtasks.map((subtask) => {
                    const parentTask = tasks.find(t => 
                      t.subTasks?.some(st => st.id === subtask.id)
                    );
                    
                    return (
                      <div
                        key={subtask.id}
                        className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md ml-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm text-gray-500 mb-1">
                              From: {parentTask?.title}
                            </div>
                            <h3 className="font-medium text-gray-900">
                              {subtask.summary}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {subtask.description}
                            </p>
                            <div className="flex items-center mt-2 space-x-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{subtask.estimatedTime} min</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-1">
                                  Difficulty:
                                </span>
                                <div className="flex">
                                  {Array.from({ length: subtask.difficulty }).map((_, i) => (
                                    <span key={i} className="text-yellow-500">★</span>
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {subtask.type}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveSubtask(subtask.id)}
                            className="ml-2 p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Button
                onClick={handleGoToTasks}
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
      
      <div className="mt-8 text-center mb-safe">
        <Button 
          onClick={handleStartBattle}
          size="lg"
          disabled={selectedItems.selectedTasks.length === 0 && selectedItems.selectedSubtasks.length === 0}
          icon={<Swords className="w-5 h-5" />}
        >
          Begin Battle
        </Button>
        {selectedItems.selectedTasks.length === 0 && selectedItems.selectedSubtasks.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">Select at least one task to begin</p>
        )}
      </div>
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Time Mismatch Warning</h3>
            <p className="text-gray-600 mb-6">
              The total estimated time ({totalEstimatedTime} min) exceeds your battle duration ({duration} min).
              Are you sure you want to proceed?
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmation(false)}
              >
                Adjust Duration
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                  createSession(duration, selectedTaskIds);
                  startBattle();
                }}
              >
                Start Anyway
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattlePreparation;