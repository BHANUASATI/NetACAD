from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums for Pydantic models
class UserRole(str, Enum):
    STUDENT = "student"
    FACULTY = "faculty"
    ADMIN = "admin"

class VerificationStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"

class TaskType(str, Enum):
    ASSIGNMENT = "assignment"
    PROJECT = "project"
    EXAM = "exam"
    QUIZ = "quiz"

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CLOSED = "closed"

class SubmissionStatus(str, Enum):
    PENDING = "pending"
    SUBMITTED = "submitted"
    LATE = "late"
    GRADED = "graded"

class NotificationType(str, Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"

# User Models
class UserBase(BaseModel):
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool
    email_verified: bool
    last_login: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# Department Models
class DepartmentBase(BaseModel):
    name: str
    code: str
    description: Optional[str]

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Student Models
class StudentBase(BaseModel):
    enrollment_number: str
    first_name: str
    last_name: str
    phone: Optional[str]
    date_of_birth: Optional[datetime]
    gender: Optional[str]
    blood_group: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    pincode: Optional[str]
    department_id: int
    semester: int = 1
    batch: Optional[str]
    admission_year: Optional[int]

class StudentCreate(StudentBase):
    password: str

class StudentUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    pincode: Optional[str]

class StudentResponse(StudentBase):
    id: int
    user_id: int
    gpa: float
    attendance_percentage: float
    documents_verified: bool
    verification_status: VerificationStatus
    verified_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    department: Optional[DepartmentResponse]
    
    class Config:
        from_attributes = True

# Faculty Models
class FacultyBase(BaseModel):
    employee_id: str
    first_name: str
    last_name: str
    phone: Optional[str]
    email: Optional[str]
    specialization: Optional[str]
    designation: Optional[str]
    department_id: int

class FacultyCreate(FacultyBase):
    password: str

class FacultyUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    specialization: Optional[str]
    designation: Optional[str]

class FacultyResponse(FacultyBase):
    id: int
    user_id: int
    is_active: bool
    can_verify_documents: bool
    can_assign_tasks: bool
    created_at: datetime
    updated_at: datetime
    department: Optional[DepartmentResponse]
    
    class Config:
        from_attributes = True

# Admin Models
class AdminBase(BaseModel):
    first_name: str
    last_name: str
    department_id: int

class AdminCreate(AdminBase):
    password: str

class AdminResponse(AdminBase):
    id: int
    user_id: int
    permissions: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Document Models
class DocumentTypeBase(BaseModel):
    name: str
    description: Optional[str]
    is_required: bool = True
    max_file_size_mb: int = 5
    allowed_extensions: Optional[str]

class DocumentTypeCreate(DocumentTypeBase):
    pass

class DocumentTypeResponse(DocumentTypeBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class StudentDocumentBase(BaseModel):
    document_type_id: int
    verification_notes: Optional[str]

class StudentDocumentResponse(StudentDocumentBase):
    id: int
    student_id: int
    file_name: str
    file_path: str
    file_size_mb: Optional[float]
    file_extension: Optional[str]
    verification_status: VerificationStatus
    verified_by: Optional[int]
    uploaded_at: datetime
    updated_at: datetime
    document_type: Optional[DocumentTypeResponse]
    
    class Config:
        from_attributes = True

# Task Models
class TaskBase(BaseModel):
    title: str
    description: Optional[str]
    assigned_to: Optional[int]
    department_id: Optional[int]
    task_type: TaskType
    priority: TaskPriority
    due_date: Optional[datetime]
    max_marks: Optional[int]

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    priority: Optional[TaskPriority]
    due_date: Optional[datetime]
    max_marks: Optional[int]
    status: Optional[TaskStatus]

class TaskResponse(TaskBase):
    id: int
    assigned_by: Optional[int]
    status: TaskStatus
    created_at: datetime
    updated_at: datetime
    assigned_by_faculty: Optional[FacultyResponse]
    assigned_to_student: Optional[StudentResponse]
    department: Optional[DepartmentResponse]
    
    class Config:
        from_attributes = True

# Task Submission Models
class TaskSubmissionBase(BaseModel):
    submission_text: Optional[str]

class TaskSubmissionCreate(TaskSubmissionBase):
    pass

class TaskSubmissionUpdate(BaseModel):
    marks_obtained: Optional[int]
    feedback: Optional[str]
    submission_status: Optional[SubmissionStatus]

class TaskSubmissionResponse(TaskSubmissionBase):
    id: int
    task_id: int
    student_id: int
    file_path: Optional[str]
    submission_status: SubmissionStatus
    marks_obtained: Optional[int]
    feedback: Optional[str]
    graded_by: Optional[int]
    graded_at: Optional[datetime]
    submitted_at: datetime
    updated_at: datetime
    task: Optional[TaskResponse]
    student: Optional[StudentResponse]
    
    class Config:
        from_attributes = True

# Notification Models
class NotificationBase(BaseModel):
    title: str
    message: str
    notification_type: NotificationType = NotificationType.INFO
    action_url: Optional[str]

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard Stats
class DashboardStats(BaseModel):
    total_students: int
    verified_students: int
    pending_documents: int
    total_tasks: int
    total_faculty: int
