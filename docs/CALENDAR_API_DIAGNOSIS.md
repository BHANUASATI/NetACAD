# Calendar API Diagnosis - 422 Unprocessable Entity Error

## Issue Summary
The `POST /calendar/events` endpoint is returning `422 Unprocessable Entity` errors.

## Root Causes Identified

### 1. ❌ Missing Authentication (Most Likely)
**Symptoms:** API calls without JWT token fail
- **Without Auth:** `403 Not Authenticated` 
- **With Auth:** `200 OK`

**Solution:** Ensure frontend includes `Authorization: Bearer <token>` header

### 2. ❌ Invalid Enum Values  
**Symptoms:** 422 error with enum validation message

**Examples:**
```json
// ❌ Invalid event_type
{"event_type": "invalid_type"}
// Response: "Input should be 'academic' or 'personal'"

// ❌ Invalid priority  
{"priority": "invalid"}
// Response: "Input should be 'low', 'medium', 'high', or 'urgent'"

// ❌ Invalid risk_level
{"risk_level": "invalid"} 
// Response: "Input should be 'low', 'medium', 'high', or 'critical'"
```

**Valid Enum Values:**
- `event_type`: `"academic"` or `"personal"`
- `priority`: `"low"`, `"medium"`, `"high"`, or `"urgent"`
- `risk_level`: `"low"`, `"medium"`, `"high"`, or `"critical"`

### 3. ❌ Invalid Date Format
**Symptoms:** 422 error with datetime parsing message

**Examples:**
```json
// ❌ Invalid date
{"start_date": "invalid-date"}
// Response: "Input should be a valid datetime, invalid character in year"

// ✅ Valid ISO dates
{"start_date": "2026-03-24T10:00:00.000Z"}
{"start_date": "2026-03-24T10:00:00"}
```

### 4. ❌ Date Validation Errors
**Symptoms:** 422 error with date relationship validation

**Rules:**
- `end_date` must be after `start_date` (if provided)
- `alert_date` must be on or before `start_date` (if provided)

## API Requirements

### Required Fields
```json
{
  "title": "string (required)",
  "event_type": "academic|personal (required)", 
  "start_date": "datetime (required)"
}
```

### Optional Fields
```json
{
  "description": "string",
  "status": "pending|in_progress|completed (default: pending)",
  "priority": "low|medium|high|urgent (default: medium)",
  "risk_level": "low|medium|high|critical (default: low)",
  "end_date": "datetime",
  "alert_date": "datetime", 
  "location": "string",
  "category": "string",
  "alert_message": "string",
  "alert_enabled": "boolean (default: false)"
}
```

## Working Example

```bash
# 1. Login to get token
TOKEN=$(curl -s -X POST "http://localhost:8002/api/auth/login" \
-H "Content-Type: application/json" \
-d '{
    "email": "admin@university.edu.in",
    "password": "password"
}' | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

# 2. Create event with valid data
curl -X POST "http://localhost:8002/calendar/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
    "title": "Test Event",
    "description": "Test Description",
    "event_type": "personal",
    "priority": "medium", 
    "risk_level": "low",
    "start_date": "2026-03-24T10:00:00.000Z",
    "category": "test",
    "location": "test",
    "alert_enabled": false
}'
```

## Frontend Debugging Checklist

1. **Check Authentication:**
   - Is user logged in?
   - Does `localStorage.getItem('authToken')` return a token?
   - Is token included in `Authorization` header?

2. **Check Data Format:**
   - Are enum values valid?
   - Are dates in ISO format?
   - Are required fields present?

3. **Check Network:**
   - Open browser dev tools → Network tab
   - Look for failed requests to `/calendar/events`
   - Check request payload and response details

## Quick Fix Script

Run this script to test your API:
```bash
cd /Users/Asati_Bhanu/Desktop/GitHub_Pull/NetACAD/backend
python3 test_calendar_api.py
```

## Most Likely Solution

The 422 errors are probably caused by **missing authentication** in the frontend. Ensure:

1. User is logged in before creating calendar events
2. Frontend includes the JWT token in request headers
3. Token is valid (not expired)

Check the browser console for authentication errors and verify the user is properly logged in.
