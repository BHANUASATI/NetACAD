from sqlalchemy import create_engine, text
from config import settings

def migrate_faculty_table():
    """Add missing columns to faculties table"""
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Add role column
        try:
            conn.execute(text("""
                ALTER TABLE faculties 
                ADD COLUMN role ENUM('registrar', 'professor', 'associate_professor', 'assistant_professor', 'lecturer', 'lab_instructor', 'admin_staff') 
                DEFAULT 'lecturer'
            """))
            print("Added role column to faculties table")
        except Exception as e:
            if "Duplicate column name" in str(e):
                print("Role column already exists")
            else:
                print(f"Error adding role column: {e}")
        
        # Add permission columns
        permission_columns = [
            ("can_grade_submissions", "BOOLEAN DEFAULT FALSE"),
            ("can_manage_students", "BOOLEAN DEFAULT FALSE"),
            ("can_generate_reports", "BOOLEAN DEFAULT FALSE"),
            ("can_access_all_departments", "BOOLEAN DEFAULT FALSE")
        ]
        
        for column_name, column_def in permission_columns:
            try:
                conn.execute(text(f"ALTER TABLE faculties ADD COLUMN {column_name} {column_def}"))
                print(f"Added {column_name} column to faculties table")
            except Exception as e:
                if "Duplicate column name" in str(e):
                    print(f"{column_name} column already exists")
                else:
                    print(f"Error adding {column_name} column: {e}")
        
        conn.commit()
        print("Faculty table migration completed!")

if __name__ == "__main__":
    migrate_faculty_table()
