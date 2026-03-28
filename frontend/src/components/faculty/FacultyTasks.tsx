import React from 'react';
import { ListTodo, Plus, Calendar, Users } from 'lucide-react';

export const FacultyTasks: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Faculty Tasks</h2>
        <div className="text-center py-12">
          <ListTodo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Faculty task management coming soon...</p>
        </div>
      </div>
    </div>
  );
};
