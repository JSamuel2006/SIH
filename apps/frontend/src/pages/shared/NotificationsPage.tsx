import React from 'react';
import { Bell, ShieldAlert, CheckCircle2, Info, Trash2 } from 'lucide-react';
import CitizenLayout from '../../layouts/CitizenLayout';
import { useNotifications } from '../../contexts/NotificationContext';

export default function NotificationsPage() {
  const { notifications, markAsRead, clearAll } = useNotifications();

  return (
    <CitizenLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <h1 className="text-xl font-bold text-slate-100">Notification Center</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Real-time epidemiological alerts, advisory updates, and campaign dispatches</p>
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-xl text-xs border border-slate-700 transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </header>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
              No active notifications at this time.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 text-xs ${
                  item.type === 'ALERT'
                    ? 'bg-rose-950/20 border-rose-800/40 text-slate-200'
                    : item.type === 'SUCCESS'
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                } ${!item.read ? 'ring-1 ring-blue-500/50' : 'opacity-80'}`}
              >
                {item.type === 'ALERT' ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                ) : item.type === 'SUCCESS' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-100">{item.title}</h4>
                    <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                  </div>
                  <p className="text-slate-400 mt-1">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </CitizenLayout>
  );
}
