import React from 'react';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const SUGGESTED = [
  { text: 'How to prevent Dengue fever?', icon: '🦟' },
  { text: 'Dengue symptoms and warning signs', icon: '🌡️' },
  { text: 'National Vaccination schedule for children', icon: '💉' },
  { text: 'What is PM-JAY Ayushman Bharat?', icon: '🏥' },
  { text: 'TB elimination programme in India', icon: '🫁' },
  { text: 'Maternal health services in government hospitals', icon: '🤱' },
  { text: 'Malaria prevention measures', icon: '🦟' },
  { text: 'Symptoms of severe dehydration in children', icon: '💧' },
  { text: 'Mental health helpline numbers in India', icon: '🧠' },
  { text: 'How to make ORS at home?', icon: '🥤' },
];

export default function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="text-center">
        <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">⚕️</span>
        </div>
        <h2 className="text-lg font-bold text-slate-200">ArogyaVerse AI Health Assistant</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Ask me anything about diseases, prevention, vaccinations, government health schemes, or general health guidance — in your preferred Indian language.
        </p>
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">ICMR Grounded</span>
          <span className="text-[10px] text-blue-400 font-semibold px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full">WHO Aligned</span>
          <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full">Not a Medical Diagnosis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
        {SUGGESTED.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item.text)}
            className="flex items-center gap-2.5 px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left text-xs text-slate-300 hover:text-slate-100 transition group"
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            <span className="group-hover:text-blue-300 transition">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
