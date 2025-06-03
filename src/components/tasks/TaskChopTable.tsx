import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Sparkles, Plus, Save, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import { useAppStore } from '../../store';
import { analyzeTask } from '../../utils/gemini';
import { TaskType, SubTask } from '../../types';
import { toast } from 'sonner';

const TASK_TYPES: TaskType[] = ['Research', 'Development', 'Design', 'Testing', 'Documentation'];
const TIME_OPTIONS = [15, 30, 60, 120, 240, 480];

const TaskChopTable: React.FC = () => {
  const [mainTask, setMainTask] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [subTasks, setSubTasks] = useState<(Omit<SubTask, 'id'> & { tempId: string })[]>([]);
  const { addTask, settings } = useAppStore();

  const handleAnalyze = async () => {
    if (!mainTask.trim()) {
      toast.error('Please enter a task description');
      return;
    }
    
    if (!settings.geminiApiKey) {
      toast.error('Please add your Gemini API key in settings');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const analyzedTasks = await analyzeTask(mainTask, settings.geminiApiKey);
      setSubTasks(
        analyzedTasks.map(task => ({
          ...task,
          tempId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        }))
      );
      toast.success('Task analyzed successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to analyze task');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddSubTask = () => {
    setSubTasks([
      ...subTasks,
      {
        description: '',
        estimatedTime: 30,
        difficulty: 3,
        type: 'Development',
        tempId: Date.now().toString(),
      },
    ]);
  };

  const handleUpdateSubTask = (index: number, updates: Partial<SubTask>) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index] = { ...newSubTasks[index], ...updates };
    setSubTasks(newSubTasks);
  };

  const handleDeleteSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(subTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSubTasks(items);
  };

  const handleSave = () => {
    if (!mainTask.trim()) {
      toast.error('Please enter a main task description');
      return;
    }

    if (subTasks.length === 0) {
      toast.error('Please add at least one subtask');
      return;
    }

    const totalTime = subTasks.reduce((sum, task) => sum + task.estimatedTime, 0);
    const avgDifficulty = Math.round(
      subTasks.reduce((sum, task) => sum + task.difficulty, 0) / subTasks.length
    );

    const task = {
      title: mainTask,
      description: `Split into ${subTasks.length} subtasks`,
      estimatedTime: totalTime,
      difficulty: avgDifficulty as 1 | 2 | 3 | 4 | 5,
      subTasks: subTasks,
    };

    addTask(task);
    toast.success('Task saved successfully');
    
    // Reset form
    setMainTask('');
    setSubTasks([]);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Task Description
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={mainTask}
            onChange={(e) => setMainTask(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 h-10 px-3"
            placeholder="Enter the main task to break down"
            maxLength={100}
          />
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !mainTask.trim()}
            icon={<Sparkles className="w-4 h-4" />}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="subtasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="mb-6"
            >
              {subTasks.map((subtask, index) => (
                <Draggable
                  key={subtask.tempId}
                  draggableId={subtask.tempId}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-gray-50 p-4 rounded-lg mb-2 border border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 min-h-[4rem] flex flex-col">
                          <textarea
                            value={subtask.description}
                            onChange={(e) =>
                              handleUpdateSubTask(index, {
                                description: e.target.value,
                              })
                            }
                            className="w-full rounded-md border-gray-300 shadow-sm resize-none h-24 py-2 px-3"
                            placeholder="Subtask description"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <select
                            value={subtask.estimatedTime}
                            onChange={(e) =>
                              handleUpdateSubTask(index, {
                                estimatedTime: parseInt(e.target.value),
                              })
                            }
                            className="w-full rounded-md border-gray-300 shadow-sm"
                          >
                            {TIME_OPTIONS.map((time) => (
                              <option key={time} value={time}>
                                {time} min
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex gap-2">
                          <select
                            value={subtask.type}
                            onChange={(e) =>
                              handleUpdateSubTask(index, {
                                type: e.target.value as TaskType,
                              })
                            }
                            className="flex-1 rounded-md border-gray-300 shadow-sm"
                          >
                            {TASK_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleDeleteSubTask(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2">
                        <label className="text-sm text-gray-600">Difficulty:</label>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <button
                              key={level}
                              onClick={() =>
                                handleUpdateSubTask(index, {
                                  difficulty: level as 1 | 2 | 3 | 4 | 5,
                                })
                              }
                              className={`w-8 h-8 rounded ${
                                subtask.difficulty === level
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              ★
                            </button>
                          ))}
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
      </DragDropContext>

      <div className="flex justify-between">
        <Button
          onClick={handleAddSubTask}
          variant="secondary"
          icon={<Plus className="w-4 h-4" />}
        >
          Add Subtask
        </Button>

        <Button
          onClick={handleSave}
          disabled={subTasks.length === 0 || !mainTask.trim()}
          icon={<Save className="w-4 h-4" />}
        >
          Save to Battle Tasks
        </Button>
      </div>
    </div>
  );
};

export default TaskChopTable;