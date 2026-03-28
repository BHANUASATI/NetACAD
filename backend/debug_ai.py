#!/usr/bin/env python3

"""
Debug script to check AI assistant functionality
"""

import asyncio
import sys
sys.path.append('.')

from ai_assistant import ai_assistant_service
from config import settings

async def debug_ai():
    print("🔍 Debugging AI Assistant...")
    print("=" * 50)
    
    # Check 1: Configuration
    print("1. Configuration Check:")
    print(f"   Gemini API Key configured: {bool(settings.GEMINI_API_KEY)}")
    print(f"   API Key starts with: {settings.GEMINI_API_KEY[:10] if settings.GEMINI_API_KEY else 'None'}...")
    print()
    
    # Check 2: Service Initialization
    print("2. Service Initialization:")
    print(f"   API Available: {ai_assistant_service.api_available}")
    print(f"   Model: {ai_assistant_service.model.model_name if ai_assistant_service.model else 'None'}")
    print()
    
    # Check 3: Test Response
    print("3. Testing AI Response:")
    try:
        response = await ai_assistant_service.get_ai_response(
            "Hello, this is a test message",
            [],
            {"name": "Test Student", "course": "Computer Science"}
        )
        print(f"   ✅ Response received: {len(response)} characters")
        print(f"   Response preview: {response[:100]}...")
        
        # Check if it's a fallback response
        if "technical difficulties" in response.lower():
            print("   ⚠️  This is a fallback response (API quota exceeded)")
        else:
            print("   🎉 This is a real AI response!")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    print()
    print("4. Backend Server Status:")
    try:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:8000/docs", timeout=5.0)
            if response.status_code == 200:
                print("   ✅ Backend server is running")
            else:
                print(f"   ❌ Backend server status: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Backend server not accessible: {e}")
    
    print()
    print("🎯 Troubleshooting Steps:")
    print("1. If API quota exceeded: Enable billing at https://ai.google.dev/")
    print("2. If backend not running: Restart with 'python3 main.py'")
    print("3. If authentication error: Check user login status")
    print("4. If frontend issue: Check browser console for errors")

if __name__ == "__main__":
    asyncio.run(debug_ai())
