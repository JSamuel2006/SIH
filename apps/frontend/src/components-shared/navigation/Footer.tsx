import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="font-bold text-slate-200 text-sm">ArogyaVerse AI</div>
          <p className="text-[11px] text-slate-500 mt-1">
            India's AI Public Health Intelligence Platform | MoHFW & ICMR Standards Compliant
          </p>
        </div>
        <div className="flex gap-6 text-[11px]">
          <Link to="/about" className="hover:text-blue-400 transition">About Platform</Link>
          <Link to="/features" className="hover:text-blue-400 transition">Features</Link>
          <Link to="/help" className="hover:text-blue-400 transition">Help & FAQs</Link>
          <a href="#" className="hover:text-blue-400 transition">Privacy Policy (DPDP Act)</a>
        </div>
        <div className="text-[11px] text-slate-500">
          © {new Date().getFullYear()} Government of India Digital Health Initiative
        </div>
      </div>
    </footer>
  );
}
