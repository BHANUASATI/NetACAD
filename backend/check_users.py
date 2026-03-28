#!/usr/bin/env python3

"""
Check existing users in the database
"""

import sys
sys.path.append('.')

from database import SessionLocal
from models import User, UserRole

def check_users():
    print("👥 Checking Database Users...")
    print("=" * 40)
    
    db = SessionLocal()
    
    try:
        users = db.query(User).all()
        print(f"Total users found: {len(users)}")
        
        for user in users:
            print(f"\n📋 User ID: {user.id}")
            print(f"   Email: {user.email}")
            print(f"   Role: {user.role}")
            print(f"   Active: {user.is_active}")
            
            # Check if user has student-specific fields
            if hasattr(user, 'first_name') and user.first_name:
                print(f"   Name: {user.first_name} {user.last_name}")
                print(f"   Course: {getattr(user, 'course', 'N/A')}")
                print(f"   Semester: {getattr(user, 'semester', 'N/A')}")
            elif hasattr(user, 'name') and user.name:
                print(f"   Name: {user.name}")
            else:
                print(f"   Name: Not available")
        
        print("\n" + "=" * 40)
        print("💡 Login Credentials:")
        print("• Use the email and password of any active user")
        print("• Students can access AI assistant")
        print("• Faculty/Admins cannot access AI assistant")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_users()
