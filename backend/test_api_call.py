#!/usr/bin/env python3

"""
Test the exact API call that the frontend makes
"""

import asyncio
import sys
sys.path.append('.')

from ai_assistant import ai_assistant_service
from models import AIConversation, AIMessage
from database import SessionLocal
from datetime import datetime

async def test_api_call():
    print("🧪 Testing API Call Simulation...")
    print("=" * 50)
    
    # Simulate the exact process in ai_assistant_routes.py
    db = SessionLocal()
    
    try:
        # Step 1: Create a test conversation (like frontend does)
        print("1. Creating test conversation...")
        test_user_id = 1  # Assuming user with ID 1 exists
        conversation = ai_assistant_service.create_conversation(
            db, 
            type('User', (), {'id': test_user_id})(), 
            "Test Conversation"
        )
        print(f"   ✅ Conversation created: ID {conversation.id}")
        
        # Step 2: Add user message (like frontend does)
        print("2. Adding user message...")
        user_message = ai_assistant_service.add_message(
            db, conversation.id, "Hello, can you help me study?", "user"
        )
        print(f"   ✅ User message added: ID {user_message.id}")
        
        # Step 3: Get conversation history (like backend does)
        print("3. Getting conversation history...")
        messages = ai_assistant_service.get_conversation_messages(db, conversation.id)
        conversation_history = [
            {
                "sender_type": msg.sender_type,
                "content": msg.content
            }
            for msg in messages[:-1]  # Exclude the just-added user message
        ]
        print(f"   ✅ History retrieved: {len(conversation_history)} messages")
        
        # Step 4: Prepare user context (like backend does)
        print("4. Preparing user context...")
        user_context = {
            "name": "Test Student",
            "course": "Computer Science", 
            "semester": "3",
            "department": "Computer Science"
        }
        print(f"   ✅ User context prepared")
        
        # Step 5: Get AI response (like backend does)
        print("5. Getting AI response...")
        ai_response_content = await ai_assistant_service.get_ai_response(
            "Hello, can you help me study?",
            conversation_history,
            user_context
        )
        print(f"   ✅ AI response received: {len(ai_response_content)} characters")
        print(f"   Preview: {ai_response_content[:100]}...")
        
        # Step 6: Save AI response (like backend does)
        print("6. Saving AI response...")
        ai_message = ai_assistant_service.add_message(
            db, conversation.id, ai_response_content, "ai"
        )
        print(f"   ✅ AI message saved: ID {ai_message.id}")
        
        # Step 7: Format response (like backend does)
        print("7. Formatting API response...")
        api_response = {
            "user_message": user_message,
            "ai_message": ai_message
        }
        print(f"   ✅ API response formatted")
        
        # Step 8: Test the response format
        print("8. Testing response format...")
        print(f"   user_message.id: {api_response['user_message'].id}")
        print(f"   user_message.content: {api_response['user_message'].content}")
        print(f"   ai_message.id: {api_response['ai_message'].id}")
        print(f"   ai_message.content: {api_response['ai_message'].content[:50]}...")
        
        # Step 9: Clean up
        print("9. Cleaning up...")
        ai_assistant_service.delete_conversation(db, conversation.id, test_user_id)
        print("   ✅ Test conversation deleted")
        
        print("\n🎉 API Call Test Complete!")
        print("The backend API is working correctly.")
        print("If the frontend isn't showing responses, check:")
        print("1. Browser console for JavaScript errors")
        print("2. Network tab for failed API requests")
        print("3. Authentication token validity")
        print("4. Frontend state management")
        
    except Exception as e:
        print(f"❌ Error during test: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_api_call())
