import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Shield, CheckCircle } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [abhaId, setAbhaId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto my-12 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Register ABHA Health Account</h2>
          <p className="text-xs text-slate-400">Connect your ABHA ID with ArogyaVerse AI Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">14-Digit ABHA ID</label>
            <input
              type="text"
              required
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              placeholder="12-3456-7890-1234"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-lg shadow-blue-600/20"
          >
            Register & Link ABHA →
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Already registered? <Link to="/login" className="text-blue-400 font-semibold hover:underline">Sign In</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
