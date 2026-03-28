import React, { useState } from 'react';
import { RefreshCw, Calendar, Users, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface ERPStatus {
  module: string;
  lastSync: Date;
  status: 'synced' | 'pending' | 'error';
  recordsCount: number;
}

export const ERPDashboard: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<ERPStatus[]>([
    {
      module: 'Academic Calendar',
      lastSync: new Date('2024-02-15T10:30:00'),
      status: 'synced',
      recordsCount: 45,
    },
    {
      module: 'Student Enrollment',
      lastSync: new Date('2024-02-14T15:45:00'),
      status: 'synced',
      recordsCount: 1247,
    },
    {
      module: 'Exam Results',
      lastSync: new Date('2024-02-13T09:15:00'),
      status: 'pending',
      recordsCount: 892,
    },
    {
      module: 'Course Catalog',
      lastSync: new Date('2024-02-16T08:20:00'),
      status: 'synced',
      recordsCount: 156,
    },
    {
      module: 'Faculty Data',
      lastSync: new Date('2024-02-12T14:30:00'),
      status: 'error',
      recordsCount: 67,
    },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const handleSync = async (module: string) => {
    setIsSyncing(true);
    setSelectedModule(module);
    
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus(prev => prev.map(status => 
        status.module === module 
          ? { ...status, lastSync: new Date(), status: 'synced' as const }
          : status
      ));
      setIsSyncing(false);
      setSelectedModule(null);
    }, 3000);
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    
    // Simulate sync all process
    setTimeout(() => {
      setSyncStatus(prev => prev.map(status => ({
        ...status,
        lastSync: new Date(),
        status: 'synced' as const
      })));
      setIsSyncing(false);
    }, 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'error': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ERP Integration</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              University ERP synchronization and data management
            </p>
          </div>
          
          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isSyncing ? 'Syncing...' : 'Sync All'}</span>
          </button>
        </div>

        {/* Sync Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Synced</p>
                <p className="text-2xl font-bold">{syncStatus.filter(s => s.status === 'synced').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">{syncStatus.filter(s => s.status === 'pending').length}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Errors</p>
                <p className="text-2xl font-bold">{syncStatus.filter(s => s.status === 'error').length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Records</p>
                <p className="text-2xl font-bold">{syncStatus.reduce((acc, s) => acc + s.recordsCount, 0)}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Module Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Module Status</h3>
          
          {syncStatus.map((module) => (
            <div key={module.module} className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(module.status)}`}>
                    {getStatusIcon(module.status)}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{module.module}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Last sync: {module.lastSync.toLocaleDateString()}</span>
                      <span>Records: {module.recordsCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(module.status)}`}>
                    {module.status.toUpperCase()}
                  </span>
                  
                  <button
                    onClick={() => handleSync(module.module)}
                    disabled={isSyncing && selectedModule === module.module}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>
                      {isSyncing && selectedModule === module.module ? 'Syncing...' : 'Sync'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Preview */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Sync Activity</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Academic Calendar Updated</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">15 new events added</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Student Enrollment Synced</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">23 new students enrolled</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">5 hours ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Course Catalog Updated</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">5 new courses added</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
