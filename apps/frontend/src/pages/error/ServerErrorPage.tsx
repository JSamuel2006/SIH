import React from 'react';
import { Link } from 'react-router-dom';
import { ServerCrash, ArrowLeft } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';

export default function ServerErrorPage() {
  return (
    <PublicLayout>
      <div className="max-w-md mx-auto my-20 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-2xl">
        <div className="w-16 h-16 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ServerCrash className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">500 - Server Exception</h1>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          An unexpected microservice error occurred while processing your request. The incident has been logged for system administrator review.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Platform Home
        </Link>
      </div>
    </PublicLayout>
  );
}
