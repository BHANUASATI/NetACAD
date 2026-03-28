from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from models import Student, User, Task, TaskSubmission, StudentDocument, DocumentType, Department, School, Course
from database import get_db
from schemas import StudentResponse, StudentUpdate, StudentCreate
from dependencies import get_current_active_user, get_current_student, get_current_faculty, get_current_admin
from typing import List

router = APIRouter(prefix="/students", tags=["students"])

@router.get("/", response_model=List[StudentResponse])
def get_students(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all students (Admin only)."""
    students = db.query(Student).offset(skip).limit(limit).all()
    return students

@router.get("/me")
def get_my_student_info(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get current student's information."""
    
    # Get student with school, department, and course information using raw SQL
    query = text("""
        SELECT s.*, 
               sc.name as school_name, sc.code as school_code,
               d.name as department_name, d.code as department_code,
               c.name as course_name, c.code as course_code
        FROM students s
        LEFT JOIN schools sc ON s.school_id = sc.id
        LEFT JOIN departments d ON s.department_id = d.id
        LEFT JOIN courses c ON s.course_id = c.id
        WHERE s.user_id = :user_id
    """)
    
    result = db.execute(query, {"user_id": current_user.id}).first()
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Add school, department, and course info to student response
    student_data = {
        "id": result.id,
        "user_id": result.user_id,
        "enrollment_number": result.enrollment_number,
        "first_name": result.first_name,
        "last_name": result.last_name,
        "phone": result.phone,
        "date_of_birth": result.date_of_birth,
        "gender": result.gender,
        "blood_group": result.blood_group,
        "address": result.address,
        "city": result.city,
        "state": result.state,
        "pincode": result.pincode,
        "school_id": result.school_id,
        "department_id": result.department_id,
        "course_id": result.course_id,
        "semester": result.semester,
        "batch": result.batch,
        "admission_year": result.admission_year,
        "gpa": result.gpa,
        "attendance_percentage": result.attendance_percentage,
        "documents_verified": result.documents_verified,
        "verification_status": result.verification_status,
        "verified_by": result.verified_by,
        "verified_at": result.verified_at,
        "created_at": result.created_at,
        "updated_at": result.updated_at,
        "school": {
            "id": result.school_id,
            "name": result.school_name,
            "code": result.school_code
        } if result.school_name else None,
        "department": {
            "id": result.department_id,
            "name": result.department_name,
            "code": result.department_code
        } if result.department_name else None,
        "course": {
            "id": result.course_id,
            "name": result.course_name,
            "code": result.course_code
        } if result.course_name else None
    }
    
    return student_data

@router.post("/", response_model=StudentResponse)
def create_student(
    student_data: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new student (Admin only)."""
    from auth import get_password_hash
    
    # Check if enrollment number already exists
    existing_student = db.query(Student).filter(Student.enrollment_number == student_data.enrollment_number).first()
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Enrollment number already exists"
        )
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == student_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    
    try:
        # Create user account
        password_hash = get_password_hash(student_data.password)
        user = User(
            email=student_data.email,
            password_hash=password_hash,
            role="student",
            is_active=True,
            email_verified=False
        )
        db.add(user)
        db.flush()  # Get the user ID
        
        # Create student profile
        student = Student(
            user_id=user.id,
            enrollment_number=student_data.enrollment_number,
            first_name=student_data.first_name,
            last_name=student_data.last_name,
            phone=student_data.phone,
            date_of_birth=student_data.date_of_birth,
            gender=student_data.gender,
            blood_group=student_data.blood_group,
            address=student_data.address,
            city=student_data.city,
            state=student_data.state,
            pincode=student_data.pincode,
            school_id=student_data.school_id,
            department_id=student_data.department_id,
            course_id=student_data.course_id,
            semester=student_data.semester,
            batch=student_data.batch,
            admission_year=student_data.admission_year,
            gpa=0.0,
            attendance_percentage=0.0,
            documents_verified=False,
            verification_status="pending"
        )
        db.add(student)
        db.commit()
        db.refresh(student)
        
        return student
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating student: {str(e)}"
        )

@router.get("/{student_id}", response_model=StudentResponse)
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get specific student by ID (Admin only)."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    return student

@router.put("/me", response_model=StudentResponse)
def update_my_student_info(
    student_update: StudentUpdate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Update current student's information."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Update student fields
    update_data = student_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)
    
    db.commit()
    db.refresh(student)
    return student

@router.get("/dashboard/stats")
def get_student_dashboard_stats(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for current student."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Get task statistics
    # Task and TaskSubmission already imported
    
    total_tasks = db.query(Task).filter(
        (Task.assigned_to == student.id) | 
        (Task.assigned_to.is_(None) & Task.department_id == student.department_id)
    ).count()
    
    submitted_tasks = db.query(TaskSubmission).filter(
        TaskSubmission.student_id == student.id,
        TaskSubmission.submission_status.in_(['submitted', 'graded'])
    ).count()
    
    pending_tasks = total_tasks - submitted_tasks
    
    # Get document statistics
    from database_models import StudentDocument
    
    total_documents = db.query(StudentDocument).filter(
        StudentDocument.student_id == student.id
    ).count()
    
    verified_documents = db.query(StudentDocument).filter(
        StudentDocument.student_id == student.id,
        StudentDocument.verification_status == 'verified'
    ).count()
    
    return {
        "total_tasks": total_tasks,
        "submitted_tasks": submitted_tasks,
        "pending_tasks": pending_tasks,
        "total_documents": total_documents,
        "verified_documents": verified_documents,
        "documents_verified": student.documents_verified,
        "verification_status": student.verification_status,
        "gpa": float(student.gpa),
        "attendance_percentage": float(student.attendance_percentage)
    }

@router.get("/verification/status")
def get_verification_status(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get document verification status for current student."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # StudentDocument and DocumentType already imported
    
    documents = db.query(StudentDocument).join(DocumentType).filter(
        StudentDocument.student_id == student.id
    ).all()
    
    return {
        "documents_verified": student.documents_verified,
        "verification_status": student.verification_status,
        "verified_at": student.verified_at,
        "documents": [
            {
                "document_type": doc.document_type.name,
                "file_name": doc.file_name,
                "verification_status": doc.verification_status,
                "uploaded_at": doc.uploaded_at,
                "verification_notes": doc.verification_notes
            }
            for doc in documents
        ]
    }
