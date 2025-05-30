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
  
  // Get available tasks (those that aren't completed and not selected)
  const availableTasks = tasks.filter(task => 
    !task.completed && !selectedTaskIds.includes(task.id)
  );
  
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
  
  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { source, destination, draggableId } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // Moving within selected tasks
    if (source.droppableId === 'selected-tasks' && 
        destination.droppableId === 'selected-tasks') {
      const newOrder = Array.from(selectedTaskIds);
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, draggableId);
      setSelectedTaskIds(newOrder);
      return;
    }
    
    // Moving from available to selected
    if (source.droppableId === 'available-tasks' && 
        destination.droppableId === 'selected-tasks') {
      setSelectedTaskIds(prev => [...prev, draggableId]);
      return;
    }
    
    // Moving from selected to available
    if (source.droppableId === 'selected-tasks' && 
        destination.droppableId === 'available-tasks') {
      setSelectedTaskIds(prev => prev.filter(id => id !== draggableId));
    }
  };
  
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  // Start the battle
  const handleStartBattle = () => {
    if (selectedTaskIds.length === 0) return;
    createSession(duration, selectedTaskIds);
    startBattle();
  };
  
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
        <div className="p-6 border-b border-gray-200">
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
      
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`transition-all duration-300 ${isDragging ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}>
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
                  className={`bg-white p-4 rounded-lg border-2 min-h-[400px] transition-colors ${
                    snapshot.isDraggingOver ? 'border-red-400 bg-red-50' : 'border-gray-200'
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
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 transition-transform ${
                              snapshot.isDragging ? 'rotate-1 scale-105' : ''
                            }`}
                          >
                            <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                              <h3 className="font-medium">{task.title}</h3>
                              {task.estimatedTime && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {task.estimatedTime} min
                                </p>
                              )}
                            </div>
                          </div>
                        )}
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
                  className={`bg-white p-4 rounded-lg border-2 min-h-[400px] transition-colors ${
                    snapshot.isDraggingOver ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  {availableTasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <p>No tasks available. Create some tasks to begin.</p>
                    </div>
                  ) : (
                    availableTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 transition-transform ${
                              snapshot.isDragging ? 'rotate-1 scale-105' : ''
                            }`}
                          >
                            <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                              <h3 className="font-medium">{task.title}</h3>
                              {task.estimatedTime && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {task.estimatedTime} min
                                </p>
                              )}
                            </div>
                          </div>
                        )}
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