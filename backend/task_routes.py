from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from models import Task, TaskSubmission, User, Student, Faculty
from database import get_db
from schemas import TaskCreate, TaskResponse, TaskSubmissionCreate, TaskSubmissionResponse, TaskUpdate
from dependencies import get_current_active_user, get_current_faculty, get_current_student
from typing import List
import os
from datetime import datetime

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_faculty),
    db: Session = Depends(get_db)
):
    """Create a new task (Faculty only)."""
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks"
        )
    
    if not faculty.can_assign_tasks:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to assign tasks"
        )
    
    # Create task
    db_task = Task(
        title=task_data.title,
        description=task_data.description,
        assigned_by=faculty.id,
        assigned_to=task_data.assigned_to,
        department_id=task_data.department_id,
        task_type=task_data.task_type,
        priority=task_data.priority,
        due_date=task_data.due_date,
        max_marks=task_data.max_marks,
        status="published"
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    return db_task

@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get tasks based on user role."""
    if current_user.role == "student":
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found"
            )
        
        tasks = db.query(Task).filter(
            (Task.assigned_to == student.id) | 
            (Task.assigned_to.is_(None) & Task.department_id == student.department_id)
        ).offset(skip).limit(limit).all()
        
    elif current_user.role == "faculty":
        faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
        if not faculty:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Faculty profile not found"
            )
        
        tasks = db.query(Task).filter(Task.assigned_by == faculty.id).offset(skip).limit(limit).all()
        
    else:  # admin
        tasks = db.query(Task).offset(skip).limit(limit).all()
    
    return tasks

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific task by ID."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if user has permission to view this task
    if current_user.role == "student":
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if task.assigned_to != student.id and (task.assigned_to is not None or task.department_id != student.department_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this task"
            )
    elif current_user.role == "faculty":
        faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
        if task.assigned_by != faculty.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this task"
            )
    
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_faculty),
    db: Session = Depends(get_db)
):
    """Update a task (Faculty only)."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if task.assigned_by != faculty.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )
    
    # Update task fields
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    return task

@router.post("/{task_id}/submit", response_model=TaskSubmissionResponse)
def submit_task(
    task_id: int,
    submission_text: str = None,
    file: UploadFile = File(None),
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Submit a task (Student only)."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if student is assigned to this task
    if task.assigned_to != student.id and (task.assigned_to is not None or task.department_id != student.department_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to submit this task"
        )
    
    # Check if already submitted
    existing_submission = db.query(TaskSubmission).filter(
        TaskSubmission.task_id == task_id,
        TaskSubmission.student_id == student.id
    ).first()
    
    if existing_submission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task already submitted"
        )
    
    # Handle file upload
    file_path = None
    if file:
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads/tasks"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        file_extension = file.filename.split(".")[-1] if file.filename else ""
        file_name = f"task_{task_id}_student_{student.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_extension}"
        file_path = os.path.join(upload_dir, file_name)
        
        with open(file_path, "wb") as buffer:
            content = file.file.read()
            buffer.write(content)
    
    # Determine submission status
    submission_status = "submitted"
    if task.due_date and datetime.utcnow() > task.due_date:
        submission_status = "late"
    
    # Create submission
    db_submission = TaskSubmission(
        task_id=task_id,
        student_id=student.id,
        submission_text=submission_text,
        file_path=file_path,
        submission_status=submission_status
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    return db_submission

@router.get("/{task_id}/submissions", response_model=List[TaskSubmissionResponse])
def get_task_submissions(
    task_id: int,
    current_user: User = Depends(get_current_faculty),
    db: Session = Depends(get_db)
):
    """Get all submissions for a task (Faculty only)."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if task.assigned_by != faculty.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view submissions for this task"
        )
    
    submissions = db.query(TaskSubmission).filter(TaskSubmission.task_id == task_id).all()
    return submissions

@router.put("/submissions/{submission_id}/grade")
def grade_submission(
    submission_id: int,
    marks_obtained: int,
    feedback: str = None,
    current_user: User = Depends(get_current_faculty),
    db: Session = Depends(get_db)
):
    """Grade a task submission (Faculty only)."""
    submission = db.query(TaskSubmission).filter(TaskSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    task = db.query(Task).filter(Task.id == submission.task_id).first()
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    
    if task.assigned_by != faculty.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to grade this submission"
        )
    
    # Update submission
    submission.marks_obtained = marks_obtained
    submission.feedback = feedback
    submission.graded_by = faculty.id
    submission.graded_at = datetime.utcnow()
    submission.submission_status = "graded"
    
    db.commit()
    
    return {"message": "Submission graded successfully"}
