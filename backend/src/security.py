from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status
from app_config import settings
import hashlib

# Password hashing using SHA-256
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    # Handle plain text passwords
    if plain_password == hashed_password:
        return True
    # Handle SHA-256 hashes
    if len(hashed_password) == 64 and all(c in '0123456789abcdef' for c in hashed_password.lower()):
        return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password
    return False

def get_password_hash(password: str) -> str:
    """Generate password hash using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return email."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None

def authenticate_user(email: str, password: str, user_obj) -> Optional[bool]:
    """Authenticate user credentials."""
    if not user_obj:
        return False
    if not verify_password(password, user_obj.password_hash):
        return False
    return True
