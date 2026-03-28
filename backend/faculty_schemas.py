from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import FacultyRole, DepartmentType

class FacultyBase(BaseModel):
    employee_id: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    specialization: Optional[str] = None
    designation: Optional[str] = None
    role: FacultyRole = FacultyRole.LECTURER
    department_id: int
    is_active: bool = True

class FacultyCreate(FacultyBase):
    password: str

class FacultyUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    specialization: Optional[str] = None
    designation: Optional[str] = None
    role: Optional[FacultyRole] = None
    department_id: Optional[int] = None
    is_active: Optional[bool] = None

class FacultyResponse(FacultyBase):
    id: int
    user_id: int
    can_verify_documents: bool
    can_assign_tasks: bool
    can_grade_submissions: bool
    can_manage_students: bool
    can_generate_reports: bool
    can_access_all_departments: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class FacultyProfileResponse(BaseModel):
    id: int
    employee_id: str
    first_name: str
    last_name: str
    phone: Optional[str]
    email: Optional[str]
    specialization: Optional[str]
    designation: Optional[str]
    role: FacultyRole
    department: Optional[dict] = None
    is_active: bool
    permissions: dict
    
    class Config:
        from_attributes = True

class DepartmentBase(BaseModel):
    name: str
    code: str
    type: DepartmentType
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    type: Optional[DepartmentType] = None
    description: Optional[str] = None

class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Task Management Schemas for Faculty
class TaskCreate(BaseModel):
    title: str
    description: str
    type: str  # assignment, project, exam, general
    priority: str  # low, medium, high, urgent
    due_date: datetime
    max_score: float = 100.0
    department_id: Optional[int] = None
    assigned_student_ids: Optional[List[int]] = []

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    max_score: Optional[float] = None
    is_active: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    type: str
    priority: str
    due_date: datetime
    max_score: float
    is_active: bool
    faculty_id: int
    department_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Student Verification Schemas
class StudentVerificationRequest(BaseModel):
    student_id: int
    document_type_id: int
    verification_status: str  # verified, rejected
    remarks: Optional[str] = None

class BulkStudentVerification(BaseModel):
    verifications: List[StudentVerificationRequest]

# Faculty Statistics
class FacultyStats(BaseModel):
    total_students: int
    pending_verifications: int
    verified_documents: int
    rejected_documents: int
    active_tasks: int
    completed_tasks: int
    pending_submissions: int
    graded_submissions: int
