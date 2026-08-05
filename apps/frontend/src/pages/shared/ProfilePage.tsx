import React from 'react';
import { User, Shield, Key, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components-shared/navigation/Navbar';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 my-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-2xl flex items-center justify-center">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">{user?.name}</h1>
              <p className="text-xs text-blue-400 font-mono mt-0.5">{user?.role.replace('ROLE_', '')} Account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="text-slate-400 font-semibold mb-1">Official Email</div>
              <div className="text-slate-200">{user?.email}</div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="text-slate-400 font-semibold mb-1">ABHA Health ID</div>
              <div className="text-slate-200 font-mono">{user?.abhaId || 'ABHA-91-8842-1029-4410'}</div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="text-slate-400 font-semibold mb-1">Assigned Jurisdiction</div>
              <div className="text-slate-200">{user?.jurisdiction || 'National Jurisdiction'}</div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="text-slate-400 font-semibold mb-1">Session Security</div>
              <div className="text-emerald-400 font-semibold">DigiLocker Certified OAuth2 Token</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
