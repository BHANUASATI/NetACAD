import React, { useState } from 'react';
import { Search, Filter, User, BookOpen, TrendingUp, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';

interface StudentProgress {
  studentId: string;
  studentName: string;
  email: string;
  course: string;
  currentSemester: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  lastActive: Date;
  riskLevel: 'low' | 'medium' | 'high';
  gpa?: number;
}

export const StudentProgress: React.FC = () => {
  const [students, setStudents] = useState<StudentProgress[]>([
    {
      studentId: 'STU001',
      studentName: 'John Doe',
      email: 'john.doe@university.edu',
      course: 'BCA',
      currentSemester: 1,
      totalTasks: 12,
      completedTasks: 8,
      pendingTasks: 3,
      overdueTasks: 1,
      completionRate: 66.7,
      lastActive: new Date('2024-02-15T10:30:00'),
      riskLevel: 'medium',
      gpa: 3.2
    },
    {
      studentId: 'STU002',
      studentName: 'Jane Smith',
      email: 'jane.smith@university.edu',
      course: 'BCA',
      currentSemester: 2,
      totalTasks: 15,
      completedTasks: 14,
      pendingTasks: 1,
      overdueTasks: 0,
      completionRate: 93.3,
      lastActive: new Date('2024-02-16T14:20:00'),
      riskLevel: 'low',
      gpa: 3.8
    },
    {
      studentId: 'STU003',
      studentName: 'Mike Johnson',
      email: 'mike.johnson@university.edu',
      course: 'MCA',
      currentSemester: 1,
      totalTasks: 10,
      completedTasks: 4,
      pendingTasks: 4,
      overdueTasks: 2,
      completionRate: 40.0,
      lastActive: new Date('2024-02-10T09:15:00'),
      riskLevel: 'high',
      gpa: 2.1
    },
    {
      studentId: 'STU004',
      studentName: 'Sarah Williams',
      email: 'sarah.williams@university.edu',
      course: 'MCA',
      currentSemester: 3,
      totalTasks: 18,
      completedTasks: 16,
      pendingTasks: 2,
      overdueTasks: 0,
      completionRate: 88.9,
      lastActive: new Date('2024-02-16T16:45:00'),
      riskLevel: 'low',
      gpa: 3.6
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);

  const courses = ['BCA', 'MCA'];
  const riskLevels = ['low', 'medium', 'high'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || student.course === selectedCourse;
    const matchesRisk = selectedRisk === 'all' || student.riskLevel === selectedRisk;
    
    return matchesSearch && matchesCourse && matchesRisk;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Progress</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor student academic progress and performance
            </p>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Avg Completion</p>
                <p className="text-2xl font-bold">
                  {(students.reduce((acc, s) => acc + s.completionRate, 0) / students.length).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">At Risk</p>
                <p className="text-2xl font-bold">{students.filter(s => s.riskLevel === 'high').length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Overdue Tasks</p>
                <p className="text-2xl font-bold">{students.reduce((acc, s) => acc + s.overdueTasks, 0)}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Risk Levels</option>
            {riskLevels.map(risk => (
              <option key={risk} value={risk}>{risk.charAt(0).toUpperCase() + risk.slice(1)} Risk</option>
            ))}
          </select>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-600">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Course</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Progress</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Tasks</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Risk Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Last Active</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.studentId} className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{student.studentName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-gray-900 dark:text-white">{student.course}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Semester {student.currentSemester}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <div className="w-24 bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              student.completionRate >= 80 ? 'bg-green-500' :
                              student.completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${student.completionRate}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${getCompletionColor(student.completionRate)}`}>
                        {student.completionRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{student.completedTasks}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span>{student.pendingTasks}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span>{student.overdueTasks}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(student.riskLevel)}`}>
                      {student.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {student.lastActive.toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedStudent.studentName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedStudent.email}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <AlertTriangle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Info */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Basic Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Student ID:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedStudent.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Course:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedStudent.course}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Semester:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedStudent.currentSemester}</span>
                  </div>
                  {selectedStudent.gpa && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">GPA:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{selectedStudent.gpa.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Overview */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Progress Overview</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Tasks:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedStudent.totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed:</span>
                    <span className="text-sm text-green-600 dark:text-green-400">{selectedStudent.completedTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending:</span>
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">{selectedStudent.pendingTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Overdue:</span>
                    <span className="text-sm text-red-600 dark:text-red-400">{selectedStudent.overdueTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate:</span>
                    <span className={`text-sm font-medium ${getCompletionColor(selectedStudent.completionRate)}`}>
                      {selectedStudent.completionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Risk Assessment</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(selectedStudent.riskLevel)}`}>
                      {selectedStudent.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Active:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {selectedStudent.lastActive.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recommendations:</div>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedStudent.riskLevel === 'high' && (
                        <>
                          <li>• Schedule immediate meeting with student</li>
                          <li>• Review academic support options</li>
                          <li>• Consider academic probation if needed</li>
                        </>
                      )}
                      {selectedStudent.riskLevel === 'medium' && (
                        <>
                          <li>• Send progress reminder</li>
                          <li>• Offer additional study resources</li>
                          <li>• Monitor closely for next 2 weeks</li>
                        </>
                      )}
                      {selectedStudent.riskLevel === 'low' && (
                        <>
                          <li>• Continue current progress</li>
                          <li>• Consider advanced opportunities</li>
                          <li>• Recognize excellent performance</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
