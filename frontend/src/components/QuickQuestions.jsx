import React from 'react';

const QUESTIONS = [
  { text: "What classes do you offer?", icon: "💃" },
  { text: "How much do classes cost?", icon: "💰" },
  { text: "I'm a beginner, what should I start with?", icon: "🌱" },
  { text: "Do you have kids classes?", icon: "👶" },
  { text: "What are your hours?", icon: "🕐" },
  { text: "Do you offer private lessons?", icon: "👯" },
];

function QuickQuestions({ onSelect, disabled }) {
  return (
    <div className="px-4 py-3 animate-slide-up">
      <p className="text-xs text-gray-500 mb-2 font-semibold">💡 Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => !disabled && onSelect(q.text)}
            disabled={disabled}
            className="text-xs bg-white/90 hover:bg-white text-gray-700 hover:text-dance-purple px-3 py-1.5 rounded-full border border-gray-200 hover:border-dance-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
          >
            <span className="mr-1">{q.icon}</span>
            {q.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickQuestions;
