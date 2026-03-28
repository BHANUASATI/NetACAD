# University Management System Backend

FastAPI backend with MySQL database for the University Management System.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Database Setup
- Install MySQL on your system
- Create a database named `university_db`
- Update the database connection in `.env` file if needed

### 3. Environment Variables
Create a `.env` file with the following variables:
```
DATABASE_URL=mysql+pymysql://root:password@localhost/university_db
SECRET_KEY=your-secret-key-change-in-production-this-should-be-very-secure
UNIVERSITY_EMAIL_DOMAIN=university.edu.in
```

### 4. Run the Backend
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

### Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Features

1. **JWT Authentication** - Secure token-based authentication
2. **University Email Validation** - Only allows university email domains
3. **Role-based Access Control** - Student, Faculty, and Admin roles
4. **Password Hashing** - Secure password storage with bcrypt
5. **CORS Support** - Frontend integration ready

## Database Models

### Users Table
- id, email, password_hash, first_name, last_name
- role (student/faculty/admin)
- is_active, created_at, updated_at
- Student fields: enrollment_number, course, semester, batch, advisor
- Faculty fields: department, employee_id

## Testing

Use the provided test users or create new ones through the registration endpoint.

### Test Users
- Student: student@university.edu.in / password
- Faculty: faculty@university.edu.in / password
- Admin: admin@university.edu.in / password
