# Database Schema Documentation

## Overview
This database schema supports a complete university document management system where:
- **Students** can login, upload documents, and access dashboard after verification
- **Faculty** can verify documents and assign tasks to students
- **Admin** can manage users, generate credentials, and oversee the system

## Core Tables

### 1. Users Table
Base authentication table for all system users.
- **email**: Unique email address for login
- **password_hash**: Encrypted password using bcrypt
- **role**: Enum ('student', 'faculty', 'admin')
- **is_active**: Account status
- **email_verified**: Email verification status

### 2. Students Table
Student-specific information and academic records.
- **enrollment_number**: Unique university enrollment ID
- **documents_verified**: Boolean flag for dashboard access
- **verification_status**: 'pending', 'verified', or 'rejected'
- **semester, gpa, attendance**: Academic information

### 3. Faculties Table
Faculty information and permissions.
- **employee_id**: Unique employee identification
- **can_verify_documents**: Permission to verify student documents
- **can_assign_tasks**: Permission to assign tasks to students

### 4. Admins Table
Administrator information and permissions.
- **permissions**: JSON field for granular permissions
- **department_id**: Department association

### 5. Student Documents Table
Document uploads and verification tracking.
- **document_type_id**: Reference to document types
- **file_path**: Storage location of uploaded file
- **verification_status**: 'pending', 'verified', or 'rejected'
- **verified_by**: Faculty who verified the document

### 6. Tasks Table
Tasks assigned by faculty to students.
- **assigned_to**: Individual student (NULL for general tasks)
- **department_id**: Department-wide tasks
- **priority**: Task priority level
- **due_date**: Task deadline

### 7. Task Submissions Table
Student submissions for assigned tasks.
- **submission_status**: 'not_submitted', 'submitted', 'graded', 'late'
- **marks_obtained**: Score given by faculty
- **feedback**: Faculty feedback on submission

## Key Features

### Document Verification Workflow
1. Student uploads required documents
2. Faculty reviews and verifies/rejects documents
3. System automatically updates student verification status
4. Dashboard access granted only when all required documents are verified

### User Management
- Admin can create login credentials for students and faculty
- Role-based access control
- Email verification required for account activation

### Task Management
- Faculty can assign tasks to individual students or entire departments
- Students can submit work through the system
- Faculty can grade and provide feedback
- Priority-based task organization

### Audit Trail
- Complete audit log of all system actions
- Track changes to important records
- IP address and user agent logging

### Notifications
- System notifications for important events
- Document verification status updates
- Task assignment and deadline reminders

## Database Views

### student_verification_status
Shows each student's document verification progress with counts of total, verified, and pending documents.

### faculty_workload
Displays faculty workload including tasks assigned and submissions pending grading.

## Triggers and Automation

### Automatic Verification Status Update
When a document is verified, the system automatically checks if all required documents for a student are verified and updates the student's verification status accordingly.

### Audit Logging
All important actions are automatically logged to the audit_trail table for security and compliance.

## Stored Functions

### create_student_credentials()
Creates a new student account with login credentials.
```sql
SELECT create_student_credentials(
    'student@university.edu.in',
    'password123',
    '2024CS001',
    'John',
    'Doe',
    1
);
```

### create_faculty_credentials()
Creates a new faculty account with login credentials.
```sql
SELECT create_faculty_credentials(
    'faculty@university.edu.in',
    'password123',
    'FAC001',
    'Jane',
    'Smith',
    1
);
```

## Security Features

1. **Password Encryption**: All passwords are hashed using bcrypt
2. **Role-Based Access**: Different access levels for students, faculty, and admin
3. **Audit Trail**: Complete logging of all system actions
4. **Document Validation**: File type and size restrictions
5. **Email Verification**: Required for account activation

## Initial Data Setup

The schema includes:
- 5 default departments (CS, EC, ME, CE, EE)
- 9 document types with validation rules
- Default admin account (admin@university.edu.in / admin123)

## Integration Notes

This schema is designed to work with:
- **Backend**: Node.js/Express, Python/Django, or similar
- **File Storage**: Local filesystem or cloud storage (AWS S3, etc.)
- **Authentication**: JWT tokens or session-based auth
- **Email Service**: For verification emails and notifications

## Access Control Logic

### Dashboard Access
```sql
-- Students can only access dashboard if:
SELECT documents_verified = TRUE AND verification_status = 'verified'
FROM students WHERE user_id = :current_user_id;
```

### Document Verification Permission
```sql
-- Faculty can verify documents if:
SELECT can_verify_documents = TRUE AND is_active = TRUE
FROM faculties WHERE user_id = :current_user_id;
```

### Task Assignment Permission
```sql
-- Faculty can assign tasks if:
SELECT can_assign_tasks = TRUE AND is_active = TRUE
FROM faculties WHERE user_id = :current_user_id;
```

This schema provides a robust foundation for your university document management system with proper security, audit trails, and automated workflows.
