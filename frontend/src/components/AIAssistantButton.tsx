import React, { useState } from 'react';
import AIAssistant from './AIAssistant';
import AIDebugInfo from './AIDebugInfo';
import './AIAssistantButton.css';

const AIAssistantButton: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const toggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen);
  };

  return (
    <>
      <button 
        className="ai-assistant-fab"
        onClick={toggleAssistant}
        title="AI Assistant"
      >
        <div className="ai-icon-container">
          <svg 
            className="ai-robot-icon"
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <style>
              {`
                @keyframes robotFloat {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-3px); }
                }
                @keyframes robotBlink {
                  0%, 90%, 100% { opacity: 1; }
                  95% { opacity: 0; }
                }
                @keyframes robotAntenna {
                  0%, 100% { transform: rotate(0deg); }
                  25% { transform: rotate(-10deg); }
                  75% { transform: rotate(10deg); }
                }
                .ai-robot-icon {
                  animation: robotFloat 3s ease-in-out infinite;
                }
                .robot-eye {
                  animation: robotBlink 4s ease-in-out infinite;
                }
                .robot-antenna {
                  animation: robotAntenna 2s ease-in-out infinite;
                  transform-origin: center;
                }
              `}
            </style>
            
            {/* Robot Head */}
            <rect x="6" y="8" width="12" height="10" rx="2" fill="white" opacity="0.9"/>
            
            {/* Robot Eyes */}
            <circle cx="9" cy="12" r="1.5" fill="#667eea" className="robot-eye"/>
            <circle cx="15" cy="12" r="1.5" fill="#667eea" className="robot-eye"/>
            
            {/* Robot Mouth */}
            <rect x="10" y="15" width="4" height="1" rx="0.5" fill="#667eea"/>
            
            {/* Robot Antenna */}
            <line x1="12" y1="8" x2="12" y2="6" stroke="white" strokeWidth="1.5" className="robot-antenna"/>
            <circle cx="12" cy="5" r="1" fill="#667eea" className="robot-antenna"/>
            
            {/* Robot Body */}
            <rect x="8" y="18" width="8" height="4" rx="1" fill="white" opacity="0.8"/>
            
            {/* Robot Arms */}
            <rect x="5" y="19" width="3" height="1" rx="0.5" fill="white" opacity="0.8"/>
            <rect x="16" y="19" width="3" height="1" rx="0.5" fill="white" opacity="0.8"/>
          </svg>
          
          {/* Animated Pulse Ring */}
          <div className="ai-pulse-ring"></div>
        </div>
        
        <span className="fab-text">AI Help</span>
      </button>
      
      <AIAssistant 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)} 
      />
    </>
  );
};

export default AIAssistantButton;
