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
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            A
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-100">ArogyaVerse <span className="text-blue-400">AI</span></span>
            <span className="hidden sm:inline-block text-[10px] text-slate-400 ml-2 px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700">Gov Platform</span>
          </div>
        </Link>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search diseases, outbreak reports, ICMR protocols, facilities..."
            className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 border border-slate-800 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl border border-slate-800 transition relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-1.5 right-1.5 animate-pulse"></span>
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3">
                <span className="font-bold text-xs text-slate-200">Alert Notifications</span>
                <span className="text-[10px] text-blue-400 font-mono">2 Unread</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs">
                  <div className="font-bold text-rose-300">Outbreak Alert: Pune Haveli</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Dengue query spike Z-Score &gt; 3.4</div>
                </div>
                <div className="p-2.5 bg-slate-800 rounded-xl text-xs">
                  <div className="font-semibold text-slate-200">Campaign Dispatch Success</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">45,000 SMS delivered in Haveli Block</div>
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
              className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                <div className="text-[10px] text-slate-400">{user.role.replace('ROLE_', '')}</div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs">
                <div className="p-2.5 border-b border-slate-800 mb-1">
                  <div className="font-bold text-slate-200">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                </div>
                <Link to="/profile" className="block px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg">Profile Settings</Link>
                <Link to="/settings" className="block px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg">System Preferences</Link>
                <Link to="/help" className="block px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg">Help & Documentation</Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/40 rounded-lg mt-1 border-t border-slate-800"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
