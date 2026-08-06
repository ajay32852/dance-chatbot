import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import QuickQuestions from './QuickQuestions';
import ChatInput from './ChatInput';
import { sendMessage, checkHealth } from '../services/api';

function ChatWindow() {
  // State
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! 👋 Welcome to **Rhythm Dance Academy**! I'm your AI assistant. I can help you with information about our classes, schedules, pricing, and instructors. What would you like to know? 💃🕺",
      sources: [],
      timestamp: new Date().toISOString(),
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      const health = await checkHealth();
      setIsOnline(health.status === 'healthy');
    };
    checkBackend();
    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle sending message
  const handleSend = async (messageText) => {
    const userMessage = (messageText || '').trim();
    if (!userMessage || loading) return;

    setError(null);

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      sources: [],
      timestamp: new Date().toISOString(),
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Call API
      const response = await sendMessage(userMessage, messages);
      
      if (response.success) {
        // Add assistant response
        const botMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.answer,
          sources: response.sources || [],
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(response.error || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
      // Add error message
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `⚠️ ${err.message}\n\nPlease make sure:\n• Ollama is running (\`ollama serve\`)\n• Backend is running (\`python main.py\`)\n• Try again in a moment`,
        sources: [],
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Clear chat
  const clearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([
        {
          id: 1,
          role: 'assistant',
          content: "Chat cleared! 👋 How can I help you today?",
          sources: [],
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-2 sm:p-4">
      {/* Header with clear button */}
      <div className="relative">
        <Header isOnline={isOnline} />
        {messages.length > 1 && (
          <button
            onClick={clearChat}
            className="absolute top-4 right-16 text-xs text-gray-500 hover:text-dance-pink transition px-2 py-1 rounded"
            title="Clear chat"
          >
            🗑️ Clear
          </button>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700">
          <p className="font-semibold">⚠️ {error}</p>
        </div>
      )}

      {/* Messages container */}
      <div
        ref={chatContainerRef}
        className="flex-1 bg-white/95 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 shadow-inner chat-scroll"
      >
        {messages.map((msg) => (
          <Message key={msg.id} {...msg} />
        ))}

        {/* Typing indicator */}
        {loading && <TypingIndicator />}

        {/* Quick questions (only at start) */}
        {messages.length === 1 && !loading && (
          <QuickQuestions onSelect={handleSend} disabled={loading} />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}

export default ChatWindow;
