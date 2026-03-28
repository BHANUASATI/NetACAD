#!/usr/bin/env python3

"""
Quick test to verify the school/department/course API endpoints work
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

# Create test client
client = TestClient(app)

def test_endpoints():
    print("🧪 Testing School/Department/Course API Endpoints")
    print("=" * 50)
    
    # Test schools endpoint
    print("\n1. Testing GET /schools/")
    try:
        response = client.get("/schools/")
        if response.status_code == 200:
            schools = response.json()
            print(f"✅ Schools endpoint works! Found {len(schools)} schools")
            for school in schools[:3]:  # Show first 3
                print(f"   - {school['name']} (ID: {school['id']})")
        else:
            print(f"❌ Schools endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Schools endpoint error: {e}")
    
    # Test all departments endpoint
    print("\n2. Testing GET /schools/departments")
    try:
        response = client.get("/schools/departments")
        if response.status_code == 200:
            departments = response.json()
            print(f"✅ All departments endpoint works! Found {len(departments)} departments")
            for dept in departments[:5]:  # Show first 5
                print(f"   - {dept['name']} (ID: {dept['id']}, School ID: {dept.get('school_id', 'N/A')})")
        else:
            print(f"❌ All departments endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ All departments endpoint error: {e}")
    
    # Test all courses endpoint
    print("\n3. Testing GET /schools/courses")
    try:
        response = client.get("/schools/courses")
        if response.status_code == 200:
            courses = response.json()
            print(f"✅ All courses endpoint works! Found {len(courses)} courses")
            for course in courses[:5]:  # Show first 5
                print(f"   - {course['name']} (ID: {course['id']}, Dept ID: {course.get('department_id', 'N/A')})")
        else:
            print(f"❌ All courses endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ All courses endpoint error: {e}")
    
    # Test departments by school
    print("\n4. Testing GET /schools/1/departments")
    try:
        response = client.get("/schools/1/departments")
        if response.status_code == 200:
            departments = response.json()
            print(f"✅ Departments by school endpoint works! Found {len(departments)} departments for school 1")
            for dept in departments:
                print(f"   - {dept['name']} (ID: {dept['id']})")
        else:
            print(f"❌ Departments by school endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Departments by school endpoint error: {e}")
    
    # Test courses by department
    print("\n5. Testing GET /schools/departments/1/courses")
    try:
        response = client.get("/schools/departments/1/courses")
        if response.status_code == 200:
            courses = response.json()
            print(f"✅ Courses by department endpoint works! Found {len(courses)} courses for department 1")
            for course in courses:
                print(f"   - {course['name']} ({course['duration_years']} years)")
        else:
            print(f"❌ Courses by department endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Courses by department endpoint error: {e}")
    
    print("\n🎯 Test Summary:")
    print("If all endpoints show ✅, the frontend should be able to:")
    print("1. Load schools")
    print("2. Load all departments (for filtering)")
    print("3. Load all courses (for filtering)")
    print("4. Filter departments by selected school")
    print("5. Filter courses by selected department")

if __name__ == "__main__":
    test_endpoints()
