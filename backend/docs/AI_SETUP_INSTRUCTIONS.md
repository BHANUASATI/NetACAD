# AI Assistant Setup Instructions

## Overview
The AI Assistant has been integrated into NetACAD to help students solve problems and get academic guidance. It uses OpenAI's GPT-3.5-turbo model to provide intelligent responses.

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure OpenAI API Key
Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Database Migration
The AI assistant uses two new database tables:
- `ai_conversations` - Stores conversation metadata
- `ai_messages` - Stores individual messages

Run the application to automatically create these tables:
```bash
python main.py
```

## Frontend Setup

### 1. Add AI Assistant to Student Dashboard
Import and add the AIAssistantButton component to your student dashboard:

```tsx
import AIAssistantButton from '../components/AIAssistantButton';

// In your student dashboard component
return (
  <div>
    {/* Your existing dashboard content */}
    <AIAssistantButton />
  </div>
);
```

### 2. Features Available
- **Conversation Management**: Create, view, and delete conversations
- **Real-time Chat**: Send messages and receive AI responses
- **Context Awareness**: AI knows student's course, semester, and department
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

### Authentication Required
All endpoints require a valid JWT token and are restricted to students only.

### Conversations
- `GET /api/ai/conversations` - Get all user conversations
- `POST /api/ai/conversations` - Create new conversation
- `GET /api/ai/conversations/{id}` - Get conversation with messages
- `DELETE /api/ai/conversations/{id}` - Delete conversation

### Chat
- `POST /api/ai/conversations/{id}/messages` - Send message and get AI response
- `POST /api/ai/chat` - Quick chat without conversation (for simple queries)

## AI Capabilities

The AI assistant is configured to help students with:
- Academic questions and concepts
- Assignment guidance (without doing the work)
- Study tips and strategies
- University procedures and policies
- Time management and organization
- General problem-solving

## Security & Privacy

- Only students can access the AI assistant
- All conversations are private to the individual student
- Messages are stored in the database for context
- OpenAI API calls are made securely

## Customization

### System Prompt
The AI's behavior can be customized by modifying the `_create_system_message` method in `ai_assistant.py`.

### Model Settings
Change the OpenAI model, temperature, and token limits in the `get_ai_response` method.

## Troubleshooting

### Common Issues
1. **API Key Error**: Ensure OPENAI_API_KEY is set in `.env`
2. **Database Error**: Check that database tables were created
3. **Permission Error**: Verify user is logged in as a student
4. **CORS Error**: Ensure frontend URL is in ALLOWED_ORIGINS

### Logs
Check the backend console for error messages and API call status.

## Cost Considerations

- Each message consumes OpenAI API tokens
- Monitor usage in your OpenAI dashboard
- Consider implementing rate limiting if needed
- Current implementation uses GPT-3.5-turbo for cost efficiency

## Future Enhancements

- Add conversation export functionality
- Implement message search
- Add voice input/output
- Integrate with university knowledge base
- Add multi-language support
