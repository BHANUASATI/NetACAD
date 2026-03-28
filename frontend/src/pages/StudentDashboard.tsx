import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { authService, studentService, facultyService, adminService, calendarService, documentService } from '../services/api';
import { Student } from '../types';
import AIAssistantButton from '../components/AIAssistantButton';
import { 
  Bell, 
  Search, 
  Menu, 
  X as CloseIcon, 
  Settings, 
  LogOut, 
  User,
  Trophy,
  Users,
  BookOpen,
  Calendar,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Briefcase,
  Library,
  DollarSign,
  MessageSquare,
  HelpCircle,
  Building,
  UserCheck,
  Home,
  BarChart3,
  FileText,
  CreditCard,
  Plus,
  Filter,
  Clock,
  Flag,
  Play,
  Code,
  Brain,
  Beaker,
  Presentation,
  FileText as DocumentIcon,
  Search as ResearchIcon,
  FolderOpen as ProjectIcon,
  Lock,
  Upload,
  Download,
  Eye,
  Trash2,
  File,
  Folder,
  Paperclip,
  Check,
  AlertTriangle as WarningIcon,
  CalendarDays,
  CalendarCheck,
  CalendarPlus,
  TrendingUp,
  ChevronDown,
  Sun,
  Moon,
  Shield,
  Key
} from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

// Define task types
type TaskPriority = 'high' | 'medium' | 'low' | 'urgent';
type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'locked';
type TaskType = 'document' | 'code' | 'exam' | 'lab' | 'presentation' | 'research' | 'project';

interface Task {
  id: number;
  title: string;
  description: string;
  course: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  type: TaskType;
  submitted: boolean;
  prerequisites?: number[];
  unlocksCategory?: string;
}

interface CategoryProgress {
  type: string;
  unlocked: boolean;
  requiredCompleted: number;
  totalRequired: number;
}

// Document Management Types
type DocumentStatus = 'pending' | 'uploaded' | 'reviewing' | 'approved' | 'rejected';
type DocumentCategory = 'academic' | 'personal' | 'research' | 'project' | 'administrative';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadDate: Date;
  url: string;
  description: string;
  tags: string[];
}

// Calendar Types
type CalendarType = 'academic' | 'personal';
type TodoStatus = 'pending' | 'in-progress' | 'completed';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: CalendarType;
  status: TodoStatus;
  priority: TaskPriority;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  alertDate?: string;
  alertMessage?: string;
  alertEnabled?: boolean;
  alertSent?: boolean;
}

export const StudentDashboard: React.FC = () => {
  const { state, logout } = useApp();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const { currentUser } = state;
  const currentStudent = currentUser as Student;
  
  // Real data state
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [studentDocuments, setStudentDocuments] = useState<any[]>([]);
  const [studentTasks, setStudentTasks] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [documentTypesStatus, setDocumentTypesStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Fetch student profile
        const profileData = await studentService.getProfile() as any;
        setStudentProfile(profileData);
        
        // Fetch student documents
        const documentsData = await studentService.getDocuments() as any[];
        setStudentDocuments(documentsData);
        
        // Fetch document types with status
        const documentStatusData = await studentService.getDocumentsStatus() as any[];
        setDocumentTypesStatus(documentStatusData);
        
        // Transform documents data for display
        const transformedDocuments = documentsData.map((doc: any) => ({
          id: doc.id.toString(),
          name: doc.file_name || doc.document_type?.name || 'Document',
          type: doc.document_type?.name || 'document',
          size: (doc.file_size_mb || 0) * 1024 * 1024, // Convert MB to bytes
          category: 'academic' as DocumentCategory,
          status: doc.verification_status === 'verified' ? 'approved' as DocumentStatus : 
                  doc.verification_status === 'rejected' ? 'rejected' as DocumentStatus : 
                  'pending' as DocumentStatus,
          uploadDate: new Date(doc.uploaded_at || doc.created_at || Date.now()),
          url: doc.file_path ? `/uploads/documents/${doc.student?.enrollment_number}/${doc.file_name}` : '#',
          description: `${doc.document_type?.name || 'Document'} - ${doc.verification_status || 'pending'}`,
          tags: [doc.verification_status || 'pending', doc.document_type?.name?.toLowerCase() || 'document'],
          document_type_id: doc.document_type_id, // Add this for filtering
          verification_status: doc.verification_status // Add this for filtering
        }));
        setUploadedDocuments(transformedDocuments);
        
        // Fetch student tasks
        const tasksData = await studentService.getTasks() as any[];
        setStudentTasks(tasksData);
        
        // Transform tasks data for display
        const transformedTasks = tasksData.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          course: `${task.task_type?.toUpperCase()}${task.department_id ? ` - Dept ${task.department_id}` : ''}`,
          dueDate: task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'No due date',
          priority: (task.priority || 'medium') as TaskPriority,
          status: (task.status === 'published' ? 'pending' : 
                  task.status === 'completed' ? 'completed' : 
                  'pending') as TaskStatus,
          progress: 0,
          type: (task.task_type || 'document') as TaskType,
          submitted: false,
          prerequisites: [],
          unlocksCategory: undefined
        }));
        setTasks(transformedTasks);
        
        // Fetch dashboard stats
        const statsData = await studentService.getDashboardStats() as any;
        setDashboardStats(statsData);
        
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchStudentData();
    }
  }, [currentUser]);

  // Fetch calendar data
  useEffect(() => {
    if (!currentUser) return;

    const fetchCalendarData = async () => {
      try {
        // Fetch all calendar events
        const eventsData = await calendarService.getEvents() as any;
        const transformedEvents = eventsData.events.map((event: any) => ({
          id: event.id.toString(),
          title: event.title,
          description: event.description,
          date: new Date(event.start_date),
          type: event.event_type,
          status: event.status,
          priority: event.priority,
          riskLevel: event.risk_level,
          category: event.category,
          location: event.location,
          startDate: event.start_date,
          endDate: event.end_date,
          alertDate: event.alert_date,
          alertMessage: event.alert_message,
          alertEnabled: event.alert_enabled,
          alertSent: event.alert_sent
        }));
        
        setCalendarEvents(transformedEvents);
        
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      }
    };

    fetchCalendarData();
  }, [currentUser]);

  // Generate Alert Messages
  const generateAlertMessages = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const academicEvents = calendarEvents.filter(event => event.type === 'academic');
    const personalEvents = calendarEvents.filter(event => event.type === 'personal');

    const academicAlerts: string[] = [];
    const personalAlerts: string[] = [];

    // Academic Alerts
    const pendingAcademic = academicEvents.filter(event => 
      event.status === 'pending' || event.status === 'in-progress'
    );

    // Urgent academic tasks (due today or tomorrow)
    const urgentAcademic = pendingAcademic.filter(event => {
      if (!event.startDate) return false;
      const eventDate = new Date(event.startDate);
      return eventDate <= tomorrow;
    });

    // High priority academic tasks
    const highPriorityAcademic = pendingAcademic.filter(event => 
      event.priority === 'high' || event.priority === 'urgent'
    );

    // High risk academic tasks
    const highRiskAcademic = pendingAcademic.filter(event => 
      event.riskLevel === 'high' || event.riskLevel === 'critical'
    );

    if (urgentAcademic.length > 0) {
      academicAlerts.push(`🔴 URGENT: ${urgentAcademic.length} academic task(s) due today or tomorrow!`);
    }

    if (highPriorityAcademic.length > 0) {
      academicAlerts.push(`⚠️ PRIORITY: ${highPriorityAcademic.length} high priority academic task(s) pending`);
    }

    if (highRiskAcademic.length > 0) {
      academicAlerts.push(`⚡ RISK: ${highRiskAcademic.length} high risk academic task(s) require attention`);
    }

    // Upcoming academic tasks this week
    const upcomingAcademic = academicEvents.filter(event => {
      if (!event.startDate) return false;
      const eventDate = new Date(event.startDate);
      return eventDate > tomorrow && eventDate <= nextWeek;
    });

    if (upcomingAcademic.length > 0) {
      academicAlerts.push(`📅 UPCOMING: ${upcomingAcademic.length} academic task(s) due this week`);
    }

    // Personal Alerts
    const pendingPersonal = personalEvents.filter(event => 
      event.status === 'pending' || event.status === 'in-progress'
    );

    // Urgent personal tasks (due today or tomorrow)
    const urgentPersonal = pendingPersonal.filter(event => {
      if (!event.startDate) return false;
      const eventDate = new Date(event.startDate);
      return eventDate <= tomorrow;
    });

    // High priority personal tasks
    const highPriorityPersonal = pendingPersonal.filter(event => 
      event.priority === 'high' || event.priority === 'urgent'
    );

    // High risk personal tasks
    const highRiskPersonal = pendingPersonal.filter(event => 
      event.riskLevel === 'high' || event.riskLevel === 'critical'
    );

    if (urgentPersonal.length > 0) {
      personalAlerts.push(`🔴 URGENT: ${urgentPersonal.length} personal task(s) due today or tomorrow!`);
    }

    if (highPriorityPersonal.length > 0) {
      personalAlerts.push(`⚠️ PRIORITY: ${highPriorityPersonal.length} high priority personal task(s) pending`);
    }

    if (highRiskPersonal.length > 0) {
      personalAlerts.push(`⚡ RISK: ${highRiskPersonal.length} high risk personal task(s) require attention`);
    }

    // Upcoming personal tasks this week
    const upcomingPersonal = personalEvents.filter(event => {
      if (!event.startDate) return false;
      const eventDate = new Date(event.startDate);
      return eventDate > tomorrow && eventDate <= nextWeek;
    });

    if (upcomingPersonal.length > 0) {
      personalAlerts.push(`📅 UPCOMING: ${upcomingPersonal.length} personal task(s) due this week`);
    }

    // Alert enabled tasks
    const alertEnabledAcademic = academicEvents.filter(event => 
      event.alertEnabled && event.alertDate && !event.alertSent
    );

    const alertEnabledPersonal = personalEvents.filter(event => 
      event.alertEnabled && event.alertDate && !event.alertSent
    );

    if (alertEnabledAcademic.length > 0) {
      academicAlerts.push(`🔔 ALERTS: ${alertEnabledAcademic.length} academic task(s) have active alerts`);
    }

    if (alertEnabledPersonal.length > 0) {
      personalAlerts.push(`🔔 ALERTS: ${alertEnabledPersonal.length} personal task(s) have active alerts`);
    }

    setAlertMessages({
      academic: academicAlerts,
      personal: personalAlerts
    });

    return academicAlerts.length > 0 || personalAlerts.length > 0;
  };

  // Document Management Functions
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'tasks' | 'documents' | 'placements' | 'library' | 'fees' | 'messages' | 'help' | 'services' | 'attendance'>('tasks');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('document');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([
    { type: 'document', unlocked: true, requiredCompleted: 0, totalRequired: 9 },
    { type: 'code', unlocked: false, requiredCompleted: 0, totalRequired: 1 },
    { type: 'lab', unlocked: false, requiredCompleted: 0, totalRequired: 2 },
    { type: 'exam', unlocked: false, requiredCompleted: 0, totalRequired: 2 },
    { type: 'presentation', unlocked: false, requiredCompleted: 0, totalRequired: 1 },
    { type: 'research', unlocked: false, requiredCompleted: 0, totalRequired: 1 },
    { type: 'project', unlocked: false, requiredCompleted: 0, totalRequired: 2 }
  ]);

  // Document Management State
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentPreview, setDocumentPreview] = useState<{url: string, name: string} | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  // Real-time document status updates
  useEffect(() => {
    if (!currentUser) return;

    const pollDocumentStatus = async () => {
      try {
        // Fetch both documents and document types status
        const [documentsData, documentStatusData] = await Promise.all([
          studentService.getDocuments() as Promise<any[]>,
          studentService.getDocumentsStatus() as Promise<any[]>
        ]);
        
        // Update document types status
        setDocumentTypesStatus(documentStatusData);
        
        const transformedDocuments = documentsData.map((doc: any) => ({
          id: doc.id.toString(),
          name: doc.file_name || doc.document_type?.name || 'Document',
          type: doc.document_type?.name || 'document',
          size: (doc.file_size_mb || 0) * 1024 * 1024, // Convert MB to bytes
          category: 'academic' as DocumentCategory,
          status: doc.verification_status === 'verified' ? 'approved' as DocumentStatus : 
                  doc.verification_status === 'rejected' ? 'rejected' as DocumentStatus : 
                  'pending' as DocumentStatus,
          uploadDate: new Date(doc.uploaded_at || doc.created_at || Date.now()),
          url: doc.file_path ? `/uploads/documents/${doc.student?.enrollment_number}/${doc.file_name}` : '#',
          description: `${doc.document_type?.name || 'Document'} - ${doc.verification_status || 'pending'}`,
          tags: [doc.verification_status || 'pending', doc.document_type?.name?.toLowerCase() || 'document'],
          document_type_id: doc.document_type_id, // Add this for filtering
          verification_status: doc.verification_status // Add this for filtering
        }));
        
        // Always update the documents list
        setUploadedDocuments(prev => {
          // Check if any document status has changed
          const hasChanges = transformedDocuments.some((newDoc) => {
            const oldDoc = prev.find(d => d.id === newDoc.id);
            return !oldDoc || oldDoc.status !== newDoc.status;
          });
          
          if (hasChanges) {
            // Show notification for status changes
            transformedDocuments.forEach((newDoc) => {
              const oldDoc = prev.find(d => d.id === newDoc.id);
              if (oldDoc && oldDoc.status !== newDoc.status) {
                if (newDoc.status === 'approved') {
                  alert(`🎉 Good news! Your document "${newDoc.name}" has been approved!`);
                } else if (newDoc.status === 'rejected') {
                  alert(`⚠️ Your document "${newDoc.name}" has been rejected. Please upload a new document.`);
                }
              }
            });
          }
          
          return transformedDocuments;
        });
      } catch (error) {
        console.error('Error polling document status:', error);
      }
    };

    // Poll every 30 seconds for document status updates
    const interval = setInterval(pollDocumentStatus, 30000);
    
    return () => clearInterval(interval);
  }, [currentUser]);

  // Handle document type selection changes
  useEffect(() => {
    const handleDocumentTypeChange = () => {
      const documentTypeSelect = document.getElementById('documentType') as HTMLSelectElement;
      const fileUploadArea = document.querySelector('[data-file-upload-area]') as HTMLElement;
      const statusReasonSection = document.getElementById('statusReasonSection') as HTMLElement;
      
      if (documentTypeSelect && fileUploadArea && statusReasonSection) {
        const selectedValue = documentTypeSelect.value;
        
        if (selectedValue === 'not_applicable' || selectedValue === 'not_present') {
          // Show reason section, hide file upload
          statusReasonSection.classList.remove('hidden');
          fileUploadArea.style.display = 'none';
        } else if (selectedValue) {
          // Show file upload, hide reason section
          statusReasonSection.classList.add('hidden');
          fileUploadArea.style.display = 'block';
        } else {
          // Hide both when no selection
          statusReasonSection.classList.add('hidden');
          fileUploadArea.style.display = 'block';
        }
      }
    };

    // Add event listener
    const documentTypeSelect = document.getElementById('documentType');
    if (documentTypeSelect) {
      documentTypeSelect.addEventListener('change', handleDocumentTypeChange);
    }

    // Cleanup
    return () => {
      if (documentTypeSelect) {
        documentTypeSelect.removeEventListener('change', handleDocumentTypeChange);
      }
    };
  }, [showUploadModal]); // Re-run when modal opens/closes

  // Calendar State
  const [showAcademicCalendar, setShowAcademicCalendar] = useState(false);
  const [showPersonalCalendar, setShowPersonalCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  
  // Personal Calendar Todo State
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');
  const [todoPriority, setTodoPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [todoRiskLevel, setTodoRiskLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [todoCategory, setTodoCategory] = useState('Personal');
  const [todoLocation, setTodoLocation] = useState('');
  const [todoAlertEnabled, setTodoAlertEnabled] = useState(false);
  const [todoAlertMessage, setTodoAlertMessage] = useState('');
  const [todoAlertDate, setTodoAlertDate] = useState('');
  const [editingTodo, setEditingTodo] = useState<CalendarEvent | null>(null);

  // Alert System State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessages, setAlertMessages] = useState<{
    academic: string[];
    personal: string[];
  }>({ academic: [], personal: [] });
  const [alertsShown, setAlertsShown] = useState(false);

  // Show alerts on first login
  useEffect(() => {
    if (calendarEvents.length > 0 && !alertsShown && currentUser) {
      const hasAlerts = generateAlertMessages();
      if (hasAlerts) {
        setShowAlertModal(true);
        setAlertsShown(true);
      }
    }
  }, [calendarEvents, alertsShown, currentUser]);

  const handleTaskAction = (taskId: number, action: 'continue' | 'postpone' | 'priority' | 'complete') => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          switch (action) {
            case 'continue':
              return { ...task, progress: Math.min(task.progress + 10, 100) };
            case 'complete':
              return { ...task, status: 'completed', progress: 100, submitted: true };
            case 'postpone':
              const newPriority: 'high' | 'medium' | 'low' | 'urgent' = 
                task.priority === 'urgent' ? 'high' :
                task.priority === 'high' ? 'medium' : 'low';
              return { ...task, priority: newPriority };
            case 'priority':
              const priorities: ('high' | 'medium' | 'low' | 'urgent')[] = ['high', 'medium', 'low', 'urgent'];
              const currentIndex = priorities.indexOf(task.priority);
              const nextIndex = (currentIndex + 1) % priorities.length;
              return { ...task, priority: priorities[nextIndex] };
            default:
              return task;
          }
        }
        return task;
      })
    );

    // Check for unlocks and update category progress
    setTimeout(() => {
      checkUnlocks();
    }, 100);
  };

  const checkUnlocks = () => {
    const updatedTasks = [...tasks];
    const updatedCategoryProgress = [...categoryProgress];

    // Check each category for unlock conditions
    updatedCategoryProgress.forEach((category, index) => {
      if (!category.unlocked && category.type !== 'document') {
        // Find tasks that unlock this category
        const unlockingTasks = updatedTasks.filter(task => task.unlocksCategory === category.type);
        
        if (unlockingTasks.length > 0) {
          // Check if all unlocking tasks are completed
          const allCompleted = unlockingTasks.every(task => task.status === 'completed');
          
          if (allCompleted) {
            updatedCategoryProgress[index].unlocked = true;
            
            // Unlock tasks in this category
            updatedTasks.forEach(task => {
              if (task.type === category.type && task.status === 'locked') {
                // Check if prerequisites are met
                const prerequisitesMet = !task.prerequisites || 
                  task.prerequisites.every(prereqId => 
                    updatedTasks.find(t => t.id === prereqId)?.status === 'completed'
                  );
                
                if (prerequisitesMet) {
                  task.status = 'pending';
                }
              }
            });
          }
        }
      }
    });

    setCategoryProgress(updatedCategoryProgress);
    setTasks(updatedTasks);
  };

  const isCategoryUnlocked = (categoryType: string) => {
    const category = categoryProgress.find(cat => cat.type === categoryType);
    return category ? category.unlocked : false;
  };

  const getCategoryProgress = (categoryType: string) => {
    const category = categoryProgress.find(cat => cat.type === categoryType);
    if (!category) return { completed: 0, total: 0 };
    
    const categoryTasks = tasks.filter(task => task.type === categoryType);
    const completedTasks = categoryTasks.filter(task => task.status === 'completed');
    
    return {
      completed: completedTasks.length,
      total: categoryTasks.length
  };
};

  const deleteDocument = (docId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
    setSelectedDocument(null);
  };

  // Upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      
      // Get the selected document type from dropdown
      const documentTypeSelect = document.getElementById('documentType') as HTMLSelectElement;
      const documentType = documentTypeSelect?.value || '';
      
      // Generate automatic filename
      const automaticFileName = documentType ? generateFileName(file.name, documentType) : file.name;
      
      // Set the automatic file name instead of original
      setSelectedFileName(automaticFileName);
      
      // Create a preview URL for the selected file
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        setDocumentPreview({
          url: url,
          name: automaticFileName  // Show automatic name in preview
        });
        setShowPreviewModal(true);
      }
      
      console.log('File dropped:', file.name, '->', automaticFileName, file.type, file.size);
    }
  };

  const downloadDocument = (doc: any) => {
    // Create a download link for the document
    const link = document.createElement('a');
    link.href = doc.file_path || doc.url;
    link.download = doc.file_name || doc.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Get the selected document type from dropdown
      const documentTypeSelect = document.getElementById('documentType') as HTMLSelectElement;
      const documentType = documentTypeSelect?.value || '';
      
      // Generate automatic filename
      const automaticFileName = documentType ? generateFileName(file.name, documentType) : file.name;
      
      // Set the automatic file name instead of original
      setSelectedFileName(automaticFileName);
      
      // Create a preview URL for the selected file
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        setDocumentPreview({
          url: url,
          name: automaticFileName  // Show automatic name in preview
        });
        setShowPreviewModal(true);
      }
      
      // You can still proceed with the upload logic
      console.log('File selected:', file.name, '->', automaticFileName, file.type, file.size);
    }
  };

  const previewDocument = (doc: any) => {
    // Set document preview and show modal
    setDocumentPreview({
      url: doc.file_path || doc.url,
      name: doc.file_name || doc.name
    });
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setDocumentPreview(null);
  };

  // Reset file selection when modal is closed
  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFileName('');
    // Reset file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      case 'reviewing': return 'text-yellow-500';
      case 'uploaded': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <WarningIcon className="w-4 h-4" />;
      case 'reviewing': return <Clock className="w-4 h-4" />;
      case 'uploaded': return <Upload className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: DocumentCategory) => {
    switch (category) {
      case 'academic': return 'bg-blue-500/20 text-blue-500';
      case 'personal': return 'bg-purple-500/20 text-purple-500';
      case 'research': return 'bg-indigo-500/20 text-indigo-500';
      case 'project': return 'bg-teal-500/20 text-teal-500';
      case 'administrative': return 'bg-orange-500/20 text-orange-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getBorderColor = (status: DocumentStatus) => {
    switch (status) {
      case 'approved': return 'border-green-500/30';
      case 'rejected': return 'border-red-500/30';
      case 'reviewing': return 'border-yellow-500/30';
      case 'uploaded': return 'border-blue-500/30';
      default: return 'border-gray-500/30';
    }
  };

  // Calendar Utility Functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date, type: CalendarType) => {
    return calendarEvents.filter(event => 
      event.type === type &&
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const getEventStatusColor = (status: TodoStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getMonthYearString = (date: Date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getCalendarStats = (type: CalendarType) => {
    const events = calendarEvents.filter(event => event.type === type);
    const completed = events.filter(event => event.status === 'completed').length;
    const pending = events.filter(event => event.status === 'pending').length;
    const inProgress = events.filter(event => event.status === 'in-progress').length;
    
    return { total: events.length, completed, pending, inProgress };
  };

  // Get available document types (excluding already uploaded ones, but including rejected)
  const getAvailableDocumentTypes = () => {
    const allDocuments = [
      // Academic Documents
      { id: '10th_marksheet', name: '10th Marksheet', category: 'Academic Documents', dbId: 2 },
      { id: '12th_marksheet', name: '12th Marksheet', category: 'Academic Documents', dbId: 3 },
      { id: 'transfer_certificate', name: 'Transfer Certificate (TC)', category: 'Academic Documents', dbId: 6 },
      { id: 'migration_certificate', name: 'Migration Certificate', category: 'Academic Documents', dbId: 7 },
      // Identity Documents
      { id: 'birth_certificate', name: 'Birth Certificate', category: 'Identity Documents', dbId: 1 },
      { id: 'aadhaar_card', name: 'Aadhaar Card', category: 'Identity Documents', dbId: 4 },
      { id: 'passport_photos', name: 'Passport-size Photographs', category: 'Identity Documents', dbId: 5 },
      // Residence Documents
      { id: 'domicile_certificate', name: 'Domicile Certificate', category: 'Residence Documents', dbId: 9 },
      // Character & Medical Documents
      { id: 'character_certificate', name: 'Character / Conduct Certificate', category: 'Character & Medical Documents', dbId: 74 },
      { id: 'medical_fitness', name: 'Medical Fitness Certificate', category: 'Character & Medical Documents', dbId: 75 },
      { id: 'anti_ragging_affidavit', name: 'Anti-Ragging Affidavit', category: 'Character & Medical Documents', dbId: 76 },
      // Special Documents
      { id: 'gap_certificate', name: 'Gap Certificate', category: 'Special Documents', dbId: 77 },
      { id: 'income_certificate', name: 'Income Certificate', category: 'Special Documents', dbId: 8 }
    ];

    // Filter out documents that are already uploaded and approved, but keep rejected ones for re-upload
    const availableDocuments = allDocuments.filter(doc => {
      // Find if this document type exists in uploaded documents
      const uploadedDoc = uploadedDocuments.find(uploaded => {
        // Primary matching by document_type_id
        if (doc.dbId && (uploaded as any).document_type_id) {
          return (uploaded as any).document_type_id === doc.dbId;
        }
        
        // Fallback to name matching for documents without dbId
        if ((uploaded as any).document_type?.name) {
          return (uploaded as any).document_type.name.toLowerCase() === doc.name.toLowerCase();
        }
        
        // Final fallback to file name matching
        return uploaded.name && (
          uploaded.name.toLowerCase().includes(doc.name.toLowerCase()) ||
          doc.name.toLowerCase().includes(uploaded.name.toLowerCase())
        );
      });
      
      // Keep document if it's not uploaded OR if it's rejected (for re-upload)
      // Hide documents that are approved, uploaded, reviewing, or pending
      if (!uploadedDoc) {
        return true; // Document not uploaded, show it
      }
      
      // Show rejected documents for re-upload
      if (uploadedDoc.status === 'rejected') {
        return true;
      }
      
      // Hide all other statuses (approved, pending, reviewing, uploaded)
      return false;
    });

    return availableDocuments;
  };

  // Helper function to get database document type ID from frontend document type ID
  const getDocumentTypeId = (frontendDocId: string): number | null => {
    console.log('🔍 Debug - Looking up document type:', frontendDocId);
    
    const allDocs = [
      { id: '10th_marksheet', dbId: 2 },
      { id: '12th_marksheet', dbId: 3 },
      { id: 'transfer_certificate', dbId: 6 },
      { id: 'migration_certificate', dbId: 7 },
      { id: 'birth_certificate', dbId: 1 },
      { id: 'aadhaar_card', dbId: 4 },
      { id: 'passport_photos', dbId: 5 },
      { id: 'domicile_certificate', dbId: 9 },
      { id: 'character_certificate', dbId: 74 },
      { id: 'medical_fitness', dbId: 75 },
      { id: 'anti_ragging_affidavit', dbId: 76 },
      { id: 'gap_certificate', dbId: 77 },
      { id: 'income_certificate', dbId: 8 }
    ];
    
    const doc = allDocs.find(d => d.id === frontendDocId);
    const result = doc ? doc.dbId : null;
    console.log('🔍 Debug - Found doc:', doc, 'Result:', result);
    return result;
  };

  // Helper function to get document type name from frontend document type ID
  const getDocumentTypeName = (frontendDocId: string): string => {
    const allDocs = [
      { id: '10th_marksheet', name: '10th Marksheet' },
      { id: '12th_marksheet', name: '12th Marksheet' },
      { id: 'transfer_certificate', name: 'Transfer Certificate' },
      { id: 'migration_certificate', name: 'Migration Certificate' },
      { id: 'birth_certificate', name: 'Birth Certificate' },
      { id: 'aadhaar_card', name: 'Aadhaar Card' },
      { id: 'passport_photos', name: 'Passport Photos' },
      { id: 'domicile_certificate', name: 'Domicile Certificate' },
      { id: 'character_certificate', name: 'Character Certificate' },
      { id: 'medical_fitness', name: 'Medical Fitness Certificate' },
      { id: 'anti_ragging_affidavit', name: 'Anti-Ragging Affidavit' },
      { id: 'gap_certificate', name: 'Gap Certificate' },
      { id: 'income_certificate', name: 'Income Certificate' }
    ];
    
    const doc = allDocs.find(d => d.id === frontendDocId);
    return doc ? doc.name : '';
  };

  // Helper function to generate automatic file name
  const generateFileName = (originalFileName: string, documentType: string): string => {
    const enrollmentNumber = studentProfile?.enrollment_number || studentProfile?.enrollmentNumber || 'Student';
    const documentTypeName = getDocumentTypeName(documentType);
    const fileExtension = originalFileName.split('.').pop() || '';
    
    // Remove special characters and spaces from enrollment number
    const cleanEnrollmentNumber = enrollmentNumber.replace(/[^a-zA-Z0-9]/g, '_');
    // Remove special characters and spaces from document type
    const cleanDocumentType = documentTypeName.replace(/[^a-zA-Z0-9]/g, '_');
    
    return `${cleanEnrollmentNumber}_${cleanDocumentType}.${fileExtension}`;
  };

  // Personal Calendar Todo Functions
  const openTodoModal = (date: Date, todo?: CalendarEvent) => {
    setSelectedDate(date);
    if (todo) {
      // Edit mode
      setEditingTodo(todo);
      setTodoTitle(todo.title);
      setTodoDescription(todo.description || '');
      setTodoPriority(todo.priority as any);
      setTodoRiskLevel(todo.riskLevel);
      setTodoCategory(todo.category || 'Personal');
      setTodoLocation(todo.location || '');
      setTodoAlertEnabled(todo.alertEnabled || false);
      setTodoAlertMessage(todo.alertMessage || '');
      setTodoAlertDate(todo.alertDate ? new Date(todo.alertDate).toISOString().split('T')[0] : '');
    } else {
      // Create mode
      setEditingTodo(null);
      setTodoTitle('');
      setTodoDescription('');
      setTodoPriority('medium');
      setTodoRiskLevel('low');
      setTodoCategory('Personal');
      setTodoLocation('');
      setTodoAlertEnabled(false);
      setTodoAlertMessage('');
      setTodoAlertDate('');
    }
    setShowTodoModal(true);
  };

  const closeTodoModal = () => {
    setShowTodoModal(false);
    setSelectedDate(null);
    setEditingTodo(null);
    setTodoTitle('');
    setTodoDescription('');
    setTodoPriority('medium');
    setTodoRiskLevel('low');
    setTodoCategory('Personal');
    setTodoLocation('');
    setTodoAlertEnabled(false);
    setTodoAlertMessage('');
    setTodoAlertDate('');
  };

  const saveTodo = async () => {
    if (!todoTitle.trim() || !selectedDate) {
      alert('Please enter a title and select a date');
      return;
    }

    try {
      const todoData = {
        title: todoTitle,
        description: todoDescription,
        event_type: 'personal',
        priority: todoPriority,
        risk_level: todoRiskLevel,
        start_date: selectedDate.toISOString(),
        category: todoCategory,
        location: todoLocation,
        alert_enabled: todoAlertEnabled,
        alert_message: todoAlertMessage,
        alert_date: todoAlertDate ? new Date(todoAlertDate).toISOString() : null
      };

      if (editingTodo) {
        // Update existing todo
        await calendarService.updateEvent(editingTodo.id, todoData);
      } else {
        // Create new todo
        await calendarService.createEvent(todoData);
      }

      // Refresh calendar events
      const eventsData = await calendarService.getEvents() as any;
      const transformedEvents = eventsData.events.map((event: any) => ({
        id: event.id.toString(),
        title: event.title,
        description: event.description,
        date: new Date(event.start_date),
        type: event.event_type,
        status: event.status,
        priority: event.priority,
        riskLevel: event.risk_level,
        category: event.category,
        location: event.location,
        startDate: event.start_date,
        endDate: event.end_date,
        alertDate: event.alert_date,
        alertMessage: event.alert_message,
        alertEnabled: event.alert_enabled,
        alertSent: event.alert_sent
      }));
      
      setCalendarEvents(transformedEvents);
      closeTodoModal();
      alert(editingTodo ? 'Todo updated successfully!' : 'Todo created successfully!');
    } catch (error: any) {
      console.error('Error saving todo:', error);
      alert(`Error: ${error.response?.data?.detail || 'Failed to save todo'}`);
    }
  };

  const deleteTodo = async (todoId: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await calendarService.deleteEvent(todoId);
      
      // Refresh calendar events
      const eventsData = await calendarService.getEvents() as any;
      const transformedEvents = eventsData.events.map((event: any) => ({
        id: event.id.toString(),
        title: event.title,
        description: event.description,
        date: new Date(event.start_date),
        type: event.event_type,
        status: event.status,
        priority: event.priority,
        riskLevel: event.risk_level,
        category: event.category,
        location: event.location,
        startDate: event.start_date,
        endDate: event.end_date,
        alertDate: event.alert_date,
        alertMessage: event.alert_message,
        alertEnabled: event.alert_enabled,
        alertSent: event.alert_sent
      }));
      
      setCalendarEvents(transformedEvents);
      alert('Todo deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      alert(`Error: ${error.response?.data?.detail || 'Failed to delete todo'}`);
    }
  };

  const toggleTodoStatus = async (todoId: string) => {
    try {
      await calendarService.toggleEventStatus(todoId);
      
      // Refresh calendar events
      const eventsData = await calendarService.getEvents() as any;
      const transformedEvents = eventsData.events.map((event: any) => ({
        id: event.id.toString(),
        title: event.title,
        description: event.description,
        date: new Date(event.start_date),
        type: event.event_type,
        status: event.status,
        priority: event.priority,
        riskLevel: event.risk_level,
        category: event.category,
        location: event.location,
        startDate: event.start_date,
        endDate: event.end_date,
        alertDate: event.alert_date,
        alertMessage: event.alert_message,
        alertEnabled: event.alert_enabled,
        alertSent: event.alert_sent
      }));
      
      setCalendarEvents(transformedEvents);
    } catch (error: any) {
      console.error('Error toggling todo status:', error);
      alert(`Error: ${error.response?.data?.detail || 'Failed to update todo status'}`);
    }
  };

  const markTodoComplete = async (todoId: string) => {
    try {
      await calendarService.markEventComplete(todoId);
      
      // Refresh calendar events
      const eventsData = await calendarService.getEvents() as any;
      const transformedEvents = eventsData.events.map((event: any) => ({
        id: event.id.toString(),
        title: event.title,
        description: event.description,
        date: new Date(event.start_date),
        type: event.event_type,
        status: event.status,
        priority: event.priority,
        riskLevel: event.risk_level,
        category: event.category,
        location: event.location,
        startDate: event.start_date,
        endDate: event.end_date,
        alertDate: event.alert_date,
        alertMessage: event.alert_message,
        alertEnabled: event.alert_enabled,
        alertSent: event.alert_sent
      }));
      
      setCalendarEvents(transformedEvents);
    } catch (error: any) {
      console.error('Error marking todo complete:', error);
      alert(`Error: ${error.response?.data?.detail || 'Failed to mark todo complete'}`);
    }
  };

  // Dropdown state management
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleDropdown = (categoryId: string) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  const isCategoryActive = (category: any) => {
    return category.items.some((item: any) => activeView === item.id);
  };

  const handleItemClick = (itemId: string) => {
    setActiveView(itemId as any);
    setOpenDropdown(null);
  };

  const navigationCategories = [
    {
      id: 'academic',
      label: 'Academic',
      icon: BookOpen,
      items: [
        { id: 'tasks', label: t('nav.tasks'), icon: Home },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'library', label: t('nav.library'), icon: Library },
      ]
    },
    {
      id: 'career',
      label: 'Career',
      icon: Briefcase,
      items: [
        { id: 'placements', label: t('nav.placements'), icon: Briefcase },
      ]
    },
    {
      id: 'services',
      label: 'Services',
      icon: Building,
      items: [
        { id: 'fees', label: t('nav.fees'), icon: DollarSign },
        { id: 'attendance', label: t('nav.attendance'), icon: UserCheck },
        { id: 'messages', label: t('nav.messages'), icon: MessageSquare },
        { id: 'services', label: t('nav.services'), icon: Building },
        { id: 'help', label: t('nav.help'), icon: HelpCircle },
      ]
    }
  ];

  const mobileNavigationItems = [
    ...navigationCategories.flatMap(cat => cat.items),
  ];

  // Sample notifications data
  const notifications = [
    { id: 1, title: 'Document Approved', message: 'Your Aadhar Card has been verified', type: 'success', time: '2 min ago' },
    { id: 2, title: 'New Task Assigned', message: 'Complete your profile verification', type: 'info', time: '1 hour ago' },
    { id: 3, title: 'Payment Reminder', message: 'Fee payment due in 3 days', type: 'warning', time: '3 hours ago' },
  ];

  const userMenuItems = [
    { id: 'profile', label: 'Profile', icon: User, action: () => console.log('Profile clicked') },
    { id: 'settings', label: 'Settings', icon: Settings, action: () => console.log('Settings clicked') },
    { id: 'security', label: 'Security', icon: Shield, action: () => console.log('Security clicked') },
    { id: 'change-password', label: 'Change Password', icon: Key, action: () => console.log('Change password clicked') },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'tasks':
        return (
          <div className="space-y-8">
            {/* Tasks Header */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-white/10 backdrop-blur-md'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-white/20'} shadow-xl relative overflow-hidden`}>
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="transform transition-all duration-300 hover:translate-x-2">
                  <h2 className={`text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r ${theme === 'dark' ? 'from-cyan-400 to-blue-400' : 'from-cyan-300 to-blue-300'} bg-clip-text text-transparent`}>
                    Academic Tasks
                  </h2>
                  <p className={`${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-200'} text-lg`}>Manage your assignments, projects, and deadlines</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className={`px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Document
                  </button>
                  <button className={`px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}>
                    <Filter className="w-5 h-5 mr-2" />
                    Filter
                  </button>
                  <button 
                    onClick={() => setShowAcademicCalendar(true)}
                    className={`px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}
                  >
                    <CalendarDays className="w-5 h-5 mr-2" />
                    Academic Calendar
                  </button>
                  <button 
                    onClick={() => setShowPersonalCalendar(true)}
                    className={`px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl hover:from-cyan-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}
                  >
                    <CalendarPlus className="w-5 h-5 mr-2" />
                    Personal Calendar
                  </button>
                </div>
              </div>
            </div>

            {/* Task Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: CheckCircle, value: dashboardStats?.submitted_tasks || '0', label: 'Completed', change: 'This semester', color: 'from-emerald-500 to-teal-600' },
                { icon: Clock, value: dashboardStats?.pending_tasks || '0', label: 'In Progress', change: 'Active now', color: 'from-cyan-500 to-blue-600' },
                { icon: AlertCircle, value: dashboardStats?.pending_tasks || '0', label: 'Pending', change: 'To be done', color: 'from-amber-500 to-orange-600' },
                { icon: Calendar, value: dashboardStats?.total_tasks || '0', label: 'Total Tasks', change: 'This semester', color: 'from-indigo-500 to-purple-600' }
              ].map((stat, index) => (
                <div key={index} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1`} style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Background decoration */}
                  <div className="absolute inset-0 bg-white/10 transform rotate-45 scale-150 group-hover:rotate-12 transition-transform duration-500"></div>
                  
                  <div className="relative z-10">
                    <stat.icon className="w-10 h-10 text-white mb-4 transform transition-transform duration-300 group-hover:scale-110" />
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-white/90 font-medium">{stat.label}</div>
                    <div className="text-white/75 text-sm mt-1">{stat.change}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Verification Status */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-white/10 backdrop-blur-md'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-white/20'} shadow-xl relative overflow-hidden`}>
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-300'} mb-2`}>
                      Document Verification Status
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-200'}`}>
                      Track your document submission and verification progress
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2`}
                  >
                    <Upload className="w-4 h-4" />
                    Upload New
                  </button>
                </div>

                {/* Document Status Overview - Connected to Real Data */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 animate-gradient'} border`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-300'}`}>Total Documents</span>
                      <FileText className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-500' : 'text-cyan-400'}`} />
                    </div>
                    <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-200'}`}>
                      12
                    </div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-cyan-600' : 'text-cyan-500'} mt-1`}>
                      Required to upload
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 animate-gradient'} border`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-300'}`}>Verified</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-200'}`}>
                      {uploadedDocuments.filter(doc => doc.status === 'approved' && doc.type !== 'status').length}
                    </div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-cyan-600' : 'text-cyan-500'} mt-1`}>
                      Verified by faculty
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 animate-gradient'} border`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-300'}`}>Pending</span>
                      <Clock className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-200'}`}>
                      {uploadedDocuments.filter(doc => doc.status === 'pending' && doc.type !== 'status').length}
                    </div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-cyan-600' : 'text-cyan-500'} mt-1`}>
                      Still need to submit
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 animate-gradient'} border`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Rejected</span>
                      <XCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {uploadedDocuments.filter(doc => doc.status === 'rejected').length}
                    </div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                      Need to re-upload
                    </p>
                  </div>
                </div>

                {/* Document Details Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Approved Documents */}
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 animate-gradient'} border`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Approved Documents
                      </h4>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {uploadedDocuments.filter(doc => doc.status === 'approved' && doc.type !== 'status').length} documents
                      </span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uploadedDocuments.filter(doc => doc.status === 'approved' && doc.type !== 'status').length > 0 ? (
                        uploadedDocuments
                          .filter(doc => doc.status === 'approved' && doc.type !== 'status')
                          .map((doc, index) => (
                            <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {doc.name}
                                </span>
                              </div>
                              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                {doc.uploadDate.toLocaleDateString()}
                              </span>
                            </div>
                          ))
                      ) : (
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} italic`}>
                          No approved documents yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rejected Documents */}
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 animate-gradient'} border`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                        <XCircle className="w-4 h-4 text-red-500" />
                        Rejected Documents
                      </h4>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {uploadedDocuments.filter(doc => doc.status === 'rejected').length} documents
                      </span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uploadedDocuments.filter(doc => doc.status === 'rejected').length > 0 ? (
                        uploadedDocuments
                          .filter(doc => doc.status === 'rejected')
                          .map((doc, index) => (
                            <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 border-red-800/30' : 'bg-red-50 border-red-200'} border`}>
                              <div className="flex items-center gap-2">
                                <XCircle className="w-3 h-3 text-red-500" />
                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {doc.name}
                                </span>
                              </div>
                              <button
                                onClick={() => setShowUploadModal(true)}
                                className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-red-800 hover:bg-red-700 text-red-200' : 'bg-red-600 hover:bg-red-700 text-white'} transition-colors`}
                              >
                                Re-upload
                              </button>
                            </div>
                          ))
                      ) : (
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} italic`}>
                          No rejected documents
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Categories */}
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'document', label: 'Documents', icon: DocumentIcon, description: 'Start Here' },
                { id: 'code', label: 'Code', icon: Code, description: 'Unlocks after documents' },
                { id: 'lab', label: 'Labs', icon: Beaker, description: 'Unlocks after code' },
                { id: 'exam', label: 'Exams', icon: Brain, description: 'Unlocks after labs' },
                { id: 'presentation', label: 'Presentations', icon: Presentation, description: 'Unlocks after exams' },
                { id: 'research', label: 'Research', icon: ResearchIcon, description: 'Unlocks after presentations' },
                { id: 'project', label: 'Projects', icon: ProjectIcon, description: 'Unlocks after research' }
              ].map((category) => {
                const unlocked = isCategoryUnlocked(category.id);
                const progress = getCategoryProgress(category.id);
                
                return (
                  <button 
                    key={category.id}
                    onClick={() => unlocked && setSelectedCategory(category.id)}
                    disabled={!unlocked}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 relative ${
                      !unlocked 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300' 
                        : selectedCategory === category.id
                          ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg' 
                        : theme === 'dark' 
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                          : 'bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-700 hover:from-emerald-200 hover:to-cyan-200 border border-emerald-300'
                    }`}
                    title={!unlocked ? category.description : ''}
                  >
                    <div className="relative">
                      <category.icon className="w-4 h-4" />
                      {!unlocked && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                          <Lock className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{category.label}</div>
                      {unlocked && progress.total > 0 && (
                        <div className="text-xs opacity-75">
                          {progress.completed}/{progress.total}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks
                .filter(task => task.type === selectedCategory)
                .map((task, index) => (
                <div className={`group relative overflow-hidden rounded-2xl ${
                  task.status === 'locked' 
                    ? theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-emerald-50 border-emerald-200'
                    : theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-white via-emerald-50 to-cyan-50'
                } border shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]`} style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Background decoration */}
                  <div className="absolute inset-0 opacity-5">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${
                      task.priority === 'high' ? 'from-red-500 to-orange-500' :
                      task.priority === 'medium' ? 'from-yellow-500 to-orange-500' :
                      'from-green-500 to-teal-500'
                    } rounded-full blur-xl`}></div>
                  </div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Task Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            task.type === 'document' ? 'bg-blue-500/20 text-blue-500' :
                            task.type === 'code' ? 'bg-purple-500/20 text-purple-500' :
                            task.type === 'exam' ? 'bg-red-500/20 text-red-500' :
                            task.type === 'lab' ? 'bg-green-500/20 text-green-500' :
                            task.type === 'presentation' ? 'bg-orange-500/20 text-orange-500' :
                            task.type === 'research' ? 'bg-indigo-500/20 text-indigo-500' :
                            'bg-teal-500/20 text-teal-500'
                          } ${task.status === 'locked' ? 'opacity-50' : ''}`}>
                            {
                              task.type === 'document' ? <DocumentIcon className="w-6 h-6" /> :
                              task.type === 'code' ? <Code className="w-6 h-6" /> :
                              task.type === 'exam' ? <Brain className="w-6 h-6" /> :
                              task.type === 'lab' ? <Beaker className="w-6 h-6" /> :
                              task.type === 'presentation' ? <Presentation className="w-6 h-6" /> :
                              task.type === 'research' ? <ResearchIcon className="w-6 h-6" /> :
                              <ProjectIcon className="w-6 h-6" />
                            }
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-1 ${task.status === 'locked' ? 'opacity-50' : ''}`}>
                              {task.title}
                            </h4>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2 ${task.status === 'locked' ? 'opacity-50' : ''}`}>
                              {task.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} ${task.status === 'locked' ? 'opacity-50' : ''}`}>
                                <BookOpen className="w-4 h-4 inline mr-1" />
                                {task.course}
                              </span>
                              <span className={`${
                                task.priority === 'high' ? 'text-red-500' :
                                task.priority === 'medium' ? 'text-yellow-500' :
                                'text-green-500'
                              } ${task.status === 'locked' ? 'opacity-50' : ''}`}>
                                <Flag className="w-4 h-4 inline mr-1" />
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </span>
                              <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} ${task.status === 'locked' ? 'opacity-50' : ''}`}>
                                <Clock className="w-4 h-4 inline mr-1" />
                                {task.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ${task.status === 'locked' ? 'opacity-50' : ''}`}>
                              {task.status === 'locked' ? 'Locked' : 'Progress'}
                            </span>
                            <span className={`font-medium ${
                              task.progress === 100 ? 'text-green-500' :
                              task.progress >= 50 ? 'text-blue-500' :
                              'text-orange-500'
                            } ${task.status === 'locked' ? 'opacity-50' : ''}`}>
                              {task.status === 'locked' ? '🔒' : `${task.progress}%`}
                            </span>
                          </div>
                          <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} ${task.status === 'locked' ? 'opacity-50' : ''}`}>
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                task.progress === 100 ? 'bg-green-500' :
                                task.progress >= 50 ? 'bg-blue-500' :
                                'bg-orange-500'
                              } ${task.status === 'locked' ? 'w-0' : ''}`}
                              style={{ width: task.status === 'locked' ? '0%' : `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                        {task.status === 'locked' ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-500 rounded-xl border border-gray-500/30">
                            <Lock className="w-5 h-5" />
                            <span className="font-medium">Locked</span>
                          </div>
                        ) : task.status === 'completed' ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-500 rounded-xl border border-green-500/30">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Completed</span>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleTaskAction(task.id, 'continue')}
                              className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}
                            >
                              <Play className="w-4 h-4" />
                              Continue
                            </button>
                            <button 
                              onClick={() => handleTaskAction(task.id, 'postpone')}
                              className={`px-4 py-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-xl transition-all duration-300 transform hover:scale-105`}
                            >
                              <Clock className="w-4 h-4" />
                              Postpone
                            </button>
                            <button 
                              onClick={() => handleTaskAction(task.id, 'priority')}
                              className={`px-4 py-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-xl transition-all duration-300 transform hover:scale-105`}
                            >
                              <Flag className="w-4 h-4" />
                              Priority
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Calendar Modal */}
            {showAcademicCalendar && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 lg:p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Academic Calendar</h3>
                    <button 
                      onClick={() => setShowAcademicCalendar(false)}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                    >
                      <CloseIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Calendar Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="text-2xl font-bold text-purple-500">{getCalendarStats('academic').total}</div>
                      <div className="text-sm text-gray-500">Total Events</div>
                    </div>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="text-2xl font-bold text-green-500">{getCalendarStats('academic').completed}</div>
                      <div className="text-sm text-gray-500">Completed</div>
                    </div>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="text-2xl font-bold text-blue-500">{getCalendarStats('academic').inProgress}</div>
                      <div className="text-sm text-gray-500">In Progress</div>
                    </div>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="text-2xl font-bold text-yellow-500">{getCalendarStats('academic').pending}</div>
                      <div className="text-sm text-gray-500">Pending</div>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
                    {/* Month Navigation */}
                    <div className="flex justify-between items-center mb-4">
                      <button 
                        onClick={() => navigateMonth('prev')}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
                      >
                        <CalendarDays className="w-5 h-5" />
                      </button>
                      <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {getMonthYearString(currentMonth)}
                      </h4>
                      <button 
                        onClick={() => navigateMonth('next')}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
                      >
                        <CalendarDays className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className={`text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} py-2`}>
                          {day}
                        </div>
                      ))}
                      
                      {/* Empty cells for days before month starts */}
                      {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
                        <div key={`empty-${index}`} className="p-2"></div>
                      ))}
                      
                      {/* Days of the month */}
                      {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
                        const day = index + 1;
                        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        const events = getEventsForDate(currentDate, 'academic');
                        const isToday = new Date().toDateString() === currentDate.toDateString();
                        
                        return (
                          <div 
                            key={day} 
                            className={`p-2 border rounded-lg min-h-[80px] ${
                              isToday 
                                ? 'border-purple-500 bg-purple-500/10' 
                                : theme === 'dark' 
                                  ? 'border-gray-700 bg-gray-800/50' 
                                  : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className={`text-sm font-medium ${isToday ? 'text-purple-500' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {day}
                            </div>
                            <div className="space-y-1 mt-1">
                              {events.slice(0, 2).map(event => (
                                <div 
                                  key={event.id}
                                  className={`text-xs p-1 rounded ${getEventStatusColor(event.status)} truncate`}
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {events.length > 2 && (
                                <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                  +{events.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Calendar Modal */}
            {showPersonalCalendar && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 lg:p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Personal Calendar</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        Manage your personal todos and events
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openTodoModal(new Date())}
                        className={`px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2`}
                      >
                        <Plus className="w-4 h-4" />
                        Add Todo
                      </button>
                      <button 
                        onClick={() => setShowPersonalCalendar(false)}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                      >
                        <CloseIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="text-2xl font-bold text-indigo-500">{getCalendarStats('personal').total}</div>
                      <div className="text-sm text-gray-500">Total Events</div>
                    </div>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="text-2xl font-bold text-green-500">{getCalendarStats('personal').completed}</div>
                      <div className="text-sm text-gray-500">Completed</div>
                    </div>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="text-2xl font-bold text-blue-500">{getCalendarStats('personal').inProgress}</div>
                      <div className="text-sm text-gray-500">In Progress</div>
                    </div>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="text-2xl font-bold text-yellow-500">{getCalendarStats('personal').pending}</div>
                      <div className="text-sm text-gray-500">Pending</div>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
                    {/* Month Navigation */}
                    <div className="flex justify-between items-center mb-4">
                      <button 
                        onClick={() => navigateMonth('prev')}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
                      >
                        <CalendarPlus className="w-5 h-5" />
                      </button>
                      <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {getMonthYearString(currentMonth)}
                      </h4>
                      <button 
                        onClick={() => navigateMonth('next')}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
                      >
                        <CalendarPlus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className={`text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} py-2`}>
                          {day}
                        </div>
                      ))}
                      
                      {/* Empty cells for days before month starts */}
                      {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
                        <div key={`empty-${index}`} className="p-2"></div>
                      ))}
                      
                      {/* Days of the month */}
                      {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
                        const day = index + 1;
                        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        const events = getEventsForDate(currentDate, 'personal');
                        const isToday = new Date().toDateString() === currentDate.toDateString();
                        
                        return (
                          <div 
                            key={day} 
                            className={`p-2 border rounded-lg min-h-[80px] cursor-pointer transition-colors ${
                              isToday 
                                ? 'border-indigo-500 bg-indigo-500/10' 
                                : theme === 'dark' 
                                  ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800' 
                                  : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                            onClick={() => openTodoModal(currentDate)}
                          >
                            <div className={`text-sm font-medium ${isToday ? 'text-indigo-500' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {day}
                            </div>
                            <div className="space-y-1 mt-1">
                              {events.slice(0, 2).map(event => (
                                <div 
                                  key={event.id}
                                  className={`text-xs p-1 rounded ${getEventStatusColor(event.status)} truncate cursor-pointer hover:opacity-80`}
                                  title={event.title}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openTodoModal(currentDate, event);
                                  }}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {events.length > 2 && (
                                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} italic`}>
                                  +{events.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Todo Modal */}
            {showTodoModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
                  {/* Modal Header */}
                  <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                          {editingTodo ? 'Edit Todo' : 'Add New Todo'}
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          {selectedDate ? `Date: ${selectedDate.toLocaleDateString()}` : 'Select a date'}
                        </p>
                      </div>
                      <button
                        onClick={closeTodoModal}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                      >
                        <CloseIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                      <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Title *
                      </label>
                      <input
                        type="text"
                        value={todoTitle}
                        onChange={(e) => setTodoTitle(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Enter todo title"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Description
                      </label>
                      <textarea
                        value={todoDescription}
                        onChange={(e) => setTodoDescription(e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Add description (optional)"
                      />
                    </div>

                    {/* Priority and Risk Level */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Priority
                        </label>
                        <select
                          value={todoPriority}
                          onChange={(e) => setTodoPriority(e.target.value as any)}
                          className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Risk Level
                        </label>
                        <select
                          value={todoRiskLevel}
                          onChange={(e) => setTodoRiskLevel(e.target.value as any)}
                          className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    {/* Category and Location */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Category
                        </label>
                        <input
                          type="text"
                          value={todoCategory}
                          onChange={(e) => setTodoCategory(e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                          placeholder="Personal, Work, Health, etc."
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Location
                        </label>
                        <input
                          type="text"
                          value={todoLocation}
                          onChange={(e) => setTodoLocation(e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                          placeholder="Where? (optional)"
                        />
                      </div>
                    </div>

                    {/* Alert Settings */}
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="alertEnabled"
                          checked={todoAlertEnabled}
                          onChange={(e) => setTodoAlertEnabled(e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="alertEnabled" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Enable Alert
                        </label>
                      </div>
                      {todoAlertEnabled && (
                        <div className="space-y-3">
                          <div>
                            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                              Alert Date
                            </label>
                            <input
                              type="date"
                              value={todoAlertDate}
                              onChange={(e) => setTodoAlertDate(e.target.value)}
                              className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                              Alert Message
                            </label>
                            <input
                              type="text"
                              value={todoAlertMessage}
                              onChange={(e) => setTodoAlertMessage(e.target.value)}
                              className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                              placeholder="Alert message (optional)"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Todo Actions (if editing) */}
                    {editingTodo && (
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                          Todo Actions
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => toggleTodoStatus(editingTodo.id)}
                            className={`px-3 py-1 rounded text-sm ${
                              editingTodo.status === 'pending'
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-yellow-600 text-white hover:bg-yellow-700'
                            } transition-colors`}
                          >
                            {editingTodo.status === 'pending' ? 'Start' : 'Pause'}
                          </button>
                          <button
                            onClick={() => markTodoComplete(editingTodo.id)}
                            className="px-3 py-1 rounded text-sm bg-green-600 text-white hover:bg-green-700 transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => deleteTodo(editingTodo.id)}
                            className="px-3 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={closeTodoModal}
                        className={`px-6 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveTodo}
                        className={`px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105`}
                      >
                        {editingTodo ? 'Update Todo' : 'Create Todo'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Alert Modal */}
            {showAlertModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto`}>
                  {/* Modal Header */}
                  <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                          <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                            Pending Work Alerts
                          </h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                            Important tasks that need your attention
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAlertModal(false)}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                      >
                        <CloseIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-6">
                    {/* Academic Alerts */}
                    {alertMessages.academic.length > 0 && (
                      <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-purple-900/50 border-purple-700' : 'bg-purple-50 border-purple-200'} border`}>
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-5 h-5 text-purple-600" />
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-900'}`}>
                            Academic Calendar
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {alertMessages.academic.map((alert, index) => (
                            <div
                              key={`academic-${index}`}
                              className={`flex items-center gap-2 p-2 rounded-lg ${theme === 'dark' ? 'bg-purple-800/30' : 'bg-purple-100/50'}`}
                            >
                              <span className="text-sm">{alert}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            setShowAlertModal(false);
                            setShowAcademicCalendar(true);
                          }}
                          className={`mt-3 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium`}
                        >
                          View Academic Calendar
                        </button>
                      </div>
                    )}

                    {/* Personal Alerts */}
                    {alertMessages.personal.length > 0 && (
                      <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-indigo-900/50 border-indigo-700' : 'bg-indigo-50 border-indigo-200'} border`}>
                        <div className="flex items-center gap-2 mb-3">
                          <User className="w-5 h-5 text-indigo-600" />
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'}`}>
                            Personal Calendar
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {alertMessages.personal.map((alert, index) => (
                            <div
                              key={`personal-${index}`}
                              className={`flex items-center gap-2 p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-800/30' : 'bg-indigo-100/50'}`}
                            >
                              <span className="text-sm">{alert}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            setShowAlertModal(false);
                            setShowPersonalCalendar(true);
                          }}
                          className={`mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium`}
                        >
                          View Personal Calendar
                        </button>
                      </div>
                    )}

                    {/* Summary */}
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          Summary
                        </h4>
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>You have <span className="font-medium text-orange-600">{alertMessages.academic.length + alertMessages.personal.length}</span> pending items requiring attention.</p>
                        <p className="mt-1">Stay organized and complete your tasks on time for better academic performance!</p>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3">
                        {alertMessages.academic.length > 0 && (
                          <button
                            onClick={() => {
                              setShowAlertModal(false);
                              setShowAcademicCalendar(true);
                            }}
                            className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-purple-800 hover:bg-purple-700' : 'bg-purple-100 hover:bg-purple-200'} ${theme === 'dark' ? 'text-purple-300' : 'text-purple-900'} transition-colors`}
                          >
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            Academic
                          </button>
                        )}
                        {alertMessages.personal.length > 0 && (
                          <button
                            onClick={() => {
                              setShowAlertModal(false);
                              setShowPersonalCalendar(true);
                            }}
                            className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-800 hover:bg-indigo-700' : 'bg-indigo-100 hover:bg-indigo-200'} ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} transition-colors`}
                          >
                            <User className="w-4 h-4 inline mr-2" />
                            Personal
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => setShowAlertModal(false)}
                        className={`px-6 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-8">
            {/* Documents Header */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl relative overflow-hidden`}>
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500 to-teal-500 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="transform transition-all duration-300 hover:translate-x-2">
                  <h2 className={`text-3xl lg:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-3 bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-300' : 'from-black to-gray-700'} bg-clip-text text-transparent`}>
                    Document Management
                  </h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg`}>Upload and manage your academic documents</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className={`px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Document
                  </button>
                </div>
              </div>
            </div>

            {/* Document Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl relative overflow-hidden`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Documents</span>
                  <FileText className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  9
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                  Total required documents to submit
                </p>
              </div>
              
              <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl relative overflow-hidden`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Verified</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {documentTypesStatus.filter(doc => doc.verification_status === 'verified').length}
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                  Verified by faculty
                </p>
              </div>
              
              <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl relative overflow-hidden`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Pending</span>
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {documentTypesStatus.filter(doc => doc.upload_status === 'not_uploaded' || doc.verification_status === 'pending' || doc.verification_status === 'rejected').length}
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                  Pending or rejected
                </p>
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl relative overflow-hidden`}>
              <div className="relative z-10">
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-6`}>
                  Required Documents Checklist
                </h3>
                
                <div className="space-y-4">
                  {documentTypesStatus.map((doc, index) => {
                    const status = doc.upload_status === 'not_uploaded' ? 'missing' : 
                                  doc.verification_status === 'verified' ? 'approved' :
                                  doc.verification_status === 'rejected' ? 'rejected' : 'pending';
                    
                    return (
                      <div key={doc.document_type_id} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border transition-all duration-300 hover:shadow-lg`} style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              status === 'approved' ? 'bg-green-100 text-green-600' :
                              status === 'rejected' ? 'bg-red-100 text-red-600' :
                              status === 'pending' ? 'bg-orange-100 text-orange-600' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {status === 'approved' ? <CheckCircle className="w-5 h-5" /> :
                               status === 'rejected' ? <XCircle className="w-5 h-5" /> :
                               status === 'pending' ? <Clock className="w-5 h-5" /> :
                               <File className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                  {doc.name}
                                </h4>
                                {doc.is_required && (
                                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                                    Required
                                  </span>
                                )}
                                {!doc.is_required && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                                    Optional
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 mt-1">
                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {doc.description || 'Document'}
                                </span>
                                {doc.uploaded_at && (
                                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {doc.rejection_reason && (
                                <p className={`text-sm text-red-500 mt-2`}>
                                  Rejection reason: {doc.rejection_reason}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                status === 'approved' ? 'bg-green-100 text-green-800' :
                                status === 'rejected' ? 'bg-red-100 text-red-800' :
                                status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {status === 'approved' ? 'Approved' :
                                 status === 'rejected' ? 'Rejected' : 
                                 status === 'pending' ? 'Pending Verification' : 'Missing'}
                              </span>
                              {status === 'pending' && (
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                                  Under review
                                </p>
                              )}
                            </div>
                            
                            {doc.file_path && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => previewDocument({
                                    url: doc.file_path,
                                    name: doc.file_name || doc.name
                                  })}
                                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                                  title="Preview"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => downloadDocument({
                                    url: doc.file_path,
                                    name: doc.file_name || doc.name
                                  })}
                                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            
                            {doc.upload_status === 'not_uploaded' && (
                              <button
                                onClick={() => {
                                  // Pre-select the document type in the upload modal
                                  setTimeout(() => {
                                    const selectElement = document.getElementById('documentType') as HTMLSelectElement;
                                    if (selectElement) {
                                      selectElement.value = doc.document_type_id.toString();
                                      // Trigger change event to show/hide appropriate sections
                                      const event = new Event('change', { bubbles: true });
                                      selectElement.dispatchEvent(event);
                                    }
                                  }, 100);
                                  setShowUploadModal(true);
                                }}
                                className={`px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm`}
                              >
                                Upload
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      case 'placements':
        return (
          <div className="space-y-8">
            {/* Placements Header */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} rounded-2xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl relative overflow-hidden`}>
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-green-500 to-teal-500 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="transform transition-all duration-300 hover:translate-x-2">
                  <h2 className={`text-3xl lg:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-3 bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-300' : 'from-black to-gray-700'} bg-clip-text text-transparent`}>
                    {t('placements.title')}
                  </h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg`}>Discover career opportunities and apply to your dream companies</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}>
                    <Search className="w-5 h-5 mr-2" />
                    Search Jobs
                  </button>
                  <button className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}>
                    <FileText className="w-5 h-5 mr-2" />
                    My Applications
                  </button>
                </div>
              </div>
            </div>

            {/* Placement Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Briefcase, value: '127', label: 'Active Jobs', change: '+12 this week', color: 'from-blue-500 to-blue-600' },
                { icon: Trophy, value: '₹12.5L', label: 'Highest Package', change: 'Google', color: 'from-green-500 to-green-600' },
                { icon: Users, value: '847', label: 'Students Placed', change: 'This year', color: 'from-purple-500 to-purple-600' },
                { icon: BarChart3, value: '92%', label: 'Placement Rate', change: 'Above average', color: 'from-orange-500 to-orange-600' }
              ].map((stat, index) => (
                <div key={index} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1`} style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Background decoration */}
                  <div className="absolute inset-0 bg-white/10 transform rotate-45 scale-150 group-hover:rotate-12 transition-transform duration-500"></div>
                  
                  <div className="relative z-10">
                    <stat.icon className="w-10 h-10 text-white mb-4 transform transition-transform duration-300 group-hover:scale-110" />
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-white/90 font-medium">{stat.label}</div>
                    <div className="text-white/75 text-sm mt-1">{stat.change}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Jobs */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-300' : 'from-black to-gray-700'} bg-clip-text text-transparent`}>Featured Opportunities</h3>
                <button className={`px-4 py-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-all duration-300 transform hover:scale-105`}>
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    company: 'Google',
                    location: 'Bangalore, India',
                    title: 'Senior Software Engineer',
                    salary: '₹25-35 LPA',
                    type: 'Full-time',
                    posted: '2 days ago',
                    deadline: '5 days',
                    tags: ['React', 'TypeScript', 'Node.js'],
                    badges: ['Urgent', 'New'],
                    color: 'from-blue-500 to-blue-600'
                  },
                  {
                    company: 'Microsoft',
                    location: 'Hyderabad, India',
                    title: 'Product Manager',
                    salary: '₹18-25 LPA',
                    type: 'Full-time',
                    posted: '1 week ago',
                    deadline: '12 days',
                    tags: ['Product Strategy', 'Analytics', 'Leadership'],
                    badges: ['Popular'],
                    color: 'from-green-500 to-green-600'
                  },
                  {
                    company: 'Amazon',
                    location: 'Pune, India',
                    title: 'Data Scientist',
                    salary: '₹15-20 LPA',
                    type: 'Full-time',
                    posted: '3 days ago',
                    deadline: '8 days',
                    tags: ['Python', 'ML', 'AWS'],
                    badges: ['Hot'],
                    color: 'from-purple-500 to-purple-600'
                  }
                ].map((job, index) => (
                  <div key={index} className={`group relative overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`} style={{ animationDelay: `${index * 100}ms` }}>
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-5">
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${job.color} rounded-full blur-xl`}></div>
                    </div>
                    
                    <div className="relative z-10 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${job.color} flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          <Briefcase className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.badges.map((badge, badgeIndex) => (
                            <span key={badgeIndex} className={`px-2 py-1 text-xs font-medium rounded-full ${
                              badge === 'Urgent' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                              badge === 'New' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' :
                              badge === 'Popular' ? 'bg-purple-500/20 text-purple-500 border border-purple-500/30' :
                              'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                            }`}>
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} group-hover:text-blue-500 transition-colors`}>
                          {job.title}
                        </h4>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                          {job.company} • {job.location}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className={`px-2 py-1 text-xs rounded-lg ${theme === 'dark' ? 'bg-gray-700/50 text-gray-300 border border-gray-600/30' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}">
                          <div>
                            <div className={`text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{job.salary}</div>
                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{job.type}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Posted {job.posted}</div>
                            <div className={`text-xs ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} font-medium`}>Deadline in {job.deadline}</div>
                          </div>
                        </div>
                        
                        <button className={`w-full px-4 py-3 bg-gradient-to-r ${job.color} text-white rounded-xl hover:shadow-lg transform transition-all duration-300 hover:scale-105 font-medium`}>
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'library':
        return (
          <div className="space-y-6">
            {/* Library Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-100 dark:text-white mb-2">{t('library.title')}</h2>
                <p className="text-gray-300 dark:text-gray-300">Access thousands of books, journals, and research papers</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-4 py-2 bg-blue-500 text-gray-100 rounded-lg hover:bg-blue-600 transition-colors">
                  <Search className="w-4 h-4 inline mr-2" />
                  Search Catalog
                </button>
                <button className="px-4 py-2 bg-purple-500 text-gray-100 rounded-lg hover:bg-purple-600 transition-colors">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  My Books
                </button>
              </div>
            </div>

            {/* Library Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-gray-100">
                <BookOpen className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">45,832</div>
                <div className="text-sm opacity-90">Total Books</div>
                <div className="text-xs opacity-75 mt-1">+1,200 this month</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-gray-100">
                <FileText className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">12,456</div>
                <div className="text-sm opacity-90">Research Papers</div>
                <div className="text-xs opacity-75 mt-1">Open access</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-gray-100">
                <Calendar className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm opacity-90">Digital Access</div>
                <div className="text-xs opacity-75 mt-1">Online platform</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-gray-100">
                <Users className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">8,234</div>
                <div className="text-sm opacity-90">Active Users</div>
                <div className="text-xs opacity-75 mt-1">This month</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-emerald-800/80 backdrop-blur-md'} rounded-xl shadow-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-emerald-600'} relative`}>
              <h3 className="text-xl font-semibold text-gray-100 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-105 group">
                  <Search className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-gray-100 dark:text-white">Search Catalog</div>
                  <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">Find resources</div>
                </button>
                <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 hover:scale-105 group">
                  <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-gray-100 dark:text-white">My Borrowed</div>
                  <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">3 books active</div>
                </button>
                <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 hover:scale-105 group">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-gray-100 dark:text-white">Reserve Room</div>
                  <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">Study spaces</div>
                </button>
                <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-300 hover:scale-105 group">
                  <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-gray-100 dark:text-white">E-Resources</div>
                  <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">Digital library</div>
                </button>
              </div>
            </div>

            {/* Recently Added Books */}
            <div>
              <h3 className="text-xl font-semibold text-gray-100 dark:text-white mb-4">Recently Added Books</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`${theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-emerald-800/80 backdrop-blur-md'} rounded-xl shadow-lg p-4 border ${theme === 'dark' ? 'border-slate-700' : 'border-emerald-600'} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-100" />
                  </div>
                  <h4 className="font-semibold text-gray-100 dark:text-white text-sm mb-1">Introduction to Algorithms</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-400 mb-2">Thomas H. Cormen</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">Available</span>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Borrow</button>
                  </div>
                </div>
                <div className={`${theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-emerald-800/80 backdrop-blur-md'} rounded-xl shadow-lg p-4 border ${theme === 'dark' ? 'border-slate-700' : 'border-emerald-600'} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="w-full h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-100" />
                  </div>
                  <h4 className="font-semibold text-gray-100 dark:text-white text-sm mb-1">Machine Learning</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-400 mb-2">Andrew Ng</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded">2 copies</span>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Reserve</button>
                  </div>
                </div>
                <div className={`${theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-emerald-800/80 backdrop-blur-md'} rounded-xl shadow-lg p-4 border ${theme === 'dark' ? 'border-slate-700' : 'border-emerald-600'} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="w-full h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-100" />
                  </div>
                  <h4 className="font-semibold text-gray-100 dark:text-white text-sm mb-1">Clean Code</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-400 mb-2">Robert C. Martin</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">Available</span>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Borrow</button>
                  </div>
                </div>
                <div className={`${theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-emerald-800/80 backdrop-blur-md'} rounded-xl shadow-lg p-4 border ${theme === 'dark' ? 'border-slate-700' : 'border-emerald-600'} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="w-full h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-100" />
                  </div>
                  <h4 className="font-semibold text-gray-100 dark:text-white text-sm mb-1">Design Patterns</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-400 mb-2">Gang of Four</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded">Borrowed</span>
                    <button className="text-xs text-purple-600 dark:text-purple-400 hover:underline">Waitlist</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'fees':
        return (
          <div className="space-y-6">
            {/* Fees Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">{t('fees.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300">Manage your fee payments and view transaction history</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Pay Now
                </button>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Download Receipt
                </button>
              </div>
            </div>

            {/* Fee Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-gray-100">
                <DollarSign className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">₹51,000</div>
                <div className="text-sm opacity-90">Current Semester</div>
                <div className="text-xs opacity-75 mt-1">Due in 5 days</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-gray-100">
                <CheckCircle className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">₹97,000</div>
                <div className="text-sm opacity-90">Total Paid</div>
                <div className="text-xs opacity-75 mt-1">This year</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-gray-100">
                <AlertTriangle className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">₹51,000</div>
                <div className="text-sm opacity-90">Pending</div>
                <div className="text-xs opacity-75 mt-1">1 payment</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-gray-100">
                <Calendar className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">Dec 15</div>
                <div className="text-sm opacity-90">Next Deadline</div>
                <div className="text-xs opacity-75 mt-1">5 days left</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Semester Fees */}
              <div className={`${theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-emerald-800/80 backdrop-blur-md'} rounded-xl shadow-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-emerald-600'} relative`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-100 dark:text-white mb-6">Current Semester Fees</h3>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium">Due Soon</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Tuition Fee</div>
                      <div className="font-medium text-gray-900 dark:text-white">Tuition Fee</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Main course fees</div>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-white">₹45,000</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Library Fee</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Digital & physical resources</div>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-white">₹2,000</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Laboratory Fee</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">CS Lab equipment</div>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-white">₹3,000</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Examination Fee</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Semester exams</div>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-white">₹1,000</span>
                  </div>
                  <div className="pt-3">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-100 dark:text-white">Total Amount</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₹51,000</span>
                    </div>
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Due Date</span>
                      <span className="text-orange-600 dark:text-orange-400 font-medium">December 15, 2024</span>
                    </div>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-gray-100 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-medium">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className={`${theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-emerald-800/80 backdrop-blur-md'} rounded-xl shadow-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-emerald-600'} relative`}>
                <h3 className="text-xl font-semibold text-gray-100 dark:text-white mb-6">Payment History</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-100 dark:text-white">Semester 5 Fees</div>
                        <div className="text-sm text-gray-400 dark:text-gray-400">Paid on July 15, 2024</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 dark:text-green-400 font-semibold">₹49,000</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Success</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Transaction ID: TXN20240715001</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Semester 4 Fees</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Paid on January 20, 2024</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 dark:text-green-400 font-semibold">₹48,000</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Success</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Transaction ID: TXN20240120001</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Semester 3 Fees</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Paid on July 18, 2023</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 dark:text-green-400 font-semibold">₹47,000</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Success</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Transaction ID: TXN20230718001</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 border border-emerald-600 dark:border-gray-600 text-gray-300 dark:text-gray-300 rounded-lg hover:bg-emerald-700 dark:hover:bg-gray-700 transition-colors">
                  View All Transactions
                </button>
              </div>
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div className="space-y-6">
            {/* Attendance Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">{t('attendance.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300">Monitor your attendance and view detailed reports</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  View Calendar
                </button>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Download Report
                </button>
              </div>
            </div>

            {/* Attendance Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-gray-100">
                <UserCheck className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">85.7%</div>
                <div className="text-sm opacity-90">Overall Attendance</div>
                <div className="text-xs opacity-75 mt-1">Above threshold</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-gray-100">
                <Calendar className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">102</div>
                <div className="text-sm opacity-90">Classes Attended</div>
                <div className="text-xs opacity-75 mt-1">This semester</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-gray-100">
                <AlertCircle className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">17</div>
                <div className="text-sm opacity-90">Classes Missed</div>
                <div className="text-xs opacity-75 mt-1">3 with leave</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-gray-100">
                <BarChart3 className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">Good</div>
                <div className="text-sm opacity-90">Status</div>
                <div className="text-xs opacity-75 mt-1">Keep it up!</div>
              </div>
            </div>

            {/* Monthly Attendance Chart */}
            <div className={`${theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-emerald-800/80 backdrop-blur-md'} rounded-xl shadow-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-emerald-600'} relative`}>
              <h3 className="text-xl font-semibold text-gray-100 dark:text-white mb-6">Monthly Attendance</h3>
              <div className="space-y-4">
                {[
                  { month: 'January', attended: 22, total: 24, percentage: 91.7 },
                  { month: 'February', attended: 20, total: 22, percentage: 90.9 },
                  { month: 'March', attended: 18, total: 20, percentage: 90.0 },
                  { month: 'April', attended: 19, total: 21, percentage: 90.5 },
                  { month: 'May', attended: 21, total: 23, percentage: 91.3 },
                  { month: 'June', attended: 2, total: 2, percentage: 100.0 },
                ].map((month, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-800 dark:text-white">{month.month}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                        <div 
                          className={`h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500 ${
                            month.percentage >= 90 ? 'bg-green-500 text-white' : 
                            month.percentage >= 75 ? 'bg-blue-500 text-white' : 
                            'bg-orange-500 text-white'
                          }`}
                          style={{ width: `${month.percentage}%` }}
                        >
                          {month.percentage >= 20 && `${month.percentage}%`}
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {month.attended}/{month.total}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Attendance */}
            <div className={`${theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-emerald-800/80 backdrop-blur-md'} rounded-xl shadow-lg p-6 border ${theme === 'dark' ? 'border-slate-700' : 'border-emerald-600'} relative`}>
              <h3 className="text-xl font-semibold text-gray-100 dark:text-white mb-6">Recent Attendance</h3>
              <div className="space-y-3">
                {[
                  { date: 'Dec 10, 2024', course: 'Data Structures', status: 'present', time: '9:00 AM' },
                  { date: 'Dec 9, 2024', course: 'Algorithm Design', status: 'present', time: '10:30 AM' },
                  { date: 'Dec 8, 2024', course: 'Database Systems', status: 'absent', time: '2:00 PM' },
                  { date: 'Dec 7, 2024', course: 'Web Development', status: 'present', time: '11:00 AM' },
                  { date: 'Dec 6, 2024', course: 'Machine Learning', status: 'late', time: '9:15 AM' },
                ].map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-emerald-600 dark:border-gray-600 hover:bg-emerald-700 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        record.status === 'present' ? 'bg-green-500' :
                        record.status === 'late' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-100 dark:text-white">{record.course}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{record.date} • {record.time}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      record.status === 'present' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      record.status === 'late' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-100 dark:text-white">{t('messages.title')}</h2>
            <div className="bg-emerald-800/80 dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 dark:text-white mb-2">Coming Soon</h3>
              <p className="text-gray-300 dark:text-gray-300">Messaging system will be available soon</p>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-100 dark:text-white">{t('services.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-emerald-800/80 dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <Building className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-100 dark:text-white">Cafeteria</h3>
                <p className="text-gray-300 dark:text-gray-300 text-sm">Daily meals and snacks available</p>
              </div>
              <div className="bg-emerald-800/80 dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <Users className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-100 dark:text-white">Sports Complex</h3>
                <p className="text-gray-300 dark:text-gray-300 text-sm">Indoor and outdoor sports facilities</p>
              </div>
              <div className="bg-emerald-800/80 dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <HelpCircle className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-100 dark:text-white">Health Center</h3>
                <p className="text-gray-300 dark:text-gray-300 text-sm">Medical facilities and emergency care</p>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-100 dark:text-white">{t('help.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-800/80 dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-100 dark:text-white">Contact Support</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-300 dark:text-gray-300">support@university.edu.in</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-300 dark:text-gray-300">1800-123-4567</span>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-800/80 dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-100 dark:text-white">Quick Links</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-300 dark:text-gray-300">
                    User Guide
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-300 dark:text-gray-300">
                    FAQs
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-300 dark:text-gray-300">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Home className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-2`}>Coming Soon</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} flex`}>
      {/* Top Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-40 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500'} border-r border-gray-800 border-b transition-all duration-300 shadow-2xl`}>
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          {/* Mobile Menu Toggle & Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors"
            >
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-cyan-400">AcadDNA</span>
            </div>
          </div>

          {/* Right Side - Theme, Notifications, User */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800 transition-colors">
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                {theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-blue-300" />
                ) : (
                  <Sun className="w-3 h-3 text-yellow-500" />
                )}
              </div>
              <span className="text-xs font-medium text-cyan-300">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
              <ThemeToggle />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-lg hover:bg-gray-800 text-cyan-300 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                    <span className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border-gray-700 border rounded-xl shadow-2xl">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-cyan-400 flex items-center">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                      </h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <CloseIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div 
                            key={notification.id} 
                            className="p-3 rounded-lg border bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-200 cursor-pointer" 
                          >
                            <div className="flex items-start">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
                                notification.type === 'success' ? 'bg-green-900/30' :
                                notification.type === 'warning' ? 'bg-yellow-900/30' :
                                notification.type === 'error' ? 'bg-red-900/30' :
                                'bg-blue-900/30'
                              }`}>
                                {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                                {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                                {notification.type === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                                {notification.type === 'info' && <AlertCircle className="w-4 h-4 text-blue-400" />}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-cyan-300">{notification.title}</div>
                                <div className="text-xs text-gray-400 mt-1">{notification.message}</div>
                                <div className="text-xs text-gray-500 mt-2">{notification.time}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                          <p className="text-sm text-gray-500">No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-cyan-400">
                    {studentProfile?.first_name && studentProfile?.last_name 
                      ? `${studentProfile.first_name} ${studentProfile.last_name}`
                      : studentProfile?.name || currentStudent?.name || 'Padmini Asati'
                    }
                  </div>
                  <div className="text-xs text-green-500 flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                    Online
                  </div>
                </div>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border-gray-700 border rounded-xl shadow-2xl">
                  <div className="p-2">
                    {userMenuItems.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-700">
                          <item.icon className="w-4 h-4 text-gray-300" />
                        </div>
                        <span className="text-sm text-cyan-300">{item.label}</span>
                      </button>
                    ))}
                    
                    {/* Logout */}
                    <button
                      onClick={() => {
                        setShowLogoutConfirm(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg bg-red-900/20 hover:bg-red-900/30 transition-colors border border-red-800/30 hover:border-red-700/50 mt-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-900/30 flex items-center justify-center">
                        <LogOut className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-sm text-red-400">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Side Navigation Bar */}
      <nav className={`hidden lg:flex flex-col w-72 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} fixed left-0 top-16 h-full z-50 transform transition-all duration-500 ease-in-out shadow-lg ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Navigation Items */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto pt-6">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">Main Menu</h3>
            {navigationCategories.map((category, index) => (
              <div key={category.id} className="mb-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleDropdown(category.id)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:translate-x-2 relative overflow-hidden group ${
                    isCategoryActive(category)
                      ? theme === 'dark' 
                        ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg border-l-4 border-white'
                        : 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg border-l-4 border-white'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white hover:shadow-md'
                        : 'text-cyan-700 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 hover:text-white hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background animation */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${isCategoryActive(category) ? 'from-gray-700 to-gray-600' : 'from-gray-800 to-gray-700'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  {/* Icon container */}
                  <div className={`relative z-10 w-10 h-10 rounded-lg flex items-center justify-center transform transition-all duration-300 ${
                    isCategoryActive(category)
                      ? theme === 'dark' 
                        ? 'bg-white/20 shadow-lg' 
                        : 'bg-white/30 shadow-lg'
                      : theme === 'dark'
                        ? 'bg-gray-800 group-hover:bg-white/10 group-hover:shadow-lg'
                        : 'bg-emerald-100 group-hover:bg-white/20 group-hover:shadow-lg'
                  }`}>
                    <category.icon className={`w-5 h-5 transform transition-all duration-300 ${
                      isCategoryActive(category) ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                  </div>
                  
                  {/* Text content */}
                  <div className="flex-1 text-left relative z-10">
                    <span className="font-medium">{category.label}</span>
                    {isCategoryActive(category) && (
                      <div className="text-xs text-gray-300 mt-1">Active category</div>
                    )}
                  </div>
                  
                  {/* Dropdown arrow */}
                  <div className={`relative z-10 transform transition-all duration-300 ${
                    openDropdown === category.id ? 'rotate-180' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                
                {/* Dropdown Items */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  openDropdown === category.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="mt-1 ml-4 space-y-1">
                    {category.items.map((item, itemIndex) => (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 relative overflow-hidden group ${
                          activeView === item.id
                            ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md border-l-2 border-white'
                            : 'text-gray-500 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white'
                        }`}
                        style={{ animationDelay: `${itemIndex * 50}ms` }}
                      >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transform transition-all duration-200 ${
                          activeView === item.id
                            ? 'bg-white/20 shadow-md' 
                            : 'bg-gray-700/50 group-hover:bg-white/10'
                        }`}>
                          <item.icon className={`w-4 h-4 transform transition-all duration-200 ${
                            activeView === item.id ? 'scale-110' : 'group-hover:scale-110'
                          }`} />
                        </div>
                        
                        {/* Text */}
                        <div className="flex-1 text-left">
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        
                        {/* Active indicator */}
                        {activeView === item.id && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Minimal */}
        <div className="p-4 border-t border-gray-800 bg-gradient-to-t from-gray-900 to-black">
          {/* Quick Stats or Additional Info Can Go Here */}
          <div className="text-center">
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              © 2024 AcadDNA Student Portal
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 max-w-sm mx-4 transform transition-all duration-300 scale-95 animate-in">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Confirm Logout</h3>
                <p className="text-gray-400 text-sm mb-6">Are you sure you want to sign out of your account?</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => logout()}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 bg-gradient-to-br from-gray-900 to-black rounded-xl text-white hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-700"
        >
          {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Side Navigation */}
      <nav className={`lg:hidden fixed left-0 top-0 h-full w-72 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 animate-gradient'} border-r border-gray-800 z-40 transform transition-all duration-500 ease-in-out shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">AcadDNA</span>
              <div className="text-xs text-gray-400 mt-1">Student Portal</div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">Main Menu</h3>
          {mobileNavigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as any);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg border-l-4 border-white'
                  : 'text-gray-400 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-gray-800 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <span className="font-medium">{item.label}</span>
              </div>
              {activeView === item.id && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => logout()}
            className="w-full flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-red-900/30 to-red-800/20 hover:from-red-900/40 hover:to-red-800/30 transition-all duration-300 border border-red-800/30"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-sm font-medium text-red-400">Logout</span>
          </button>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 lg:ml-72 transition-all duration-500 ${mobileMenuOpen ? 'lg:ml-72' : 'lg:ml-72'} p-4 lg:p-8 pt-40 lg:pt-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        {/* Student Profile Card */}
        <div className="mb-8">
          <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-r from-purple-500 to-purple-600'} rounded-2xl shadow-xl p-6 lg:p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-purple-200'} relative overflow-hidden group`}>
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                {/* Avatar Section */}
                <div className="xl:col-span-3 flex flex-col items-center xl:items-start">
                  <div className="relative group">
                    <div className={`w-28 h-28 lg:w-36 lg:h-36 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-white'} rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3`}>
                      <User className={`w-14 h-14 lg:w-18 lg:h-18 ${theme === 'dark' ? 'text-white' : 'text-purple-600'} transform transition-transform duration-300 group-hover:scale-110`} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full border-4 ${theme === 'dark' ? 'border-gray-900' : 'border-white'} flex items-center justify-center shadow-lg animate-pulse">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    {/* Floating particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-0 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-ping animation-delay-1000"></div>
                      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-indigo-300 rounded-full animate-ping animation-delay-2000"></div>
                    </div>
                  </div>
                  <div className="mt-6 text-center xl:text-left">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gradient-to-r from-green-900/50 to-green-800/50 text-green-400 border border-green-700/50' : 'bg-white text-purple-700 border border-purple-300'} shadow-lg transform transition-all duration-300 hover:scale-105`}>
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Active Student
                    </div>
                  </div>
                </div>
                
                {/* Student Info Section */}
                <div className="xl:col-span-6">
                  <div className="space-y-4">
                    <div className="transform transition-all duration-300 hover:translate-x-2">
                      {loading ? (
                        <div className="space-y-2">
                          <div className={`h-8 w-64 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
                          <div className={`h-6 w-48 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
                        </div>
                      ) : (
                        <>
                          <h1 className={`text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r ${theme === 'dark' ? 'from-cyan-400 to-blue-400' : 'from-cyan-300 to-blue-300'} bg-clip-text text-transparent`}>
                            {studentProfile?.first_name && studentProfile?.last_name 
                              ? `${studentProfile.first_name} ${studentProfile.last_name}`
                              : studentProfile?.name || currentStudent?.name || 'Loading...'
                            }
                          </h1>
                          <p className={`${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-200'} text-lg`}>
                            {studentProfile?.email || currentStudent?.email || 'Loading...'}
                          </p>
                        </>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: BookOpen, label: 'Course', value: studentProfile?.department?.name || studentProfile?.department?.name || 'Loading...' },
                        { icon: Calendar, label: 'Semester', value: studentProfile?.semester ? `Semester ${studentProfile.semester}` : 'Loading...' },
                        { icon: Users, label: 'Batch', value: studentProfile?.batch || 'Loading...' },
                        { icon: FileText, label: 'ID', value: studentProfile?.enrollment_number || studentProfile?.student_id || 'Loading...' }
                      ].map((item, index) => (
                        <div key={index} className={`flex items-center space-x-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white border-purple-200'} border transform transition-all duration-300 hover:scale-105 hover:shadow-lg`} style={{ animationDelay: `${index * 100}ms` }}>
                          <div className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-100'} flex items-center justify-center`}>
                            <item.icon className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-purple-600'}`} />
                          </div>
                          <div>
                            <div className={`text-xs ${theme === 'dark' ? 'text-cyan-500' : 'text-purple-500'}`}>{item.label}</div>
                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-cyan-300' : 'text-gray-800'}`}>{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['Honor Roll', "Dean's List", 'Sports Club', 'Tech Lead', 'Volunteer'].map((badge, index) => (
                        <span key={index} className={`px-3 py-1 ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 text-emerald-300 border border-emerald-700/50' : 'bg-white text-purple-600 border border-purple-300'} rounded-full text-xs font-medium transform transition-all duration-300 hover:scale-110 hover:shadow-lg`} style={{ animationDelay: `${index * 100}ms` }}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats Section */}
                <div className="xl:col-span-3">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { 
                        icon: Trophy, 
                        value: dashboardStats?.gpa?.toFixed(1) || '0.0', 
                        label: 'GPA', 
                        status: dashboardStats?.gpa >= 3.5 ? 'Excellent' : dashboardStats?.gpa >= 3.0 ? 'Good' : 'Needs Improvement', 
                        color: dashboardStats?.gpa >= 3.5 ? 'from-yellow-400 to-orange-400' : dashboardStats?.gpa >= 3.0 ? 'from-green-400 to-emerald-400' : 'from-red-400 to-pink-400'
                      },
                      { 
                        icon: UserCheck, 
                        value: `${Math.round(dashboardStats?.attendance_percentage || 0)}%`, 
                        label: 'Attendance', 
                        status: dashboardStats?.attendance_percentage >= 75 ? 'Good' : 'Low', 
                        color: dashboardStats?.attendance_percentage >= 75 ? 'from-green-400 to-emerald-400' : 'from-red-400 to-orange-400'
                      },
                      { 
                        icon: BookOpen, 
                        value: dashboardStats?.submitted_tasks || '0', 
                        label: 'Tasks', 
                        status: `${dashboardStats?.submitted_tasks || 0} completed`, 
                        color: 'from-blue-400 to-indigo-400'
                      },
                      { 
                        icon: FileText, 
                        value: dashboardStats?.total_documents || '0', 
                        label: 'Documents', 
                        status: dashboardStats?.documents_verified ? 'Verified' : 'Pending', 
                        color: dashboardStats?.documents_verified ? 'from-green-400 to-emerald-400' : 'from-yellow-400 to-orange-400'
                      }
                    ].map((stat, index) => (
                      <div key={index} className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group`} style={{ animationDelay: `${index * 100}ms` }}>
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-white/10 transform rotate-45 scale-150 group-hover:rotate-12 transition-transform duration-500"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-center mb-3">
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-xl lg:text-2xl font-bold text-white">{stat.value}</div>
                          <div className="text-xs text-white/80">{stat.label}</div>
                          <div className="text-xs text-white font-medium mt-1">{stat.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
              
    {/* Dynamic Content */}
    {renderContent()}
  </main>

  {/* Upload Document Modal */}
  {showUploadModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100`}>
        {/* Modal Header */}
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Upload Document
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Submit your academic documents for verification
              </p>
            </div>
            <button
              onClick={closeUploadModal}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Document Type Selection */}
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Document Type
            </label>
            <select
              id="documentType"
              className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              defaultValue=""
            >
              <option value="" disabled>Select document type</option>
              
              {documentTypesStatus.filter(doc => doc.upload_status === 'not_uploaded' || doc.verification_status === 'rejected').length > 0 ? (
                <>
                  {documentTypesStatus
                    .filter(doc => doc.upload_status === 'not_uploaded' || doc.verification_status === 'rejected')
                    .map(doc => (
                      <option key={doc.document_type_id} value={doc.document_type_id}>
                        {doc.name} {doc.is_required ? '(Required)' : '(Optional)'}
                      </option>
                    ))}
                </>
              ) : (
                <option value="" disabled>All documents have been uploaded</option>
              )}
              
              {/* Status Options */}
              <optgroup label="Document Status" className="font-semibold">
                <option value="not_applicable">Not Applicable</option>
                <option value="not_present">Not Present</option>
              </optgroup>
            </select>
            {documentTypesStatus.filter(doc => doc.upload_status === 'not_uploaded' || doc.verification_status === 'rejected').length === 0 && (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                All required documents have been submitted. You can still mark documents as "Not Applicable" or "Not Present" if needed.
              </p>
            )}
          </div>

          {/* Document Status Reason (for Not Applicable/Not Present) */}
          <div id="statusReasonSection" className="hidden">
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Reason for Status
            </label>
            <textarea
              id="statusReason"
              rows={2}
              className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Please explain why this document is not applicable or not present..."
            />
          </div>

          {/* File Upload Area */}
          <div data-file-upload-area>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Select File
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : theme === 'dark'
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="fileInput"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              
              <div className="space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                  <Upload className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                
                <div>
                  {selectedFileName ? (
                    <>
                      <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        Selected: {selectedFileName}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        Click or drag to change file
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        Drag and drop your file here
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        or click to browse
                      </p>
                    </>
                  )}
                </div>
                
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  <p>Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
                  <p>Maximum file size: 5MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Description (Optional)
            </label>
            <textarea
              id="documentDescription"
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Add any additional information about this document..."
            />
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Uploading...
                </span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeUploadModal}
              className={`px-6 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                const documentType = (document.getElementById('documentType') as HTMLSelectElement).value;
                const description = (document.getElementById('documentDescription') as HTMLTextAreaElement).value;
                const statusReason = (document.getElementById('statusReason') as HTMLTextAreaElement).value;
                
                if (!documentType) {
                  alert('Please select a document type');
                  return;
                }
                
                // Handle special status options
                if (documentType === 'not_applicable' || documentType === 'not_present') {
                  if (!statusReason.trim()) {
                    alert('Please provide a reason for the document status');
                    return;
                  }
                  
                  // Create a status record without file upload
                  const statusDocument = {
                    id: Date.now().toString(),
                    name: documentType === 'not_applicable' ? 'Document Not Applicable' : 'Document Not Present',
                    type: 'status',
                    size: 0,
                    category: 'administrative' as DocumentCategory,
                    status: 'approved' as DocumentStatus,
                    uploadDate: new Date(),
                    url: '#',
                    description: statusReason,
                    tags: [documentType.replace('_', ' '), 'status']
                  };
                  
                  setUploadedDocuments(prev => [...prev, statusDocument]);
                  alert(`Document status recorded: ${documentType.replace('_', ' ').toUpperCase()}`);
                  setShowUploadModal(false);
                  return;
                }
                
                if (!fileInput.files || fileInput.files.length === 0) {
                  alert('Please select a file to upload');
                  return;
                }
                
                // Trigger file upload with selected document type
                const file = fileInput.files[0];
                const uploadSingleFile = async (file: File) => {
                  setUploadProgress(10);
                  
                  try {
                    // Get the database document type ID
                    console.log('🔍 Debug - Selected documentType:', documentType);
                    
                    // The dropdown now uses numeric document_type_id directly
                    // No need to map from string ID to numeric ID
                    let documentTypeId: number | null = null;
                    
                    if (documentType === 'not_applicable' || documentType === 'not_present') {
                      // Handle status options separately
                      documentTypeId = null;
                    } else {
                      // Convert string to number if it's a numeric document type ID
                      const numericId = parseInt(documentType);
                      documentTypeId = isNaN(numericId) ? null : numericId;
                    }
                    
                    console.log('🔍 Debug - Mapped documentTypeId:', documentTypeId);
                    
                    if (!documentTypeId) {
                      if (documentType === 'not_applicable' || documentType === 'not_present') {
                        // These are handled separately below
                      } else {
                        console.error('❌ Debug - Document type not found for:', documentType);
                        alert('This document type is not available for upload. Please select a different document type.');
                        setUploadProgress(0);
                        return;
                      }
                    }
                    
                    // Only proceed with upload if documentTypeId is valid
                    if (documentTypeId === null) {
                      console.error('❌ Debug - documentTypeId is null, cannot upload');
                      alert('Invalid document type selected. Please select a valid document type.');
                      setUploadProgress(0);
                      return;
                    }
                    
                    const formData = new FormData();
                    
                    // Generate automatic file name
                    let documentTypeName = '';
                    
                    // Get document type name from the dropdown selection
                    const documentTypeSelect = document.getElementById('documentType') as HTMLSelectElement;
                    const selectedOption = documentTypeSelect.options[documentTypeSelect.selectedIndex];
                    documentTypeName = selectedOption.text.replace(' (Required)', '').replace(' (Optional)', '');
                    
                    const automaticFileName = generateFileName(file.name, documentTypeName);
                    
                    // Use the original file but with automatic name
                    formData.append('file', file);
                    formData.append('file_name', automaticFileName);
                    
                    // Use the correct API endpoint with document_type_id as query parameter
                    const response = await documentService.uploadDocument(formData, documentTypeId.toString());
                    setUploadProgress(100);
                    
                    // Show success message
                    alert('Document uploaded successfully! It will be reviewed by the administration.');
                    
                    // Refresh documents list
                    const documentsData = await studentService.getDocuments() as any[];
                    const transformedDocuments = documentsData.map((doc: any) => ({
                      id: doc.id.toString(),
                      name: doc.file_name || doc.document_type?.name || 'Document',
                      type: doc.document_type?.name || 'document',
                      size: doc.file_size_mb * 1024 * 1024 || 0,
                      category: 'academic' as DocumentCategory,
                      status: doc.verification_status || 'pending',
                      uploadDate: new Date(doc.uploaded_at || doc.created_at),
                      description: `${doc.document_type?.name || 'Document'} - ${doc.verification_status || 'pending'}`,
                      tags: [doc.verification_status || 'pending', doc.document_type?.name?.toLowerCase() || 'document'],
                      url: doc.file_path ? `/uploads/documents/${doc.student?.enrollment_number}/${doc.file_name}` : '',
                      document_type_id: doc.document_type_id, // Add this for filtering
                      verification_status: doc.verification_status // Add this for filtering
                    }));
                    setUploadedDocuments(transformedDocuments);
                    
                    // Close modal and reset form
                    closeUploadModal();
                    
                  } catch (error: any) {
                    console.error('Upload error:', error);
                    setUploadProgress(0);
                    
                    // Show specific error message
                    let errorMessage = 'Upload failed. Please try again.';
                    if (error.response?.data?.detail) {
                      errorMessage = error.response.data.detail;
                    } else if (error.message) {
                      errorMessage = error.message;
                    }
                    
                    alert(`Upload failed: ${errorMessage}`);
                  }
                };
                
                uploadSingleFile(file);
              }}
              className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2`}
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeUploadModal}
              className={`px-6 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Document Preview Modal */}
  {showPreviewModal && documentPreview && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100`}>
        {/* Modal Header */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <div>
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Document Preview
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {documentPreview.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadDocument({ id: 'preview', name: documentPreview.name, url: documentPreview.url, type: '', size: 0, category: 'academic', status: 'approved', uploadDate: new Date(), description: '', tags: [] })}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={closePreviewModal}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              title="Close"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Document Preview */}
        <div className="p-4">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg overflow-hidden`} style={{ height: '70vh' }}>
            {documentPreview.url.endsWith('.pdf') ? (
              <iframe
                src={documentPreview.url}
                className="w-full h-full"
                title={documentPreview.name}
              />
            ) : documentPreview.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={documentPreview.url}
                alt={documentPreview.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Preview not available for this file type
                  </p>
                  <button
                    onClick={() => downloadDocument({ id: 'preview', name: documentPreview.name, url: documentPreview.url, type: '', size: 0, category: 'academic', status: 'approved', uploadDate: new Date(), description: '', tags: [] })}
                    className={`mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}
                  >
                    Download File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )}
  
  {/* AI Assistant Button */}
  <AIAssistantButton />
</div>
  );
};

export default StudentDashboard;
