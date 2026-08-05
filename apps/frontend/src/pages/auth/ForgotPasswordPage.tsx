import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto my-16 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Reset Account Access</h2>
          <p className="text-xs text-slate-400">Enter your registered official email or mobile number</p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-center space-y-2 text-xs">
            <div className="font-bold text-emerald-300">Reset Link Dispatched</div>
            <p className="text-slate-400">An authentication link has been sent to {email}. Check your inbox.</p>
            <Link to="/login" className="inline-block mt-2 text-blue-400 font-semibold hover:underline">Return to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email / Mobile Number</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@mohfw.gov.in"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition"
            >
              Send Reset Link →
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
