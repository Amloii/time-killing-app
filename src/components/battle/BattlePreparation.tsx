import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Swords, Clock, Plus, Minus, MoveHorizontal, Timer } from 'lucide-react';
import Button from '../common/Button';
import { useAppStore } from '../../store';
import SamuraiMascot from '../common/SamuraiMascot';

const BattlePreparation: React.FC = () => {
  const { tasks, settings, createSession, startBattle } = useAppStore();
  
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [duration, setDuration] = useState(settings.defaultSessionDuration);
  const [isDragging, setIsDragging] = useState(false);
  
  // Get available tasks (those that aren't completed)
  const availableTasks = tasks.filter(task => !task.completed);
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
  
  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    
    if (!result.destination) {
      return;
    }
    
    const { source, destination } = result;
    
    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'selected-tasks') {
        const newTaskIds = Array.from(selectedTaskIds);
        const [movedId] = newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, movedId);
        setSelectedTaskIds(newTaskIds);
      }
      return;
    }
    
    const taskId = result.draggableId;
    
    // Moving to selected tasks
    if (destination.droppableId === 'selected-tasks') {
      if (!selectedTaskIds.includes(taskId)) {
        const newSelectedIds = [...selectedTaskIds];
        newSelectedIds.splice(destination.index, 0, taskId);
        setSelectedTaskIds(newSelectedIds);
      }
    }
    
    // Moving to available tasks
    if (destination.droppableId === 'available-tasks') {
      setSelectedTaskIds(selectedTaskIds.filter(id => id !== taskId));
    }
  };
  
  // Start the battle
  const handleStartBattle = () => {
    if (selectedTaskIds.length === 0) return;
    createSession(duration, selectedTaskIds);
    startBattle();
  };
  
  // Render task item
  const renderTask = (task: NonNullable<typeof tasks[0]>, provided: any, snapshot: any) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`mb-2 transition-all duration-200 ${
        snapshot.isDragging ? 'scale-105 rotate-1 shadow-lg' : ''
      }`}
    >
      <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md">
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
    </div>
  );
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Prepare for Battle</h1>
        <p className="text-gray-600">Select your tasks and set your battle duration</p>
      </div>
      
      <div className="mb-8 flex justify-center">
        <SamuraiMascot mood={isDragging ? "focused" : "ready"} size={120} />
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
      
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Selected Battle Tasks</h2>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                {selectedTasks.length}
              </span>
            </div>
            
            <Droppable droppableId="selected-tasks">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[400px] p-4 rounded-lg border-2 transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'bg-red-50 border-red-300' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {selectedTasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <MoveHorizontal className="w-8 h-8 mb-2" />
                      <p>Drag tasks here to add them to your battle</p>
                    </div>
                  ) : (
                    selectedTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => renderTask(task, provided, snapshot)}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Available Tasks</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {availableTasks.length}
              </span>
            </div>
            
            <Droppable droppableId="available-tasks">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[400px] p-4 rounded-lg border-2 transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'bg-red-50 border-red-300' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {availableTasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <p>No tasks available. Create some tasks to begin.</p>
                    </div>
                  ) : (
                    availableTasks
                      .filter(task => !selectedTaskIds.includes(task.id))
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => renderTask(task, provided, snapshot)}
                        </Draggable>
                      ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
      
      <div className="mt-8 text-center">
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