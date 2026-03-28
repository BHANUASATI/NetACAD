import React from 'react';
import { TrendingUp, Award, Target, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProgressDashboard: React.FC = () => {
  const { state } = useApp();
  const { tasks, currentStudent } = state;

  if (!currentStudent) return null;

  const currentSemesterTasks = tasks.filter(task => task.semester === currentStudent.currentSemester);
  const completedTasks = currentSemesterTasks.filter(task => task.status === 'completed');
  const pendingTasks = currentSemesterTasks.filter(task => task.status === 'pending');
  const overdueTasks = currentSemesterTasks.filter(task => 
    task.status === 'pending' && task.dueDate < new Date()
  );

  const completionRate = currentSemesterTasks.length > 0 
    ? Math.round((completedTasks.length / currentSemesterTasks.length) * 100)
    : 0;

  const categoryProgress = calculateCategoryProgress(currentSemesterTasks);
  const upcomingDeadlines = getUpcomingDeadlines(pendingTasks);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white shadow-card-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Semester {currentStudent.currentSemester} Progress</h3>
            <p className="text-primary-100 mb-4">
              {completedTasks.length} of {currentSemesterTasks.length} tasks completed
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span className="font-semibold">{completionRate}% Complete</span>
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                <span>Level {Math.floor(completionRate / 20) + 1}</span>
              </div>
            </div>
          </div>
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionRate / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{completionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-card-lg border border-gray-100 dark:border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks.length}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</p>
          <div className="mt-2 w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-card-lg border border-gray-100 dark:border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{pendingTasks.length}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending Tasks</p>
          <div className="mt-2 w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(pendingTasks.length / currentSemesterTasks.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-card-lg border border-gray-100 dark:border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{overdueTasks.length}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Overdue Tasks</p>
          <div className="mt-2 w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overdueTasks.length > 0 ? (overdueTasks.length / currentSemesterTasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-card-lg border border-gray-100 dark:border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-primary-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{currentSemesterTasks.length}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
          <div className="mt-2 w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-card-lg border border-gray-100 dark:border-dark-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress by Category</h3>
        <div className="space-y-4">
          {Object.entries(categoryProgress).map(([category, progress]: [string, any]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  category === 'academic' ? 'bg-blue-500' :
                  category === 'administrative' ? 'bg-purple-500' :
                  category === 'financial' ? 'bg-green-500' :
                  'bg-orange-500'
                }`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {category}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      category === 'academic' ? 'bg-blue-500' :
                      category === 'administrative' ? 'bg-purple-500' :
                      category === 'financial' ? 'bg-green-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${progress.completionRate}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {progress.completed}/{progress.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-card-lg border border-gray-100 dark:border-dark-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary-600" />
          Upcoming Deadlines
        </h3>
        <div className="space-y-3">
          {upcomingDeadlines.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No upcoming deadlines in the next 7 days
            </p>
          ) : (
            upcomingDeadlines.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Due in {Math.ceil((task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

function calculateCategoryProgress(tasks: any[]) {
  const categories = ['academic', 'administrative', 'financial', 'extracurricular'];
  const progress: any = {};
  
  categories.forEach(category => {
    const categoryTasks = tasks.filter(task => task.category === category);
    const completedTasks = categoryTasks.filter(task => task.status === 'completed');
    
    progress[category] = {
      total: categoryTasks.length,
      completed: completedTasks.length,
      completionRate: categoryTasks.length > 0 ? Math.round((completedTasks.length / categoryTasks.length) * 100) : 0
    };
  });
  
  return progress;
}

function getUpcomingDeadlines(pendingTasks: any[]) {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return pendingTasks
    .filter(task => task.dueDate >= now && task.dueDate <= nextWeek)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);
}
