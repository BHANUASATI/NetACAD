import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Calendar, Tag, Lock } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
  isDependencyMet?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onUpdateStatus, 
  isDependencyMet = true 
}) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800';
      case 'overdue':
        return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800';
      default:
        return 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-600 hover:shadow-card-lg';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'low':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    }
  };

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'academic':
        return <Calendar className="w-4 h-4" />;
      case 'administrative':
        return <CheckCircle className="w-4 h-4" />;
      case 'financial':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'academic':
        return 'text-blue-600 dark:text-blue-400';
      case 'administrative':
        return 'text-purple-600 dark:text-purple-400';
      case 'financial':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-orange-600 dark:text-orange-400';
    }
  };

  const isOverdue = task.dueDate < new Date() && task.status !== 'completed';
  const daysUntilDue = Math.ceil((task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`border rounded-xl p-5 transition-all duration-300 transform hover:scale-[1.02] ${
      getStatusColor(isOverdue ? 'overdue' : task.status)
    } ${!isDependencyMet ? 'opacity-60' : ''} animate-slide-up`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getCategoryColor(task.category)} bg-opacity-10`}>
            {getCategoryIcon(task.category)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
              {task.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs capitalize ${getCategoryColor(task.category)}`}>
                {task.category}
              </span>
              {isOverdue && (
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{task.dueDate.toLocaleDateString()}</span>
          </div>
          {!isOverdue && daysUntilDue >= 0 && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span className={daysUntilDue <= 3 ? 'text-orange-600 dark:text-orange-400 font-medium' : ''}>
                {daysUntilDue === 0 ? 'Today' : daysUntilDue === 1 ? 'Tomorrow' : `${daysUntilDue} days`}
              </span>
            </div>
          )}
        </div>
        {task.dependencies && task.dependencies.length > 0 && (
          <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
            <Lock className="w-3 h-3" />
            <span>Has dependencies</span>
          </div>
        )}
      </div>

      {!isDependencyMet && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4 animate-pulse-slow">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <p className="text-xs text-orange-800 dark:text-orange-300 font-medium">
              Complete dependencies first to unlock this task
            </p>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        {task.status === 'pending' && isDependencyMet && (
          <button
            onClick={() => onUpdateStatus(task.id, 'completed')}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Mark Complete
          </button>
        )}
        {task.status === 'completed' && (
          <button
            onClick={() => onUpdateStatus(task.id, 'pending')}
            className="flex-1 bg-gradient-to-r from-gray-500 to-slate-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-gray-600 hover:to-slate-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Mark Pending
          </button>
        )}
      </div>
    </div>
  );
};
