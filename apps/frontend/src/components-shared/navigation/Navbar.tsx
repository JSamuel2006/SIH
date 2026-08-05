import React, { useState } from 'react';
import { Bell, Search, User as UserIcon, Shield, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-slate-950/80 border-b border-slate-900/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 rounded-xl lg:hidden border border-slate-900"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            A
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-100 bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">
              ArogyaVerse <span className="text-cyan-400">AI</span>
            </span>
            <span className="hidden sm:inline-block text-[9px] text-cyan-400 font-bold uppercase tracking-wider ml-2.5 px-2 py-0.5 bg-cyan-950/30 rounded-md border border-cyan-800/20">
              Command Hub
            </span>
          </div>
        </Link>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search queries, outbreak reports, ICMR protocols..."
            className="w-full bg-slate-950/90 text-xs text-slate-200 placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 border border-slate-900 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_10px_rgba(34,211,238,0.1)] transition-all duration-300"
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl border border-slate-900 transition-all duration-300"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl border border-slate-900 transition-all duration-300 relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 bg-cyan-500 rounded-full absolute top-2 right-2 animate-pulse glow-cyan"></span>
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-950/95 border border-slate-900 rounded-2xl shadow-2xl p-4.5 z-50 backdrop-blur-xl">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900 mb-3">
                <span className="font-bold text-xs text-slate-200">Alert Notifications</span>
                <span className="text-[9px] text-cyan-400 font-bold tracking-wider px-1.5 py-0.5 bg-cyan-950/40 rounded border border-cyan-800/20">2 ACTIVE</span>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl text-xs">
                  <div className="font-bold text-rose-400">Outbreak Alert: Pune Haveli</div>
                  <div className="text-slate-400 text-[10px] mt-1">Dengue query spike Z-Score &gt; 3.42</div>
                </div>
                <div className="p-3 bg-slate-900/60 border border-slate-800/60 rounded-xl text-xs">
                  <div className="font-semibold text-slate-200">Campaign Dispatch Success</div>
                  <div className="text-slate-400 text-[10px] mt-1">45,000 SMS delivered in Haveli Block</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-950/90 hover:bg-slate-900 rounded-xl border border-slate-900 transition-all duration-300"
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-200 leading-tight">{user.name}</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{user.role.replace('ROLE_', '')}</div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-slate-950/95 border border-slate-900 rounded-2xl shadow-2xl p-2 z-50 text-xs backdrop-blur-xl">
                <div className="p-2.5 border-b border-slate-900 mb-1.5">
                  <div className="font-bold text-slate-200">{user.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                </div>
                <Link to="/profile" className="block px-3 py-2 text-slate-300 hover:bg-slate-900 rounded-lg transition-colors">Profile Settings</Link>
                <Link to="/settings" className="block px-3 py-2 text-slate-300 hover:bg-slate-900 rounded-lg transition-colors">System Preferences</Link>
                <Link to="/help" className="block px-3 py-2 text-slate-300 hover:bg-slate-900 rounded-lg transition-colors">Help & Documentation</Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2.5 text-rose-400 hover:bg-rose-950/20 rounded-lg mt-1.5 border-t border-slate-900 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
