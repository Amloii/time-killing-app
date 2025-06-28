import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Sparkles, Plus, Save, Trash2, X } from 'lucide-react';
import Button from '../common/Button';
import { useAppStore } from '../../store';
import { analyzeTask } from '../../utils/llm/suggestions';
import { TaskType, SubTask, Task } from '../../types';
import { toast } from 'sonner';

const TASK_TYPES: TaskType[] = ['Research', 'Development', 'Design', 'Testing', 'Documentation'];
const TIME_OPTIONS = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 480];

interface TaskChopModalProps {
  task: Task;
  onClose: () => void;
  onSave: (subTasks: Omit<SubTask, 'id'>[]) => void;
}

const TaskChopModal: React.FC<TaskChopModalProps> = ({ task, onClose, onSave }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [subTasks, setSubTasks] = useState<(Omit<SubTask, 'id'> & { tempId: string })[]>([]);
  const { userProfile } = useAppStore();

  const handleAnalyze = async () => {
    if (!userProfile.llmProvider || (!userProfile.geminiApiKey && !userProfile.openaiApiKey)) {
      toast.error('Please configure an AI provider in settings');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const taskDescription = `${task.title}${task.description ? ` - ${task.description}` : ''}`;
      
      const apiKey = userProfile.llmProvider === 'gemini' 
        ? userProfile.geminiApiKey 
        : userProfile.openaiApiKey;
      
      const settings = userProfile.llmSettings || {
        temperature: 0.7,
        maxTokens: 4096,
        model: userProfile.llmProvider === 'gemini' ? 'gemini-2.0-flash-lite' : 'gpt-4o-mini',
        outputFormat: 'json' as const,
        enableUsageMonitoring: true,
      };
      
      const analyzedTasks = await analyzeTask(
        taskDescription, 
        userProfile.llmProvider, 
        apiKey, 
        settings
      );
      setSubTasks(
        analyzedTasks.map(subtask => ({
          ...subtask,
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
        summary: '',
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
    if (subTasks.length === 0) {
      toast.error('Please add at least one subtask');
      return;
    }

    // Validate that all subtasks have required fields
    const invalidSubtasks = subTasks.filter(st => !st.summary.trim() || !st.description.trim());
    if (invalidSubtasks.length > 0) {
      toast.error('Please fill in all subtask fields');
      return;
    }

    onSave(subTasks);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Chop Task</h2>
              <p className="text-gray-600 mt-1">Break down "{task.title}" into smaller subtasks</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="mb-6">
            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                icon={<Sparkles className="w-4 h-4" />}
              >
                {isAnalyzing ? 'Analyzing...' : 'AI Analyze'}
              </Button>
              <Button
                onClick={handleAddSubTask}
                variant="secondary"
                icon={<Plus className="w-4 h-4" />}
              >
                Add Subtask
              </Button>
            </div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="subtasks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
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
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2 min-h-[4rem] flex flex-col gap-2">
                              <input
                                type="text"
                                value={subtask.summary}
                                onChange={(e) =>
                                  handleUpdateSubTask(index, {
                                    summary: e.target.value.slice(0, 50),
                                  })
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm h-10 px-3"
                                placeholder="Short summary (max 50 chars)"
                                maxLength={50}
                              />
                              <textarea
                                value={subtask.description}
                                onChange={(e) =>
                                  handleUpdateSubTask(index, {
                                    description: e.target.value,
                                  })
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm resize-none h-20 py-2 px-3"
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

          {subTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No subtasks yet. Use AI Analyze or Add Subtask to get started.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={subTasks.length === 0}
            icon={<Save className="w-4 h-4" />}
          >
            Save Subtasks
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskChopModal;