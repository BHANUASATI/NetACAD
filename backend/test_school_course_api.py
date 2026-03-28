"""
Test script for School, Department, and Course functionality
This script tests the new hierarchical structure for student registration
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8002"

def test_api_endpoints():
    """Test the new API endpoints"""
    
    # Test login first to get token
    login_data = {
        "email": "admin@university.edu.in",
        "password": "admin123"
    }
    
    try:
        # Login
        print("Testing login...")
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if login_response.status_code == 200:
            token = login_response.json().get("access_token")
            headers = {"Authorization": f"Bearer {token}"}
            print("✓ Login successful")
        else:
            print("✗ Login failed")
            return
        
        # Test schools endpoint
        print("\nTesting schools endpoint...")
        schools_response = requests.get(f"{BASE_URL}/schools/", headers=headers)
        if schools_response.status_code == 200:
            schools = schools_response.json()
            print(f"✓ Found {len(schools)} schools")
            for school in schools:
                print(f"  - {school['name']} ({school['code']})")
        else:
            print(f"✗ Schools endpoint failed: {schools_response.status_code}")
        
        # Test departments endpoint
        print("\nTesting departments endpoint...")
        departments_response = requests.get(f"{BASE_URL}/schools/departments", headers=headers)
        if departments_response.status_code == 200:
            departments = departments_response.json()
            print(f"✓ Found {len(departments)} departments")
            for dept in departments[:5]:  # Show first 5
                print(f"  - {dept['name']} ({dept['code']}) - School ID: {dept['school_id']}")
        else:
            print(f"✗ Departments endpoint failed: {departments_response.status_code}")
        
        # Test courses endpoint
        print("\nTesting courses endpoint...")
        courses_response = requests.get(f"{BASE_URL}/schools/departments/courses", headers=headers)
        if courses_response.status_code == 200:
            courses = courses_response.json()
            print(f"✓ Found {len(courses)} courses")
            for course in courses[:5]:  # Show first 5
                print(f"  - {course['name']} ({course['code']}) - Dept ID: {course['department_id']}")
        else:
            print(f"✗ Courses endpoint failed: {courses_response.status_code}")
        
        # Test creating a sample school
        print("\nTesting school creation...")
        school_data = {
            "name": "Test School",
            "code": "TEST",
            "type": "engineering_technology",
            "description": "Test school for verification"
        }
        
        create_school_response = requests.post(f"{BASE_URL}/schools/", json=school_data, headers=headers)
        if create_school_response.status_code == 200:
            new_school = create_school_response.json()
            print(f"✓ Created school: {new_school['name']} (ID: {new_school['id']})")
            
            # Test creating a department in the new school
            dept_data = {
                "name": "Test Department",
                "code": "TDEPT",
                "type": "computer_science",
                "description": "Test department"
            }
            
            create_dept_response = requests.post(f"{BASE_URL}/schools/{new_school['id']}/departments", json=dept_data, headers=headers)
            if create_dept_response.status_code == 200:
                new_dept = create_dept_response.json()
                print(f"✓ Created department: {new_dept['name']} (ID: {new_dept['id']})")
                
                # Test creating a course in the new department
                course_data = {
                    "name": "Test Course",
                    "code": "TCOURSE",
                    "type": "undergraduate",
                    "description": "Test course",
                    "duration_years": 4
                }
                
                create_course_response = requests.post(f"{BASE_URL}/schools/departments/{new_dept['id']}/courses", json=course_data, headers=headers)
                if create_course_response.status_code == 200:
                    new_course = create_course_response.json()
                    print(f"✓ Created course: {new_course['name']} (ID: {new_course['id']})")
                else:
                    print(f"✗ Course creation failed: {create_course_response.status_code}")
            else:
                print(f"✗ Department creation failed: {create_dept_response.status_code}")
        else:
            print(f"✗ School creation failed: {create_school_response.status_code}")
        
        print("\n✓ All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("✗ Could not connect to the API server. Make sure the server is running on localhost:8002")
    except Exception as e:
        print(f"✗ Test failed with error: {str(e)}")

if __name__ == "__main__":
    test_api_endpoints()
