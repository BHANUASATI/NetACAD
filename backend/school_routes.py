from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import School, Department, Course, User
from database import get_db
from schemas import (
    SchoolCreate, SchoolResponse, DepartmentCreate, DepartmentResponse, 
    DepartmentWithSchool, CourseCreate, CourseResponse, CourseWithDepartment
)
from dependencies import get_current_active_user, get_current_admin
from typing import List

router = APIRouter(prefix="/schools", tags=["schools"])

@router.get("/", response_model=List[SchoolResponse])
def get_schools(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all schools."""
    schools = db.query(School).offset(skip).limit(limit).all()
    return schools

@router.post("/", response_model=SchoolResponse)
def create_school(
    school_data: SchoolCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new school (Admin only)."""
    
    # Check if school code already exists
    existing_school = db.query(School).filter(School.code == school_data.code).first()
    if existing_school:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="School code already exists"
        )
    
    # Check if school name already exists
    existing_name = db.query(School).filter(School.name == school_data.name).first()
    if existing_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="School name already exists"
        )
    
    try:
        school = School(**school_data.dict())
        db.add(school)
        db.commit()
        db.refresh(school)
        return school
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating school: {str(e)}"
        )

@router.get("/{school_id}/departments", response_model=List[DepartmentWithSchool])
def get_departments_by_school(
    school_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all departments for a specific school."""
    departments = db.query(Department).filter(Department.school_id == school_id).offset(skip).limit(limit).all()
    return departments

@router.get("/departments", response_model=List[DepartmentResponse])
def get_all_departments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all departments."""
    departments = db.query(Department).offset(skip).limit(limit).all()
    return departments

@router.post("/{school_id}/departments", response_model=DepartmentResponse)
def create_department_in_school(
    school_id: int,
    department_data: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new department in a specific school (Admin only)."""
    
    # Check if school exists
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    # Check if department code already exists
    existing_dept = db.query(Department).filter(Department.code == department_data.code).first()
    if existing_dept:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department code already exists"
        )
    
    try:
        department_data.school_id = school_id
        department = Department(**department_data.dict())
        db.add(department)
        db.commit()
        db.refresh(department)
        return department
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating department: {str(e)}"
        )

@router.get("/departments/{department_id}/courses", response_model=List[CourseWithDepartment])
def get_courses_by_department(
    department_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all courses for a specific department."""
    courses = db.query(Course).filter(Course.department_id == department_id).offset(skip).limit(limit).all()
    return courses

@router.get("/courses", response_model=List[CourseResponse])
def get_all_courses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all courses."""
    courses = db.query(Course).offset(skip).limit(limit).all()
    return courses

@router.post("/departments/{department_id}/courses", response_model=CourseResponse)
def create_course_in_department(
    department_id: int,
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new course in a specific department (Admin only)."""
    
    # Check if department exists
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    
    # Check if course code already exists
    existing_course = db.query(Course).filter(Course.code == course_data.code).first()
    if existing_course:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course code already exists"
        )
    
    try:
        course_data.department_id = department_id
        course = Course(**course_data.dict())
        db.add(course)
        db.commit()
        db.refresh(course)
        return course
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating course: {str(e)}"
        )
