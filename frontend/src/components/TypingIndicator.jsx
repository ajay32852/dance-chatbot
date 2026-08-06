import React from 'react';

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="flex items-start gap-2 max-w-[85%]">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-dance-purple to-purple-400 flex items-center justify-center text-sm text-white shadow-md">
          🤖
        </div>

        {/* Typing bubble */}
        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-md border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-dance-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-dance-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-dance-pink rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs text-gray-500">Dancing through the database...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
