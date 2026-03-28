#!/usr/bin/env python3
"""
Add missing document types to the database
"""

from database import get_db
from models import DocumentType

def add_missing_document_types():
    """Add document types that are missing from the database"""
    
    # Get database session
    db = next(get_db())
    
    # Missing document types from frontend
    missing_docs = [
        {'name': 'Character Certificate', 'description': 'Character or conduct certificate from previous institution', 'is_required': True, 'max_file_size_mb': 5, 'allowed_extensions': 'pdf,jpg,jpeg,png'},
        {'name': 'Medical Fitness Certificate', 'description': 'Medical fitness certificate from registered practitioner', 'is_required': True, 'max_file_size_mb': 5, 'allowed_extensions': 'pdf,jpg,jpeg,png'},
        {'name': 'Anti-Ragging Affidavit', 'description': 'Anti-ragging affidavit as per university requirements', 'is_required': True, 'max_file_size_mb': 5, 'allowed_extensions': 'pdf,jpg,jpeg,png'},
        {'name': 'Gap Certificate', 'description': 'Gap certificate if there is a break in education', 'is_required': False, 'max_file_size_mb': 5, 'allowed_extensions': 'pdf,jpg,jpeg,png'}
    ]
    
    print('Adding missing document types...')
    for doc_data in missing_docs:
        # Check if document type already exists
        existing = db.query(DocumentType).filter(DocumentType.name == doc_data['name']).first()
        if not existing:
            new_doc = DocumentType(**doc_data)
            db.add(new_doc)
            print(f'✅ Added: {doc_data["name"]}')
        else:
            print(f'⚠️ Already exists: {doc_data["name"]}')
    
    try:
        db.commit()
        print('\n✅ Database updated successfully!')
    except Exception as e:
        print(f'❌ Error updating database: {e}')
        db.rollback()
        return
    
    # Show all document types with their IDs
    print('\n📋 All Document Types in Database:')
    print('=' * 80)
    doc_types = db.query(DocumentType).all()
    for doc_type in doc_types:
        required_status = 'Required' if doc_type.is_required else 'Optional'
        print(f'ID: {doc_type.id:2d} | {doc_type.name:<30} | {required_status:<8} | {doc_type.allowed_extensions}')
    
    db.close()

if __name__ == "__main__":
    add_missing_document_types()
