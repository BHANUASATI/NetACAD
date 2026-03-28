import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, GitBranch, Shield, AlertTriangle } from 'lucide-react';

interface DependencyRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  affectedTasks: string[];
}

export const DependencyRules: React.FC = () => {
  const [rules, setRules] = useState<DependencyRule[]>([
    {
      id: '1',
      name: 'Fee Payment Before Internship',
      description: 'Students must complete fee payment before applying for internships',
      condition: 'fee_payment_status == completed',
      action: 'enable_internship_application',
      isActive: true,
      priority: 'high',
      affectedTasks: ['Internship Application', 'Minor Project Topic Submission']
    },
    {
      id: '2',
      name: 'Document Verification Before Exam Form',
      description: 'Document verification must be completed before exam form submission',
      condition: 'document_verification == completed',
      action: 'enable_exam_form_submission',
      isActive: true,
      priority: 'high',
      affectedTasks: ['Exam Form Submission']
    },
    {
      id: '3',
      name: 'Library Card Before Book Issue',
      description: 'Library registration required for book issuance',
      condition: 'library_registration == completed',
      action: 'enable_book_issue',
      isActive: false,
      priority: 'medium',
      affectedTasks: ['Book Issue Request']
    }
  ]);

  const [editingRule, setEditingRule] = useState<DependencyRule | null>(null);
  const [isAddingRule, setIsAddingRule] = useState(false);

  const handleAddRule = () => {
    const newRule: DependencyRule = {
      id: Date.now().toString(),
      name: '',
      description: '',
      condition: '',
      action: '',
      isActive: true,
      priority: 'medium',
      affectedTasks: []
    };
    setEditingRule(newRule);
    setIsAddingRule(true);
  };

  const handleSaveRule = () => {
    if (!editingRule) return;

    if (isAddingRule) {
      setRules([...rules, editingRule]);
    } else {
      setRules(rules.map(r => r.id === editingRule.id ? editingRule : r));
    }

    setEditingRule(null);
    setIsAddingRule(false);
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const getPriorityColor = (priority: DependencyRule['priority']) => {
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
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dependency Rules</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure task dependencies and validation rules
            </p>
          </div>
          <button
            onClick={handleAddRule}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rule</span>
          </button>
        </div>

        {/* Rules Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Rules</p>
                <p className="text-2xl font-bold">{rules.filter(r => r.isActive).length}</p>
              </div>
              <Shield className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-500 to-slate-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm">Inactive Rules</p>
                <p className="text-2xl font-bold">{rules.filter(r => !r.isActive).length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gray-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">High Priority</p>
                <p className="text-2xl font-bold">{rules.filter(r => r.priority === 'high').length}</p>
              </div>
              <GitBranch className="w-8 h-8 text-red-200" />
            </div>
          </div>
        </div>

        {/* Edit/Add Form */}
        {editingRule && (
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6 mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isAddingRule ? 'Add New Rule' : 'Edit Rule'}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveRule}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditingRule(null);
                    setIsAddingRule(false);
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
                placeholder="Rule Name"
                value={editingRule.name}
                onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
              />

              <select
                value={editingRule.priority}
                onChange={(e) => setEditingRule({ ...editingRule, priority: e.target.value as any })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <textarea
                placeholder="Description"
                value={editingRule.description}
                onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white md:col-span-2"
                rows={3}
              />

              <input
                type="text"
                placeholder="Condition (e.g., fee_payment_status == completed)"
                value={editingRule.condition}
                onChange={(e) => setEditingRule({ ...editingRule, condition: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white md:col-span-2"
              />

              <input
                type="text"
                placeholder="Action (e.g., enable_internship_application)"
                value={editingRule.action}
                onChange={(e) => setEditingRule({ ...editingRule, action: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white md:col-span-2"
              />

              <div className="flex items-center space-x-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingRule.isActive}
                  onChange={(e) => setEditingRule({ ...editingRule, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rule is active
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Rules List */}
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className={`bg-white dark:bg-dark-800 border rounded-lg p-4 ${
              rule.isActive 
                ? 'border-gray-200 dark:border-dark-600' 
                : 'border-gray-300 dark:border-dark-700 opacity-60'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{rule.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(rule.priority)}`}>
                      {rule.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rule.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{rule.description}</p>
                  
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Condition:</span>
                      <code className="text-xs bg-gray-200 dark:bg-dark-600 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                        {rule.condition}
                      </code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Action:</span>
                      <code className="text-xs bg-gray-200 dark:bg-dark-600 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                        {rule.action}
                      </code>
                    </div>
                    {rule.affectedTasks.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Affects:</span>
                        <div className="flex flex-wrap gap-1">
                          {rule.affectedTasks.map((task, index) => (
                            <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded">
                              {task}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      rule.isActive
                        ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                        : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-700'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingRule(rule);
                      setIsAddingRule(false);
                    }}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
