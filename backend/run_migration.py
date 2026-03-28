#!/usr/bin/env python3

"""
Database migration script for School, Department, and Course structure
Run this script to create the new tables and update existing ones
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, engine
from models import Base
from sqlalchemy import text

def run_migration():
    print("🔄 Running School/Department/Course Migration")
    print("=" * 50)
    
    db = SessionLocal()
    
    try:
        # Create all tables (this will create new ones if they don't exist)
        print("\n1. Creating/Updating tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created/updated successfully")
        
        # Check if schools exist
        print("\n2. Checking schools data...")
        schools_count = db.execute(text("SELECT COUNT(*) FROM schools")).scalar()
        print(f"Found {schools_count} schools")
        
        if schools_count == 0:
            print("Inserting sample schools...")
            db.execute(text("""
                INSERT INTO schools (name, code, type, description) VALUES
                ('School of Engineering and Technology', 'SOET', 'engineering_technology', 'Engineering and Technology programs'),
                ('School of Management Studies', 'SOMS', 'management_studies', 'Business and Management programs'),
                ('School of Sciences', 'SOS', 'sciences', 'Pure and Applied Sciences'),
                ('School of Arts and Humanities', 'SOAH', 'arts_humanities', 'Arts and Humanities programs')
            """))
            print("✅ Sample schools inserted")
        
        # Check if departments have school_id
        print("\n3. Checking departments structure...")
        try:
            result = db.execute(text("SELECT school_id FROM departments LIMIT 1"))
            print("✅ departments.school_id column exists")
        except Exception as e:
            print("❌ departments.school_id column missing - adding it...")
            db.execute(text("ALTER TABLE departments ADD COLUMN school_id INT"))
            print("✅ departments.school_id column added")
        
        # Update existing departments to have school_id if they don't have it
        departments_without_school = db.execute(text("""
            SELECT COUNT(*) FROM departments WHERE school_id IS NULL
        """)).scalar()
        
        if departments_without_school > 0:
            print(f"Updating {departments_without_school} departments to have school_id...")
            db.execute(text("UPDATE departments SET school_id = 1 WHERE school_id IS NULL"))
            print("✅ Departments updated")
        
        # Check if courses table exists
        print("\n4. Checking courses table...")
        try:
            courses_count = db.execute(text("SELECT COUNT(*) FROM courses")).scalar()
            print(f"Found {courses_count} courses")
        except Exception as e:
            print("Creating courses table...")
            db.execute(text("""
                CREATE TABLE courses (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    code VARCHAR(10) NOT NULL UNIQUE,
                    type VARCHAR(50) NOT NULL,
                    description TEXT,
                    department_id INT NOT NULL,
                    duration_years INT DEFAULT 4,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (department_id) REFERENCES departments(id)
                )
            """))
            print("✅ Courses table created")
            courses_count = 0
        
        # Insert sample courses if none exist
        if courses_count == 0:
            print("Inserting sample courses...")
            db.execute(text("""
                INSERT INTO courses (name, code, type, department_id, duration_years, description) VALUES
                ('Bachelor of Computer Applications', 'BCA', 'undergraduate', 1, 3, 'BCA Program - 3 years'),
                ('Master of Computer Applications', 'MCA', 'postgraduate', 1, 2, 'MCA Program - 2 years'),
                ('Bachelor of Technology in Computer Science', 'BTech_CS', 'undergraduate', 1, 4, 'B.Tech Computer Science - 4 years'),
                ('Master of Technology in Computer Science', 'MTech_CS', 'postgraduate', 1, 2, 'M.Tech Computer Science - 2 years'),
                ('Bachelor of Science in Computer Science', 'BSc_CS', 'undergraduate', 1, 3, 'B.Sc Computer Science - 3 years'),
                ('Master of Science in Computer Science', 'MSc_CS', 'postgraduate', 1, 2, 'M.Sc Computer Science - 2 years'),
                ('Diploma in Computer Applications', 'DCA', 'diploma', 1, 1, 'Diploma in Computer Applications - 1 year'),
                ('Post Graduate Diploma in Computer Science', 'PGDCS', 'postgraduate', 1, 1, 'PG Diploma in Computer Science - 1 year'),
                ('Bachelor of Computer Science', 'BCS', 'undergraduate', 1, 3, 'Bachelor of Computer Science - 3 years'),
                ('PhD in Computer Science', 'PhD_CS', 'doctorate', 1, 4, 'PhD in Computer Science - 4 years'),
                ('Bachelor of Business Administration', 'BBA', 'undergraduate', 5, 3, 'BBA Program - 3 years'),
                ('Master of Business Administration', 'MBA', 'postgraduate', 5, 2, 'MBA Program - 2 years')
            """))
            print("✅ Sample courses inserted")
        
        # Check if students have school_id and course_id
        print("\n5. Checking students table...")
        try:
            db.execute(text("SELECT school_id FROM students LIMIT 1"))
            db.execute(text("SELECT course_id FROM students LIMIT 1"))
            print("✅ students.school_id and students.course_id columns exist")
        except Exception as e:
            print("Adding school_id and course_id to students table...")
            db.execute(text("ALTER TABLE students ADD COLUMN school_id INT"))
            db.execute(text("ALTER TABLE students ADD COLUMN course_id INT"))
            print("✅ Columns added to students table")
        
        # Update existing students to have default values
        students_without_school = db.execute(text("""
            SELECT COUNT(*) FROM students WHERE school_id IS NULL
        """)).scalar()
        
        if students_without_school > 0:
            print(f"Updating {students_without_school} students to have default school_id and course_id...")
            db.execute(text("UPDATE students SET school_id = 1, course_id = 1 WHERE school_id IS NULL"))
            print("✅ Students updated")
        
        # Commit all changes
        db.commit()
        print("\n🎉 Migration completed successfully!")
        
        # Show summary
        print("\n📊 Migration Summary:")
        schools = db.execute(text("SELECT COUNT(*) FROM schools")).scalar()
        departments = db.execute(text("SELECT COUNT(*) FROM departments")).scalar()
        courses = db.execute(text("SELECT COUNT(*) FROM courses")).scalar()
        
        print(f"✅ Schools: {schools}")
        print(f"✅ Departments: {departments}")
        print(f"✅ Courses: {courses}")
        
        print("\n🚀 Frontend should now be able to:")
        print("1. Load schools from /schools/")
        print("2. Load departments from /schools/departments")
        print("3. Load courses from /schools/courses")
        print("4. Filter departments by school")
        print("5. Filter courses by department")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    run_migration()
