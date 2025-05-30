import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Swords, Clock, Plus, Minus } from 'lucide-react';
import Button from '../common/Button';
import TaskList from '../tasks/TaskList';
import { useAppStore } from '../../store';
import SamuraiMascot from '../common/SamuraiMascot';

const BattlePreparation: React.FC = () => {
  const { tasks, settings, createSession, startBattle } = useAppStore();
  
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [duration, setDuration] = useState(settings.defaultSessionDuration);
  
  // Get available tasks (those that aren't completed)
  const availableTasks = tasks.filter(task => !task.completed);
  const selectedTasks = selectedTaskIds.map(id => 
    tasks.find(task => task.id === id)
  ).filter(task => task !== undefined) as typeof tasks;
  
  // Handle duration change
  const handleDurationChange = (amount: number) => {
    const newDuration = Math.max(5, Math.min(60, duration + amount));
    setDuration(newDuration);
  };
  
  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // Handle moving within selected tasks
    if (source.droppableId === 'selected-tasks' && 
        destination.droppableId === 'selected-tasks') {
      const newSelectedTasks = Array.from(selectedTaskIds);
      const [movedTask] = newSelectedTasks.splice(source.index, 1);
      newSelectedTasks.splice(destination.index, 0, movedTask);
      setSelectedTaskIds(newSelectedTasks);
      return;
    }
    
    // Handle moving from available to selected
    if (source.droppableId === 'available-tasks' && 
        destination.droppableId === 'selected-tasks') {
      const taskId = availableTasks[source.index].id;
      if (!selectedTaskIds.includes(taskId)) {
        setSelectedTaskIds([...selectedTaskIds, taskId]);
      }
      return;
    }
    
    // Handle moving from selected to available
    if (source.droppableId === 'selected-tasks' && 
        destination.droppableId === 'available-tasks') {
      const newSelectedTasks = Array.from(selectedTaskIds);
      newSelectedTasks.splice(source.index, 1);
      setSelectedTaskIds(newSelectedTasks);
      return;
    }
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
        <p className="text-gray-600">Select tasks and set your battle duration</p>
      </div>
      
      <div className="mb-8 flex justify-center">
        <SamuraiMascot mood="ready" size={120} />
      </div>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Battle Duration
        </h2>
        
        <div className="flex items-center justify-center">
          <Button 
            onClick={() => handleDurationChange(-5)}
            variant="secondary"
            icon={<Minus className="w-4 h-4" />}
          />
          
          <div className="mx-4 text-center">
            <span className="text-4xl font-bold">{duration}</span>
            <span className="text-lg ml-2">minutes</span>
          </div>
          
          <Button 
            onClick={() => handleDurationChange(5)}
            variant="secondary"
            icon={<Plus className="w-4 h-4" />}
          />
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Selected Battle Tasks</h2>
            <Droppable droppableId="selected-tasks">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-4 rounded-lg border border-gray-200 min-h-[300px]"
                >
                  {selectedTaskIds.length === 0 ? (
                    <p className="text-center text-gray-500 py-6">
                      Drag tasks here to add them to your battle
                    </p>
                  ) : (
                    selectedTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                              <h3 className="font-medium">{task.title}</h3>
                              {task.estimatedTime && (
                                <p className="text-sm text-gray-600">
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
            <h2 className="text-xl font-bold mb-4">Available Tasks</h2>
            <Droppable droppableId="available-tasks">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-4 rounded-lg border border-gray-200 min-h-[300px]"
                >
                  {availableTasks.length === 0 ? (
                    <p className="text-center text-gray-500 py-6">
                      No tasks available. Create some tasks to begin.
                    </p>
                  ) : (
                    availableTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                              <h3 className="font-medium">{task.title}</h3>
                              {task.estimatedTime && (
                                <p className="text-sm text-gray-600">
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
      </div>
    </div>
  );
};

export default BattlePreparation;