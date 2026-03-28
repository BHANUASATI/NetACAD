#!/usr/bin/env python3
"""
Test script for faculty creation functionality
"""

import requests
import json

# Base URL
BASE_URL = "http://localhost:8000"

def login_as_registrar():
    """Login as registrar and get token"""
    login_data = {
        "email": "registrar@university.edu.in",
        "password": "registrar123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    
    if response.status_code == 200:
        token_data = response.json()
        print("✅ Login successful!")
        return token_data["access_token"]
    else:
        print(f"❌ Login failed: {response.status_code} - {response.text}")
        return None

def test_create_faculty(token):
    """Test faculty creation"""
    
    # Test faculty data
    faculty_data = {
        "employee_id": "FAC2025001",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@faculty.university.edu",
        "personal_email": "john.doe.personal@gmail.com",
        "phone": "+91 9876543210",
        "designation": "Assistant Professor",
        "department_id": 1,
        "password": "TempPassword123!"
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{BASE_URL}/registrar/faculty", json=faculty_data, headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Faculty creation successful!")
        print(f"   Message: {result.get('message')}")
        print(f"   Faculty ID: {result.get('faculty_id')}")
        print(f"   Email sent: {result.get('email_sent')}")
        return True
    else:
        print(f"❌ Faculty creation failed: {response.status_code} - {response.text}")
        return False

def test_get_faculty(token):
    """Test getting faculty list"""
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(f"{BASE_URL}/registrar/faculty", headers=headers)
    
    if response.status_code == 200:
        faculty_list = response.json()
        print("✅ Get faculty successful!")
        print(f"   Number of faculty: {len(faculty_list)}")
        for faculty in faculty_list:
            print(f"   - {faculty['first_name']} {faculty['last_name']} ({faculty['employee_id']})")
        return True
    else:
        print(f"❌ Get faculty failed: {response.status_code} - {response.text}")
        return False

def main():
    print("🧪 Testing Faculty Management Functionality")
    print("=" * 50)
    
    # Login as registrar
    token = login_as_registrar()
    if not token:
        return
    
    print()
    
    # Test faculty creation
    print("Testing faculty creation...")
    create_success = test_create_faculty(token)
    
    print()
    
    # Test getting faculty list
    print("Testing get faculty list...")
    get_success = test_get_faculty(token)
    
    print()
    print("=" * 50)
    if create_success and get_success:
        print("🎉 All tests passed!")
    else:
        print("❌ Some tests failed!")

if __name__ == "__main__":
    main()
