import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Smartphone, UserCheck } from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import PublicLayout from '../../layouts/PublicLayout';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('ROLE_OFFICER');
  const [name, setName] = useState('');
  const [abhaId, setAbhaId] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role, name || (role === 'ROLE_OFFICER' ? 'Dr. Rajesh Sharma' : 'Ananya Verma'), abhaId);
    if (role === 'ROLE_OFFICER') navigate('/officer/dashboard');
    else if (role === 'ROLE_ADMIN') navigate('/admin/dashboard');
    else navigate('/citizen/dashboard');
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto my-12 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Sign In to ArogyaVerse AI</h2>
          <p className="text-xs text-slate-400 mt-1">Select your access role & authenticate via DigiLocker / ABHA / Phone OTP</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-500"
            >
              <option value="ROLE_CITIZEN">Citizen (Health Awareness & Triage)</option>
              <option value="ROLE_OFFICER">Public Health Officer (Analytics & Outbreak Signals)</option>
              <option value="ROLE_ADMIN">System Administrator (RBAC & Governance)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Dr. Rajesh Sharma"
              className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">ABHA Health ID (Optional)</label>
            <input
              type="text"
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              placeholder="ABHA-XX-XXXX-XXXX-XXXX"
              className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/20"
          >
            Authenticate & Proceed →
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Don't have an ABHA account? <Link to="/register" className="text-blue-400 hover:underline font-semibold">Register ABHA ID</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
