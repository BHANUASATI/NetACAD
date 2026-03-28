from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app_config import settings
from database import create_tables
import uvicorn
import os

# Import all routers
from auth_routes import router as auth_router
from student_routes import router as student_router
from faculty_routes_new import router as faculty_router
from admin_routes import router as admin_router
from task_routes import router as task_router
from document_routes import router as document_router
from calendar_routes import router as calendar_router
from registrar_routes import router as registrar_router

# Create FastAPI app
app = FastAPI(
    title="University Document Management System",
    description="A comprehensive system for student document verification and task management",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth_router)
app.include_router(student_router)
app.include_router(faculty_router)
app.include_router(admin_router)
app.include_router(task_router)
app.include_router(document_router)
app.include_router(calendar_router)
app.include_router(registrar_router)

# Serve static files from uploads directory
uploads_dir = os.path.join(os.getcwd(), "uploads")
if os.path.exists(uploads_dir):
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

@app.on_event("startup")
async def startup_event():
    """Create database tables on startup."""
    create_tables()

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "University Document Management System API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
