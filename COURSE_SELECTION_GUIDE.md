# Course Selection Guide for Registrar

## How the Course Selection Works

The registrar can now select specific courses that students want to pursue within each department. Here's exactly how it works:

### Step-by-Step Process

1. **Select School** 
   - School of Engineering and Technology
   - School of Management Studies  
   - School of Sciences
   - School of Arts and Humanities

2. **Select Department** (filtered by selected school)
   
   **For School of Engineering and Technology:**
   - Computer Science
   - Mechanical Engineering
   - Electrical Engineering
   - Civil Engineering
   - Electronics Engineering

   **For School of Management Studies:**
   - Business Administration
   - Management Studies

   **For School of Sciences:**
   - Physics
   - Chemistry
   - Mathematics

3. **Select Course** (filtered by selected department)

   **Computer Science Department Courses:**
   - Bachelor of Computer Applications (BCA) - 3 years - undergraduate
   - Master of Computer Applications (MCA) - 2 years - postgraduate
   - Bachelor of Technology in Computer Science (BTech_CS) - 4 years - undergraduate
   - Master of Technology in Computer Science (MTech_CS) - 2 years - postgraduate
   - Bachelor of Science in Computer Science (BSc_CS) - 3 years - undergraduate
   - Master of Science in Computer Science (MSc_CS) - 2 years - postgraduate
   - Diploma in Computer Applications (DCA) - 1 year - diploma
   - Post Graduate Diploma in Computer Science (PGDCS) - 1 year - postgraduate
   - Bachelor of Computer Science (BCS) - 3 years - undergraduate
   - PhD in Computer Science (PhD_CS) - 4 years - doctorate

   **Business Administration Department Courses:**
   - Bachelor of Business Administration (BBA) - 3 years - undergraduate
   - Master of Business Administration (MBA) - 2 years - postgraduate
   - Bachelor of Commerce (BCom) - 3 years - undergraduate
   - Master of Commerce (MCom) - 2 years - postgraduate

   **Physics Department Courses:**
   - Bachelor of Science in Physics (BSc_PHY) - 3 years - undergraduate
   - Master of Science in Physics (MSc_PHY) - 2 years - postgraduate
   - M.Sc. Physics (Hons) (MSc_PHY_H) - 2 years - postgraduate

## Example Registration Scenarios

### Scenario 1: Student wants BCA
1. **School**: School of Engineering and Technology
2. **Department**: Computer Science  
3. **Course**: Bachelor of Computer Applications (BCA) - 3 years - undergraduate

### Scenario 2: Student wants MBA
1. **School**: School of Management Studies
2. **Department**: Business Administration
3. **Course**: Master of Business Administration (MBA) - 2 years - postgraduate

### Scenario 3: Student wants BSc Physics
1. **School**: School of Sciences
2. **Department**: Physics
3. **Course**: Bachelor of Science in Physics (BSc_PHY) - 3 years - undergraduate

## Key Features

✅ **Smart Filtering**: Courses automatically filter based on selected department
✅ **Clear Information**: Each course shows duration and type (undergraduate/postgraduate/diploma)
✅ **Comprehensive Options**: Multiple course types available within each department
✅ **Real-world Courses**: Includes BCA, MCA, BTech, MBA, BSc, MSc, Diplomas, etc.
✅ **Easy Navigation**: Cascading dropdowns guide the registrar through selection

## Frontend Experience

The course dropdown displays:
```
Bachelor of Computer Applications (BCA) - 3 years - undergraduate
Master of Computer Applications (MCA) - 2 years - postgraduate
Bachelor of Technology in Computer Science (BTech_CS) - 4 years - undergraduate
Master of Technology in Computer Science (MTech_CS) - 2 years - postgraduate
```

This makes it very clear for the registrar to:
- See exactly what course the student wants
- Understand the duration of the program
- Know if it's undergraduate, postgraduate, or diploma

## Database Storage

The selected course is stored in the `students` table:
- `school_id`: References the school table
- `department_id`: References the department table  
- `course_id`: References the course table

This ensures data integrity and allows for:
- Easy reporting by school/department/course
- Accurate student statistics
- Proper academic record management

## API Structure

The API endpoints support this hierarchy:
- `GET /schools/` - Get all schools
- `GET /schools/{school_id}/departments` - Get departments for specific school
- `GET /schools/departments/{department_id}/courses` - Get courses for specific department

This structure allows the frontend to efficiently load the appropriate options at each step.
