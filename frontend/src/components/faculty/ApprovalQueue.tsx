import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Download, AlertTriangle, User, Calendar, FileText } from 'lucide-react';

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  taskTitle: string;
  taskCategory: string;
  submittedAt: Date;
  dueDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  submissionType: 'document' | 'form' | 'assignment' | 'application';
  description: string;
  attachments?: string[];
  facultyNotes?: string;
}

export const ApprovalQueue: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: '1',
      studentName: 'John Doe',
      studentId: 'STU001',
      taskTitle: 'Document Verification',
      taskCategory: 'Administrative',
      submittedAt: new Date('2024-02-15T10:30:00'),
      dueDate: new Date('2024-02-20T23:59:59'),
      status: 'pending',
      priority: 'high',
      submissionType: 'document',
      description: 'Submitted all required academic documents including mark sheets and certificates.',
      attachments: ['marksheet_12th.pdf', 'birth_certificate.pdf', 'transfer_certificate.pdf']
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      studentId: 'STU002',
      taskTitle: 'Internship Application',
      taskCategory: 'Academic',
      submittedAt: new Date('2024-02-14T15:45:00'),
      dueDate: new Date('2024-02-18T23:59:59'),
      status: 'pending',
      priority: 'high',
      submissionType: 'application',
      description: 'Applied for summer internship at Tech Corp with resume and cover letter.',
      attachments: ['resume_jane_smith.pdf', 'cover_letter.pdf', 'internship_form.pdf']
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      studentId: 'STU003',
      taskTitle: 'Minor Project Proposal',
      taskCategory: 'Academic',
      submittedAt: new Date('2024-02-13T09:15:00'),
      dueDate: new Date('2024-02-25T23:59:59'),
      status: 'pending',
      priority: 'medium',
      submissionType: 'assignment',
      description: 'Submitted project proposal for "E-Learning Platform Development".',
      attachments: ['project_proposal.pdf', 'timeline.docx']
    }
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const handleApprove = (submissionId: string) => {
    setSubmissions(submissions.map(s => 
      s.id === submissionId ? { ...s, status: 'approved' as const } : s
    ));
    setSelectedSubmission(null);
  };

  const handleReject = (submissionId: string, reason: string) => {
    setSubmissions(submissions.map(s => 
      s.id === submissionId ? { ...s, status: 'rejected' as const, facultyNotes: reason } : s
    ));
    setSelectedSubmission(null);
  };

  const filteredSubmissions = submissions.filter(s => 
    filter === 'all' || s.status === filter
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'form': return <FileText className="w-4 h-4" />;
      case 'assignment': return <FileText className="w-4 h-4" />;
      case 'application': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Approval Queue</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review and approve student submissions
            </p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md transition-all duration-200 capitalize ${
                  filter === status
                    ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {status}
                <span className="ml-2 text-xs">
                  ({submissions.filter(s => status === 'all' || s.status === status).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">{submissions.filter(s => s.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Approved</p>
                <p className="text-2xl font-bold">{submissions.filter(s => s.status === 'approved').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Rejected</p>
                <p className="text-2xl font-bold">{submissions.filter(s => s.status === 'rejected').length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">High Priority</p>
                <p className="text-2xl font-bold">{submissions.filter(s => s.priority === 'high').length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {getSubmissionIcon(submission.submissionType)}
                      <h4 className="font-medium text-gray-900 dark:text-white">{submission.taskTitle}</h4>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(submission.priority)}`}>
                      {submission.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{submission.studentName} ({submission.studentId})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted: {submission.submittedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Due: {submission.dueDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{submission.description}</p>
                  
                  {submission.attachments && submission.attachments.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attachments:</span>
                      <div className="flex flex-wrap gap-2">
                        {submission.attachments.map((attachment, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span>{attachment}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {submission.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(submission.id)}
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Please provide reason for rejection:');
                          if (reason) handleReject(submission.id, reason);
                        }}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedSubmission.taskTitle}
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Student:</span>
                  <p className="text-gray-900 dark:text-white">{selectedSubmission.studentName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Student ID:</span>
                  <p className="text-gray-900 dark:text-white">{selectedSubmission.studentId}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
                  <p className="text-gray-900 dark:text-white">{selectedSubmission.taskCategory}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</span>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedSubmission.priority)}`}>
                    {selectedSubmission.priority}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Description:</span>
                <p className="text-gray-900 dark:text-white mt-1">{selectedSubmission.description}</p>
              </div>

              {selectedSubmission.attachments && (
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attachments:</span>
                  <div className="mt-2 space-y-2">
                    {selectedSubmission.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-dark-700 p-2 rounded">
                        <span className="text-sm text-gray-900 dark:text-white">{attachment}</span>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSubmission.facultyNotes && (
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Faculty Notes:</span>
                  <p className="text-gray-900 dark:text-white mt-1 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {selectedSubmission.facultyNotes}
                  </p>
                </div>
              )}

              {selectedSubmission.status === 'pending' && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedSubmission.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Please provide reason for rejection:');
                      if (reason) handleReject(selectedSubmission.id, reason);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
