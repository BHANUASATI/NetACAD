-- Quick test to check current data state
USE NetACAD;

-- Check what faculty IDs exist
SELECT id, employee_id, first_name, last_name FROM faculties;

-- Check what student IDs exist  
SELECT id, enrollment_number, first_name, last_name FROM students;

-- Check current tasks
SELECT id, title, assigned_by, assigned_to FROM tasks;
