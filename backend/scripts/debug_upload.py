#!/usr/bin/env python3
"""
Debug script to check what's happening with document upload
"""

import requests
import json

# Test the document types endpoint
def test_document_types():
    try:
        # First try without auth (should get 401)
        response = requests.get("http://localhost:8000/documents/types")
        print(f"Document types endpoint (no auth): {response.status_code}")
        
        # Try to get the actual error from upload endpoint
        test_file_content = b"Test document content"
        files = {'file': ('test.pdf', test_file_content, 'application/pdf')}
        data = {'document_type_id': '1'}  # Use a valid ID
        
        response = requests.post("http://localhost:8000/documents/upload", files=files, data=data)
        print(f"Upload endpoint (no auth): {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error: {e}")

def check_database_docs():
    """Check what's actually in the database"""
    try:
        from database import get_db
        from models import DocumentType
        
        db = next(get_db())
        doc_types = db.query(DocumentType).all()
        
        print("\nDocument Types in Database:")
        print("=" * 50)
        for doc in doc_types:
            print(f"ID: {doc.id:2d} | Name: {doc.name}")
        
        db.close()
        
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    print("🔍 Debugging Document Upload Issue")
    print("=" * 50)
    
    test_document_types()
    check_database_docs()
    
    print("\n🔧 Debugging Tips:")
    print("1. Check browser console for JavaScript errors")
    print("2. Check network tab for failed requests")
    print("3. Verify the document type dropdown selection")
    print("4. Make sure frontend is refreshed with latest changes")
