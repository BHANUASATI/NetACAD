import React, { useState } from 'react';
import { BarChart3, Users, BookOpen, CheckCircle, Clock, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalStudents: number;
  totalTasks: number;
  completionRate: number;
  overdueTasks: number;
  activeSemesters: number;
  pendingApprovals: number;
}

export const SystemAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('month');
  
  const analyticsData: AnalyticsData = {
    totalStudents: 1247,
    totalTasks: 8432,
    completionRate: 78.5,
    overdueTasks: 234,
    activeSemesters: 18,
    pendingApprovals: 89
  };

  const semesterProgress = [
    { semester: 'Semester 1', completion: 85, total: 210 },
    { semester: 'Semester 2', completion: 72, total: 198 },
    { semester: 'Semester 3', completion: 91, total: 176 },
    { semester: 'Semester 4', completion: 68, total: 164 },
    { semester: 'Semester 5', completion: 79, total: 142 },
    { semester: 'Semester 6', completion: 82, total: 128 }
  ];

  const taskCategories = [
    { category: 'Academic', completed: 3421, pending: 892, overdue: 145 },
    { category: 'Administrative', completed: 2103, pending: 423, overdue: 67 },
    { category: 'Financial', completed: 1876, pending: 234, overdue: 12 },
    { category: 'Extracurricular', completed: 987, pending: 156, overdue: 10 }
  ];

  const recentActivity = [
    { id: 1, type: 'task_completion', student: 'John Doe', task: 'Document Verification', time: '2 hours ago' },
    { id: 2, type: 'deadline_missed', student: 'Jane Smith', task: 'Fee Payment', time: '4 hours ago' },
    { id: 3, type: 'approval_pending', student: 'Mike Johnson', task: 'Internship Application', time: '6 hours ago' },
    { id: 4, type: 'task_completion', student: 'Sarah Williams', task: 'Library Registration', time: '8 hours ago' },
    { id: 5, type: 'deadline_approaching', student: 'Tom Brown', task: 'Mid-term Exam', time: '12 hours ago' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completion': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'deadline_missed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'approval_pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'deadline_approaching': return <Calendar className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor system performance and student progress
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="semester">This Semester</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Total Students</p>
                <p className="text-xl font-bold">{analyticsData.totalStudents.toLocaleString()}</p>
              </div>
              <Users className="w-6 h-6 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs">Total Tasks</p>
                <p className="text-xl font-bold">{analyticsData.totalTasks.toLocaleString()}</p>
              </div>
              <BookOpen className="w-6 h-6 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs">Completion Rate</p>
                <p className="text-xl font-bold">{analyticsData.completionRate}%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-xs">Overdue Tasks</p>
                <p className="text-xl font-bold">{analyticsData.overdueTasks}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-xs">Active Semesters</p>
                <p className="text-xl font-bold">{analyticsData.activeSemesters}</p>
              </div>
              <Calendar className="w-6 h-6 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs">Pending Approvals</p>
                <p className="text-xl font-bold">{analyticsData.pendingApprovals}</p>
              </div>
              <Clock className="w-6 h-6 text-indigo-200" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Semester Progress */}
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Semester Progress</h3>
            <div className="space-y-3">
              {semesterProgress.map((semester) => (
                <div key={semester.semester} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{semester.semester}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {semester.completion}% ({Math.round(semester.total * semester.completion / 100)}/{semester.total})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${semester.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Categories */}
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Categories</h3>
            <div className="space-y-4">
              {taskCategories.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {category.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {category.completed + category.pending + category.overdue} tasks
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <div
                        className="bg-green-500 h-2 rounded-l-full"
                        style={{ 
                          width: `${(category.completed / (category.completed + category.pending + category.overdue)) * 100}%` 
                        }}
                      />
                      <div
                        className="bg-yellow-500 h-2"
                        style={{ 
                          width: `${(category.pending / (category.completed + category.pending + category.overdue)) * 100}%` 
                        }}
                      />
                      <div
                        className="bg-red-500 h-2 rounded-r-full"
                        style={{ 
                          width: `${(category.overdue / (category.completed + category.pending + category.overdue)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 pt-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded" />
                  <span>Pending</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  <span>Overdue</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-white dark:bg-dark-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getActivityIcon(activity.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.student} - {activity.task}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
