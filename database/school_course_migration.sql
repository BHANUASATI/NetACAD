-- Migration script for adding School, Department, and Course structure
-- This script adds the new hierarchy: School -> Department -> Course
-- and updates the student table to include school_id and course_id

USE NetACAD;

-- 1. Create schools table
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Add school_id to departments table (if not exists)
ALTER TABLE departments 
ADD COLUMN IF NOT EXISTS school_id INT,
ADD FOREIGN KEY IF NOT EXISTS (school_id) REFERENCES schools(id),
DROP INDEX IF EXISTS departments_name_unique,
DROP INDEX IF EXISTS departments_code_unique,
ADD UNIQUE KEY unique_dept_name_school (name, school_id),
ADD UNIQUE KEY unique_dept_code_school (code, school_id);

-- 3. Create courses table
CREATE TABLE IF NOT EXISTS courses (
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

-- 4. Add school_id and course_id to students table (if not exists)
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS school_id INT,
ADD COLUMN IF NOT EXISTS course_id INT,
ADD FOREIGN KEY IF NOT EXISTS (school_id) REFERENCES schools(id),
ADD FOREIGN KEY IF NOT EXISTS (course_id) REFERENCES courses(id);

-- 5. Insert sample schools
INSERT IGNORE INTO schools (name, code, type, description) VALUES
('School of Engineering and Technology', 'SOET', 'engineering_technology', 'Engineering and Technology programs'),
('School of Management Studies', 'SOMS', 'management_studies', 'Business and Management programs'),
('School of Sciences', 'SOS', 'sciences', 'Pure and Applied Sciences'),
('School of Arts and Humanities', 'SOAH', 'arts_humanities', 'Arts and Humanities programs');

-- 6. Update existing departments to have school_id (assuming existing departments belong to SOET)
UPDATE departments SET school_id = 1 WHERE school_id IS NULL;

-- 7. Insert sample departments for different schools
INSERT IGNORE INTO departments (name, code, type, school_id, description) VALUES
-- School of Engineering and Technology departments
('Computer Science', 'CS', 'computer_science', 1, 'Computer Science and Engineering'),
('Mechanical Engineering', 'ME', 'mechanical', 1, 'Mechanical Engineering'),
('Electrical Engineering', 'EE', 'electrical', 1, 'Electrical Engineering'),
('Civil Engineering', 'CE', 'civil', 1, 'Civil Engineering'),
('Electronics Engineering', 'EC', 'electronics', 1, 'Electronics and Communication'),

-- School of Management Studies departments
('Business Administration', 'BA', 'business', 2, 'Business and Administration'),
('Management Studies', 'MS', 'business', 2, 'Management Studies'),

-- School of Sciences departments
('Physics', 'PHY', 'physics', 3, 'Physics Department'),
('Chemistry', 'CHEM', 'chemistry', 3, 'Chemistry Department'),
('Mathematics', 'MATH', 'mathematics', 3, 'Mathematics Department');

-- 8. Insert sample courses
INSERT IGNORE INTO courses (name, code, type, department_id, duration_years, description) VALUES
-- Computer Science courses (Department ID: 1)
('Bachelor of Computer Applications', 'BCA', 'undergraduate', 1, 3, 'BCA Program - 3 years'),
('Master of Computer Applications', 'MCA', 'postgraduate', 1, 2, 'MCA Program - 2 years'),
('Bachelor of Technology in Computer Science', 'BTech_CS', 'undergraduate', 1, 4, 'B.Tech Computer Science - 4 years'),
('Master of Technology in Computer Science', 'MTech_CS', 'postgraduate', 1, 2, 'M.Tech Computer Science - 2 years'),
('Bachelor of Science in Computer Science', 'BSc_CS', 'undergraduate', 1, 3, 'B.Sc Computer Science - 3 years'),
('Master of Science in Computer Science', 'MSc_CS', 'postgraduate', 1, 2, 'M.Sc Computer Science - 2 years'),
('Diploma in Computer Applications', 'DCA', 'diploma', 1, 1, 'Diploma in Computer Applications - 1 year'),
('Post Graduate Diploma in Computer Science', 'PGDCS', 'postgraduate', 1, 1, 'PG Diploma in Computer Science - 1 year'),
('Bachelor of Computer Science', 'BCS', 'undergraduate', 1, 3, 'Bachelor of Computer Science - 3 years'),
('PhD in Computer Science', 'PhD_CS', 'doctorate', 1, 4, 'PhD in Computer Science - 4 years'),

-- Mechanical Engineering courses (Department ID: 2)
('Bachelor of Technology in Mechanical', 'BTech_ME', 'undergraduate', 2, 4, 'B.Tech Mechanical Engineering - 4 years'),
('Master of Technology in Mechanical', 'MTech_ME', 'postgraduate', 2, 2, 'M.Tech Mechanical Engineering - 2 years'),
('Diploma in Mechanical Engineering', 'DME', 'diploma', 2, 3, 'Diploma in Mechanical Engineering - 3 years'),

-- Electrical Engineering courses (Department ID: 3)
('Bachelor of Technology in Electrical', 'BTech_EE', 'undergraduate', 3, 4, 'B.Tech Electrical Engineering - 4 years'),
('Master of Technology in Electrical', 'MTech_EE', 'postgraduate', 3, 2, 'M.Tech Electrical Engineering - 2 years'),
('Diploma in Electrical Engineering', 'DEE', 'diploma', 3, 3, 'Diploma in Electrical Engineering - 3 years'),

-- Civil Engineering courses (Department ID: 4)
('Bachelor of Technology in Civil', 'BTech_CE', 'undergraduate', 4, 4, 'B.Tech Civil Engineering - 4 years'),
('Master of Technology in Civil', 'MTech_CE', 'postgraduate', 4, 2, 'M.Tech Civil Engineering - 2 years'),
('Diploma in Civil Engineering', 'DCE', 'diploma', 4, 3, 'Diploma in Civil Engineering - 3 years'),

-- Electronics Engineering courses (Department ID: 5)
('Bachelor of Technology in Electronics', 'BTech_EC', 'undergraduate', 5, 4, 'B.Tech Electronics Engineering - 4 years'),
('Master of Technology in Electronics', 'MTech_EC', 'postgraduate', 5, 2, 'M.Tech Electronics Engineering - 2 years'),
('Diploma in Electronics Engineering', 'DEC', 'diploma', 5, 3, 'Diploma in Electronics Engineering - 3 years'),

-- Business Administration courses (Department ID: 6)
('Bachelor of Business Administration', 'BBA', 'undergraduate', 6, 3, 'BBA Program - 3 years'),
('Master of Business Administration', 'MBA', 'postgraduate', 6, 2, 'MBA Program - 2 years'),
('Bachelor of Commerce', 'BCom', 'undergraduate', 6, 3, 'Bachelor of Commerce - 3 years'),
('Master of Commerce', 'MCom', 'postgraduate', 6, 2, 'Master of Commerce - 2 years'),

-- Management Studies courses (Department ID: 7)
('Post Graduate Diploma in Management', 'PGDM', 'postgraduate', 7, 2, 'PGDM Program - 2 years'),
('Executive MBA', 'EMBA', 'postgraduate', 7, 1, 'Executive MBA - 1 year'),

-- Physics courses (Department ID: 8)
('Bachelor of Science in Physics', 'BSc_PHY', 'undergraduate', 8, 3, 'B.Sc Physics - 3 years'),
('Master of Science in Physics', 'MSc_PHY', 'postgraduate', 8, 2, 'M.Sc Physics - 2 years'),
('M.Sc. Physics (Hons)', 'MSc_PHY_H', 'postgraduate', 8, 2, 'M.Sc Physics Hons - 2 years'),

-- Chemistry courses (Department ID: 9)
('Bachelor of Science in Chemistry', 'BSc_CHEM', 'undergraduate', 9, 3, 'B.Sc Chemistry - 3 years'),
('Master of Science in Chemistry', 'MSc_CHEM', 'postgraduate', 9, 2, 'M.Sc Chemistry - 2 years'),

-- Mathematics courses (Department ID: 10)
('Bachelor of Science in Mathematics', 'BSc_MATH', 'undergraduate', 10, 3, 'B.Sc Mathematics - 3 years'),
('Master of Science in Mathematics', 'MSc_MATH', 'postgraduate', 10, 2, 'M.Sc Mathematics - 2 years');

-- 9. Update existing students to have default school_id and course_id
-- This is a placeholder - in real scenario, you'd need to map students appropriately
UPDATE students SET school_id = 1, course_id = 1 WHERE school_id IS NULL;

-- 10. Make school_id and course_id required in students table (after data migration)
-- Uncomment the following lines after ensuring all students have valid school_id and course_id
-- ALTER TABLE students MODIFY school_id INT NOT NULL;
-- ALTER TABLE students MODIFY course_id INT NOT NULL;
