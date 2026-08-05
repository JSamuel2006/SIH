import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 max-w-3xl">
      <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
        <span className="text-blue-400 text-xs font-bold">AI</span>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none px-5 py-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
          <span className="text-xs text-slate-400 ml-2">Searching ICMR knowledge base...</span>
        </div>
      </div>
    </div>
  );
}
