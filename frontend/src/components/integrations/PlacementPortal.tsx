import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, ExternalLink, Send, Eye, Star } from 'lucide-react';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  deadline: Date;
  description: string;
  requirements: string[];
  type: 'onsite' | 'remote' | 'hybrid';
  status: 'open' | 'closed' | 'upcoming';
  applicationCount: number;
  maxApplications: number;
}

interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  studentName: string;
  appliedAt: Date;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  resume?: string;
  coverLetter?: string;
}

export const PlacementPortal: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([
    {
      id: 'INT001',
      title: 'Software Developer Intern',
      company: 'Tech Corp',
      location: 'Bangalore',
      duration: '3 months',
      stipend: '10000/month',
      deadline: new Date('2024-03-01'),
      description: 'Looking for motivated software development interns to work on cutting-edge web applications.',
      requirements: ['Programming knowledge', 'Problem solving skills', 'Web development basics'],
      type: 'onsite',
      status: 'open',
      applicationCount: 45,
      maxApplications: 100,
    },
    {
      id: 'INT002',
      title: 'Web Development Intern',
      company: 'Digital Agency',
      location: 'Remote',
      duration: '2 months',
      stipend: '8000/month',
      deadline: new Date('2024-02-25'),
      description: 'Frontend development internship with modern web technologies and frameworks.',
      requirements: ['HTML/CSS/JS', 'React knowledge', 'Design sense'],
      type: 'remote',
      status: 'open',
      applicationCount: 67,
      maxApplications: 50,
    },
    {
      id: 'INT003',
      title: 'Data Science Intern',
      company: 'Analytics Pro',
      location: 'Hybrid',
      duration: '4 months',
      stipend: '12000/month',
      deadline: new Date('2024-03-15'),
      description: 'Work on real-world data science projects and machine learning models.',
      requirements: ['Python programming', 'Statistics knowledge', 'ML basics'],
      type: 'hybrid',
      status: 'open',
      applicationCount: 23,
      maxApplications: 30,
    },
    {
      id: 'INT004',
      title: 'Mobile App Development',
      company: 'App Studio',
      location: 'Pune',
      duration: '3 months',
      stipend: '9000/month',
      deadline: new Date('2024-02-20'),
      description: 'Develop mobile applications for iOS and Android platforms.',
      requirements: ['Java/Kotlin', 'Swift', 'Mobile UI/UX'],
      type: 'onsite',
      status: 'closed',
      applicationCount: 89,
      maxApplications: 40,
    },
  ]);

  const [applications] = useState<Application[]>([
    {
      id: 'APP001',
      internshipId: 'INT001',
      studentId: 'STU001',
      studentName: 'John Doe',
      appliedAt: new Date('2024-02-10T14:30:00'),
      status: 'pending',
      resume: 'john_doe_resume.pdf',
      coverLetter: 'john_doe_cover.pdf',
    },
    {
      id: 'APP002',
      internshipId: 'INT002',
      studentId: 'STU002',
      studentName: 'Jane Smith',
      appliedAt: new Date('2024-02-08T10:15:00'),
      status: 'reviewed',
      resume: 'jane_smith_resume.pdf',
      coverLetter: 'jane_smith_cover.pdf',
    },
    {
      id: 'APP003',
      internshipId: 'INT003',
      studentId: 'STU003',
      studentName: 'Mike Johnson',
      appliedAt: new Date('2024-02-12T16:45:00'),
      status: 'accepted',
      resume: 'mike_johnson_resume.pdf',
    },
  ]);

  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [activeTab, setActiveTab] = useState<'internships' | 'applications'>('internships');

  const filteredInternships = internships.filter(internship => 
    filter === 'all' || internship.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'closed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'onsite': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'remote': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'hybrid': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Placement Portal</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage internship opportunities and student applications
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('internships')}
            className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === 'internships'
                ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Internships
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === 'applications'
                ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Applications
          </button>
        </div>

        {activeTab === 'internships' && (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Internships</p>
                    <p className="text-2xl font-bold">{internships.length}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Open Positions</p>
                    <p className="text-2xl font-bold">{internships.filter(i => i.status === 'open').length}</p>
                  </div>
                  <Star className="w-8 h-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Total Applications</p>
                    <p className="text-2xl font-bold">{internships.reduce((acc, i) => acc + i.applicationCount, 0)}</p>
                  </div>
                  <Send className="w-8 h-8 text-yellow-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Remote Options</p>
                    <p className="text-2xl font-bold">{internships.filter(i => i.type === 'remote').length}</p>
                  </div>
                  <ExternalLink className="w-8 h-8 text-purple-200" />
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="flex space-x-2 mb-6">
              {(['all', 'open', 'closed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize ${
                    filter === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                  }`}
                >
                  {status}
                  <span className="ml-2 text-xs">
                    ({internships.filter(i => status === 'all' || i.status === status).length})
                  </span>
                </button>
              ))}
            </div>

            {/* Internships List */}
            <div className="space-y-4">
              {filteredInternships.map((internship) => (
                <div key={internship.id} className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{internship.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(internship.status)}`}>
                          {internship.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(internship.type)}`}>
                          {internship.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{internship.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{internship.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{internship.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{internship.stipend}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{internship.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {internship.requirements.slice(0, 3).map((req, index) => (
                            <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded">
                              {req}
                            </span>
                          ))}
                          {internship.requirements.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{internship.requirements.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {internship.applicationCount}/{internship.maxApplications} applications
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedInternship(internship)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-4">
            {/* Applications List */}
            {applications.map((application) => {
              const internship = internships.find(i => i.id === application.internshipId);
              return (
                <div key={application.id} className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{application.studentName}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <p>Applied for: {internship?.title}</p>
                        <p>Company: {internship?.company}</p>
                        <p>Applied on: {application.appliedAt.toLocaleDateString()}</p>
                      </div>
                      
                      {(application.resume || application.coverLetter) && (
                        <div className="flex space-x-2">
                          {application.resume && (
                            <span className="text-xs bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                              Resume: {application.resume}
                            </span>
                          )}
                          {application.coverLetter && (
                            <span className="text-xs bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                              Cover Letter: {application.coverLetter}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Internship Detail Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedInternship.title}
              </h3>
              <button
                onClick={() => setSelectedInternship(null)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Company:</span>
                  <p className="text-gray-900 dark:text-white">{selectedInternship.company}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location:</span>
                  <p className="text-gray-900 dark:text-white">{selectedInternship.location}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration:</span>
                  <p className="text-gray-900 dark:text-white">{selectedInternship.duration}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Stipend:</span>
                  <p className="text-gray-900 dark:text-white">{selectedInternship.stipend}</p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Description:</span>
                <p className="text-gray-900 dark:text-white mt-1">{selectedInternship.description}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Requirements:</span>
                <ul className="mt-1 space-y-1">
                  {selectedInternship.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-900 dark:text-white">
                      • {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Applications:</span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedInternship.applicationCount}/{selectedInternship.maxApplications}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Deadline:</span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedInternship.deadline.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
