import React, { useState, useEffect, useRef } from 'react';
import { aiAssistantService } from '../services/api';
import './AIAssistant.css';
import AIDebugInfo from './AIDebugInfo';

interface Message {
  id: number;
  content: string;
  sender_type: 'user' | 'ai';
  created_at: string;
}

interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const data = await aiAssistantService.getConversations() as Conversation[];
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const newConversation = await aiAssistantService.createConversation() as Conversation;
      setConversations([newConversation, ...conversations]);
      setCurrentConversation(newConversation);
      setMessages([]);
      setShowConversationList(false);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const loadConversation = async (conversationId: number) => {
    try {
      const data = await aiAssistantService.getConversation(conversationId.toString()) as any;
      setCurrentConversation(data);
      setMessages(data.messages || []);
      setShowConversationList(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentConversation) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('🔍 Sending message to AI:', userMessage);
      const response = await aiAssistantService.sendMessage(
        currentConversation.id.toString(),
        userMessage
      ) as any;
      
      console.log('🔍 AI Response received:', response);
      console.log('🔍 User message:', response.user_message);
      console.log('🔍 AI message:', response.ai_message);
      
      setMessages([...messages, response.user_message, response.ai_message]);
      console.log('🔍 Messages updated:', messages.length + 2);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages([...messages, {
        id: Date.now(),
        content: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender_type: 'ai',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (conversationId: number) => {
    try {
      await aiAssistantService.deleteConversation(conversationId.toString());
      setConversations(conversations.filter(c => c.id !== conversationId));
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
        setShowConversationList(true);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="ai-assistant-overlay">
      <div className="ai-assistant-modal">
        <div className="ai-assistant-header">
          <h3>AI Assistant</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="ai-assistant-content">
          {showConversationList ? (
            <div className="conversation-list">
              <div className="conversation-list-header">
                <div className="header-content">
                  <div className="ai-welcome-icon">
                    <svg 
                      width="40" 
                      height="40" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <style>
                        {`
                          @keyframes welcomeFloat {
                            0%, 100% { transform: translateY(0px) rotate(0deg); }
                            50% { transform: translateY(-5px) rotate(5deg); }
                          }
                          @keyframes welcomeSparkle {
                            0%, 100% { opacity: 0; transform: scale(0); }
                            50% { opacity: 1; transform: scale(1); }
                          }
                          .ai-welcome-icon {
                            animation: welcomeFloat 3s ease-in-out infinite;
                          }
                          .sparkle {
                            animation: welcomeSparkle 2s ease-in-out infinite;
                          }
                        `}
                      </style>
                      
                      {/* Robot Body */}
                      <rect x="7" y="10" width="10" height="8" rx="2" fill="url(#robotGradient)" />
                      
                      {/* Robot Head */}
                      <rect x="8" y="6" width="8" height="6" rx="1.5" fill="url(#robotGradient)" />
                      
                      {/* Robot Eyes */}
                      <circle cx="10" cy="8" r="1" fill="#667eea" />
                      <circle cx="14" cy="8" r="1" fill="#667eea" />
                      
                      {/* Robot Mouth */}
                      <path d="M10 10 Q12 11 14 10" stroke="#667eea" strokeWidth="0.5" fill="none" />
                      
                      {/* Robot Antenna */}
                      <line x1="12" y1="6" x2="12" y2="4" stroke="#667eea" strokeWidth="1" />
                      <circle cx="12" cy="3" r="0.5" fill="#667eea" className="sparkle" />
                      
                      {/* Sparkles */}
                      <circle cx="6" cy="8" r="0.5" fill="#667eea" className="sparkle" style={{ animationDelay: '0.5s' }} />
                      <circle cx="18" cy="10" r="0.5" fill="#667eea" className="sparkle" style={{ animationDelay: '1s' }} />
                      <circle cx="16" cy="14" r="0.5" fill="#667eea" className="sparkle" style={{ animationDelay: '1.5s' }} />
                      
                      {/* Gradient Definition */}
                      <defs>
                        <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="header-text">
                    <h4>AI Assistant</h4>
                    <p>Your academic companion</p>
                  </div>
                </div>
                <button className="new-conversation-btn" onClick={createNewConversation}>
                  + New Chat
                </button>
              </div>
              
              <div className="conversations">
                {conversations.length === 0 ? (
                  <div className="no-conversations">
                    <p>No conversations yet. Start a new chat!</p>
                  </div>
                ) : (
                  conversations.map(conversation => (
                    <div key={conversation.id} className="conversation-item">
                      <div 
                        className="conversation-info"
                        onClick={() => loadConversation(conversation.id)}
                      >
                        <div className="conversation-title">{conversation.title}</div>
                        <div className="conversation-date">
                          {formatDate(conversation.updated_at)}
                        </div>
                      </div>
                      <button 
                        className="delete-conversation-btn"
                        onClick={() => deleteConversation(conversation.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="chat-view">
              <div className="chat-header">
                <button 
                  className="back-button"
                  onClick={() => setShowConversationList(true)}
                >
                  ← Back
                </button>
                <h4>{currentConversation?.title}</h4>
              </div>
              
              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="welcome-message">
                    <div className="welcome-robot">
                      <svg 
                        width="60" 
                        height="60" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <style>
                          {`
                            @keyframes welcomeRobotFloat {
                              0%, 100% { transform: translateY(0px) rotate(0deg); }
                              50% { transform: translateY(-8px) rotate(3deg); }
                            }
                            @keyframes welcomeRobotBlink {
                              0%, 90%, 100% { opacity: 1; }
                              95% { opacity: 0; }
                            }
                            @keyframes welcomeRobotWave {
                              0%, 100% { transform: rotate(0deg); }
                              25% { transform: rotate(-15deg); }
                              75% { transform: rotate(15deg); }
                            }
                            .welcome-robot svg {
                              animation: welcomeRobotFloat 4s ease-in-out infinite;
                            }
                            .welcome-robot-eye {
                              animation: welcomeRobotBlink 5s ease-in-out infinite;
                            }
                            .welcome-robot-arm {
                              animation: welcomeRobotWave 2s ease-in-out infinite;
                              transform-origin: 12px 14px;
                            }
                          `}
                        </style>
                        
                        {/* Robot Body */}
                        <rect x="6" y="12" width="12" height="8" rx="2" fill="url(#welcomeRobotGradient)" opacity="0.9"/>
                        
                        {/* Robot Head */}
                        <rect x="7" y="6" width="10" height="7" rx="2" fill="url(#welcomeRobotGradient)" />
                        
                        {/* Robot Eyes */}
                        <circle cx="9.5" cy="9" r="1.2" fill="#667eea" className="welcome-robot-eye"/>
                        <circle cx="14.5" cy="9" r="1.2" fill="#667eea" className="welcome-robot-eye"/>
                        
                        {/* Robot Mouth */}
                        <path d="M10 11 Q12 12.5 14 11" stroke="#667eea" strokeWidth="1" fill="none" />
                        
                        {/* Robot Antenna */}
                        <line x1="12" y1="6" x2="12" y2="3" stroke="#667eea" strokeWidth="1.5" />
                        <circle cx="12" cy="2" r="1" fill="#667eea" />
                        
                        {/* Robot Arms */}
                        <rect x="4" y="13" width="3" height="1.5" rx="0.5" fill="url(#welcomeRobotGradient)" className="welcome-robot-arm" />
                        <rect x="17" y="13" width="3" height="1.5" rx="0.5" fill="url(#welcomeRobotGradient)" />
                        
                        {/* Gradient Definition */}
                        <defs>
                          <linearGradient id="welcomeRobotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#667eea" />
                            <stop offset="100%" stopColor="#764ba2" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="welcome-text">
                      <h3>Hello! I'm your AI Assistant 🤖</h3>
                      <p>I'm here to help you with your studies, assignments, and academic questions. What can I help you with today?</p>
                    </div>
                  </div>
                ) : (
                  messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`message ${message.sender_type === 'user' ? 'user-message' : 'ai-message'}`}
                    >
                      <div className="message-content">
                        {message.content}
                      </div>
                      <div className="message-time">
                        {formatDate(message.created_at)}
                      </div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="message ai-message">
                    <div className="message-content typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <div className="input-container">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e)}
                  placeholder="Type your message..."
                  className="message-input"
                  rows={1}
                  disabled={isLoading}
                />
                <button 
                  className="send-button"
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
