import React from 'react';
import { Settings, Moon, Globe, Shield, Volume2 } from 'lucide-react';
import CitizenLayout from '../../layouts/CitizenLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../contexts/LanguageContext';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <CitizenLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-slate-100">System & Portal Preferences</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Configure language, accessibility font scaling, theme, and privacy settings</p>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
          {/* Language Switcher */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <div className="font-bold text-slate-200">Default Bhashini Language</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Select preferred language for voice and text health assistant</div>
            </div>
            <select
              value={language.code}
              onChange={(e) => {
                const found = SUPPORTED_LANGUAGES.find((l) => l.code === e.target.value);
                if (found) setLanguage(found);
              }}
              className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Selector */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <div className="font-bold text-slate-200">Display Theme</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Choose UI theme mode</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1.5 rounded-xl border ${
                  theme === 'dark' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Dark Mode
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1.5 rounded-xl border ${
                  theme === 'light' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Light Mode
              </button>
            </div>
          </div>

          {/* Privacy & PII */}
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-200">DPDP Act Privacy Shield</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Presidio PII Redaction is enforced at edge gateways</div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] font-bold">
              ENFORCED
            </span>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}
