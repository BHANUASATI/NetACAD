import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { facultyService } from '../services/api';
import { 
  Users, 
  CheckCircle, 
  XCircle,
  BarChart3, 
  ListTodo, 
  MessageSquare, 
  Settings,
  Calendar,
  BookOpen,
  Award,
  Bell,
  Search,
  Menu,
  X as CloseIcon,
  LogOut,
  UserCheck,
  FileText,
  Clock,
  Eye,
  AlertTriangle,
  TrendingUp,
  Target,
  Briefcase,
  GraduationCap,
  Building,
  Mail,
  Phone,
  MapPin,
  Star,
  ChevronRight
} from 'lucide-react';

type FacultyView = 'dashboard' | 'approvals' | 'students' | 'courses' | 'analytics' | 'tasks' | 'messages' | 'schedule' | 'research';

interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  specialization: string[];
  experience: number;
  rating: number;
  totalStudents: number;
  coursesTeaching: number;
  publications: number;
  office: string;
  consultationHours: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  semester: string;
  credits: number;
  enrolledStudents: number;
  schedule: string;
  room: string;
  status: 'active' | 'completed' | 'upcoming';
  progress: number;
  nextClass: Date;
}

interface QuickStats {
  totalStudents: number;
  pendingApprovals: number;
  todayClasses: number;
  unreadMessages: number;
  averageRating: number;
  researchProjects: number;
}

export const FacultyDashboard: React.FC = () => {
  const { state, logout } = useApp();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { currentUser } = state;
  const [activeView, setActiveView] = useState<FacultyView>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  // Real faculty data state
  const [facultyProfile, setFacultyProfile] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [pendingDocuments, setPendingDocuments] = useState<any[]>([]);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  // Fetch faculty data on component mount
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        
        // Fetch faculty profile
        const profileData = await facultyService.getProfile() as any;
        setFacultyProfile(profileData);
        
        // Fetch dashboard stats
        const statsData = await facultyService.getDashboardStats() as any;
        setDashboardStats(statsData);
        
        // Fetch pending documents (if faculty can verify)
        if (profileData?.can_verify_documents) {
          const documentsData = await facultyService.getPendingDocuments() as any[];
          setPendingDocuments(documentsData);
        }
        
      } catch (error: any) {
        console.error('Error fetching faculty data:', error);
        
        // Handle case where faculty profile doesn't exist
        if (error?.message?.includes('Faculty profile not found') || error?.detail === 'Faculty profile not found') {
          console.log('Faculty profile not found, using fallback data');
          // Set default values when profile doesn't exist
          setFacultyProfile({
            id: 'FAC001',
            first_name: 'Faculty',
            last_name: 'User',
            email: currentUser?.email || 'faculty@university.edu.in',
            phone: 'Not provided',
            designation: 'Faculty Member',
            specialization: 'General',
            office: 'Not assigned',
            can_verify_documents: false,
            can_assign_tasks: false
          });
          setDashboardStats({
            total_students: 0,
            pending_documents: 0,
            total_tasks: 0,
            pending_grades: 0,
            verified_students: 0,
            can_verify_documents: false,
            can_assign_tasks: false
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchFacultyData();
    }
  }, [currentUser]);

  // Document verification handlers
  const handleDocumentVerification = async (documentId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      setApprovalLoading(true);
      
      await facultyService.verifyDocument(documentId, status, notes);
      
      // Refresh pending documents
      if (facultyProfile?.can_verify_documents) {
        const documentsData = await facultyService.getPendingDocuments() as any[];
        setPendingDocuments(documentsData);
      }
      
      // Show success message
      alert(`Document ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
      
      // Clear selection
      setSelectedDocument(null);
      setVerificationNotes('');
      
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Failed to verify document. Please try again.');
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleApproveDocument = (document: any) => {
    setSelectedDocument(document);
    setVerificationNotes('');
  };

  const handleRejectDocument = (document: any) => {
    setSelectedDocument(document);
    setVerificationNotes('');
  };

  const confirmApproval = () => {
    if (selectedDocument) {
      handleDocumentVerification(selectedDocument.id, 'approved', verificationNotes);
    }
  };

  const confirmRejection = () => {
    if (selectedDocument) {
      handleDocumentVerification(selectedDocument.id, 'rejected', verificationNotes);
    }
  };

  // Transform faculty profile data for display
  const transformedProfile: FacultyProfile = facultyProfile ? {
    id: facultyProfile.id?.toString() || '',
    name: `${facultyProfile.first_name} ${facultyProfile.last_name}` || 'Faculty Name',
    email: facultyProfile.user?.email || facultyProfile.email || '',
    phone: facultyProfile.phone || 'Not provided',
    department: facultyProfile.department?.name || 'Not assigned',
    designation: facultyProfile.designation || 'Faculty',
    specialization: facultyProfile.specialization ? [facultyProfile.specialization] : [],
    experience: 0, // Calculate from join date if available
    rating: 4.5, // Default rating
    totalStudents: dashboardStats?.total_students || 0,
    coursesTeaching: 0, // Get from courses API if available
    publications: 0, // Get from publications API if available
    office: facultyProfile.office || 'Not assigned',
    consultationHours: 'Mon-Fri: 10:00 AM - 12:00 PM'
  } : {
    id: 'FAC001',
    name: 'Loading...',
    email: '',
    phone: '',
    department: '',
    designation: '',
    specialization: [],
    experience: 0,
    rating: 0,
    totalStudents: 0,
    coursesTeaching: 0,
    publications: 0,
    office: '',
    consultationHours: ''
  };

  // Transform dashboard stats for display
  const transformedStats: QuickStats = dashboardStats ? {
    totalStudents: dashboardStats.total_students || 0,
    pendingApprovals: dashboardStats.pending_documents || 0,
    todayClasses: 0, // Get from schedule API
    unreadMessages: 0, // Get from messages API
    averageRating: 4.5, // Default rating
    researchProjects: dashboardStats.total_tasks || 0
  } : {
    totalStudents: 0,
    pendingApprovals: 0,
    todayClasses: 0,
    unreadMessages: 0,
    averageRating: 0,
    researchProjects: 0
  };

  // Courses Data
  const [courses] = useState<Course[]>([
    {
      id: 'CS301',
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      semester: 'Fall 2024',
      credits: 4,
      enrolledStudents: 45,
      schedule: 'Mon, Wed, Fri - 10:00 AM',
      room: 'CS-201',
      status: 'active',
      progress: 65,
      nextClass: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    },
    {
      id: 'CS401',
      code: 'CS401',
      name: 'Machine Learning',
      semester: 'Fall 2024',
      credits: 3,
      enrolledStudents: 38,
      schedule: 'Tue, Thu - 2:00 PM',
      room: 'CS-301',
      status: 'active',
      progress: 72,
      nextClass: new Date(Date.now() + 24 * 60 * 60 * 1000) // tomorrow
    },
    {
      id: 'CS501',
      code: 'CS501',
      name: 'Research Methodology',
      semester: 'Fall 2024',
      credits: 2,
      enrolledStudents: 25,
      schedule: 'Wed - 4:00 PM',
      room: 'CS-401',
      status: 'active',
      progress: 45,
      nextClass: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    },
    {
      id: 'CS201',
      code: 'CS201',
      name: 'Introduction to Programming',
      semester: 'Fall 2024',
      credits: 3,
      enrolledStudents: 48,
      schedule: 'Mon, Tue, Thu - 11:00 AM',
      room: 'CS-101',
      status: 'active',
      progress: 58,
      nextClass: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour from now
    }
  ]);

  // Quick Stats from API
  const quickStats: QuickStats = transformedStats;

  // Navigation Items
  const navigationItems = [
    { id: 'dashboard' as FacultyView, label: 'Dashboard', icon: BarChart3 },
    { id: 'approvals' as FacultyView, label: 'Approval Queue', icon: CheckCircle },
    { id: 'students' as FacultyView, label: 'Student Progress', icon: Users },
    { id: 'courses' as FacultyView, label: 'Course Management', icon: BookOpen },
    { id: 'analytics' as FacultyView, label: 'Analytics', icon: TrendingUp },
    { id: 'tasks' as FacultyView, label: 'Faculty Tasks', icon: ListTodo },
    { id: 'messages' as FacultyView, label: 'Messages', icon: MessageSquare },
    { id: 'schedule' as FacultyView, label: 'Schedule', icon: Calendar },
    { id: 'research' as FacultyView, label: 'Research', icon: Target },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Faculty Profile Header */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl relative overflow-hidden`}>
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-green-500 to-teal-500 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <UserCheck className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-2`}>
                        {loading ? 'Loading...' : transformedProfile.name}
                      </h1>
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg mb-1`}>
                        {transformedProfile.designation}
                      </p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-2`}>
                        <Building className="w-4 h-4" />
                        {transformedProfile.department}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {transformedProfile.rating}
                          </span>
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {transformedProfile.experience} years experience
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {transformedProfile.publications} publications
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{transformedProfile.email}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{transformedProfile.phone}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{transformedProfile.office}</span>
                    </div>
                  </div>
                </div>
                
                {/* Specialization Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {transformedProfile.specialization.map((spec: string, index: number) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 ${theme === 'dark' ? 'bg-blue-900/20 text-blue-400 border-blue-800/30' : 'bg-blue-100 text-blue-700 border-blue-200'} rounded-full text-xs border`}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {[
                { 
                  icon: Users, 
                  value: quickStats.totalStudents, 
                  label: 'Total Students', 
                  change: '+12 this semester', 
                  color: 'from-blue-500 to-blue-600' 
                },
                { 
                  icon: CheckCircle, 
                  value: quickStats.pendingApprovals, 
                  label: 'Pending Approvals', 
                  change: '3 urgent', 
                  color: 'from-orange-500 to-orange-600' 
                },
                { 
                  icon: Calendar, 
                  value: quickStats.todayClasses, 
                  label: "Today's Classes", 
                  change: 'Next in 1 hour', 
                  color: 'from-green-500 to-green-600' 
                },
                { 
                  icon: MessageSquare, 
                  value: quickStats.unreadMessages, 
                  label: 'Unread Messages', 
                  change: '2 from admin', 
                  color: 'from-purple-500 to-purple-600' 
                },
                { 
                  icon: Star, 
                  value: quickStats.averageRating, 
                  label: 'Average Rating', 
                  change: 'Excellent', 
                  color: 'from-yellow-500 to-yellow-600' 
                },
                { 
                  icon: Target, 
                  value: quickStats.researchProjects, 
                  label: 'Research Projects', 
                  change: '1 ongoing', 
                  color: 'from-indigo-500 to-indigo-600' 
                }
              ].map((stat, index) => (
                <div key={index} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1`}>
                  {/* Background decoration */}
                  <div className="absolute inset-0 bg-white/10 transform rotate-45 scale-150 group-hover:rotate-12 transition-transform duration-500"></div>
                  
                  <div className="relative z-10">
                    <stat.icon className="w-8 h-8 text-white mb-4 transform transition-transform duration-300 group-hover:scale-110" />
                    <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-white/90 font-medium text-sm">{stat.label}</div>
                    <div className="text-white/75 text-xs mt-1">{stat.change}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Today's Schedule */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Today's Schedule</h2>
                <button className={`px-4 py-2 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition-colors flex items-center gap-2`}>
                  <Calendar className="w-4 h-4" />
                  View Full Schedule
                </button>
              </div>
              
              <div className="space-y-4">
                {courses
                  .filter(course => course.status === 'active')
                  .slice(0, 3)
                  .map((course) => (
                    <div key={course.id} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} border hover:shadow-lg transition-all duration-300`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                              {course.code}: {course.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              course.progress > 70 ? 'bg-green-100 text-green-700' :
                              course.progress > 40 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {course.progress}% Complete
                            </span>
                          </div>
                          <div className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.schedule}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {course.room}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {course.enrolledStudents} students
                            </span>
                          </div>
                        </div>
                        <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                          <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Courses */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Active Courses</h2>
                <button className={`px-4 py-2 ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white rounded-lg transition-colors flex items-center gap-2`}>
                  <BookOpen className="w-4 h-4" />
                  Manage Courses
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} border hover:shadow-lg transition-all duration-300`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-1`}>
                          {course.code}
                        </h3>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {course.name}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        course.status === 'active' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Progress</span>
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{course.progress}%</span>
                      </div>
                      <div className={`w-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full ${
                            course.progress > 70 ? 'bg-green-500' :
                            course.progress > 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          } rounded-full transition-all duration-300`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span>{course.enrolledStudents} students</span>
                        <span>{course.credits} credits</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'approvals':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-2`}>Document Approval Queue</h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Review and verify student document submissions
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-orange-900/20 text-orange-400 border-orange-800/30' : 'bg-orange-100 text-orange-700 border-orange-200'} border`}>
                  <span className="font-medium">{pendingDocuments.length} Pending</span>
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
              {pendingDocuments.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-2`}>No Pending Documents</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    All documents have been reviewed. Great job!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {pendingDocuments.map((document) => (
                    <div key={document.id} className={`p-6 hover:${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} transition-colors`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`w-12 h-12 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                              <FileText className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                            </div>
                            <div>
                              <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                {document.file_name || 'Document.pdf'}
                              </h4>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {document.document_type?.name || 'Document Type'} • 
                                Uploaded {new Date(document.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Student</span>
                              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                {document.student?.first_name} {document.student?.last_name}
                              </p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {document.student?.enrollment_number}
                              </p>
                            </div>
                            <div>
                              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Department</span>
                              <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                {document.student?.department?.name || 'Computer Science'}
                              </p>
                            </div>
                            <div>
                              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>File Size</span>
                              <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                {document.file_size ? `${(document.file_size / 1024).toFixed(1)} KB` : 'Unknown'}
                              </p>
                            </div>
                          </div>

                          {document.description && (
                            <div className="mb-4">
                              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Description</span>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                                {document.description}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => {
                              // Handle file paths with or without leading slash
                              const previewUrl = document.file_path.startsWith('/uploads') 
                                ? `http://localhost:8000${document.file_path}`
                                : document.file_path.startsWith('uploads/')
                                ? `http://localhost:8000/${document.file_path}`
                                : document.file_path;
                              
                              // Open in new window and handle potential errors
                              const newWindow = window.open(previewUrl, '_blank');
                              
                              // Check if the window failed to load (file not found)
                              if (newWindow) {
                                newWindow.onload = () => {
                                  // Window loaded successfully
                                };
                                newWindow.onerror = () => {
                                  newWindow.close();
                                  alert('Document file not found. The file may have been moved or deleted.');
                                };
                                
                                // Fallback timeout check
                                setTimeout(() => {
                                  if (newWindow.closed) {
                                    return;
                                  }
                                  try {
                                    // Try to access the window - will fail if it's showing error page
                                    newWindow.location.href;
                                  } catch (e) {
                                    newWindow.close();
                                    alert('Document file not found. The file may have been moved or deleted.');
                                  }
                                }, 3000);
                              } else {
                                alert('Unable to open document preview. Please check your popup blocker settings.');
                              }
                            }}
                            className={`px-3 py-2 text-sm rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors flex items-center gap-2`}
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveDocument(document)}
                              disabled={approvalLoading}
                              className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                                approvalLoading 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-green-500 hover:bg-green-600 text-white'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectDocument(document)}
                              disabled={approvalLoading}
                              className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                                approvalLoading 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-red-500 hover:bg-red-600 text-white'
                              }`}
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verification Modal */}
            {selectedDocument && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-2xl max-w-md w-full`}>
                  <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      Document Verification
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      {selectedDocument.file_name}
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Verification Notes (Optional)
                      </label>
                      <textarea
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Add any notes about this verification..."
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={confirmApproval}
                        disabled={approvalLoading}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          approvalLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {approvalLoading ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={confirmRejection}
                        disabled={approvalLoading}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          approvalLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        {approvalLoading ? 'Processing...' : 'Reject'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDocument(null);
                          setVerificationNotes('');
                        }}
                        className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'students':
        return (
          <div className="p-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-4`}>Student Progress</h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Monitor student performance, attendance, and academic progress
              </p>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="p-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-4`}>Course Management</h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage course content, assignments, and student enrollment
              </p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-4`}>Analytics</h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Comprehensive analytics and insights on teaching performance
              </p>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="p-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-4`}>Faculty Tasks</h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage teaching responsibilities, research, and administrative tasks
              </p>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="p-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-4`}>Messages</h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Communicate with students, colleagues, and administration
              </p>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="p-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-4`}>Schedule</h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                View and manage teaching schedule and appointments
              </p>
            </div>
          </div>
        );
      case 'research':
        return (
          <div className="p-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-4`}>Research</h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage research projects, publications, and collaborations
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-white'} flex`}>
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 ${theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50'}`}>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Sidebar Navigation */}
      <div className={`relative z-10 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 ${theme === 'dark' ? 'bg-gray-900/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl'} border-r ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Faculty Portal</h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Academic Excellence</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeView === item.id
                      ? `bg-gradient-to-r ${
                          theme === 'dark' 
                            ? 'from-blue-600/20 to-purple-600/20 text-blue-400 border-l-4 border-blue-500' 
                            : 'from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-500'
                        }`
                      : `${theme === 'dark' 
                        ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'} truncate`}>
                    {transformedProfile.name}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                    {transformedProfile.designation}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-red-400 hover:bg-red-900/20' 
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 flex flex-col">
        {/* Top Navigation */}
        <header className={`sticky top-0 z-20 ${theme === 'dark' ? 'bg-gray-900/90 backdrop-blur-xl border-gray-800' : 'bg-white/90 backdrop-blur-xl border-gray-200'} border-b`}>
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className={`relative w-full`}>
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder={`Search ${activeView}...`}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                      : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Bell className="w-5 h-5" />
                {quickStats.unreadMessages > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* User Profile */}
              <div className={`hidden sm:flex items-center space-x-3 px-3 py-2 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {transformedProfile.name}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {transformedProfile.designation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};
