import React from 'react';
import { BarChart3, TrendingUp, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const FacultyAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Faculty Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Students</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Avg Completion</p>
                <p className="text-2xl font-bold">82%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pending Reviews</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">This Week</p>
                <p className="text-2xl font-bold">28</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
