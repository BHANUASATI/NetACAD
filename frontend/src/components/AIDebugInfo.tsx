import React from 'react';

interface AIDebugInfoProps {
  messages: any[];
  isLoading: boolean;
  currentConversation: any;
  conversations: any[];
}

const AIDebugInfo: React.FC<AIDebugInfoProps> = ({ 
  messages, 
  isLoading, 
  currentConversation, 
  conversations 
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 10000,
      maxWidth: '300px'
    }}>
      <h4>AI Assistant Debug Info</h4>
      <div><strong>Conversations:</strong> {conversations.length}</div>
      <div><strong>Current Conv ID:</strong> {currentConversation?.id || 'None'}</div>
      <div><strong>Messages:</strong> {messages.length}</div>
      <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
      
      <div style={{marginTop: '10px'}}>
        <strong>Last 3 Messages:</strong>
        {messages.slice(-3).map((msg, idx) => (
          <div key={idx} style={{fontSize: '10px', marginBottom: '5px'}}>
            <div>{msg.sender_type}: {msg.content?.substring(0, 50)}...</div>
            <div>ID: {msg.id}, Time: {msg.created_at}</div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => console.log('AI Debug State:', {
          messages,
          isLoading,
          currentConversation,
          conversations
        })}
        style={{
          marginTop: '10px',
          padding: '5px',
          background: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        Log to Console
      </button>
    </div>
  );
};

export default AIDebugInfo;
