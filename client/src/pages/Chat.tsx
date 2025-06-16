import React, { useState, useEffect, useRef } from 'react';
import useChat from '../hooks/useChat';
import { FiSend, FiSun, FiMoon, FiCopy, FiDownload } from 'react-icons/fi';
import { BsRobot, BsLightbulb } from 'react-icons/bs';
import { toast } from 'react-toastify';

const Chat: React.FC = () => {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    loading,
    bottomRef,
    error,
  } = useChat();

  const [darkMode, setDarkMode] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [typingDots, setTypingDots] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Enhanced prompt templates with emojis
  const templates = [
    "🚀 Explain quantum computing simply",
    "🥗 Suggest healthy meal ideas",
    "🐍 Help debug this Python code",
    "⏱️ Recommend productivity tips",
    "💡 Explain like I'm 5 years old",
    "🌍 Current world news summary"
  ];

  // Typing indicator animation
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setTypingDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 300);
      return () => clearInterval(interval);
    } else {
      setTypingDots('');
    }
  }, [loading]);

  // Toggle dark mode with localStorage persistence
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);
  }, []);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200 // Max height of 200px
      )}px`;
    }
  }, [input]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Export chat
  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.sender === 'user' ? 'You' : 'AI Assistant'}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
  };

  return (
    <div className={`h-screen flex flex-col transition-all duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`p-4 flex justify-between items-center border-b transition-all duration-300 ${
        darkMode 
          ? 'border-indigo-900 bg-gradient-to-r from-gray-800 to-gray-900' 
          : 'border-indigo-100 bg-gradient-to-r from-white to-gray-50'
      }`}>
        <div className="flex items-center space-x-3">
          <BsRobot className={`text-3xl transition-all duration-300 ${
            darkMode 
              ? 'text-indigo-400 hover:text-indigo-300' 
              : 'text-indigo-600 hover:text-indigo-500'
          }`} />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            AI Assistant
          </h1>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowTemplates(!showTemplates)}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'hover:bg-gray-700 text-yellow-400 hover:text-yellow-300' 
                : 'hover:bg-gray-100 text-yellow-600 hover:text-yellow-500'
            }`}
            title="Prompt templates"
          >
            <BsLightbulb className={`text-xl ${showTemplates ? 'animate-bounce' : ''}`} />
          </button>
          
          <button 
            onClick={exportChat}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'hover:bg-gray-700 text-emerald-400 hover:text-emerald-300' 
                : 'hover:bg-gray-100 text-emerald-600 hover:text-emerald-500'
            }`}
            title="Export chat"
          >
            <FiDownload className="text-lg" />
          </button>
          
          <button 
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'hover:bg-gray-700 text-amber-400 hover:text-amber-300' 
                : 'hover:bg-gray-100 text-amber-600 hover:text-amber-500'
            }`}
            title="Toggle theme"
          >
            {darkMode ? <FiSun className="text-lg animate-spin-slow" /> : <FiMoon className="text-lg" />}
          </button>
        </div>
      </header>

      {/* Prompt Templates Panel */}
      {showTemplates && (
        <div className={`p-4 border-b transition-all duration-300 ${
          darkMode 
            ? 'border-indigo-900 bg-gray-800' 
            : 'border-indigo-100 bg-indigo-50'
        }`}>
          <h3 className={`mb-3 font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ✨ Quick Start Prompts
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(template);
                  setShowTemplates(false);
                  textareaRef.current?.focus();
                }}
                className={`p-3 text-sm rounded-lg transition-all duration-200 text-left ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white' 
                    : 'bg-white hover:bg-indigo-100 border border-indigo-200 text-gray-800'
                }`}
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 transition-all duration-300 ${
        darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-gray-100'
      }`}>
        {messages.length === 0 && (
          <div className={`h-full flex flex-col items-center justify-center text-center p-8 transition-all duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-500'
          }`}>
            <BsRobot className="text-5xl mb-4 opacity-70" />
            <h3 className="text-2xl font-medium mb-2">How can I help you today?</h3>
            <p className="max-w-md">Try asking a question or click the <span className="text-yellow-500">💡 lightbulb</span> for prompt ideas</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-xl p-4 transition-all duration-200 ${
                msg.sender === 'user' 
                  ? darkMode 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-indigo-500 text-white shadow-md'
                  : darkMode 
                    ? 'bg-gray-700 text-gray-100 shadow-lg' 
                    : 'bg-white text-gray-800 border border-gray-200 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">
                  {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                </span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(msg.text);
                    toast.success('Copied to clipboard!');
                  }}
                  className={`opacity-70 hover:opacity-100 p-1 transition-all duration-200 ${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Copy message"
                >
                  <FiCopy size={16} />
                </button>
              </div>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className={`max-w-3xl rounded-xl p-4 transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300' 
                : 'bg-white text-gray-700 border border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Thinking</span>
                <span className="inline-block w-6 text-left">{typingDots}</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className={`p-4 rounded-xl text-center transition-all duration-300 ${
            darkMode 
              ? 'bg-red-800/80 text-red-100' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className={`p-4 transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800 border-t border-gray-700' 
          : 'bg-white border-t border-gray-200'
      }`}>
        <div className="flex items-end space-x-3">
          <textarea
            ref={textareaRef}
            rows={1}
            className={`flex-1 p-4 rounded-xl focus:outline-none focus:ring-2 resize-none overflow-y-auto max-h-48 ${
              darkMode 
                ? 'bg-gray-700 text-white focus:ring-indigo-500 placeholder-gray-400'
                : 'bg-gray-100 text-gray-800 focus:ring-indigo-400 placeholder-gray-500'
            }`}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={loading}
            style={{ minHeight: '60px' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || input.trim() === ''}
            className={`p-4 mb-1 rounded-xl flex items-center justify-center transition-all duration-300 ${
              loading || input.trim() === '' 
                ? darkMode 
                  ? 'bg-gray-600 text-gray-400' 
                  : 'bg-gray-200 text-gray-400'
                : darkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md'
            }`}
          >
            <FiSend className="text-lg" />
          </button>
        </div>
        <div className={`text-xs mt-1 flex justify-between ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <span>
            {input.split('\n').length > 3 && (
              <span>Long message ({input.split('\n').length} lines)</span>
            )}
          </span>
          <span>
            {input.length > 100 && `${input.length}/500`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chat;