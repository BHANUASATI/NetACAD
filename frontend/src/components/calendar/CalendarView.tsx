import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Task } from '../../types';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100 dark:border-dark-700"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayTasks = getTasksForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 dark:border-dark-600 p-2 overflow-hidden transition-all duration-200 hover:shadow-md ${
            isToday ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700' : 'bg-white dark:bg-dark-800'
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayTasks.slice(0, 2).map(task => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`text-xs p-1 rounded cursor-pointer truncate transition-all duration-200 hover:scale-105 ${
                  task.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : task.priority === 'high'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}
              >
                {task.title}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{dayTasks.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card-lg p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
          {monthYear}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-dark-600 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 dark:bg-dark-700 p-2 text-center">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{day}</div>
          </div>
        ))}
        {renderCalendarDays()}
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">High Priority</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Medium Priority</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Low Priority</span>
        </div>
      </div>
    </div>
  );
};
