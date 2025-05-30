import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  droppableId: string;
  onDragEnd?: (result: DropResult) => void;
  emptyMessage?: string;
  isDraggable?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  droppableId,
  onDragEnd,
  emptyMessage = 'No tasks available',
  isDraggable = true,
}) => {
  // If tasks is empty, display empty message
  if (tasks.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  if (!isDraggable) {
    return (
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            index={index}
            isDraggable={false}
          />
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd || (() => {})}>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {tasks.map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;