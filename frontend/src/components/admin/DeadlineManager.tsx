import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, Edit2, Save, X, Plus } from 'lucide-react';

interface Deadline {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'expired' | 'completed';
  affectedSemesters: number[];
  reminderDays: number[];
}

export const DeadlineManager: React.FC = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([
    {
      id: '1',
      title: 'Document Verification Deadline',
      description: 'Last date for submitting academic documents',
      dueDate: new Date('2024-02-28'),
      priority: 'high',
      status: 'active',
      affectedSemesters: [1],
      reminderDays: [7, 3, 1]
    },
    {
      id: '2',
      title: 'Mid-term Exam Registration',
      description: 'Registration for mid-term examinations',
      dueDate: new Date('2024-03-15'),
      priority: 'high',
      status: 'active',
      affectedSemesters: [1, 2, 3],
      reminderDays: [14, 7, 3, 1]
    }
  ]);

  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [isAddingDeadline, setIsAddingDeadline] = useState(false);

  const handleAddDeadline = () => {
    const newDeadline: Deadline = {
      id: Date.now().toString(),
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'medium',
      status: 'active',
      affectedSemesters: [],
      reminderDays: [7, 3, 1]
    };
    setEditingDeadline(newDeadline);
    setIsAddingDeadline(true);
  };

  const handleSaveDeadline = () => {
    if (!editingDeadline) return;

    if (isAddingDeadline) {
      setDeadlines([...deadlines, editingDeadline]);
    } else {
      setDeadlines(deadlines.map(d => d.id === editingDeadline.id ? editingDeadline : d));
    }

    setEditingDeadline(null);
    setIsAddingDeadline(false);
  };

  const handleDeleteDeadline = (id: string) => {
    setDeadlines(deadlines.filter(d => d.id !== id));
  };

  const getStatusColor = (status: Deadline['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'expired': return 'text-red-600 dark:text-red-400';
      case 'completed': return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: Deadline['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Deadline Management</h2>
          <button
            onClick={handleAddDeadline}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Deadline</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Deadlines</p>
                <p className="text-2xl font-bold">{deadlines.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active</p>
                <p className="text-2xl font-bold">{deadlines.filter(d => d.status === 'active').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Expired</p>
                <p className="text-2xl font-bold">{deadlines.filter(d => d.status === 'expired').length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">High Priority</p>
                <p className="text-2xl font-bold">{deadlines.filter(d => d.priority === 'high').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-200" />
            </div>
          </div>
        </div>

        {/* Edit/Add Form */}
        {editingDeadline && (
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6 mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isAddingDeadline ? 'Add New Deadline' : 'Edit Deadline'}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveDeadline}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditingDeadline(null);
                    setIsAddingDeadline(false);
                  }}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Deadline Title"
                value={editingDeadline.title}
                onChange={(e) => setEditingDeadline({ ...editingDeadline, title: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
              />

              <input
                type="datetime-local"
                value={editingDeadline.dueDate.toISOString().slice(0, 16)}
                onChange={(e) => setEditingDeadline({ ...editingDeadline, dueDate: new Date(e.target.value) })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
              />

              <textarea
                placeholder="Description"
                value={editingDeadline.description}
                onChange={(e) => setEditingDeadline({ ...editingDeadline, description: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white md:col-span-2"
                rows={3}
              />

              <select
                value={editingDeadline.priority}
                onChange={(e) => setEditingDeadline({ ...editingDeadline, priority: e.target.value as any })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <select
                value={editingDeadline.status}
                onChange={(e) => setEditingDeadline({ ...editingDeadline, status: e.target.value as any })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        )}

        {/* Deadlines List */}
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{deadline.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(deadline.priority)}`}>
                      {deadline.priority}
                    </span>
                    <span className={`text-sm ${getStatusColor(deadline.status)}`}>
                      {deadline.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{deadline.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{deadline.dueDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{deadline.dueDate.toLocaleTimeString()}</span>
                    </div>
                    <span>Semesters: {deadline.affectedSemesters.join(', ')}</span>
                    <span>Reminders: {deadline.reminderDays.join(', ')} days before</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingDeadline(deadline);
                      setIsAddingDeadline(false);
                    }}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDeadline(deadline.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
