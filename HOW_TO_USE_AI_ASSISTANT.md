# How to Use the AI Assistant

## Quick Setup

### 1. Backend Configuration
Add your OpenAI API key to the backend `.env` file:
```bash
cd backend
echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env
```

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Start the Backend Server
```bash
python main.py
```

### 4. Start the Frontend
```bash
cd frontend
npm start
```

## Using the AI Assistant

### Accessing the AI Assistant
1. Log in as a student to the NetACAD system
2. You'll see a floating **AI Help** button in the bottom-right corner
3. Click the button to open the AI assistant

### Features Available

#### 🗣️ **Chat Interface**
- Type your questions in the input field
- Press Enter or click "Send" to submit
- AI responds with helpful academic guidance

#### 💬 **Conversation Management**
- **New Chat**: Create fresh conversations for different topics
- **Chat History**: View and continue previous conversations
- **Delete Conversations**: Remove old conversations you no longer need

#### 🎯 **What You Can Ask**
The AI assistant helps with:
- **Academic Questions**: "Can you explain machine learning concepts?"
- **Study Tips**: "How can I better prepare for my exams?"
- **Assignment Guidance**: "What's the best approach for this programming project?"
- **Time Management**: "How should I organize my study schedule?"
- **University Procedures**: "What's the process for applying for internships?"

#### 📱 **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Full-screen chat interface for better readability
- Smooth animations and typing indicators

## Step-by-Step Usage

### First Time Use
1. Click the **AI Help** button
2. Click **+ New Chat** to start a conversation
3. Type your first question, e.g., "Hello, I need help with my studies"
4. Press Enter to send
5. Wait for the AI response (you'll see a typing indicator)
6. Continue the conversation by asking follow-up questions

### Continuing Conversations
1. Open the AI assistant
2. Click on any existing conversation in the list
3. View the full chat history
4. Type new messages to continue the discussion

### Managing Conversations
- **View All**: Click the back arrow to see all conversations
- **Delete**: Click the 🗑️ icon next to any conversation to remove it
- **Create New**: Click "+ New Chat" for fresh topics

## Example Conversations

### Example 1: Study Help
```
Student: "I'm struggling with understanding recursion in programming"
AI: "I'd be happy to help you understand recursion! Think of it like a function that calls itself to solve smaller versions of the same problem. Let me explain with a simple example..."
```

### Example 2: Time Management
```
Student: "How can I balance my studies with part-time work?"
AI: "Balancing work and studies requires good time management. Here are some strategies that might help: 1. Create a weekly schedule, 2. Use time-blocking techniques..."
```

### Example 3: Assignment Guidance
```
Student: "I need help structuring my research paper"
AI: "I can guide you through structuring your research paper! A typical structure includes: 1. Introduction with thesis statement, 2. Literature review, 3. Methodology..."
```

## Tips for Best Results

### ✅ **Do's**
- Be specific with your questions
- Provide context about your course/subject
- Ask follow-up questions for clarification
- Use it for study guidance, not to do your work

### ❌ **Don'ts**
- Don't ask the AI to do your assignments for you
- Don't share personal sensitive information
- Don't rely solely on AI for important decisions
- Don't use inappropriate language

## Privacy & Security

- Your conversations are private and only visible to you
- Chat history is stored for context but can be deleted anytime
- Only students can access the AI assistant
- All communications are secure and encrypted

## Troubleshooting

### Common Issues

#### "AI isn't responding"
- Check your internet connection
- Verify the backend server is running
- Ensure OpenAI API key is configured correctly

#### "Can't access AI assistant"
- Make sure you're logged in as a student
- Check that your account is active
- Try refreshing the page

#### "Conversation not saving"
- Check your internet connection
- Try creating a new conversation
- Contact support if the issue persists

### Getting Help
If you encounter issues:
1. Check the backend console for error messages
2. Verify your OpenAI API key is valid
3. Ensure all dependencies are installed correctly

## Cost Considerations

- Each message uses OpenAI API tokens
- The system uses GPT-3.5-turbo for cost efficiency
- Monitor your OpenAI dashboard for usage
- Consider setting usage limits if needed

## Advanced Features

### Context Awareness
The AI knows:
- Your name and course information
- Your current semester and department
- Your academic context for better responses

### Smart Responses
The AI provides:
- Subject-specific guidance
- Study strategies tailored to your field
- University-specific advice when relevant

## Future Enhancements

Coming soon:
- Voice input/output capabilities
- Integration with university knowledge base
- Multi-language support
- Advanced study analytics
- Collaborative study sessions
