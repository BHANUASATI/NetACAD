# School, Department, and Course Structure Implementation

This implementation adds a hierarchical structure for student registration with School → Department → Course selection.

## Changes Made

### Backend Changes

1. **New Models Added** (`models.py`):
   - `School` model with name, code, type, and description
   - Updated `Department` model to include `school_id` foreign key
   - `Course` model with name, code, type, department_id, and duration_years
   - Updated `Student` model to include `school_id` and `course_id` fields

2. **New Schemas Added** (`schemas.py`):
   - `SchoolCreate`, `SchoolResponse` schemas
   - Updated `DepartmentCreate`, `DepartmentResponse` with school_id
   - `CourseCreate`, `CourseResponse`, `CourseWithDepartment` schemas
   - Updated `StudentCreate`, `StudentResponse` with school_id and course_id

3. **New API Routes** (`school_routes.py`):
   - `GET /schools/` - Get all schools
   - `POST /schools/` - Create new school (Admin only)
   - `GET /schools/{school_id}/departments` - Get departments by school
   - `POST /schools/{school_id}/departments` - Create department in school
   - `GET /schools/departments/{department_id}/courses` - Get courses by department
   - `POST /schools/departments/{department_id}/courses` - Create course in department

4. **Updated Student Routes** (`student_routes.py`):
   - Updated student creation to include school_id and course_id
   - Updated student profile retrieval to include school and course information

5. **Database Migration** (`database/school_course_migration.sql`):
   - Creates schools table
   - Updates departments table to include school_id
   - Creates courses table
   - Updates students table to include school_id and course_id
   - Inserts sample data for schools, departments, and courses

### Frontend Changes

1. **Updated AdminDashboard Component**:
   - Added school, department, and course selection fields to student registration
   - Implemented cascading dropdowns (school → department → course)
   - Added state management for schools, departments, and courses
   - Updated form validation and submission

2. **New Features**:
   - School selection enables department options
   - Department selection enables course options
   - Form fields are disabled until parent selection is made
   - Automatic reset of child fields when parent selection changes

## Sample Data Structure

### Schools
- School of Engineering and Technology (SOET)
- School of Management Studies (SOMS)
- School of Sciences (SOS)
- School of Arts and Humanities (SOAH)

### Departments (under SOET)
- Computer Science (CS)
- Mechanical Engineering (ME)
- Electrical Engineering (EE)
- Civil Engineering (CE)
- Electronics Engineering (EC)

### Courses (under Computer Science)
- Bachelor of Computer Applications (BCA)
- Master of Computer Applications (MCA)
- Bachelor of Technology in Computer Science (BTech_CS)
- Master of Technology in Computer Science (MTech_CS)

## Installation and Setup

1. **Run Database Migration**:
   ```sql
   mysql -u username -p NetACAD < database/school_course_migration.sql
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   python main.py
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

4. **Test the API**:
   ```bash
   cd backend
   python test_school_course_api.py
   ```

## Usage

### For Registrar/Admin

1. Login as admin or registrar
2. Navigate to Admin Dashboard
3. Click "Create New User"
4. Select role as "Student"
5. Fill in student details
6. **Select School** from dropdown (e.g., "School of Engineering and Technology")
7. **Select Department** from dropdown (e.g., "Computer Science") - only shows departments from selected school
8. **Select Course** from dropdown (e.g., "Bachelor of Computer Applications") - only shows courses from selected department
9. Fill remaining details and create user

### API Usage

```javascript
// Get all schools
GET /schools/

// Get departments for a specific school
GET /schools/{school_id}/departments

// Get courses for a specific department
GET /schools/departments/{department_id}/courses

// Create student with school, department, and course
POST /students/
{
  "enrollment_number": "ENR2024001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@university.edu.in",
  "password": "password123",
  "school_id": 1,
  "department_id": 1,
  "course_id": 1,
  // ... other student fields
}
```

## Database Schema

### Schools Table
```sql
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Departments Table (Updated)
```sql
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    school_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id)
);
```

### Courses Table
```sql
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    department_id INT NOT NULL,
    duration_years INT DEFAULT 4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

### Students Table (Updated)
```sql
-- Added school_id and course_id columns
ALTER TABLE students 
ADD COLUMN school_id INT,
ADD COLUMN course_id INT,
ADD FOREIGN KEY (school_id) REFERENCES schools(id),
ADD FOREIGN KEY (course_id) REFERENCES courses(id);
```

## Testing

The implementation includes a test script (`test_school_course_api.py`) that verifies:
- API endpoints are working
- School creation
- Department creation in specific schools
- Course creation in specific departments
- Data retrieval functionality

Run the test script to verify the implementation:
```bash
cd backend
python test_school_course_api.py
```

## Notes

- The implementation maintains backward compatibility with existing data
- School and course fields are optional initially but will be required after full migration
- The frontend provides a user-friendly cascading dropdown interface
- All new API endpoints require admin authentication
- Sample data is provided for testing purposes
