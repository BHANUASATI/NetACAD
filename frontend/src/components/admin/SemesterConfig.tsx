import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { AcademicProgram, TaskTemplate } from '../../types';

export const SemesterConfig: React.FC = () => {
  const [programs, setPrograms] = useState<AcademicProgram[]>([
    {
      name: 'BCA',
      totalSemesters: 6,
      semesterTasks: {
        1: [
          {
            title: 'Document Verification',
            description: 'Submit all required academic documents for verification',
            category: 'administrative',
            priority: 'high',
            weekOffset: 0
          },
          {
            title: 'iCloud Onboarding',
            description: 'Set up institutional email and cloud services',
            category: 'administrative',
            priority: 'medium',
            weekOffset: 0
          }
        ]
      }
    }
  ]);

  const [selectedProgram, setSelectedProgram] = useState<string>('BCA');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [editingTask, setEditingTask] = useState<TaskTemplate | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const currentProgram = programs.find(p => p.name === selectedProgram);
  const currentTasks = currentProgram?.semesterTasks[selectedSemester] || [];

  const handleAddTask = () => {
    const newTask: TaskTemplate = {
      title: '',
      description: '',
      category: 'academic',
      priority: 'medium',
      weekOffset: 0
    };
    setEditingTask(newTask);
    setIsAddingTask(true);
  };

  const handleSaveTask = () => {
    if (!editingTask || !currentProgram) return;

    const updatedPrograms = programs.map(program => {
      if (program.name === selectedProgram) {
        const updatedTasks = { ...program.semesterTasks };
        if (!updatedTasks[selectedSemester]) {
          updatedTasks[selectedSemester] = [];
        }
        
        if (isAddingTask) {
          updatedTasks[selectedSemester] = [...updatedTasks[selectedSemester], editingTask];
        } else {
          updatedTasks[selectedSemester] = updatedTasks[selectedSemester].map(task =>
            task.title === editingTask.title ? editingTask : task
          );
        }
        
        return { ...program, semesterTasks: updatedTasks };
      }
      return program;
    });

    setPrograms(updatedPrograms);
    setEditingTask(null);
    setIsAddingTask(false);
  };

  const handleDeleteTask = (taskTitle: string) => {
    const updatedPrograms = programs.map(program => {
      if (program.name === selectedProgram) {
        const updatedTasks = { ...program.semesterTasks };
        updatedTasks[selectedSemester] = updatedTasks[selectedSemester].filter(
          task => task.title !== taskTitle
        );
        return { ...program, semesterTasks: updatedTasks };
      }
      return program;
    });

    setPrograms(updatedPrograms);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Semester Configuration</h2>
        
        {/* Program and Semester Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Academic Program
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {programs.map(program => (
                <option key={program.name} value={program.name}>{program.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {Array.from({ length: currentProgram?.totalSemesters || 6 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>Semester {num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tasks for {selectedProgram} - Semester {selectedSemester}
            </h3>
            <button
              onClick={handleAddTask}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          {editingTask && (
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {isAddingTask ? 'Add New Task' : 'Edit Task'}
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveTask}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setIsAddingTask(false);
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
                  placeholder="Task Title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                />
                
                <select
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value as any })}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                >
                  <option value="academic">Academic</option>
                  <option value="administrative">Administrative</option>
                  <option value="financial">Financial</option>
                  <option value="extracurricular">Extracurricular</option>
                </select>

                <input
                  type="text"
                  placeholder="Description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white md:col-span-2"
                />

                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>

                <input
                  type="number"
                  placeholder="Week Offset"
                  value={editingTask.weekOffset}
                  onChange={(e) => setEditingTask({ ...editingTask, weekOffset: Number(e.target.value) })}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            {currentTasks.map((task, index) => (
              <div key={index} className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.category === 'academic' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        task.category === 'administrative' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                        task.category === 'financial' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {task.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {task.priority} priority
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Week {task.weekOffset}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setIsAddingTask(false);
                      }}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.title)}
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
    </div>
  );
};
