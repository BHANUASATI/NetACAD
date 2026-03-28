#!/usr/bin/env python3
"""
Script to create an admin user in the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, Admin
from security import get_password_hash
from config import settings

def create_admin_user():
    """Create an admin user with default credentials"""
    
    # Database connection
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.email == "admin@university.edu.in").first()
        if existing_admin:
            print("Admin user already exists!")
            print(f"Email: admin@university.edu.in")
            print("Password: admin123")
            return
        
        # Create admin user
        admin_password = "admin123"
        hashed_password = get_password_hash(admin_password)
        
        # Create user account
        admin_user = User(
            email="admin@university.edu.in",
            password_hash=hashed_password,
            is_active=True,
            role="admin"
        )
        db.add(admin_user)
        db.flush()  # Get the user ID
        
        # Create admin profile
        admin_profile = Admin(
            user_id=admin_user.id,
            employee_id="ADMIN001",
            first_name="System",
            last_name="Administrator",
            phone="+1234567890",
            department="IT Administration",
            designation="System Administrator",
            specialization="System Administration",
            is_active=True,
            can_manage_users=True,
            can_manage_departments=True,
            can_view_reports=True,
            can_manage_system=True
        )
        db.add(admin_profile)
        
        db.commit()
        
        print("✅ Admin user created successfully!")
        print("=" * 50)
        print("📧 Email: admin@university.edu.in")
        print("🔑 Password: admin123")
        print("=" * 50)
        print("⚠️  Please change the password after first login!")
        print("🌐 Login URL: http://localhost:3000/login")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating admin user: {str(e)}")
        return False
        
    finally:
        db.close()
    
    return True

if __name__ == "__main__":
    print("🚀 Creating admin user...")
    create_admin_user()
