# Admin Dashboard Setup Guide

## Overview
The Admin Dashboard provides a comprehensive interface for managing users (students and faculty) in the AcadDNA system.

## Features
- **User Management**: Add, edit, and delete students and faculty
- **Dashboard Statistics**: View user counts and system statistics
- **Role-based Access**: Admin-only access with proper authentication
- **Search & Filter**: Find users by name, email, or enrollment number
- **Status Management**: Activate/deactivate user accounts

## Admin Credentials
- **Email**: admin@university.edu.in
- **Password**: admin123
- **Login URL**: http://localhost:3000/login

## API Endpoints

### User Management
- `GET /api/admin/users` - Get all users (students and faculty)
- `POST /api/admin/users` - Create a new user (student or faculty)
- `PUT /api/admin/users/{user_id}` - Update user information
- `DELETE /api/admin/users/{user_id}` - Delete a user

### Statistics
- `GET /api/admin/stats` - Get dashboard statistics

### Existing Admin Endpoints
- `GET /api/admin/dashboard/stats` - Get comprehensive dashboard stats
- `GET /api/admin/students` - Get all students
- `GET /api/admin/faculty` - Get all faculty
- `GET /api/admin/departments` - Get all departments
- And more...

## User Creation Requirements

### For Students:
- Name (required)
- Email (must end with @university.edu.in)
- Enrollment number (required)
- Department (required)
- Phone (optional)
- Password (required)

### For Faculty:
- Name (required)
- Email (must end with @university.edu.in)
- Department (required)
- Phone (optional)
- Password (required)

## Database Schema
The admin dashboard works with the following database models:
- `User` - Base user account with authentication
- `Student` - Student-specific information
- `Faculty` - Faculty-specific information
- `Admin` - Admin-specific information
- `Department` - Department information

## Security Features
- JWT token-based authentication
- Admin-only access control
- Password hashing with bcrypt
- Email validation (university domain only)
- Role-based permissions

## Setup Instructions

### 1. Database Setup
```bash
# Navigate to backend directory
cd /Users/Asati_Bhanu/Desktop/GitHub_Pull/NetACAD/backend

# Create admin user (if not already exists)
python3 create_admin.py
```

### 2. Backend Server
```bash
# Start the backend server
python3 app.py
```
The server will run on http://localhost:8000

### 3. Frontend Server
```bash
# Navigate to frontend directory
cd /Users/Asati_Bhanu/Desktop/GitHub_Pull/NetACAD/frontend

# Start the frontend server
npm start
```
The frontend will run on http://localhost:3000

### 4. Access Admin Dashboard
1. Open http://localhost:3000/login
2. Select "Official Login" (or use admin email directly)
3. Enter credentials:
   - Email: admin@university.edu.in
   - Password: admin123
4. You will be redirected to the Admin Dashboard

## Usage Guide

### Adding a New Student
1. Click "Add User" button
2. Select role "Student"
3. Fill in required fields:
   - Name
   - Email
   - Enrollment Number
   - Department
   - Password
4. Click "Create User"

### Adding a New Faculty
1. Click "Add User" button
2. Select role "Faculty"
3. Fill in required fields:
   - Name
   - Email
   - Department
   - Password
4. Click "Create User"

### Managing Users
- **Search**: Use the search bar to find users by name, email, or enrollment number
- **Filter**: Use the dropdown to filter by role (All, Students, Faculty)
- **Edit**: Click the edit icon to update user information
- **Delete**: Click the delete icon to remove a user (with confirmation)

### Dashboard Statistics
The dashboard shows:
- Total Users
- Total Students
- Total Faculty
- Active Users

## Troubleshooting

### Admin User Not Found
If the admin user doesn't exist, run:
```bash
python3 create_admin.py
```

### Permission Denied
Ensure you're using the admin credentials and the backend server is running.

### Database Connection Issues
Check the database configuration in `config.py` and ensure the database file exists.

### Frontend Routing Issues
Ensure the AppRoutes component properly handles admin role routing.

## File Structure
```
backend/
├── admin_routes.py          # Admin API endpoints
├── create_admin.py          # Script to create admin user
├── models.py               # Database models
├── security.py             # Security utilities
└── app.py                  # Main FastAPI application

frontend/
├── src/components/
│   └── AdminDashboard.tsx  # Admin dashboard component
├── src/pages/
│   └── AppRoutes.tsx       # Routing configuration
└── src/context/
    └── AppContext.tsx      # Authentication context
```

## Development Notes
- The admin dashboard uses React with TypeScript
- Backend uses FastAPI with SQLAlchemy
- Authentication uses JWT tokens
- Database uses SQLite (configurable)
- All user operations are logged for audit purposes

## Security Recommendations
1. Change the default admin password after first login
2. Use strong passwords for all user accounts
3. Regularly review user access and permissions
4. Implement additional logging for sensitive operations
5. Consider implementing two-factor authentication for admin accounts
