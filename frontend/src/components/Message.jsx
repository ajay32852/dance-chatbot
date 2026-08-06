import React from 'react';

function Message({ role, content, sources, timestamp }) {
  const isUser = role === 'user';

  // Format timestamp
  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`flex items-start gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md ${
          isUser 
            ? 'bg-gradient-to-br from-dance-pink to-pink-400 text-white' 
            : 'bg-gradient-to-br from-dance-purple to-purple-400 text-white'
        }`}>
          {isUser ? '👤' : '🤖'}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col">
          <div className={`px-4 py-3 rounded-2xl shadow-md break-words ${
            isUser
              ? 'bg-gradient-to-br from-dance-pink to-pink-500 text-white rounded-tr-sm'
              : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
          }`}>
            {/* Content */}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>

            {/* Sources (only for assistant) */}
            {sources && sources.length > 0 && !isUser && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1.5 font-semibold">
                  📚 Sources:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sources.map((src, i) => (
                    <span
                      key={i}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium"
                    >
                      {src.category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timestamp */}
          {time && (
            <span className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'} px-2`}>
              {time}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
