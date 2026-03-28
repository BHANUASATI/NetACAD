#!/usr/bin/env python3
"""
Script to create a registrar user in the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, Faculty
from security import get_password_hash
from config import settings

def create_registrar_user():
    """Create a registrar user with default credentials"""
    
    # Database connection
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if registrar already exists
        existing_registrar = db.query(User).filter(User.email == "registrar@university.edu.in").first()
        if existing_registrar:
            print("Registrar user already exists!")
            print(f"Email: registrar@university.edu.in")
            print("Password: registrar123")
            return
        
        # Create registrar user
        registrar_password = "registrar123"
        hashed_password = get_password_hash(registrar_password)
        
        # Create user account
        registrar_user = User(
            email="registrar@university.edu.in",
            password_hash=hashed_password,
            is_active=True,
            role="faculty"  # Using faculty role for registrar
        )
        db.add(registrar_user)
        db.flush()  # Get the user ID
        
        # Create faculty profile for registrar
        registrar_profile = Faculty(
            user_id=registrar_user.id,
            employee_id="REG001",
            first_name="John",
            last_name="Smith",
            email="registrar@university.edu.in",
            phone="+1234567890",
            department="Registrar Office",
            designation="Registrar",
            specialization="Student Administration",
            is_active=True,
            can_verify_documents=True,
            can_approve_students=True,
            can_manage_documents=True,
            can_view_analytics=True
        )
        db.add(registrar_profile)
        
        db.commit()
        
        print("✅ Registrar user created successfully!")
        print("=" * 50)
        print("📧 Email: registrar@university.edu.in")
        print("🔑 Password: registrar123")
        print("=" * 50)
        print("⚠️  Please change the password after first login!")
        print("🌐 Login URL: http://localhost:3000/login")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating registrar user: {str(e)}")
        return False
        
    finally:
        db.close()
    
    return True

if __name__ == "__main__":
    print("🚀 Creating registrar user...")
    create_registrar_user()
