#!/usr/bin/env python3
"""
Script to fix document file paths in database to match actual files on disk
"""

import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
sys.path.append('/Users/Asati_Bhanu/Desktop/GitHub_Pull/NetACAD/backend')

from database import get_db
from models import StudentDocument, DocumentType, Student
from sqlalchemy.orm import Session

def fix_document_paths():
    """Update database file paths to match actual files on disk"""
    
    # Get database session
    db: Session = next(get_db())
    
    try:
        # Get all documents with their document types and student info
        documents = db.query(StudentDocument).all()
        
        print(f"Found {len(documents)} documents in database")
        
        uploads_dir = Path("/Users/Asati_Bhanu/Desktop/GitHub_Pull/NetACAD/backend/uploads/documents")
        
        fixed_count = 0
        not_found_count = 0
        
        # Create a mapping of student_id to enrollment_number
        students = db.query(Student).all()
        student_mapping = {student.id: student.enrollment_number for student in students}
        
        for doc in documents:
            # Get document type name
            doc_type = db.query(DocumentType).filter(DocumentType.id == doc.document_type_id).first()
            doc_type_name = doc_type.name if doc_type else "Unknown"
            
            # Get enrollment number for this student
            enrollment_number = student_mapping.get(doc.student_id)
            
            print(f"\nProcessing document ID {doc.id}:")
            print(f"  Student ID: {doc.student_id}")
            print(f"  Enrollment Number: {enrollment_number}")
            print(f"  Document Type: {doc_type_name}")
            print(f"  Current file_path: {doc.file_path}")
            print(f"  Original file_name: {doc.file_name}")
            
            if not enrollment_number:
                print(f"  ❌ No enrollment number found for student ID {doc.student_id}")
                not_found_count += 1
                continue
            
            # Get the student's directory using enrollment number
            student_dir = uploads_dir / enrollment_number
            
            if not student_dir.exists():
                print(f"  ❌ Student directory not found: {student_dir}")
                not_found_count += 1
                continue
            
            # List all files in student directory
            student_files = list(student_dir.glob("*"))
            print(f"  Files in directory: {[f.name for f in student_files]}")
            
            if not student_files:
                print(f"  ❌ No files found in student directory")
                not_found_count += 1
                continue
            
            # Try to find a matching file
            matching_file = None
            
            # First try exact match
            for file_path in student_files:
                if file_path.name == doc.file_name:
                    matching_file = file_path
                    break
            
            # If no exact match, try to find by document type
            if not matching_file:
                doc_type_lower = doc_type_name.lower().replace(" ", "_")
                for file_path in student_files:
                    if doc_type_lower in file_path.name.lower():
                        matching_file = file_path
                        break
            
            # If still no match, use the first file
            if not matching_file and student_files:
                matching_file = student_files[0]
                print(f"  ⚠️  Using first available file as fallback")
            
            if matching_file:
                # Update the database record
                old_path = doc.file_path
                new_path = str(matching_file.relative_to(Path("/Users/Asati_Bhanu/Desktop/GitHub_Pull/NetACAD/backend")))
                
                doc.file_path = new_path
                db.commit()
                
                print(f"  ✅ Updated file_path:")
                print(f"     From: {old_path}")
                print(f"     To: {new_path}")
                print(f"     Actual file: {matching_file.name}")
                
                fixed_count += 1
            else:
                print(f"  ❌ No matching file found")
                not_found_count += 1
        
        print(f"\n=== SUMMARY ===")
        print(f"Total documents: {len(documents)}")
        print(f"Fixed: {fixed_count}")
        print(f"Not found: {not_found_count}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_document_paths()
