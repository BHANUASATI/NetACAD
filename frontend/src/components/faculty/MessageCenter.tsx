import React from 'react';
import { MessageSquare, Send, Mail, Bell } from 'lucide-react';

export const MessageCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Message Center</h2>
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Faculty messaging system coming soon...</p>
        </div>
      </div>
    </div>
  );
};
