import { AcademicProgram, Task } from '../types';

export const ACADEMIC_PROGRAMS: AcademicProgram[] = [
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
        },
        {
          title: 'Moodle Setup',
          description: 'Complete LMS profile setup and orientation',
          category: 'academic',
          priority: 'high',
          weekOffset: 1
        },
        {
          title: 'First Internal Exam',
          description: 'Prepare and appear for first internal examination',
          category: 'academic',
          priority: 'high',
          weekOffset: 4
        }
      ],
      2: [
        {
          title: 'Library Registration',
          description: 'Complete library membership process',
          category: 'academic',
          priority: 'medium',
          weekOffset: 0
        },
        {
          title: 'Mid-term Examination',
          description: 'Prepare for mid-term examinations',
          category: 'academic',
          priority: 'high',
          weekOffset: 6
        }
      ],
      4: [
        {
          title: 'Minor Project Topic Submission',
          description: 'Submit minor project proposal for approval',
          category: 'academic',
          priority: 'high',
          weekOffset: 8,
          dependencies: ['fee_payment']
        }
      ]
    }
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
          weekOffset: 0
        },
        {
          title: 'Programming Foundation Test',
          description: 'Complete programming skills assessment',
          category: 'academic',
          priority: 'medium',
          weekOffset: 2
        }
      ],
      2: [
        {
          title: 'Minor Project Registration',
          description: 'Register for minor project and select guide',
          category: 'academic',
          priority: 'high',
          weekOffset: 0
        },
        {
          title: 'Minor Project Topic Submission',
          description: 'Submit detailed project proposal',
          category: 'academic',
          priority: 'high',
          weekOffset: 4
        }
      ]
    }
  }
];

export const generateTasksForSemester = (
  program: AcademicProgram,
  semesterNumber: number,
  startDate: Date
): Task[] => {
  const templates = program.semesterTasks[semesterNumber] || [];
  
  return templates.map((template, index) => ({
    id: `${program.name}-${semesterNumber}-${index}`,
    title: template.title,
    description: template.description,
    semester: semesterNumber,
    dueDate: new Date(
      startDate.getTime() + template.weekOffset * 7 * 24 * 60 * 60 * 1000
    ),
    priority: template.priority,
    status: 'pending',
    category: template.category,
    dependencies: template.dependencies,
    alerts: [
      {
        id: `alert-${index}`,
        type: 'reminder',
        message: `Reminder: ${template.title} due soon`,
        triggerDate: new Date(
          startDate.getTime() + (template.weekOffset - 1) * 7 * 24 * 60 * 60 * 1000
        ),
        isActive: true
      }
    ]
  }));
};

export const checkTaskDependencies = (task: Task, allTasks: Task[]): boolean => {
  if (!task.dependencies || task.dependencies.length === 0) {
    return true;
  }
  
  return task.dependencies.every(depId => {
    const dependencyTask = allTasks.find(t => t.id === depId);
    return dependencyTask?.status === 'completed';
  });
};
