import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { ArrowLeft, Clock, Star, Tag } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const TaskDetails: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks } = useAppStore();
  
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return (
      <div className="p-4 text-center">
        <p>Task not found</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Button
        onClick={() => navigate(-1)}
        variant="secondary"
        icon={<ArrowLeft className="w-5 h-5" />}
        className="mb-6"
      >
        Back
      </Button>
      
      <Card>
        <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
        
        <div className="space-y-6">
          {task.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{task.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-medium text-gray-600 mb-1">Difficulty</h2>
              <div className="flex">
                {Array.from({ length: task.difficulty }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500" />
                ))}
              </div>
            </div>
            
            {task.estimatedTime && (
              <div>
                <h2 className="text-sm font-medium text-gray-600 mb-1">
                  Estimated Time
                </h2>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-600 mr-2" />
                  <span>{task.estimatedTime} minutes</span>
                </div>
              </div>
            )}
          </div>
          
          {task.tags && task.tags.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-600 mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {task.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {task.subTasks && task.subTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Subtasks</h2>
              <div className="space-y-3">
                {task.subTasks.map(subtask => (
                  <div
                    key={subtask.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{subtask.description}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {subtask.type} • {subtask.estimatedTime} min
                        </p>
                      </div>
                      <div className="flex">
                        {Array.from({ length: subtask.difficulty }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TaskDetails;