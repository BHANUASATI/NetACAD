export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  currentSemester: number;
  totalSemesters: number;
  enrollmentNo?: string;
  batch?: string;
  advisor?: string;
  gpa?: number;
  attendance?: number;
  phone?: string;
  address?: string;
  bloodGroup?: string;
  emergencyContact?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  semester: number;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'overdue';
  category: 'academic' | 'administrative' | 'financial' | 'extracurricular';
  dependencies?: string[];
  alerts?: Alert[];
}

export interface Alert {
  id: string;
  type: 'reminder' | 'deadline' | 'dependency';
  message: string;
  triggerDate: Date;
  isActive: boolean;
}

export interface Semester {
  number: number;
  tasks: Task[];
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export interface AcademicProgram {
  name: string;
  totalSemesters: number;
  semesterTasks: {
    [semester: number]: TaskTemplate[];
  };
}

export interface TaskTemplate {
  title: string;
  description: string;
  category: Task['category'];
  priority: Task['priority'];
  weekOffset: number;
  dependencies?: string[];
}

export interface FacultyUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'faculty';
  permissions: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  permissions: string[];
}
