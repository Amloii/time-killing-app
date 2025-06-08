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
  onTaskClick?: (taskId: string) => void;
  onChopTask?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  droppableId,
  onDragEnd,
  emptyMessage = 'No tasks available',
  isDraggable = true,
  onTaskClick,
  onChopTask,
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
        {tasks.map((task, index) => {
          const itemProps = onTaskClick ? {
            onClick: () => onTaskClick(task.id),
            className: 'cursor-pointer hover:scale-[1.02] transition-transform'
          } : {};
          
          return (
            <div key={task.id} {...itemProps}>
              <TaskItem 
                task={task} 
                index={index}
                isDraggable={false}
                onChopTask={onChopTask}
              />
            </div>
          );
        })}
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
              <TaskItem 
                key={task.id} 
                task={task} 
                index={index} 
                onChopTask={onChopTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;