import React from 'react';
import { useAppStore } from '../store';
import { format } from 'date-fns';
import { BarChart, Clock, Star, CheckCircle } from 'lucide-react';
import Card from '../components/common/Card';

const Statistics: React.FC = () => {
  const { tasks } = useAppStore();
  
  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks.length / totalTasks) * 100) 
    : 0;
  
  const averageDifficulty = completedTasks.length > 0
    ? Math.round(completedTasks.reduce((sum, task) => sum + task.difficulty, 0) / completedTasks.length)
    : 0;
    
  const totalTime = completedTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
  
  const recentActivity = completedTasks
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 5);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl fight-time-heading text-black mb-6">Battle Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Overview</h2>
            <BarChart className="w-5 h-5 text-red-600" />
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <div className="flex items-center">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <span className="ml-2 font-semibold">{completionRate}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-xl font-semibold">{totalTasks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-semibold">{completedTasks.length}</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Performance</h2>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Average Difficulty</p>
              <div className="flex mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < averageDifficulty ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Total Time Invested</p>
              <div className="flex items-center mt-1">
                <Clock className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-xl font-semibold">{totalTime} minutes</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map(task => (
              <div key={task.id} className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-600">
                    Completed {format(new Date(task.completedAt!), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>{task.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;