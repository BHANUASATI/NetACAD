#!/usr/bin/env python3

"""
Test script to verify AI Assistant functionality
"""

import sys
import os
sys.path.append('.')

from ai_assistant import ai_assistant_service
from models import User, UserRole
from database import get_db, SessionLocal
from datetime import datetime

def test_ai_assistant():
    """Test AI Assistant functionality"""
    print("🤖 Testing AI Assistant...")
    
    # Test 1: Check OpenAI configuration
    from config import settings
    if not settings.OPENAI_API_KEY:
        print("❌ OpenAI API key not configured")
        return False
    print("✅ OpenAI API key configured")
    
    # Test 2: Test AI response generation
    try:
        import asyncio
        
        async def test_ai_response():
            response = await ai_assistant_service.get_ai_response(
                "Hello, can you help me with my studies?",
                [],
                {"name": "Test Student", "course": "Computer Science", "semester": "3"}
            )
            print(f"✅ AI Response: {response[:100]}...")
            return True
        
        # Run async test
        result = asyncio.run(test_ai_response())
        if not result:
            return False
            
    except Exception as e:
        print(f"❌ AI Response Test Failed: {e}")
        return False
    
    # Test 3: Test database operations
    try:
        db = SessionLocal()
        
        # Create a test user (if not exists)
        test_user = db.query(User).filter(User.email == "test.student@university.edu.in").first()
        if not test_user:
            test_user = User(
                email="test.student@university.edu.in",
                password_hash="test123",
                first_name="Test",
                last_name="Student",
                role=UserRole.STUDENT,
                is_active=True
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print("✅ Test user created")
        
        # Test conversation creation
        conversation = ai_assistant_service.create_conversation(
            db, test_user, "Test Conversation"
        )
        print(f"✅ Conversation created: ID {conversation.id}")
        
        # Test message addition
        message = ai_assistant_service.add_message(
            db, conversation.id, "Hello AI!", "user"
        )
        print(f"✅ Message added: ID {message.id}")
        
        # Test getting messages
        messages = ai_assistant_service.get_conversation_messages(db, conversation.id)
        print(f"✅ Retrieved {len(messages)} messages")
        
        # Test getting user conversations
        conversations = ai_assistant_service.get_user_conversations(db, test_user.id)
        print(f"✅ Retrieved {len(conversations)} conversations")
        
        # Clean up
        ai_assistant_service.delete_conversation(db, conversation.id, test_user.id)
        print("✅ Test conversation deleted")
        
        db.close()
        
    except Exception as e:
        print(f"❌ Database Test Failed: {e}")
        return False
    
    print("🎉 All AI Assistant tests passed!")
    return True

if __name__ == "__main__":
    success = test_ai_assistant()
    sys.exit(0 if success else 1)
