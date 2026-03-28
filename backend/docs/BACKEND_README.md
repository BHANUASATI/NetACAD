# University Document Management System - FastAPI Backend

A comprehensive FastAPI backend for the University Document Management System based on the MySQL database schema.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **User Management**: Admin, Faculty, and Student roles with specific permissions
- **Document Management**: Upload, verify, and manage student documents
- **Task Management**: Create, assign, submit, and grade tasks
- **Dashboard**: Role-specific dashboard statistics
- **File Upload**: Secure file handling with validation
- **Audit Logging**: Track all system activities

## Installation

1. **Install Dependencies:**
   ```bash
   pip install -r requirements_new.txt
   ```

2. **Set up Environment Variables:**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=mysql+mysqlconnector://username:password@localhost:3306/netacad
   SECRET_KEY=your-secret-key-here
   ALLOWED_ORIGINS=["http://localhost:3000"]
   ```

3. **Database Setup:**
   - Ensure MySQL is running
   - Create database `netacad`
   - Run the schema: `mysql -u username -p netacad < database_schema_mysql_final.sql`
   - Run sample data: `mysql -u username -p netacad < sample_data_mysql_final.sql`

## Running the Application

1. **Development Mode:**
   ```bash
   python app.py
   ```

2. **Production Mode:**
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register/student` - Register student
- `POST /auth/register/faculty` - Register faculty
- `POST /auth/register/admin` - Register admin
- `GET /auth/me` - Get current user info

### Students
- `GET /students/me` - Get student profile
- `PUT /students/me` - Update student profile
- `GET /students/dashboard/stats` - Student dashboard stats
- `GET /students/verification/status` - Document verification status

### Faculty
- `GET /faculty/me` - Get faculty profile
- `PUT /faculty/me` - Update faculty profile
- `GET /faculty/dashboard/stats` - Faculty dashboard stats
- `GET /faculty/documents/pending` - Get pending documents
- `PUT /faculty/documents/{id}/verify` - Verify document

### Admin
- `GET /admin/dashboard/stats` - Admin dashboard stats
- `GET /admin/students` - Get all students
- `GET /admin/faculty` - Get all faculty
- `GET /admin/departments` - Get all departments
- `GET /admin/documents/pending` - Get all pending documents
- `GET /admin/tasks` - Get all tasks
- `POST /admin/faculty/{id}/toggle-status` - Toggle faculty status

### Tasks
- `POST /tasks/` - Create task (Faculty)
- `GET /tasks/` - Get tasks (based on role)
- `GET /tasks/{id}` - Get specific task
- `PUT /tasks/{id}` - Update task (Faculty)
- `POST /tasks/{id}/submit` - Submit task (Student)
- `GET /tasks/{id}/submissions` - Get task submissions (Faculty)
- `PUT /tasks/submissions/{id}/grade` - Grade submission (Faculty)

### Documents
- `GET /documents/types` - Get document types
- `POST /documents/upload` - Upload document (Student)
- `GET /documents/my-documents` - Get my documents (Student)
- `GET /documents/student/{id}` - Get student documents (Faculty)
- `PUT /documents/{id}/verify` - Verify document (Faculty)
- `DELETE /documents/{id}` - Delete document (Student)

## Default Credentials

After running the sample data:

### Admin
- **Email**: admin@university.edu.in
- **Password**: admin123

### Faculty
- **Email**: john.smith@university.edu.in
- **Password**: password123

### Students
- **Verified Student**: rahul.kumar@university.edu.in / password123
- **Pending Student**: priya.sharma@university.edu.in / password123
- **Rejected Student**: amit.patel@university.edu.in / password123

## Project Structure

```
backend/
├── app.py                    # Main FastAPI application
├── app_config.py             # Application configuration
├── database_models.py        # SQLAlchemy models
├── db_connection.py          # Database connection
├── security.py               # Authentication and security
├── dependencies.py           # FastAPI dependencies
├── pydantic_schemas.py      # Pydantic models
├── auth_routes.py            # Authentication routes
├── student_routes.py         # Student routes
├── faculty_routes.py         # Faculty routes
├── admin_routes.py           # Admin routes
├── task_routes.py            # Task routes
├── document_routes.py        # Document routes
├── requirements_new.txt      # Python dependencies
└── uploads/                  # File upload directory
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- File upload validation
- CORS protection
- SQL injection protection through SQLAlchemy

## Database Schema

The API is built to work with the MySQL schema defined in `database_schema_mysql_final.sql`, including:

- Users, Students, Faculty, Admins
- Departments, Document Types
- Student Documents with verification
- Tasks and Task Submissions
- Notifications and Audit Logs

## Development Notes

- The API follows RESTful conventions
- All endpoints are properly documented with OpenAPI/Swagger
- Error handling with appropriate HTTP status codes
- Input validation using Pydantic models
- Database operations use SQLAlchemy ORM
- File uploads are handled securely with validation
