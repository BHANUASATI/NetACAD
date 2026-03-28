#!/usr/bin/env python3
"""
Test script to demonstrate the calendar API issue and solution
"""

import requests
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:8002"

def test_calendar_api_without_auth():
    """Test calendar API without authentication - should fail with 422"""
    print("🔍 Testing Calendar API WITHOUT Authentication")
    print("=" * 60)
    
    event_data = {
        "title": "Test Event",
        "description": "Test Description", 
        "event_type": "personal",
        "priority": "medium",
        "risk_level": "low",
        "start_date": "2026-03-24T10:00:00.000Z",
        "category": "test",
        "location": "test",
        "alert_enabled": False,
        "alert_message": None,
        "alert_date": None
    }
    
    response = requests.post(
        f"{BASE_URL}/calendar/events",
        json=event_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
    
    return response.status_code == 422

def test_calendar_api_with_auth():
    """Test calendar API with authentication - should work"""
    print("🔐 Testing Calendar API WITH Authentication")
    print("=" * 60)
    
    # Login to get token
    login_data = {
        "email": "admin@university.edu.in",
        "password": "password"
    }
    
    login_response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.json()}")
        return False
    
    token = login_response.json()["access_token"]
    print(f"✅ Login successful, got token")
    
    # Create event with auth
    event_data = {
        "title": "Test Event with Auth",
        "description": "This should work with proper authentication",
        "event_type": "personal", 
        "priority": "medium",
        "risk_level": "low",
        "start_date": "2026-03-24T10:00:00.000Z",
        "category": "test",
        "location": "test",
        "alert_enabled": False,
        "alert_message": None,
        "alert_date": None
    }
    
    response = requests.post(
        f"{BASE_URL}/calendar/events",
        json=event_data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    
    print(f"Status Code: {response.status_code}")
    response_data = response.json()
    print(f"Response: {json.dumps(response_data, indent=2)}")
    print()
    
    return response.status_code == 200

def main():
    print("🚀 Calendar API Diagnosis Tool")
    print("=" * 60)
    print()
    
    # Test 1: Without auth (should fail)
    failed_without_auth = test_calendar_api_without_auth()
    
    # Test 2: With auth (should succeed)
    succeeded_with_auth = test_calendar_api_with_auth()
    
    print("📊 RESULTS")
    print("=" * 60)
    print(f"❌ API fails without auth: {failed_without_auth}")
    print(f"✅ API works with auth: {succeeded_with_auth}")
    print()
    
    if failed_without_auth and succeeded_with_auth:
        print("🎯 DIAGNOSIS:")
        print("The 422 error is caused by MISSING AUTHENTICATION!")
        print("The calendar API requires a valid JWT token in the Authorization header.")
        print()
        print("💡 SOLUTION:")
        print("1. Login to get a token: POST /api/auth/login")
        print("2. Include token in requests: Authorization: Bearer <token>")
        print("3. Frontend should handle authentication automatically")
    else:
        print("❓ Unexpected results - check server logs")

if __name__ == "__main__":
    main()
