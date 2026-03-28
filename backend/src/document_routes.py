from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from models import StudentDocument, DocumentType, User, Student
from database import get_db
from schemas import StudentDocumentResponse
from dependencies import get_current_active_user, get_current_student, get_current_faculty
from typing import List
import os
from datetime import datetime

router = APIRouter(prefix="/documents", tags=["documents"])

@router.get("/types", response_model=List[dict])
def get_document_types(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all document types."""
    document_types = db.query(DocumentType).all()
    
    return [
        {
            "id": doc_type.id,
            "name": doc_type.name,
            "description": doc_type.description,
            "is_required": doc_type.is_required,
            "max_file_size_mb": doc_type.max_file_size_mb,
            "allowed_extensions": doc_type.allowed_extensions
        }
        for doc_type in document_types
    ]

@router.post("/upload", response_model=StudentDocumentResponse)
def upload_document(
    document_type_id: int,
    file: UploadFile = File(...),
    file_name: str = None,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Upload a document (Student only)."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Check if document type exists
    document_type = db.query(DocumentType).filter(DocumentType.id == document_type_id).first()
    if not document_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document type not found"
        )
    
    # Check if document already exists for this student
    existing_doc = db.query(StudentDocument).filter(
        StudentDocument.student_id == student.id,
        StudentDocument.document_type_id == document_type_id
    ).first()
    
    # Allow re-upload if document is rejected, otherwise block
    if existing_doc and existing_doc.verification_status not in ['rejected']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document of this type already uploaded and is under review or approved"
        )
    
    # Read file content to get actual size
    content = file.file.read()
    file_size = len(content)
    
    # Reset file pointer for later use
    file.file.seek(0)
    
    # Validate file size
    if file_size > document_type.max_file_size_mb * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed size of {document_type.max_file_size_mb}MB"
        )
    
    file_extension = file.filename.split(".")[-1].lower() if file.filename else ""
    
    if document_type.allowed_extensions:
        allowed_extensions = [ext.strip() for ext in document_type.allowed_extensions.replace('["', '').replace('"]', '').replace('"', '').split(',')]
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File extension '{file_extension}' not allowed. Allowed extensions: {', '.join(allowed_extensions)}"
            )
    
    # Create uploads directory if it doesn't exist
    upload_dir = f"uploads/documents/{student.enrollment_number}"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate automatic file name if provided, otherwise use original
    if file_name:
        # Use the provided automatic file name (e.g., "Bhanu_10th_Marksheet.pdf")
        automatic_file_name = file_name
        # Ensure the file extension is correct
        if not automatic_file_name.endswith(f".{file_extension}"):
            automatic_file_name = f"{automatic_file_name}.{file_extension}"
    else:
        # Fallback to original naming if no automatic name provided
        automatic_file_name = f"{document_type.name.replace(' ', '_').lower()}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_extension}"
    
    file_path = os.path.join(upload_dir, automatic_file_name)
    
    with open(file_path, "wb") as buffer:
        buffer.write(content)
    
    # If re-uploading a rejected document, update the existing record
    if existing_doc and existing_doc.verification_status == 'rejected':
        # Delete old file
        if os.path.exists(existing_doc.file_path):
            os.remove(existing_doc.file_path)
        
        # Update existing record
        existing_doc.file_name = automatic_file_name
        existing_doc.file_path = file_path
        existing_doc.file_size_mb = round(file_size / (1024 * 1024), 2)
        existing_doc.file_extension = file_extension
        existing_doc.verification_status = "pending"
        existing_doc.uploaded_at = datetime.utcnow()
        
        db.commit()
        db.refresh(existing_doc)
        return existing_doc
    
    # Create new document record
    db_document = StudentDocument(
        student_id=student.id,
        document_type_id=document_type_id,
        file_name=automatic_file_name,  # Store the renamed file name
        file_path=file_path,
        file_size_mb=round(file_size / (1024 * 1024), 2),
        file_extension=file_extension,
        verification_status="pending"
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document

@router.get("/my-documents", response_model=List[StudentDocumentResponse])
def get_my_documents(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get current student's documents."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Include document_type relationship in the query
    from sqlalchemy.orm import joinedload
    documents = db.query(StudentDocument).options(
        joinedload(StudentDocument.document_type),
        joinedload(StudentDocument.student)
    ).filter(StudentDocument.student_id == student.id).all()
    
    # Create custom response to include document type info
    result = []
    for doc in documents:
        doc_dict = {
            "id": doc.id,
            "student_id": doc.student_id,
            "document_type_id": doc.document_type_id,
            "file_name": doc.file_name,
            "file_path": doc.file_path,
            "file_size_mb": doc.file_size_mb,
            "file_extension": doc.file_extension,
            "upload_status": doc.upload_status,
            "verification_status": doc.verification_status,
            "verified_by": doc.verified_by,
            "verification_notes": doc.verification_notes,
            "rejection_reason": doc.rejection_reason,
            "uploaded_at": doc.uploaded_at,
            "verified_at": doc.verified_at,
            "created_at": doc.created_at,
            "updated_at": doc.updated_at,
            "document_type": {
                "id": doc.document_type.id,
                "name": doc.document_type.name
            } if doc.document_type else None,
            "student": {
                "enrollment_number": doc.student.enrollment_number
            } if doc.student else None
        }
        result.append(doc_dict)
    
    return result

@router.get("/my-documents-status", response_model=List[dict])
def get_my_documents_status(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get all document types with upload status for current student."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Get all document types
    all_document_types = db.query(DocumentType).all()
    
    # Get student's uploaded documents
    from sqlalchemy.orm import joinedload
    student_documents = db.query(StudentDocument).options(
        joinedload(StudentDocument.document_type)
    ).filter(StudentDocument.student_id == student.id).all()
    
    # Create a map of document_type_id to document
    doc_map = {doc.document_type_id: doc for doc in student_documents}
    
    # Build response with all document types and their status
    result = []
    for doc_type in all_document_types:
        uploaded_doc = doc_map.get(doc_type.id)
        
        result.append({
            "document_type_id": doc_type.id,
            "name": doc_type.name,
            "description": doc_type.description,
            "is_required": doc_type.is_required,
            "max_file_size_mb": doc_type.max_file_size_mb,
            "allowed_extensions": doc_type.allowed_extensions,
            "upload_status": "uploaded" if uploaded_doc else "not_uploaded",
            "verification_status": uploaded_doc.verification_status if uploaded_doc else None,
            "uploaded_at": uploaded_doc.uploaded_at.isoformat() if uploaded_doc and uploaded_doc.uploaded_at else None,
            "verified_at": uploaded_doc.verified_at.isoformat() if uploaded_doc and uploaded_doc.verified_at else None,
            "file_name": uploaded_doc.file_name if uploaded_doc else None,
            "file_size_mb": uploaded_doc.file_size_mb if uploaded_doc else None,
            "rejection_reason": uploaded_doc.rejection_reason if uploaded_doc else None,
            "file_path": uploaded_doc.file_path if uploaded_doc else None,
            "student_enrollment": student.enrollment_number
        })
    
    return result

@router.get("/student/{student_id}", response_model=List[StudentDocumentResponse])
def get_student_documents(
    student_id: int,
    current_user: User = Depends(get_current_faculty),
    db: Session = Depends(get_db)
):
    """Get student's documents (Faculty only)."""
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty profile not found"
        )
    
    if not faculty.can_verify_documents:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view documents"
        )
    
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check if student is in same department
    if student.department_id != faculty.department_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view documents of students from other departments"
        )
    
    documents = db.query(StudentDocument).filter(StudentDocument.student_id == student_id).all()
    return documents

@router.put("/{document_id}/verify")
def verify_document(
    document_id: int,
    verification_status: str,
    verification_notes: str = None,
    current_user: User = Depends(get_current_faculty),
    db: Session = Depends(get_db)
):
    """Verify or reject a document (Faculty only)."""
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
    
    # Check if student is in same department
    student = db.query(Student).filter(Student.id == document.student_id).first()
    if student.department_id != faculty.department_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to verify documents of students from other departments"
        )
    
    # Update document verification
    document.verification_status = verification_status
    document.verified_by = faculty.id
    document.verification_notes = verification_notes
    
    db.commit()
    
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
    elif verification_status == 'rejected':
        student.verification_status = 'rejected'
    
    db.commit()
    
    return {"message": f"Document {verification_status} successfully"}

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Delete a document (Student only, only if not verified)."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    document = db.query(StudentDocument).filter(
        StudentDocument.id == document_id,
        StudentDocument.student_id == student.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    if document.verification_status == 'verified':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete verified document"
        )
    
    # Delete file from filesystem
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    # Delete database record
    db.delete(document)
    db.commit()
    
    return {"message": "Document deleted successfully"}
