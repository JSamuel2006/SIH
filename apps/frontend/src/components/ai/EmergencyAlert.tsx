import React from 'react';
import { Phone, AlertTriangle } from 'lucide-react';

export default function EmergencyAlert() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="bg-rose-950/60 border-2 border-rose-500 rounded-2xl p-5 shadow-xl shadow-rose-900/30 animate-pulse-once">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-rose-600 text-white rounded-xl flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-rose-200 text-base">
              🚨 MEDICAL EMERGENCY DETECTED
            </h3>
            <p className="text-rose-300 text-xs mt-1 leading-relaxed">
              The symptoms described may indicate a life-threatening emergency. Do NOT rely on this platform for emergency medical advice. Seek immediate professional medical help.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="tel:108"
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
              >
                <Phone className="w-4 h-4" /> Call 108 — Ambulance
              </a>
              <a
                href="tel:112"
                className="flex items-center gap-2 px-4 py-2 bg-rose-800/60 hover:bg-rose-700/60 text-rose-200 border border-rose-700 rounded-xl text-xs font-bold transition"
              >
                <Phone className="w-4 h-4" /> Call 112 — National Emergency
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
