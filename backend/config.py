from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        extra="ignore"  # Allow extra fields in .env
    )
    # Database
    DATABASE_URL: str = "mysql+mysqlconnector://root:@localhost:3306/NetACAD"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005", "http://localhost:3006"]
    
    # University Email Domain
    UNIVERSITY_EMAIL_DOMAIN: str = "university.edu.in"
    
    # Email Configuration
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "")
    
    # OpenAI Configuration (deprecated - using Gemini instead)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")

    # Google Gemini Configuration
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")

# Create global settings instance
settings = Settings()
