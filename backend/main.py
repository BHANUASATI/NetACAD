from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

import models, schemas, auth
from database import get_db, engine
from config import settings
from dependencies import get_current_user
from registrar_routes import router as registrar_router
from auth_routes import router as auth_router
from student_routes import router as student_router
from faculty_routes_new import router as faculty_router
from faculty_simple_routes import router as faculty_simple_router
from admin_routes import router as admin_router
from task_routes import router as task_router
from document_routes import router as document_router
from calendar_routes import router as calendar_router
from ai_assistant_routes import router as ai_assistant_router
from school_routes import router as school_router

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="University Management System API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/auth/login", response_model=schemas.Token)
async def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    # Validate university email
    if not user_credentials.email.endswith(f"@{settings.UNIVERSITY_EMAIL_DOMAIN}"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email must be from {settings.UNIVERSITY_EMAIL_DOMAIN} domain"
        )
    
    # Find user
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    
    if not user or not auth.verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.post("/api/auth/register", response_model=schemas.UserResponse)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check enrollment number for students
    if user.role == models.UserRole.STUDENT and user.enrollment_number:
        existing_enrollment = db.query(models.User).filter(
            models.User.enrollment_number == user.enrollment_number
        ).first()
        if existing_enrollment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Enrollment number already exists"
            )
    
    # Check employee ID for faculty
    if user.role == models.UserRole.FACULTY and user.employee_id:
        existing_employee = db.query(models.User).filter(
            models.User.employee_id == user.employee_id
        ).first()
        if existing_employee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee ID already exists"
            )
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        enrollment_number=user.enrollment_number,
        course=user.course,
        semester=user.semester,
        batch=user.batch,
        advisor=user.advisor,
        department=user.department,
        employee_id=user.employee_id
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.get("/api/auth/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/")
async def root():
    return {"message": "University Management System API"}

# Include all routers
app.include_router(auth_router, tags=["auth"])
app.include_router(student_router, tags=["students"])
app.include_router(faculty_router, tags=["faculty"])
app.include_router(faculty_simple_router, tags=["faculty-simple"])
app.include_router(admin_router, tags=["admin"])
app.include_router(task_router, tags=["tasks"])
app.include_router(document_router, tags=["documents"])
app.include_router(calendar_router, tags=["calendar"])
app.include_router(registrar_router, tags=["registrar"])
app.include_router(school_router, tags=["schools"])
app.include_router(ai_assistant_router, prefix="/api/ai", tags=["ai-assistant"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
