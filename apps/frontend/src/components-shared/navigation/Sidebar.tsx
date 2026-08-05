import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bot, MapPin, Send, FileText, Settings, Shield, User, HelpCircle, Activity, Scan, Play, Share2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    // Citizen Portal Links
    { label: 'Citizen Dashboard', path: '/citizen/dashboard', icon: LayoutDashboard, roles: ['ROLE_CITIZEN', 'ROLE_OFFICER', 'ROLE_ADMIN'] },
    { label: 'AI Health Assistant', path: '/citizen/triage', icon: Bot, roles: ['ROLE_CITIZEN', 'ROLE_OFFICER', 'ROLE_ADMIN'] },
    { label: 'Medicine Scanner', path: '/citizen/medicine-scanner', icon: Scan, roles: ['ROLE_CITIZEN', 'ROLE_OFFICER', 'ROLE_ADMIN'] },

    // Officer Command Center Links
    { label: 'Command Center & Twin', path: '/officer/dashboard', icon: Activity, roles: ['ROLE_OFFICER', 'ROLE_ADMIN'] },
    { label: 'AI Campaign Generator', path: '/officer/campaign-generator', icon: Send, roles: ['ROLE_OFFICER', 'ROLE_ADMIN'] },
    { label: 'AI Scenario Simulator', path: '/officer/scenario-simulator', icon: Play, roles: ['ROLE_OFFICER', 'ROLE_ADMIN'] },
    { label: 'Health Knowledge Graph', path: '/officer/knowledge-graph', icon: Share2, roles: ['ROLE_OFFICER', 'ROLE_ADMIN'] },
    { label: 'News Intelligence', path: '/officer/news-intelligence', icon: FileText, roles: ['ROLE_OFFICER', 'ROLE_ADMIN'] },

    // Governance & Settings
    { label: 'Admin Governance', path: '/admin/dashboard', icon: Shield, roles: ['ROLE_ADMIN'] },
    { label: 'User Profile', path: '/profile', icon: User, roles: ['ROLE_CITIZEN', 'ROLE_OFFICER', 'ROLE_ADMIN'] },
    { label: 'Platform Settings', path: '/settings', icon: Settings, roles: ['ROLE_CITIZEN', 'ROLE_OFFICER', 'ROLE_ADMIN'] },
    { label: 'Help & FAQs', path: '/help', icon: HelpCircle, roles: ['ROLE_CITIZEN', 'ROLE_OFFICER', 'ROLE_ADMIN'] },
  ];

  const allowedItems = navItems.filter(item => !user || item.roles.includes(user.role));

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-950/80 border-r border-slate-900/60 p-4 flex flex-col justify-between backdrop-blur-xl transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="space-y-6">
        <div className="px-2 pt-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3.5 pl-2">Portal Navigation</div>
          <nav className="space-y-1.5">
            {allowedItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-[0_0_15px_rgba(34,211,238,0.05)]'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border-transparent hover:border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? 'text-cyan-400 scale-110' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-2xl shadow-inner text-xs">
        <div className="font-extrabold text-slate-200 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse glow-cyan" />
          ArogyaVerse v1.0
        </div>
        <div className="text-[10px] text-slate-500 mt-1 font-semibold">ICMR & MoHFW Aligned</div>
      </div>
    </aside>
  );
}
