// Mock Data Service for NetACAD
// This provides mock data for development and testing

import { Student, Task, FacultyUser, AdminUser, AcademicProgram } from '../types';

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 'STU001',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    course: 'BCA',
    currentSemester: 1,
    totalSemesters: 6,
  },
  {
    id: 'STU002',
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    course: 'BCA',
    currentSemester: 2,
    totalSemesters: 6,
  },
  {
    id: 'STU003',
    name: 'Mike Johnson',
    email: 'mike.johnson@university.edu',
    course: 'MCA',
    currentSemester: 1,
    totalSemesters: 4,
  },
  {
    id: 'STU004',
    name: 'Sarah Williams',
    email: 'sarah.williams@university.edu',
    course: 'MCA',
    currentSemester: 3,
    totalSemesters: 4,
  },
];

// Mock Faculty
export const mockFaculty: FacultyUser[] = [
  {
    id: 'FAC001',
    name: 'Dr. Smith',
    email: 'smith@university.edu',
    department: 'Computer Science',
    role: 'faculty',
    permissions: ['manage_tasks', 'view_students', 'approve_submissions'],
  },
  {
    id: 'FAC002',
    name: 'Prof. Johnson',
    email: 'johnson@university.edu',
    department: 'Computer Science',
    role: 'faculty',
    permissions: ['manage_tasks', 'view_students', 'approve_submissions'],
  },
];

// Mock Admins
export const mockAdmins: AdminUser[] = [
  {
    id: 'ADMIN001',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
    permissions: ['manage_all', 'configure_system', 'view_analytics'],
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 'TASK001',
    title: 'Document Verification',
    description: 'Submit all required academic documents for verification',
    semester: 1,
    dueDate: new Date('2024-02-28'),
    priority: 'high',
    status: 'pending',
    category: 'administrative',
    dependencies: [],
    alerts: [
      {
        id: 'ALERT001',
        type: 'reminder',
        message: 'Document verification deadline approaching',
        triggerDate: new Date('2024-02-25'),
        isActive: true,
      },
    ],
  },
  {
    id: 'TASK002',
    title: 'iCloud Onboarding',
    description: 'Set up institutional email and cloud services',
    semester: 1,
    dueDate: new Date('2024-02-15'),
    priority: 'medium',
    status: 'completed',
    category: 'administrative',
    dependencies: [],
    alerts: [],
  },
  {
    id: 'TASK003',
    title: 'First Internal Exam',
    description: 'Prepare and appear for first internal examination',
    semester: 1,
    dueDate: new Date('2024-03-15'),
    priority: 'high',
    status: 'pending',
    category: 'academic',
    dependencies: ['TASK001'],
    alerts: [
      {
        id: 'ALERT002',
        type: 'deadline',
        message: 'First internal exam deadline',
        triggerDate: new Date('2024-03-10'),
        isActive: true,
      },
    ],
  },
  {
    id: 'TASK004',
    title: 'Library Registration',
    description: 'Complete library membership process',
    semester: 2,
    dueDate: new Date('2024-03-01'),
    priority: 'medium',
    status: 'pending',
    category: 'academic',
    dependencies: [],
    alerts: [],
  },
  {
    id: 'TASK005',
    title: 'Minor Project Topic Submission',
    description: 'Submit minor project proposal for approval',
    semester: 4,
    dueDate: new Date('2024-04-15'),
    priority: 'high',
    status: 'pending',
    category: 'academic',
    dependencies: ['TASK006'],
    alerts: [],
  },
  {
    id: 'TASK006',
    title: 'Fee Payment',
    description: 'Pay semester fees',
    semester: 1,
    dueDate: new Date('2024-02-10'),
    priority: 'high',
    status: 'completed',
    category: 'financial',
    dependencies: [],
    alerts: [],
  },
];

// Mock Academic Programs
export const mockAcademicPrograms: AcademicProgram[] = [
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
          weekOffset: 0,
        },
        {
          title: 'iCloud Onboarding',
          description: 'Set up institutional email and cloud services',
          category: 'administrative',
          priority: 'medium',
          weekOffset: 0,
        },
        {
          title: 'Moodle Setup',
          description: 'Complete LMS profile setup and orientation',
          category: 'academic',
          priority: 'high',
          weekOffset: 1,
        },
        {
          title: 'First Internal Exam',
          description: 'Prepare and appear for first internal examination',
          category: 'academic',
          priority: 'high',
          weekOffset: 4,
        },
      ],
      2: [
        {
          title: 'Library Registration',
          description: 'Complete library membership process',
          category: 'academic',
          priority: 'medium',
          weekOffset: 0,
        },
        {
          title: 'Mid-term Examination',
          description: 'Prepare for mid-term examinations',
          category: 'academic',
          priority: 'high',
          weekOffset: 6,
        },
      ],
      3: [
        {
          title: 'Internship Application',
          description: 'Apply for summer internship program',
          category: 'academic',
          priority: 'high',
          weekOffset: 8,
          dependencies: ['fee_payment'],
        },
      ],
      4: [
        {
          title: 'Minor Project Topic Submission',
          description: 'Submit minor project proposal for approval',
          category: 'academic',
          priority: 'high',
          weekOffset: 8,
          dependencies: ['fee_payment'],
        },
      ],
    },
  },
  {
    name: 'MCA',
    totalSemesters: 4,
    semesterTasks: {
      1: [
        {
          title: 'Document Verification',
          description: 'Submit all required academic documents',
          category: 'administrative',
          priority: 'high',
          weekOffset: 0,
        },
        {
          title: 'Programming Foundation Test',
          description: 'Complete programming skills assessment',
          category: 'academic',
          priority: 'medium',
          weekOffset: 2,
        },
      ],
      2: [
        {
          title: 'Minor Project Registration',
          description: 'Register for minor project and select guide',
          category: 'academic',
          priority: 'high',
          weekOffset: 0,
        },
        {
          title: 'Minor Project Topic Submission',
          description: 'Submit detailed project proposal',
          category: 'academic',
          priority: 'high',
          weekOffset: 4,
        },
      ],
    },
  },
];

// Mock API responses
export const mockApiResponses = {
  // Authentication
  login: (email: string, password: string, isFaculty: boolean) => {
    // Check if it's an admin email
    if (email.includes('admin')) {
      const admin = mockAdmins.find(a => a.email === email);
      if (admin && password === 'password') {
        return {
          success: true,
          user: admin,
          token: 'mock-jwt-token',
        };
      }
    }
    
    // Check faculty or student
    const user = isFaculty 
      ? mockFaculty.find(f => f.email === email)
      : mockStudents.find(s => s.email === email);
    
    if (user && password === 'password') {
      return {
        success: true,
        user,
        token: 'mock-jwt-token',
      };
    }
    return {
      success: false,
      message: 'Invalid credentials',
    };
  },

  // Student tasks
  getStudentTasks: (studentId: string, semester?: number) => {
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) return [];

    return mockTasks.filter(task => 
      task.semester === (semester || student.currentSemester)
    );
  },

  // Faculty approvals
  getPendingApprovals: () => {
    return [
      {
        id: 'SUB001',
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
        attachments: ['marksheet_12th.pdf', 'birth_certificate.pdf'],
      },
      {
        id: 'SUB002',
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
        attachments: ['resume_jane_smith.pdf', 'cover_letter.pdf'],
      },
    ];
  },

  // Admin analytics
  getSystemAnalytics: () => ({
    totalStudents: mockStudents.length,
    totalTasks: mockTasks.length,
    completionRate: 78.5,
    overdueTasks: 234,
    activeSemesters: 18,
    pendingApprovals: 89,
    semesterProgress: [
      { semester: 'Semester 1', completion: 85, total: 210 },
      { semester: 'Semester 2', completion: 72, total: 198 },
      { semester: 'Semester 3', completion: 91, total: 176 },
      { semester: 'Semester 4', completion: 68, total: 164 },
      { semester: 'Semester 5', completion: 79, total: 142 },
      { semester: 'Semester 6', completion: 82, total: 128 },
    ],
    taskCategories: [
      { category: 'Academic', completed: 3421, pending: 892, overdue: 145 },
      { category: 'Administrative', completed: 2103, pending: 423, overdue: 67 },
      { category: 'Financial', completed: 1876, pending: 234, overdue: 12 },
      { category: 'Extracurricular', completed: 987, pending: 156, overdue: 10 },
    ],
  }),

  // ERP Integration
  getAcademicCalendar: () => [
    {
      id: 'CAL001',
      title: 'Semester 1 Begins',
      startDate: '2024-01-15',
      endDate: '2024-01-15',
      type: 'academic',
    },
    {
      id: 'CAL002',
      title: 'Mid-term Exams',
      startDate: '2024-03-01',
      endDate: '2024-03-07',
      type: 'exam',
    },
    {
      id: 'CAL003',
      title: 'Semester 1 Ends',
      startDate: '2024-05-15',
      endDate: '2024-05-15',
      type: 'academic',
    },
  ],

  // Placement Portal
  getInternshipOpenings: () => [
    {
      id: 'INT001',
      title: 'Software Developer Intern',
      company: 'Tech Corp',
      location: 'Bangalore',
      duration: '3 months',
      stipend: '10000/month',
      deadline: new Date('2024-03-01'),
      description: 'Looking for motivated software development interns.',
      requirements: ['Programming knowledge', 'Problem solving skills'],
    },
    {
      id: 'INT002',
      title: 'Web Development Intern',
      company: 'Digital Agency',
      location: 'Remote',
      duration: '2 months',
      stipend: '8000/month',
      deadline: new Date('2024-02-25'),
      description: 'Frontend development internship with modern web technologies.',
      requirements: ['HTML/CSS/JS', 'React knowledge'],
    },
  ],
};

// Mock delay function to simulate API latency
export const mockDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Enhanced mock API with delay
export const mockApi = {
  ...mockApiResponses,
  login: async (email: string, password: string, isFaculty: boolean) => {
    await mockDelay(1000);
    return mockApiResponses.login(email, password, isFaculty);
  },
  getStudentTasks: async (studentId: string, semester?: number) => {
    await mockDelay(500);
    return mockApiResponses.getStudentTasks(studentId, semester);
  },
  getPendingApprovals: async () => {
    await mockDelay(800);
    return mockApiResponses.getPendingApprovals();
  },
  getSystemAnalytics: async () => {
    await mockDelay(600);
    return mockApiResponses.getSystemAnalytics();
  },
  getAcademicCalendar: async () => {
    await mockDelay(700);
    return mockApiResponses.getAcademicCalendar();
  },
  getInternshipOpenings: async () => {
    await mockDelay(900);
    return mockApiResponses.getInternshipOpenings();
  },
};
