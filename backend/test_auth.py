#!/usr/bin/env python3

"""
Test authentication for AI assistant endpoints
"""

import requests
import json

def test_ai_endpoints():
    print("🔐 Testing AI Assistant Authentication...")
    print("=" * 50)
    
    base_url = "http://localhost:8000"
    
    # Test 1: Check if server is running
    print("1. Checking server status...")
    try:
        response = requests.get(f"{base_url}/docs")
        if response.status_code == 200:
            print("   ✅ Server is running")
        else:
            print(f"   ❌ Server status: {response.status_code}")
            return
    except Exception as e:
        print(f"   ❌ Server not accessible: {e}")
        return
    
    # Test 2: Try to login as a student
    print("\n2. Testing student login...")
    
    # Try different student credentials
    student_credentials = [
        {"email": "student@university.edu.in", "password": "password123"},
        {"email": "student@university.edu.in", "password": "student123"},
        {"email": "rahul.kumar@university.edu.in", "password": "password123"},
        {"email": "priya.sharma@university.edu.in", "password": "password123"},
        {"email": "bhanu@university.edu.in", "password": "password123"},
    ]
    
    token = None
    for creds in student_credentials:
        try:
            response = requests.post(f"{base_url}/api/auth/login", json=creds)
            print(f"   Trying {creds['email']} - Status: {response.status_code}")
            
            if response.status_code == 200:
                token_data = response.json()
                token = token_data.get("access_token")
                print(f"   ✅ Login successful with {creds['email']}!")
                print(f"   Token: {token[:30] if token else 'None'}...")
                break
            else:
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail.get('detail', 'Unknown error')}")
                except:
                    print(f"   Error: {response.text}")
        except Exception as e:
            print(f"   Request failed: {e}")
    
    if not token:
        print("   ❌ All login attempts failed")
        print("   💡 You need to log in to the frontend first with correct credentials")
        return
    
    # Test 3: Use token to access AI endpoint
    print("\n3. Testing AI endpoint with token...")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test creating a conversation
    conv_data = {"title": "Test Conversation"}
    response = requests.post(f"{base_url}/api/ai/conversations", json=conv_data, headers=headers)
    print(f"   Create conversation status: {response.status_code}")
    
    if response.status_code == 200:
        conv = response.json()
        conv_id = conv.get("id")
        print(f"   ✅ Conversation created: ID {conv_id}")
        
        # Test sending a message
        print("\n4. Testing sending message...")
        msg_data = {"content": "Hello, can you help me study?"}
        response = requests.post(f"{base_url}/api/ai/conversations/{conv_id}/messages", json=msg_data, headers=headers)
        print(f"   Send message status: {response.status_code}")
        
        if response.status_code == 200:
            msg_response = response.json()
            print("   ✅ Message sent successfully!")
            print(f"   User message: {msg_response.get('user_message', {}).get('content', 'N/A')}")
            print(f"   AI response: {msg_response.get('ai_message', {}).get('content', 'N/A')[:100]}...")
        else:
            print(f"   ❌ Send message failed: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"   Error detail: {error_detail}")
            except:
                print(f"   Error text: {response.text}")
    else:
        print(f"   ❌ Create conversation failed: {response.status_code}")
        try:
            error_detail = response.json()
            print(f"   Error detail: {error_detail}")
        except:
            print(f"   Error text: {response.text}")
    
    print("\n" + "=" * 50)
    print("🎯 Authentication Test Complete!")
    print("\n💡 If tests pass, the issue is in the frontend:")
    print("• Check if user is logged in properly")
    print("• Check if token is stored in localStorage")
    print("• Check if token is expired")
    print("• Try logging out and logging back in")

if __name__ == "__main__":
    test_ai_endpoints()
