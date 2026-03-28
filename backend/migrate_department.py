from sqlalchemy import create_engine, text
from config import settings

def migrate_department_table():
    """Add type column to departments table"""
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            conn.execute(text("""
                ALTER TABLE departments 
                ADD COLUMN type ENUM('computer_science', 'mechanical', 'electrical', 'civil', 'chemical', 'electronics', 'business', 'physics', 'chemistry', 'mathematics') 
                DEFAULT 'computer_science'
            """))
            print("Added type column to departments table")
        except Exception as e:
            if "Duplicate column name" in str(e):
                print("Type column already exists in departments table")
            else:
                print(f"Error adding type column: {e}")
        
        # Update existing departments to have correct types
        department_updates = [
            (1, 'computer_science'),  # Computer Science
            (2, 'mechanical'),        # Mechanical Engineering
            (3, 'electrical'),        # Electrical Engineering
        ]
        
        for dept_id, dept_type in department_updates:
            try:
                conn.execute(text("UPDATE departments SET type = :type WHERE id = :id"), 
                           {"type": dept_type, "id": dept_id})
                print(f"Updated department {dept_id} to type {dept_type}")
            except Exception as e:
                print(f"Error updating department {dept_id}: {e}")
        
        conn.commit()
        print("Department table migration completed!")

if __name__ == "__main__":
    migrate_department_table()
