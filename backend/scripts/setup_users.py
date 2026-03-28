"""
Create all test users for the university system
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from models import Base, User, UserRole
from auth import get_password_hash
from config import settings
import hashlib

# Create database engine
engine = create_engine(settings.DATABASE_URL)

# Create all tables
Base.metadata.create_all(bind=engine)

# Create session
from sqlalchemy.orm import sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def create_all_users():
    """Create all test users"""
    
    # Check if users already exist, if so, just return
    existing_users = db.query(User).all()
    if existing_users:
        print(f"Found {len(existing_users)} existing users. Skipping user creation.")
        for user in existing_users:
            print(f"Existing user: {user.email}")
        return
    
    # Sample users
    users_data = [
        {
            "email": "student@university.edu.in",
            "first_name": "Rahul",
            "last_name": "Kumar Sharma",
            "role": UserRole.STUDENT,
            "enrollment_number": "2021CS001",
            "course": "Computer Science",
            "semester": 5,
            "batch": "2021-2025",
            "advisor": "Dr. Priya Sharma"
        },
        {
            "email": "faculty@university.edu.in",
            "first_name": "Priya",
            "last_name": "Sharma",
            "role": UserRole.FACULTY,
            "department": "Computer Science",
            "employee_id": "FAC001"
        },
        {
            "email": "admin@university.edu.in",
            "first_name": "System",
            "last_name": "Administrator",
            "role": UserRole.ADMIN
        },
        {
            "email": "john.smith@university.edu.in",
            "first_name": "John",
            "last_name": "Smith",
            "role": UserRole.FACULTY,
            "department": "Registrar Office",
            "employee_id": "REG001"
        }
    ]
    
    # Create users
    for user_data in users_data:
        try:
            # Use different password for registrar user as mentioned in login form
            if user_data["email"] == "john.smith@university.edu.in":
                password_hash = get_password_hash("registrar123")
            else:
                password_hash = get_password_hash("pass123")
            
            user = User(
                password_hash=password_hash,
                **user_data
            )
            
            db.add(user)
            print(f"Created user: {user.email}")
        except Exception as e:
            print(f"Error creating user {user_data.get('email', 'unknown')}: {e}")
            continue
    
    # Commit to database
    try:
        db.commit()
        print("All users created successfully!")
    except Exception as e:
        print(f"Error committing to database: {e}")
        db.rollback()

if __name__ == "__main__":
    try:
        create_all_users()
        print("Database setup completed!")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()
