#!/usr/bin/env python3
"""
Test script to verify the new document status API endpoint
"""

import requests
import json

# Test configuration
BASE_URL = "http://localhost:8000"
API_ENDPOINT = f"{BASE_URL}/documents/my-documents-status"

def test_document_status_api():
    """Test the document status API endpoint"""
    
    print("🧪 Testing Document Status API...")
    
    try:
        # First, try to login to get a token
        login_data = {
            "email": "rahul.kumar@university.edu.in",
            "password": "password"
        }
        
        print("🔐 Attempting login...")
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data.get("access_token")
            print("✅ Login successful!")
            
            # Now test the document status endpoint
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            print("📄 Testing document status endpoint...")
            doc_response = requests.get(API_ENDPOINT, headers=headers)
            
            if doc_response.status_code == 200:
                documents = doc_response.json()
                print(f"✅ API call successful! Found {len(documents)} document types")
                
                # Print document status summary
                for doc in documents:
                    status = doc.get("upload_status", "unknown")
                    verification = doc.get("verification_status", "unknown")
                    print(f"  📋 {doc.get('name', 'Unknown')}: {status} ({verification})")
                
                return True
            else:
                print(f"❌ API call failed with status {doc_response.status_code}")
                print(f"Response: {doc_response.text}")
                return False
                
        else:
            print(f"❌ Login failed with status {login_response.status_code}")
            print(f"Response: {login_response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure the backend server is running on localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_document_status_api()
    if success:
        print("\n🎉 All tests passed! The document status API is working correctly.")
    else:
        print("\n💥 Tests failed! Please check the backend server and database setup.")
