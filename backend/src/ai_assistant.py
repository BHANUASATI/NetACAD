import google.generativeai as genai
from typing import List, Dict, Optional
from datetime import datetime
import json
from config import settings
from sqlalchemy.orm import Session
from models import User, AIConversation, AIMessage

class AIAssistantService:
    def __init__(self):
        # Check for Gemini API key
        if hasattr(settings, 'GEMINI_API_KEY') and settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-flash-latest')
            self.api_available = True
            print(f"✅ Using gemini-flash-latest model (real-time AI)")
        else:
            print("Warning: Gemini API key not found in settings")
            self.model = None
            self.api_available = False
    
    async def get_ai_response(
        self, 
        message: str, 
        conversation_history: List[Dict] = None,
        user_context: Dict = None
    ) -> str:
        """Get AI response for student query"""
        try:
            if not self.api_available:
                return "AI service is not configured. Please contact administrator."
            
            # Prepare system message based on user context
            system_message = self._create_system_message(user_context)
            
            # Build conversation context
            full_prompt = system_message + "\n\n"
            
            # Add conversation history
            if conversation_history:
                for msg in conversation_history[-10:]:  # Keep last 10 messages for context
                    role = "User" if msg["sender_type"] == "user" else "Assistant"
                    full_prompt += f"{role}: {msg['content']}\n"
            
            # Add current message
            full_prompt += f"User: {message}\nAssistant: "
            
            # Make API call using Gemini
            response = self.model.generate_content(full_prompt)
            
            if response.text:
                return response.text.strip()
            else:
                print("Gemini returned empty response")
                return self._get_fallback_response(message, user_context)
            
        except Exception as e:
            print(f"Error getting Gemini response: {e}")
            # Return a helpful fallback response
            return self._get_fallback_response(message, user_context)
    
    def _create_system_message(self, user_context: Dict = None) -> str:
        """Create system message based on user context"""
        base_message = """You are an AI assistant for NetACAD, a university management system. 
        Your role is to help students with their academic problems, questions about courses, 
        assignments, and general university life. Be helpful, professional, and encouraging.
        
        You can help with:
        - Academic questions and concepts
        - Assignment guidance (but don't do the work for them)
        - Study tips and strategies
        - University procedures and policies
        - Time management and organization
        - General problem-solving
        
        Be encouraging and supportive. If you don't know something, admit it and suggest 
        where they might find help."""
        
        if user_context:
            context_info = f"\n\nStudent Context:\n"
            if user_context.get('name'):
                context_info += f"Name: {user_context['name']}\n"
            if user_context.get('course'):
                context_info += f"Course: {user_context['course']}\n"
            if user_context.get('semester'):
                context_info += f"Semester: {user_context['semester']}\n"
            if user_context.get('department'):
                context_info += f"Department: {user_context['department']}\n"
            
            base_message += context_info
        
        return base_message
    
    def create_conversation(self, db: Session, user: User, title: str = None) -> AIConversation:
        """Create new AI conversation"""
        conversation = AIConversation(
            user_id=user.id,
            title=title or f"Conversation {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            created_at=datetime.utcnow()
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        return conversation
    
    def add_message(
        self, 
        db: Session, 
        conversation_id: int, 
        content: str, 
        sender_type: str
    ) -> AIMessage:
        """Add message to conversation"""
        message = AIMessage(
            conversation_id=conversation_id,
            content=content,
            sender_type=sender_type,
            created_at=datetime.utcnow()
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        return message
    
    def get_conversation_messages(self, db: Session, conversation_id: int) -> List[AIMessage]:
        """Get all messages in a conversation"""
        return db.query(AIMessage).filter(
            AIMessage.conversation_id == conversation_id
        ).order_by(AIMessage.created_at.asc()).all()
    
    def get_user_conversations(self, db: Session, user_id: int) -> List[AIConversation]:
        """Get all conversations for a user"""
        return db.query(AIConversation).filter(
            AIConversation.user_id == user_id
        ).order_by(AIConversation.created_at.desc()).all()
    
    def delete_conversation(self, db: Session, conversation_id: int, user_id: int) -> bool:
        """Delete a conversation and all its messages"""
        conversation = db.query(AIConversation).filter(
            AIConversation.id == conversation_id,
            AIConversation.user_id == user_id
        ).first()
        
        if conversation:
            # Delete all messages first (foreign key constraint)
            db.query(AIMessage).filter(
                AIMessage.conversation_id == conversation_id
            ).delete()
            
            # Delete conversation
            db.delete(conversation)
            db.commit()
            return True
        
        return False
    
    def _get_fallback_response(self, message: str, user_context: Dict = None) -> str:
        """Get a helpful fallback response when OpenAI API is unavailable"""
        message_lower = message.lower()
        
        # Study and learning related queries
        if any(word in message_lower for word in ['study', 'learn', 'understand', 'concept', 'explain']):
            return """📚 **Study Tips & Guidance**

While I'm experiencing some technical difficulties with my AI brain, here are some proven study strategies:

**🎯 Effective Study Techniques:**
• **Active Recall**: Test yourself instead of just re-reading
• **Spaced Repetition**: Review material at increasing intervals
• **Pomodoro Technique**: Study 25 mins, break 5 mins
• **Mind Mapping**: Visual connections between concepts

**💡 For Better Understanding:**
• Break complex topics into smaller parts
• Try explaining concepts to others
• Use real-world examples
• Practice problems regularly

**📖 Resources:**
• University library and online journals
• Study groups with classmates
• Professor office hours
• Online educational platforms

Would you like more specific advice on a particular subject?"""

        # Assignment and project related queries
        elif any(word in message_lower for word in ['assignment', 'project', 'homework', 'task']):
            return """📝 **Assignment Guidance**

Here's a structured approach for tackling assignments:

**🔍 Assignment Planning:**
• Read instructions carefully and note requirements
• Break down into smaller, manageable tasks
• Set realistic deadlines for each part
• Start early to avoid last-minute stress

**✍️ Writing & Research:**
• Create an outline before writing
• Use credible academic sources
• Keep track of references
• Draft, revise, and proofread

**💻 Programming Projects:**
• Understand requirements first
• Design before coding (flowcharts/pseudocode)
• Test frequently as you build
• Comment your code for clarity

**🤝 Get Help:**
• Ask questions in class
• Form study groups
• Utilize university tutoring services
• Visit professor office hours

Remember: I'm here to guide you, but the learning happens when you do the work yourself!"""

        # Time management related queries
        elif any(word in message_lower for word in ['time', 'schedule', 'organize', 'manage', 'plan']):
            return """⏰ **Time Management Strategies**

Here's how to better manage your academic schedule:

**📅 Weekly Planning:**
• Use a planner or digital calendar
• Schedule study blocks for each subject
• Include breaks and leisure time
• Plan for assignments and exams in advance

**🎯 Daily Routines:**
• Prioritize tasks using the Eisenhower Matrix
• Use time-blocking for focused work
• Take regular breaks to maintain focus
• Set daily achievable goals

**⚡ Productivity Tips:**
• Study during your peak energy hours
• Eliminate distractions (phone, social media)
• Use the 2-minute rule for small tasks
• Review and adjust your schedule weekly

**📱 Tools & Apps:**
• Calendar apps for scheduling
• Todo apps for task management
• Focus apps to minimize distractions
• Note-taking apps for organization

Balance is key - schedule time for academics, health, and social activities!"""

        # Exam preparation related queries
        elif any(word in message_lower for word in ['exam', 'test', 'prepare', 'study for']):
            return """🎓 **Exam Preparation Guide**

Here's how to prepare effectively for exams:

**📋 Early Preparation:**
• Start studying at least 2 weeks before
• Create a study schedule covering all topics
• Identify your weak areas and focus on them
• Gather all necessary materials

**🧠 Study Techniques:**
• Use active recall (testing yourself)
• Practice with past exam papers
• Create summary sheets and flashcards
• Teach concepts to study partners

**📅 Exam Week:**
• Get adequate sleep (7-8 hours)
• Eat nutritious meals and stay hydrated
• Arrive early with all required materials
• Stay calm and read questions carefully

**⏰ During the Exam:**
• Scan all questions first
• Allocate time based on question marks
• Answer easier questions first for confidence
• Review your work if time permits

**🏥 Health & Wellness:**
• Manage stress with breathing exercises
• Take short breaks during long study sessions
• Stay positive and confident
• Seek help if feeling overwhelmed

You've got this! Proper preparation is the key to success."""

        # General greeting or help request
        elif any(word in message_lower for word in ['hello', 'hi', 'help', 'start', 'guide']):
            return """🤖 **Hello! I'm Your Academic Assistant**

I'm here to help you succeed in your academic journey! While I'm currently experiencing some technical difficulties with my advanced AI capabilities, I can still provide you with:

**📚 Academic Support:**
• Study strategies and techniques
• Assignment guidance and planning
• Time management tips
• Exam preparation advice
• Research and writing help

**🎯 How I Can Help:**
• Ask me about study methods for any subject
• Get help with assignment planning
• Learn time management strategies
• Prepare for exams effectively
• Improve your academic performance

**💡 Example Questions:**
• "How can I better understand calculus concepts?"
• "What's the best way to approach a research paper?"
• "How do I manage my study schedule?"
• "Can you help me prepare for my finals?"

Feel free to ask any academic-related questions, and I'll do my best to guide you toward success! 🌟"""

        # Default fallback for other queries
        else:
            return """🤖 **Academic Guidance Available**

I'm currently experiencing some technical difficulties, but I'm still here to help you with your academic journey!

**📚 I can assist with:**
• Study strategies and learning techniques
• Assignment planning and guidance
• Time management and organization
• Exam preparation methods
• Research and writing tips
• Academic goal setting

**💡 Try asking me about:**
• "How to study effectively for [subject]"
• "Best way to approach assignments"
• "Time management tips for students"
• "Exam preparation strategies"
• "Research paper guidance"

**🎓 Remember:**
• Your professors and university resources are valuable
• Form study groups with classmates
• Utilize the library and tutoring services
• Don't hesitate to ask for help when needed

I'm here to support your academic success. What specific area would you like guidance on?"""

# Global instance
ai_assistant_service = AIAssistantService()
