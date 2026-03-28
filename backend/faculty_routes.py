from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import Faculty, User, Student, StudentDocument, Task, TaskSubmission, DocumentType
from database import get_db
from schemas import FacultyResponse, FacultyUpdate, StudentDocumentResponse
from dependencies import get_current_active_user, get_current_admin, get_current_faculty
from typing import List
from datetime import datetime

router = APIRouter(prefix="/faculty", tags=["faculty"])

@router.get("/", response_model=List[FacultyResponse])
def get_faculties(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all faculties (Admin only)."""
    faculties = db.query(Faculty).offset(skip).limit(limit).all()
    return faculties

@router.get("/me", response_model=FacultyResponse)
def get_my_faculty_info(
    current_user: User = Depends(get_current_faculty),
    db: Session = Depends(get_db)
):
    """Get current faculty's information."""
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty profile not found"
        )
    return faculty

@router.put("/me", response_model=FacultyResponse)
def update_my_faculty_info(
    faculty_update: FacultyUpdate,
    current_user: User = Depends(get_current_faculty),
    db: Session = Depends(get_db)
):
    """Update current faculty's information."""
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty profile not found"
        )
    
    # Update faculty fields
    update_data = faculty_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(faculty, field, value)
    
    db.commit()
    db.refresh(faculty)
    return faculty

@router.get("/dashboard/stats")
def get_faculty_dashboard_stats(
    current_user: User = Depends(get_current_faculty),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for current faculty."""
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty profile not found"
        )
    
    # All models already imported at top
    
    # Get task statistics
    total_tasks = db.query(Task).filter(Task.assigned_by == faculty.id).count()
    
    pending_grades = db.query(TaskSubmission).join(Task).filter(
        Task.assigned_by == faculty.id,
        TaskSubmission.submission_status == 'submitted',
        TaskSubmission.graded_at.is_(None)
    ).count()
    
    # Get student statistics
    total_students = db.query(Student).filter(
        Student.department_id == faculty.department_id
    ).count()
    
    verified_students = db.query(Student).filter(
        Student.department_id == faculty.department_id,
        Student.documents_verified == True
    ).count()
    
    # Get document verification statistics
    pending_documents = db.query(StudentDocument).join(Student).filter(
        Student.department_id == faculty.department_id,
        StudentDocument.verification_status == 'pending'
    ).count()
    
    return {
        "total_tasks": total_tasks,
        "pending_grades": pending_grades,
        "total_students": total_students,
        "verified_students": verified_students,
        "pending_documents": pending_documents,
        "can_verify_documents": faculty.can_verify_documents,
        "can_assign_tasks": faculty.can_assign_tasks
    }

@router.get("/documents/pending", response_model=List[StudentDocumentResponse])
def get_pending_documents(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_faculty),
    db: Session = Depends(get_db)
):
    """Get pending document verifications for faculty."""
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty profile not found"
        )
    
    if not faculty.can_verify_documents:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to verify documents"
        )
    
    documents = db.query(StudentDocument).join(Student).filter(
        Student.department_id == faculty.department_id,
        StudentDocument.verification_status == 'pending'
    ).offset(skip).limit(limit).all()
    
    return documents

@router.put("/documents/{document_id}/verify")
def verify_document(
    document_id: int,
    verification_status: str,
    verification_notes: str = None,
    current_user: User = Depends(get_current_faculty),
    db: Session = Depends(get_db)
):
    """Verify or reject a student document."""
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty profile not found"
        )
    
    if not faculty.can_verify_documents:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to verify documents"
        )
    
    document = db.query(StudentDocument).filter(StudentDocument.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Update document verification
    # Map 'approved' to 'verified' for database compatibility
    db_status = 'verified' if verification_status == 'approved' else verification_status
    document.verification_status = db_status
    document.verified_by = faculty.id
    document.verification_notes = verification_notes
    
    db.commit()
    
    # Check if all student documents are verified
    # DocumentType already imported at top
    
    student = db.query(Student).filter(Student.id == document.student_id).first()
    # Check if all required documents are verified (9 total required documents)
    TOTAL_REQUIRED_DOCS = 9
    
    verified_docs = db.query(StudentDocument).filter(
        StudentDocument.student_id == student.id,
        StudentDocument.verification_status == 'verified'
    ).count()
    
    # Update student verification status
    if verified_docs == TOTAL_REQUIRED_DOCS:
        student.documents_verified = True
        student.verification_status = 'verified'
        student.verified_by = faculty.id
        student.verified_at = datetime.utcnow()
    elif db_status == 'rejected':
        student.verification_status = 'rejected'
    
    db.commit()
    
    return {"message": f"Document {verification_status} successfully"}
