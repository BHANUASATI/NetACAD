from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status
from config import settings
from sqlalchemy.orm import Session
from models import User
import hashlib
import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    try:
        # Handle bcrypt hashes (new format from create_sample_faculty.py)
        if hashed_password.startswith('$2b$') or hashed_password.startswith('$2a$'):
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except:
        pass
    
    # Handle plain text passwords (legacy)
    if plain_password == hashed_password:
        return True
    
    # Handle SHA-256 hashes (legacy)
    if len(hashed_password) == 64 and all(c in '0123456789abcdef' for c in hashed_password.lower()):
        return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password
    
    return False

def get_password_hash(password: str) -> str:
    """Hash a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

def authenticate_user(email: str, password: str, db: Session) -> Optional[User]:
    """Authenticate a user by email and password."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None
