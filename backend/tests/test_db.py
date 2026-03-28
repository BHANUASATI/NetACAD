"""
Test script to check database and create users manually
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from models import Base, User, UserRole
from auth import get_password_hash
from config import settings

# Create database engine
engine = create_engine(settings.DATABASE_URL)

# Create all tables
Base.metadata.create_all(bind=engine)

# Create session
from sqlalchemy.orm import sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def check_users():
    """Check existing users"""
    users = db.query(User).all()
    print(f"Total users in database: {len(users)}")
    for user in users:
        print(f"User: {user.email}, Role: {user.role}")

def create_user_directly():
    """Create a user directly without bcrypt complications"""
    try:
        # Create a simple user with hardcoded hash for "pass123"
        # This is a simple hash for testing - in production use proper bcrypt
        import hashlib
        password = "pass123"
        # Using SHA-256 for now (in production, use bcrypt)
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        user = User(
            email="student@university.edu.in",
            password_hash=password_hash,  # Will be updated to use proper hash later
            first_name="Rahul",
            last_name="Kumar Sharma",
            role=UserRole.STUDENT,
            enrollment_number="2021CS001",
            course="Computer Science",
            semester=5,
            batch="2021-2025",
            advisor="Dr. Priya Sharma"
        )
        
        db.add(user)
        db.commit()
        print("User created successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()

if __name__ == "__main__":
    print("Checking existing users...")
    check_users()
    
    print("\nCreating test user...")
    create_user_directly()
    
    print("\nFinal user count:")
    check_users()
