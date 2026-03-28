from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from database import Base
from models import User
from datetime import datetime
import enum

class EventType(enum.Enum):
    ACADEMIC = "academic"
    PERSONAL = "personal"

class EventStatus(enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Priority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class RiskLevel(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    event_type = Column(Enum(EventType), nullable=False)
    status = Column(Enum(EventStatus), default=EventStatus.PENDING)
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    risk_level = Column(Enum(RiskLevel), default=RiskLevel.LOW)
    
    # Date and time
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime)
    alert_date = Column(DateTime)  # When to send alert
    
    # Location and category
    location = Column(String(255))
    category = Column(String(100))
    
    # Alert settings
    alert_message = Column(Text)
    alert_enabled = Column(Boolean, default=False)
    alert_sent = Column(Boolean, default=False)
    
    # Relationships
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Update User model to include calendar events relationship
# This should be added to the User model in models.py
# calendar_events = relationship("CalendarEvent", back_populates="user")
