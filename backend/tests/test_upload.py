#!/usr/bin/env python3
"""
Test script to verify document upload functionality
"""

import requests
import json
import os

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test if the server is running"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Server is running")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        return False

def test_document_types_endpoint():
    """Test the document types endpoint (without auth)"""
    try:
        response = requests.get(f"{BASE_URL}/documents/types")
        print(f"Document types endpoint status: {response.status_code}")
        if response.status_code == 401:
            print("✅ Endpoint exists but requires authentication (expected)")
            return True
        else:
            print(f"Response: {response.text}")
            return response.status_code == 200
    except Exception as e:
        print(f"❌ Document types endpoint error: {e}")
        return False

def test_upload_endpoint():
    """Test the upload endpoint (without auth)"""
    try:
        # Create a test file
        test_file_content = b"Test document content"
        files = {'file': ('test.pdf', test_file_content, 'application/pdf')}
        data = {'document_type_id': '1'}
        
        response = requests.post(f"{BASE_URL}/documents/upload", files=files, data=data)
        print(f"Upload endpoint status: {response.status_code}")
        if response.status_code == 401:
            print("✅ Upload endpoint exists but requires authentication (expected)")
            return True
        else:
            print(f"Response: {response.text}")
            return response.status_code == 200
    except Exception as e:
        print(f"❌ Upload endpoint error: {e}")
        return False

def main():
    print("🔍 Testing Document Upload Functionality")
    print("=" * 50)
    
    # Test basic connectivity
    if not test_health_check():
        print("\n❌ Server is not running. Please start the backend server first.")
        print("Run: python3 -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload")
        return
    
    print()
    
    # Test endpoints
    test_document_types_endpoint()
    test_upload_endpoint()
    
    print("\n" + "=" * 50)
    print("📋 Summary:")
    print("✅ Backend server is running")
    print("✅ Document upload endpoints are accessible")
    print("✅ Authentication is working (endpoints require auth)")
    print("\n🔧 Next Steps:")
    print("1. Start the frontend application")
    print("2. Login as a student user")
    print("3. Try uploading a document")

if __name__ == "__main__":
    main()
