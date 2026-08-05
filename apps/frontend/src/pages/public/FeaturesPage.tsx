import React from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { Bot, MapPin, Send, FileText, Shield, Sparkles, Activity, Bell } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Voice-First Multi-Lingual Triage',
      desc: 'Allows citizens to speak or type symptoms in 22 Indic languages with real-time translation powered by Bhashini API.',
      icon: Bot,
      color: 'text-blue-400 bg-blue-600/20',
    },
    {
      title: 'ISRO Bhuvan GIS Heatmaps',
      desc: 'Visualizes anonymized search query density down to Block/Tehsil levels using GeoHash spatial clustering.',
      icon: MapPin,
      color: 'text-emerald-400 bg-emerald-600/20',
    },
    {
      title: 'Outbreak Early Warning System',
      desc: 'Prophet ML time-series anomaly detector identifies statistical search spikes (Z-Score > 3.0) up to 14 days before clinical hospital admissions.',
      icon: Activity,
      color: 'text-rose-400 bg-rose-600/20',
    },
    {
      title: 'Automated Campaign Planner',
      desc: 'Enables Health Officers to dispatch geo-targeted SMS, WhatsApp Business, and IVR public awareness campaigns.',
      icon: Send,
      color: 'text-purple-400 bg-purple-600/20',
    },
    {
      title: 'Async Epidemiological PDF Exporter',
      desc: 'Generates detailed monthly district health intelligence reports complete with ICMR advisory summaries.',
      icon: FileText,
      color: 'text-amber-400 bg-amber-600/20',
    },
    {
      title: 'Presidio PII Redaction Engine',
      desc: 'Strips Aadhaar numbers, phone numbers, and names at the edge before data touches any LLM or analytics warehouse.',
      icon: Shield,
      color: 'text-cyan-400 bg-cyan-600/20',
    },
  ];

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            Platform Capabilities & Enterprise Modules
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Architected for scalability, privacy, and real-time public health response.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className={`p-3 rounded-xl w-fit ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-200">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </PublicLayout>
  );
}
