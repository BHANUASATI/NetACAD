#!/usr/bin/env python3

"""
Test script to check if real AI responses are working
"""

import asyncio
import sys
sys.path.append('.')

from ai_assistant import ai_assistant_service

async def test_real_ai():
    """Test if real AI responses are working"""
    print("🤖 Testing Real AI Responses...")
    print("=" * 50)
    
    test_questions = [
        "Hello, can you help me with my studies?",
        "What's the best way to study for exams?",
        "How can I manage my time better as a student?",
        "Can you explain machine learning concepts?"
    ]
    
    for i, question in enumerate(test_questions, 1):
        print(f"\n📝 Question {i}: {question}")
        print("-" * 40)
        
        try:
            response = await ai_assistant_service.get_ai_response(
                question,
                [],
                {"name": "Test Student", "course": "Computer Science", "semester": "3"}
            )
            
            # Check if it's a fallback response
            if "technical difficulties" in response.lower() or "currently experiencing" in response.lower():
                print("❌ Fallback Response (API quota exceeded)")
                print(f"Response: {response[:100]}...")
            else:
                print("✅ Real AI Response!")
                print(f"Response: {response[:150]}...")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 To get real AI responses:")
    print("1. Add credits to your OpenAI account: https://platform.openai.com/account/billing")
    print("2. Check your API usage: https://platform.openai.com/account/usage")
    print("3. Minimum $5-10 credits should work for testing")
    print("4. Restart the backend server after adding credits")

if __name__ == "__main__":
    asyncio.run(test_real_ai())
