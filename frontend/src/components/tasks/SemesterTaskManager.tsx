import React, { useState, useMemo } from 'react';
import { TaskCard } from './TaskCard';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { checkTaskDependencies } from '../../utils/academicEngine';
import { BookOpen, CheckCircle, Clock, AlertTriangle, LayoutDashboard, Calendar as CalendarIcon, ListTodo } from 'lucide-react';

type ViewMode = 'tasks' | 'calendar' | 'progress';

export interface TaskFilters {
  status: string[];
  priority: string[];
  category: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
}

export const SemesterTaskManager: React.FC = () => {
  const { state, updateTaskStatus } = useApp();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { currentStudent, tasks } = state;
  const [viewMode, setViewMode] = useState<ViewMode>('tasks');
  const [filters, setFilters] = useState<TaskFilters>({
    status: [],
    priority: [],
    category: [],
    dateRange: 'all'
  });

  const currentSemesterTasks = useMemo(() => {
    if (!currentStudent) return [];
    return tasks.filter(task => task.semester === currentStudent.currentSemester);
  }, [tasks, currentStudent]);

  const filteredTasks = useMemo(() => {
    let filtered = currentSemesterTasks;

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }

    // Apply category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(task => filters.category.includes(task.category));
    }

    return filtered;
  }, [currentSemesterTasks, filters]);

  const pendingTasks = useMemo(() => 
    filteredTasks.filter(task => task.status === 'pending'),
    [filteredTasks]
  );

  const completedTasks = useMemo(() => 
    filteredTasks.filter(task => task.status === 'completed'),
    [filteredTasks]
  );

  const overdueTasks = useMemo(() => 
    filteredTasks.filter(task => task.status === 'overdue'),
    [filteredTasks]
  );

  const taskStats = useMemo(() => ({
    total: currentSemesterTasks.length,
    pending: pendingTasks.length,
    completed: completedTasks.length,
    overdue: overdueTasks.length,
  }), [currentSemesterTasks, pendingTasks, completedTasks, overdueTasks]);

  return (
    <div className={`transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-emerald-900'
    }`}>
      {/* Header */}
      <div className={`rounded-xl shadow-xl p-4 sm:p-6 mb-6 transition-all duration-300 ${
        theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700' : 'bg-emerald-800/90 backdrop-blur-xl border-emerald-600'
      } border`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-100'} mb-2`}>
              {t('dashboard.tasks')} - {t('dashboard.semester')} {currentStudent?.currentSemester}
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>
              Manage and track your academic tasks and deadlines
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className={`inline-flex rounded-lg p-1 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-700'
          }`}>
            <button
              onClick={() => setViewMode('tasks')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'tasks'
                  ? `${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
                  : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-gray-100'}`
              }`}
            >
              <ListTodo className="w-4 h-4 inline mr-2" />
              <span className="hidden sm:inline">Tasks</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'calendar'
                  ? `${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
                  : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-gray-100'}`
              }`}
            >
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('progress')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'progress'
                  ? `${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
                  : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-gray-100'}`
              }`}
            >
              <LayoutDashboard className="w-4 h-4 inline mr-2" />
              <span className="hidden sm:inline">Progress</span>
            </button>
          </div>
        </div>
      </div>

      
      {/* Task Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className={`p-3 sm:p-4 rounded-lg text-center transition-all duration-300 hover:scale-105 ${
          theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700' : 'bg-emerald-800/90 backdrop-blur-xl border-emerald-600'
        } border`}>
          <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg mb-2 mx-auto ${
            theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <p className={`text-lg sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-100'}`}>{taskStats.total}</p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>{t('dashboard.totalTasks')}</p>
        </div>
        
        <div className={`p-3 sm:p-4 rounded-lg text-center transition-all duration-300 hover:scale-105 ${
          theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700' : 'bg-emerald-800/90 backdrop-blur-xl border-emerald-600'
        } border`}>
          <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg mb-2 mx-auto ${
            theme === 'dark' ? 'bg-yellow-600' : 'bg-yellow-500'
          }`}>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <p className={`text-lg sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-100'}`}>{taskStats.pending}</p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>{t('dashboard.pending')}</p>
        </div>
        
        <div className={`p-3 sm:p-4 rounded-lg text-center transition-all duration-300 hover:scale-105 ${
          theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700' : 'bg-emerald-800/90 backdrop-blur-xl border-emerald-600'
        } border`}>
          <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg mb-2 mx-auto ${
            theme === 'dark' ? 'bg-green-600' : 'bg-green-500'
          }`}>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <p className={`text-lg sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-100'}`}>{taskStats.completed}</p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>{t('dashboard.completed')}</p>
        </div>
        
        <div className={`p-3 sm:p-4 rounded-lg text-center transition-all duration-300 hover:scale-105 ${
          theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700' : 'bg-emerald-800/90 backdrop-blur-xl border-emerald-600'
        } border`}>
          <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg mb-2 mx-auto ${
            theme === 'dark' ? 'bg-red-600' : 'bg-red-500'
          }`}>
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <p className={`text-lg sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-100'}`}>{taskStats.overdue}</p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>{t('dashboard.overdue')}</p>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'tasks' && (
        <div className="space-y-6">
          {pendingTasks.length > 0 && (
            <div>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-100'} mb-4`}>
                {t('dashboard.pendingTasks')} ({pendingTasks.length})
              </h3>
              <div className="grid gap-4">
                {pendingTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdateStatus={updateTaskStatus}
                  />
                ))}
              </div>
            </div>
          )}
          
          {completedTasks.length > 0 && (
            <div>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-100'} mb-4`}>
                {t('dashboard.completedTasks')} ({completedTasks.length})
              </h3>
              <div className="grid gap-4">
                {completedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdateStatus={updateTaskStatus}
                  />
                ))}
              </div>
            </div>
          )}
          
          {completedTasks.length === 0 && (
            <div className={`text-center py-8 sm:py-12 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700' : 'bg-emerald-800/90 backdrop-blur-xl border-emerald-600'
            } border`}>
              <CheckCircle className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-100'} mb-2`}>
                {t('dashboard.noCompletedTasks')}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>
                {t('dashboard.startCompleting')}
              </p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className={`rounded-xl shadow-xl p-6 sm:p-8 text-center transition-all duration-300 ${
          theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700' : 'bg-emerald-800/90 backdrop-blur-xl border-emerald-600'
        } border`}>
          <CalendarIcon className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-blue-600' : 'text-blue-500'
          }`} />
          <h3 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-100'} mb-2`}>
            Calendar View Coming Soon
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>
            Interactive calendar view for your tasks and deadlines
          </p>
        </div>
      )}

      {viewMode === 'progress' && (
        <div className={`rounded-xl shadow-xl p-6 sm:p-8 text-center transition-all duration-300 ${
          theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700' : 'bg-emerald-800/90 backdrop-blur-xl border-emerald-600'
        } border`}>
          <LayoutDashboard className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-green-600' : 'text-green-500'
          }`} />
          <h3 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-100'} mb-2`}>
            Progress Dashboard Coming Soon
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>
            Visual analytics and progress tracking for your tasks
          </p>
        </div>
      )}
    </div>
  );
};
