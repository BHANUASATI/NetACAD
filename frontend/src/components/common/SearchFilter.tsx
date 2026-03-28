import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Grid, List, Moon, Sun, Bell, Settings, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: TaskFilters) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  totalTasks: number;
}

export interface TaskFilters {
  status: string[];
  priority: string[];
  category: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilterChange,
  onViewChange,
  totalTasks
}) => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    status: [],
    priority: [],
    category: [],
    dateRange: 'all'
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleViewChange = (view: 'grid' | 'list') => {
    setViewMode(view);
    onViewChange(view);
  };

  const activeFiltersCount = useMemo(() => {
    return filters.status.length + filters.priority.length + filters.category.length + 
           (filters.dateRange !== 'all' ? 1 : 0);
  }, [filters]);

  return (
    <div className="bg-emerald-800/90 dark:bg-dark-800 rounded-xl shadow-card-lg p-6 mb-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white transition-all duration-200"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative p-3 rounded-lg transition-all duration-200 ${
              showFilters || activeFiltersCount > 0
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
            }`}
          >
            <Filter className="w-5 h-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
            <button
              onClick={() => handleViewChange('grid')}
              className={`p-2 rounded transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-emerald-700 dark:bg-dark-600 shadow-card'
                  : 'text-gray-300 dark:text-gray-400'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewChange('list')}
              className={`p-2 rounded transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-emerald-700 dark:bg-dark-600 shadow-card'
                  : 'text-gray-300 dark:text-gray-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 bg-gray-100 dark:bg-dark-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-200"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button className="p-3 bg-gray-100 dark:bg-dark-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-200 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-3 bg-gray-100 dark:bg-dark-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-200">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {['pending', 'completed', 'overdue'].map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...filters.status, status]
                          : filters.status.filter(s => s !== status);
                        handleFilterChange({ ...filters, status: newStatus });
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <div className="space-y-2">
                {['high', 'medium', 'low'].map(priority => (
                  <label key={priority} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.priority.includes(priority)}
                      onChange={(e) => {
                        const newPriority = e.target.checked
                          ? [...filters.priority, priority]
                          : filters.priority.filter(p => p !== priority);
                        handleFilterChange({ ...filters, priority: newPriority });
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <div className="space-y-2">
                {['academic', 'administrative', 'financial', 'extracurricular'].map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={(e) => {
                        const newCategory = e.target.checked
                          ? [...filters.category, category]
                          : filters.category.filter(c => c !== category);
                        handleFilterChange({ ...filters, category: newCategory });
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange({ ...filters, dateRange: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleFilterChange({
                  status: [],
                  priority: [],
                  category: [],
                  dateRange: 'all'
                })}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {totalTasks} tasks
        {searchQuery && ` matching "${searchQuery}"`}
        {activeFiltersCount > 0 && ` with ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''}`}
      </div>
    </div>
  );
};
