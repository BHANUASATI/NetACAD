from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import models, schemas
from database import get_db
from ai_assistant import ai_assistant_service
from dependencies import get_current_user

router = APIRouter()

@router.post("/conversations", response_model=schemas.AIConversationResponse)
async def create_conversation(
    conversation_data: schemas.AIConversationCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new AI conversation"""
    # Only students can create conversations
    if current_user.role != models.UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can create AI conversations"
        )
    
    conversation = ai_assistant_service.create_conversation(
        db, current_user, conversation_data.title
    )
    
    return conversation

@router.get("/conversations", response_model=List[schemas.AIConversationResponse])
async def get_conversations(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for the current user"""
    if current_user.role != models.UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access AI conversations"
        )
    
    conversations = ai_assistant_service.get_user_conversations(db, current_user.id)
    return conversations

@router.get("/conversations/{conversation_id}", response_model=schemas.AIConversationDetailResponse)
async def get_conversation(
    conversation_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific conversation with all messages"""
    if current_user.role != models.UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access AI conversations"
        )
    
    # Verify conversation belongs to user
    conversation = db.query(models.AIConversation).filter(
        models.AIConversation.id == conversation_id,
        models.AIConversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    messages = ai_assistant_service.get_conversation_messages(db, conversation_id)
    
    return {
        "id": conversation.id,
        "title": conversation.title,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "messages": messages
    }

@router.post("/conversations/{conversation_id}/messages", response_model=schemas.AIChatResponse)
async def send_message(
    conversation_id: int,
    message_data: schemas.AIMessageCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message and get AI response"""
    if current_user.role != models.UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can send messages to AI"
        )
    
    # Verify conversation belongs to user
    conversation = db.query(models.AIConversation).filter(
        models.AIConversation.id == conversation_id,
        models.AIConversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    # Save user message
    user_message = ai_assistant_service.add_message(
        db, conversation_id, message_data.content, "user"
    )
    
    # Get conversation history for context
    messages = ai_assistant_service.get_conversation_messages(db, conversation_id)
    conversation_history = [
        {
            "sender_type": msg.sender_type,
            "content": msg.content
        }
        for msg in messages[:-1]  # Exclude the just-added user message
    ]
    
    # Prepare user context
    user_context = {
        "name": f"{current_user.student.first_name} {current_user.student.last_name}" if current_user.student else f"Student {current_user.id}",
        "course": current_user.student.department.name if current_user.student and current_user.student.department else "Not specified",
        "semester": str(current_user.student.semester) if current_user.student else "Not specified",
        "department": current_user.student.department.name if current_user.student and current_user.student.department else "Not specified"
    }
    
    # Get AI response
    ai_response_content = await ai_assistant_service.get_ai_response(
        message_data.content,
        conversation_history,
        user_context
    )
    
    # Save AI response
    ai_message = ai_assistant_service.add_message(
        db, conversation_id, ai_response_content, "ai"
    )
    
    # Update conversation timestamp
    conversation.updated_at = datetime.utcnow()
    db.commit()
    
    return {
        "user_message": user_message,
        "ai_message": ai_message
    }

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a conversation"""
    if current_user.role != models.UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can delete AI conversations"
        )
    
    success = ai_assistant_service.delete_conversation(db, conversation_id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    return {"message": "Conversation deleted successfully"}

@router.post("/chat", response_model=schemas.AIChatResponse)
async def quick_chat(
    message_data: schemas.AIQuickChat,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Quick chat without creating a conversation (for simple queries)"""
    if current_user.role != models.UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can use AI chat"
        )
    
    # Prepare user context
    user_context = {
        "name": f"{current_user.student.first_name} {current_user.student.last_name}" if current_user.student else f"Student {current_user.id}",
        "course": current_user.student.department.name if current_user.student and current_user.student.department else "Not specified",
        "semester": str(current_user.student.semester) if current_user.student else "Not specified",
        "department": current_user.student.department.name if current_user.student and current_user.student.department else "Not specified"
    }
    
    # Get AI response
    ai_response_content = await ai_assistant_service.get_ai_response(
        message_data.content,
        [],
        user_context
    )
    
    # Create temporary message objects for response
    user_message = models.AIMessage(
        content=message_data.content,
        sender_type="user",
        created_at=datetime.utcnow()
    )
    
    ai_message = models.AIMessage(
        content=ai_response_content,
        sender_type="ai",
        created_at=datetime.utcnow()
    )
    
    return {
        "user_message": user_message,
        "ai_message": ai_message
    }
