#!/usr/bin/env python3
"""
Create a test student user for testing the document API
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def create_test_student():
    """Create a test student user"""
    
    print("👤 Creating test student user...")
    
    try:
        # Student registration data
        student_data = {
            "email": "test.student2@university.edu.in",
            "password": "test123",
            "first_name": "Test",
            "last_name": "Student",
            "role": "student",
            "enrollment_number": "2024TEST002",
            "course": "Computer Science",
            "semester": 3,
            "batch": "A",
            "department": "Computer Science"
        }
        
        print("📝 Registering student...")
        register_response = requests.post(f"{BASE_URL}/api/auth/register/student", json=student_data)
        
        if register_response.status_code == 200:
            print("✅ Student registration successful!")
            user_data = register_response.json()
            print(f"   User ID: {user_data.get('id')}")
            print(f"   Email: {user_data.get('email')}")
            return True
        else:
            print(f"❌ Registration failed with status {register_response.status_code}")
            print(f"Response: {register_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error creating student: {str(e)}")
        return False

def test_login():
    """Test login with the created student"""
    
    print("\n🔐 Testing login...")
    
    try:
        login_data = {
            "email": "test.student2@university.edu.in",
            "password": "test123"
        }
        
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data.get("access_token")
            print("✅ Login successful!")
            return token
        else:
            print(f"❌ Login failed with status {login_response.status_code}")
            print(f"Response: {login_response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return None

def test_document_api(token):
    """Test the document status API"""
    
    print("\n📄 Testing document status API...")
    
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        doc_response = requests.get(f"{BASE_URL}/documents/my-documents-status", headers=headers)
        
        if doc_response.status_code == 200:
            documents = doc_response.json()
            print(f"✅ API call successful! Found {len(documents)} document types")
            
            for doc in documents:
                status = doc.get("upload_status", "unknown")
                verification = doc.get("verification_status", "unknown")
                print(f"  📋 {doc.get('name', 'Unknown')}: {status} ({verification})")
            
            return True
        else:
            print(f"❌ API call failed with status {doc_response.status_code}")
            print(f"Response: {doc_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ API test error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Starting API testing...")
    
    # Try login directly (user might already exist)
    token = test_login()
    if token:
        # Test document API
        if test_document_api(token):
            print("\n🎉 All tests passed!")
        else:
            print("\n💥 Document API test failed!")
    else:
        print("\n💥 Login test failed!")
        print("   Trying to create new user...")
        # Create test student
        if create_test_student():
            # Test login again
            token = test_login()
            if token:
                # Test document API
                if test_document_api(token):
                    print("\n🎉 All tests passed!")
                else:
                    print("\n💥 Document API test failed!")
            else:
                print("\n💥 Login test failed!")
        else:
            print("\n💥 Student creation failed!")
