import React from 'react';
import { HelpCircle, BookOpen, Phone, FileText, Bot } from 'lucide-react';
import CitizenLayout from '../../layouts/CitizenLayout';

export default function HelpPage() {
  const faqs = [
    {
      q: 'How does ArogyaVerse AI process my symptom queries?',
      a: 'Your voice or text input is translated via Bhashini API, stripped of any PII (names, phone numbers) by Presidio, and checked against ICMR/WHO medical vector guidelines.',
    },
    {
      q: 'Is this application a substitute for a doctor prescription?',
      a: 'No. ArogyaVerse AI is a public health awareness and triage platform. It provides ICMR ground-truth guidance and directs citizens to nearest Registered Medical Practitioners (RMPs).',
    },
    {
      q: 'How do Public Health Officers detect disease outbreak signals?',
      a: 'The platform aggregates 100% anonymized search queries per GeoHash and runs Prophet time-series models to flag statistical spikes (Z-Score > 3.0).',
    },
  ];

  return (
    <CitizenLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-slate-100">Help & Support Documentation</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Platform guides, ICMR protocols, emergency helpline numbers, and FAQs</p>
        </header>

        {/* Emergency Contacts Banner */}
        <div className="bg-rose-950/30 border border-rose-800/40 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-rose-200 text-sm">National Emergency Helplines</div>
              <div className="text-rose-300 text-[11px] mt-0.5">Ambulance: 108 | National Emergency: 112 | Tele-MANAS: 14416</div>
            </div>
          </div>
          <a
            href="tel:108"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition flex-shrink-0"
          >
            Call 108 Now
          </a>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-200">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-blue-400">Q: {faq.q}</div>
                <p className="text-slate-300 leading-relaxed">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}
