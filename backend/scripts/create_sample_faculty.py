from sqlalchemy import create_engine, text
from config import settings
import bcrypt

def create_sample_faculty():
    """Create sample faculty members with different roles"""
    engine = create_engine(settings.DATABASE_URL)
    
    # Sample faculty data
    faculty_data = [
        {
            'employee_id': 'REG001',
            'first_name': 'John',
            'last_name': 'Smith',
            'email': 'registrar@university.edu.in',
            'password': 'registrar123',
            'role': 'registrar',
            'designation': 'Registrar',
            'specialization': 'Academic Administration',
            'department_id': 1  # Computer Science
        },
        {
            'employee_id': 'PROF001',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'email': 'staff@university.edu.in',
            'password': 'professor123',
            'role': 'professor',
            'designation': 'Professor',
            'specialization': 'Artificial Intelligence',
            'department_id': 1  # Computer Science
        },
        {
            'employee_id': 'MECH001',
            'first_name': 'Michael',
            'last_name': 'Brown',
            'email': 'mechanical.staff@university.edu.in',
            'password': 'mechanical123',
            'role': 'associate_professor',
            'designation': 'Associate Professor',
            'specialization': 'Thermodynamics',
            'department_id': 2  # Mechanical
        },
        {
            'employee_id': 'ELEC001',
            'first_name': 'Emily',
            'last_name': 'Davis',
            'email': 'electrical.staff@university.edu.in',
            'password': 'electrical123',
            'role': 'assistant_professor',
            'designation': 'Assistant Professor',
            'specialization': 'Circuit Design',
            'department_id': 3  # Electrical
        },
        {
            'employee_id': 'LECT001',
            'first_name': 'David',
            'last_name': 'Wilson',
            'email': 'lecturer.staff@university.edu.in',
            'password': 'lecturer123',
            'role': 'lecturer',
            'designation': 'Lecturer',
            'specialization': 'Database Systems',
            'department_id': 1  # Computer Science
        },
        {
            'employee_id': 'LAB001',
            'first_name': 'Lisa',
            'last_name': 'Anderson',
            'email': 'lab.staff@university.edu.in',
            'password': 'lab123',
            'role': 'lab_instructor',
            'designation': 'Lab Instructor',
            'specialization': 'Network Lab',
            'department_id': 1  # Computer Science
        },
        {
            'employee_id': 'ADMIN001',
            'first_name': 'Robert',
            'last_name': 'Taylor',
            'email': 'admin.staff@university.edu.in',
            'password': 'adminstaff123',
            'role': 'admin_staff',
            'designation': 'Administrative Staff',
            'specialization': 'Student Records',
            'department_id': 1  # Computer Science
        }
    ]
    
    with engine.connect() as conn:
        for faculty in faculty_data:
            try:
                # Check if faculty already exists
                result = conn.execute(text("SELECT id FROM faculties WHERE employee_id = :employee_id"), 
                                      {"employee_id": faculty['employee_id']})
                if result.fetchone():
                    print(f"Faculty {faculty['employee_id']} already exists")
                    continue
                
                # Create user account
                hashed_password = bcrypt.hashpw(faculty['password'].encode('utf-8'), bcrypt.gensalt())
                
                # Insert user
                conn.execute(text("""
                    INSERT INTO users (email, password_hash, role, is_active, created_at, updated_at)
                    VALUES (:email, :password, 'faculty', true, NOW(), NOW())
                """), {
                    "email": faculty['email'],
                    "password": hashed_password.decode('utf-8')
                })
                
                # Get user ID
                result = conn.execute(text("SELECT id FROM users WHERE email = :email"), 
                                      {"email": faculty['email']})
                user_id = result.fetchone()[0]
                
                # Insert faculty with permissions
                conn.execute(text("""
                    INSERT INTO faculties (
                        user_id, employee_id, first_name, last_name, phone, email,
                        specialization, designation, role, department_id, is_active,
                        can_verify_documents, can_assign_tasks, can_grade_submissions,
                        can_manage_students, can_generate_reports, can_access_all_departments,
                        created_at, updated_at
                    ) VALUES (
                        :user_id, :employee_id, :first_name, :last_name, :phone, :email,
                        :specialization, :designation, :role, :department_id, :is_active,
                        :can_verify_documents, :can_assign_tasks, :can_grade_submissions,
                        :can_manage_students, :can_generate_reports, :can_access_all_departments,
                        NOW(), NOW()
                    )
                """), {
                    "user_id": user_id,
                    "employee_id": faculty['employee_id'],
                    "first_name": faculty['first_name'],
                    "last_name": faculty['last_name'],
                    "phone": None,
                    "email": faculty['email'],
                    "specialization": faculty['specialization'],
                    "designation": faculty['designation'],
                    "role": faculty['role'],
                    "department_id": faculty['department_id'],
                    "is_active": True,
                    "can_verify_documents": True if faculty['role'] in ['registrar', 'professor', 'associate_professor', 'assistant_professor', 'admin_staff'] else False,
                    "can_assign_tasks": True if faculty['role'] in ['registrar', 'professor', 'associate_professor', 'assistant_professor', 'lecturer', 'lab_instructor'] else False,
                    "can_grade_submissions": True if faculty['role'] in ['professor', 'associate_professor', 'assistant_professor', 'lecturer', 'lab_instructor'] else False,
                    "can_manage_students": True if faculty['role'] == 'registrar' else False,
                    "can_generate_reports": True if faculty['role'] in ['registrar', 'professor', 'admin_staff'] else False,
                    "can_access_all_departments": True if faculty['role'] in ['registrar', 'admin_staff'] else False
                })
                
                print(f"Created faculty: {faculty['first_name']} {faculty['last_name']} ({faculty['role']})")
                
            except Exception as e:
                print(f"Error creating faculty {faculty['employee_id']}: {e}")

if __name__ == "__main__":
    create_sample_faculty()
    print("Sample faculty creation completed!")
