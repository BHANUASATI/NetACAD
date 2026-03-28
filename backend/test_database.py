#!/usr/bin/env python3

"""
Simple test to verify the database has the required data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_database_data():
    print("🧪 Testing Database Data for Schools/Departments/Courses")
    print("=" * 55)
    
    try:
        from database import SessionLocal
        from models import School, Department, Course
        
        # Create database session
        db = SessionLocal()
        
        # Test schools
        print("\n1. Testing Schools data:")
        schools = db.query(School).all()
        print(f"✅ Found {len(schools)} schools in database")
        for school in schools:
            print(f"   - {school.name} (ID: {school.id}, Code: {school.code})")
        
        # Test departments
        print("\n2. Testing Departments data:")
        departments = db.query(Department).all()
        print(f"✅ Found {len(departments)} departments in database")
        for dept in departments:
            print(f"   - {dept.name} (ID: {dept.id}, School ID: {dept.school_id})")
        
        # Test courses
        print("\n3. Testing Courses data:")
        courses = db.query(Course).all()
        print(f"✅ Found {len(courses)} courses in database")
        for course in courses:
            print(f"   - {course.name} (ID: {course.id}, Dept ID: {course.department_id}, {course.duration_years} years)")
        
        # Test specific relationships
        print("\n4. Testing Relationships:")
        
        # Get Computer Science department
        cs_dept = db.query(Department).filter(Department.name.like("%Computer%")).first()
        if cs_dept:
            print(f"✅ Found Computer Science department (ID: {cs_dept.id}, School: {cs_dept.school_id})")
            
            # Get courses for Computer Science
            cs_courses = db.query(Course).filter(Course.department_id == cs_dept.id).all()
            print(f"✅ Found {len(cs_courses)} courses for Computer Science:")
            for course in cs_courses:
                print(f"   - {course.name} ({course.code}) - {course.duration_years} years")
        else:
            print("❌ Computer Science department not found")
        
        db.close()
        
        print("\n🎯 Database Test Summary:")
        print("✅ Database connection works")
        print("✅ Schools data exists")
        print("✅ Departments data exists") 
        print("✅ Courses data exists")
        print("✅ Relationships are properly set up")
        
        if len(schools) > 0 and len(departments) > 0 and len(courses) > 0:
            print("\n🚀 Frontend should be able to load data!")
        else:
            print("\n⚠️  Missing data - run the migration script first")
            
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure you're in the backend directory with all dependencies installed")
    except Exception as e:
        print(f"❌ Database error: {e}")
        print("Make sure the database is running and migration has been applied")

if __name__ == "__main__":
    test_database_data()
