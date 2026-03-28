from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, Enum, ForeignKey, DECIMAL, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import enum

Base = declarative_base()

# Enums
class UserRole(str, enum.Enum):
    STUDENT = "student"
    FACULTY = "faculty"
    ADMIN = "admin"

class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"

class TaskType(str, enum.Enum):
    ASSIGNMENT = "assignment"
    PROJECT = "project"
    EXAM = "exam"
    QUIZ = "quiz"

class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CLOSED = "closed"

class SubmissionStatus(str, enum.Enum):
    PENDING = "pending"
    SUBMITTED = "submitted"
    LATE = "late"
    GRADED = "graded"

class NotificationType(str, enum.Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"

# Models
class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(10), unique=True, nullable=False)
    description = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    last_login = Column(DateTime)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    permissions = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", backref="admin")

class Faculty(Base):
    __tablename__ = "faculties"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    employee_id = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    email = Column(String(255))
    specialization = Column(String(100))
    designation = Column(String(100))
    department_id = Column(Integer, ForeignKey("departments.id"))
    is_active = Column(Boolean, default=True)
    can_verify_documents = Column(Boolean, default=True)
    can_assign_tasks = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", backref="faculty")
    department = relationship("Department")

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    enrollment_number = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    date_of_birth = Column(DateTime)
    gender = Column(Enum('male', 'female', 'other'))
    blood_group = Column(String(5))
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(10))
    department_id = Column(Integer, ForeignKey("departments.id"))
    semester = Column(Integer, default=1)
    batch = Column(String(20))
    admission_year = Column(Integer)
    gpa = Column(DECIMAL(3, 2), default=0.00)
    attendance_percentage = Column(DECIMAL(5, 2), default=0.00)
    documents_verified = Column(Boolean, default=False)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING)
    verified_by = Column(Integer, ForeignKey("faculties.id"))
    verified_at = Column(DateTime)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", backref="student")
    department = relationship("Department")
    verified_by_faculty = relationship("Faculty")

class DocumentType(Base):
    __tablename__ = "document_types"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    is_required = Column(Boolean, default=True)
    max_file_size_mb = Column(Integer, default=5)
    allowed_extensions = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

class StudentDocument(Base):
    __tablename__ = "student_documents"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"))
    document_type_id = Column(Integer, ForeignKey("document_types.id"))
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_mb = Column(DECIMAL(5, 2))
    file_extension = Column(String(10))
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING)
    verified_by = Column(Integer, ForeignKey("faculties.id"))
    verification_notes = Column(Text)
    uploaded_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    student = relationship("Student", backref="documents")
    document_type = relationship("DocumentType")
    verified_by_faculty = relationship("Faculty")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    assigned_by = Column(Integer, ForeignKey("faculties.id"))
    assigned_to = Column(Integer, ForeignKey("students.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    task_type = Column(Enum(TaskType))
    priority = Column(Enum(TaskPriority))
    due_date = Column(DateTime)
    max_marks = Column(Integer)
    status = Column(Enum(TaskStatus), default=TaskStatus.PUBLISHED)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    assigned_by_faculty = relationship("Faculty", backref="assigned_tasks")
    assigned_to_student = relationship("Student", backref="assigned_tasks")
    department = relationship("Department")

class TaskSubmission(Base):
    __tablename__ = "task_submissions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"))
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"))
    submission_text = Column(Text)
    file_path = Column(String(500))
    submission_status = Column(Enum(SubmissionStatus), default=SubmissionStatus.PENDING)
    marks_obtained = Column(Integer)
    feedback = Column(Text)
    graded_by = Column(Integer, ForeignKey("faculties.id"))
    graded_at = Column(DateTime)
    submitted_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    task = relationship("Task", backref="submissions")
    student = relationship("Student", backref="task_submissions")
    graded_by_faculty = relationship("Faculty")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(Enum(NotificationType), default=NotificationType.INFO)
    is_read = Column(Boolean, default=False)
    action_url = Column(String(500))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", backref="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(100), nullable=False)
    table_name = Column(String(50))
    record_id = Column(Integer)
    old_values = Column(Text)
    new_values = Column(Text)
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    user = relationship("User", backref="audit_logs")
