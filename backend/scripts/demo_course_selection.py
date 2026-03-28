"""
Demonstration script to show course selection functionality
This script shows how the registrar can select specific courses for students
"""

import requests
import json

BASE_URL = "http://localhost:8002"

def demo_course_selection():
    """Demonstrate the course selection workflow"""
    
    # Login as admin
    login_data = {
        "email": "admin@university.edu.in", 
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if login_response.status_code != 200:
            print("❌ Login failed. Please check admin credentials.")
            return
        
        token = login_response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        print("🎓 Course Selection Demonstration")
        print("=" * 50)
        
        # Step 1: Get all schools
        print("\n📚 Step 1: Available Schools")
        schools_response = requests.get(f"{BASE_URL}/schools/", headers=headers)
        schools = schools_response.json()
        
        for i, school in enumerate(schools, 1):
            print(f"  {i}. {school['name']} ({school['code']})")
        
        # Step 2: Show departments for School of Engineering and Technology
        soet_id = 1  # Assuming SOET has ID 1
        print(f"\n🏢 Step 2: Departments in School of Engineering and Technology")
        
        depts_response = requests.get(f"{BASE_URL}/schools/{soet_id}/departments", headers=headers)
        departments = depts_response.json()
        
        for i, dept in enumerate(departments, 1):
            print(f"  {i}. {dept['name']} ({dept['code']})")
        
        # Step 3: Show courses for Computer Science department
        cs_dept_id = 1  # Assuming CS has ID 1
        print(f"\n🎯 Step 3: Available Courses in Computer Science Department")
        
        courses_response = requests.get(f"{BASE_URL}/schools/departments/{cs_dept_id}/courses", headers=headers)
        courses = courses_response.json()
        
        print("   Popular Computer Science Courses:")
        for course in courses:
            if 'Computer' in course['name'] or 'Applications' in course['name']:
                print(f"   • {course['name']} ({course['duration_years']} years) - {course['type']}")
        
        # Step 4: Demonstrate creating a student with specific course
        print(f"\n👤 Step 4: Creating Student with BCA Course")
        
        student_data = {
            "enrollment_number": "DEMO2024001",
            "first_name": "Demo",
            "last_name": "Student",
            "email": "demo.student@university.edu.in",
            "password": "demo123",
            "phone": "+1234567890",
            "school_id": 1,  # SOET
            "department_id": 1,  # Computer Science
            "course_id": 1,  # BCA (assuming BCA has ID 1)
            "semester": 1,
            "admission_year": 2024
        }
        
        create_response = requests.post(f"{BASE_URL}/students/", json=student_data, headers=headers)
        if create_response.status_code == 200:
            student = create_response.json()
            print(f"   ✅ Student created successfully!")
            print(f"   📋 Student ID: {student['id']}")
            print(f"   🎓 Course: BCA (Bachelor of Computer Applications)")
            print(f"   🏫 School: School of Engineering and Technology")
            print(f"   🏢 Department: Computer Science")
        else:
            print(f"   ❌ Student creation failed: {create_response.status_code}")
            if create_response.status_code == 400:
                errors = create_response.json()
                print(f"   Error details: {errors}")
        
        # Step 5: Show other popular course combinations
        print(f"\n🔄 Step 5: Other Popular Course Combinations")
        print("   Here are some examples of what students can choose:")
        
        # Get Business Admin courses
        ba_dept_id = 6  # Business Admin
        ba_courses_response = requests.get(f"{BASE_URL}/schools/departments/{ba_dept_id}/courses", headers=headers)
        ba_courses = ba_courses_response.json()
        
        print("   📊 Business Administration Courses:")
        for course in ba_courses:
            if 'Business' in course['name'] or 'Administration' in course['name'] or 'Commerce' in course['name']:
                print(f"   • {course['name']} ({course['duration_years']} years) - {course['type']}")
        
        # Get Physics courses
        physics_dept_id = 8  # Physics
        physics_courses_response = requests.get(f"{BASE_URL}/schools/departments/{physics_dept_id}/courses", headers=headers)
        physics_courses = physics_courses_response.json()
        
        print("\n   🔬 Physics Courses:")
        for course in physics_courses:
            print(f"   • {course['name']} ({course['duration_years']} years) - {course['type']}")
        
        print(f"\n✨ Course Selection Summary:")
        print("   • Registrar selects School → Department → Course")
        print("   • Each course shows duration and type")
        print("   • Options are dynamically filtered")
        print("   • Student's choice is saved to database")
        print("   • Perfect for BCA, MCA, BTech, MBA, BSc, MSc, etc.")
        
        print(f"\n🎉 Demonstration Complete!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server. Please ensure the backend is running on localhost:8002")
    except Exception as e:
        print(f"❌ Error during demonstration: {str(e)}")

if __name__ == "__main__":
    demo_course_selection()
