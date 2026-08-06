import React from 'react';

function Header({ isOnline }) {
  return (
    <div className="bg-white rounded-t-2xl shadow-xl p-4 flex items-center gap-3 border-b-4 border-dance-pink">
      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dance-pink to-dance-purple flex items-center justify-center text-2xl shadow-lg">
          💃
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}></div>
      </div>

      {/* Title */}
      <div className="flex-1">
        <h1 className="text-xl font-bold text-gray-800">
          Rhythm Dance Academy
        </h1>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          {isOnline ? 'AI Assistant Online' : 'Connecting...'}
        </p>
      </div>

      {/* Menu icon */}
      <button className="text-gray-400 hover:text-gray-600 transition">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
        </svg>
      </button>
    </div>
  );
}

export default Header;
