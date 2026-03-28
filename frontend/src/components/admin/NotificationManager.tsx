import React, { useState } from 'react';
import { Bell, Send, Mail, MessageSquare, AlertTriangle, CheckCircle, Clock, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  subject: string;
  message: string;
  triggerEvent: string;
  isActive: boolean;
  recipients: 'students' | 'faculty' | 'admin' | 'all';
}

interface NotificationLog {
  id: string;
  type: 'email' | 'sms' | 'push';
  recipient: string;
  subject: string;
  message: string;
  status: 'sent' | 'pending' | 'failed';
  sentAt: Date;
  triggerEvent: string;
}

export const NotificationManager: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Task Deadline Reminder',
      type: 'email',
      subject: 'Reminder: Task Deadline Approaching',
      message: 'Dear Student, This is a reminder that your task "{{taskTitle}}" is due on {{dueDate}}. Please complete it before the deadline.',
      triggerEvent: 'task_deadline_approaching',
      isActive: true,
      recipients: 'students'
    },
    {
      id: '2',
      name: 'Task Overdue Alert',
      type: 'email',
      subject: 'Alert: Task Overdue',
      message: 'Dear Student, Your task "{{taskTitle}}" was due on {{dueDate}} and is now overdue. Please complete it as soon as possible.',
      triggerEvent: 'task_overdue',
      isActive: true,
      recipients: 'students'
    },
    {
      id: '3',
      name: 'Faculty Approval Required',
      type: 'email',
      subject: 'Action Required: Student Submission Pending Approval',
      message: 'Dear Faculty, Student "{{studentName}}" has submitted "{{taskTitle}}" and requires your approval.',
      triggerEvent: 'submission_pending_approval',
      isActive: true,
      recipients: 'faculty'
    }
  ]);

  const [notificationLogs] = useState<NotificationLog[]>([
    {
      id: '1',
      type: 'email',
      recipient: 'john.doe@university.edu',
      subject: 'Reminder: Document Verification Due Soon',
      message: 'Your document verification task is due in 3 days...',
      status: 'sent',
      sentAt: new Date('2024-02-15T10:30:00'),
      triggerEvent: 'task_deadline_approaching'
    },
    {
      id: '2',
      type: 'email',
      recipient: 'faculty@university.edu',
      subject: 'Action Required: Internship Application',
      message: 'Student Jane Smith has submitted internship application...',
      status: 'pending',
      sentAt: new Date('2024-02-15T11:45:00'),
      triggerEvent: 'submission_pending_approval'
    },
    {
      id: '3',
      type: 'sms',
      recipient: '+1234567890',
      subject: 'Task Overdue',
      message: 'Your fee payment task is overdue. Please complete it immediately.',
      status: 'failed',
      sentAt: new Date('2024-02-15T09:15:00'),
      triggerEvent: 'task_overdue'
    }
  ]);

  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'logs'>('templates');

  const handleAddTemplate = () => {
    const newTemplate: NotificationTemplate = {
      id: Date.now().toString(),
      name: '',
      type: 'email',
      subject: '',
      message: '',
      triggerEvent: '',
      isActive: true,
      recipients: 'students'
    };
    setEditingTemplate(newTemplate);
    setIsAddingTemplate(true);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    if (isAddingTemplate) {
      setTemplates([...templates, editingTemplate]);
    } else {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
    }

    setEditingTemplate(null);
    setIsAddingTemplate(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleToggleTemplate = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'failed': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Manager</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure and monitor system notifications
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === 'templates'
                ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === 'logs'
                ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Notification Logs
          </button>
        </div>

        {activeTab === 'templates' && (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Templates</p>
                    <p className="text-2xl font-bold">{templates.length}</p>
                  </div>
                  <Mail className="w-8 h-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active</p>
                    <p className="text-2xl font-bold">{templates.filter(t => t.isActive).length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Email</p>
                    <p className="text-2xl font-bold">{templates.filter(t => t.type === 'email').length}</p>
                  </div>
                  <Mail className="w-8 h-8 text-yellow-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">SMS</p>
                    <p className="text-2xl font-bold">{templates.filter(t => t.type === 'sms').length}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-purple-200" />
                </div>
              </div>
            </div>

            {/* Add Template Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleAddTemplate}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Template</span>
              </button>
            </div>

            {/* Edit/Add Form */}
            {editingTemplate && (
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6 mb-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isAddingTemplate ? 'Add New Template' : 'Edit Template'}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveTemplate}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingTemplate(null);
                        setIsAddingTemplate(false);
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
                    placeholder="Template Name"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                  />

                  <select
                    value={editingTemplate.type}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, type: e.target.value as any })}
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push Notification</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Subject"
                    value={editingTemplate.subject}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white md:col-span-2"
                  />

                  <textarea
                    placeholder="Message (use {{taskTitle}}, {{dueDate}}, {{studentName}} as placeholders)"
                    value={editingTemplate.message}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, message: e.target.value })}
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white md:col-span-2"
                    rows={4}
                  />

                  <input
                    type="text"
                    placeholder="Trigger Event (e.g., task_deadline_approaching)"
                    value={editingTemplate.triggerEvent}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, triggerEvent: e.target.value })}
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                  />

                  <select
                    value={editingTemplate.recipients}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, recipients: e.target.value as any })}
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                  >
                    <option value="students">Students</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                    <option value="all">All Users</option>
                  </select>

                  <div className="flex items-center space-x-2 md:col-span-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editingTemplate.isActive}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, isActive: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Template is active
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Templates List */}
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className={`bg-white dark:bg-dark-800 border rounded-lg p-4 ${
                  template.isActive 
                    ? 'border-gray-200 dark:border-dark-600' 
                    : 'border-gray-300 dark:border-dark-700 opacity-60'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          {getNotificationIcon(template.type)}
                          <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          template.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {template.recipients}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Subject:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{template.subject}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Message:</span>
                          <p className="mt-1 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-700 p-2 rounded">
                            {template.message}
                          </p>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Trigger:</span>
                          <code className="ml-2 text-xs bg-gray-200 dark:bg-dark-600 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                            {template.triggerEvent}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleTemplate(template.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          template.isActive
                            ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-700'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTemplate(template);
                          setIsAddingTemplate(false);
                        }}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            {/* Notification Logs */}
            <div className="space-y-3">
              {notificationLogs.map((log) => (
                <div key={log.id} className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(log.status)}`}>
                        {getNotificationIcon(log.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{log.subject}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          To: {log.recipient}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {log.message.substring(0, 100)}...
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>Trigger: {log.triggerEvent}</span>
                          <span>{log.sentAt.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
