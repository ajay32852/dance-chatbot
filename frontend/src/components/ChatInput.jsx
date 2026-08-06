import React, { useState, useRef } from 'react';

function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-b-2xl shadow-xl p-4 border-t-4 border-dance-pink">
      <div className="flex gap-2 items-end">
        {/* Input field */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about classes, schedules, pricing..."
            disabled={disabled}
            maxLength={500}
            className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-dance-pink transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
          />
          {/* Character count */}
          {input.length > 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {input.length}/500
            </span>
          )}
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-5 py-3 bg-gradient-to-r from-dance-pink to-dance-purple text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          {disabled ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="hidden sm:inline">Sending</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Send</span>
              <span>🚀</span>
            </>
          )}
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-400 mt-2 text-center">
        Powered by AI • Responses based on our knowledge base
      </p>
    </form>
  );
}

export default ChatInput;
