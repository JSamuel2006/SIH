import React from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { Shield, Globe, Activity, Award, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold">
            <Award className="w-4 h-4" /> Smart India Hackathon Grand Finale Flagship Initiative
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            About ArogyaVerse AI
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            India's AI Public Health Intelligence Platform bridging the gap between citizen health awareness and data-driven public health governance.
          </p>
        </div>

        {/* Vision Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl w-fit">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Inclusive Citizen Empowerment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enabling citizens across India—including rural and semi-urban populations—to query symptoms, understand preventive health protocols, and access verified ICMR/WHO guidelines in 22 scheduled Indian languages via voice or text.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl w-fit">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Epidemiological Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipping District, State, and National Health Officers with real-time, 100% anonymized query density metrics, early-warning outbreak anomaly detection (Z-Score &gt; 3.0), and automated awareness campaign management.
            </p>
          </div>
        </div>

        {/* Compliance & Standards */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-200">Government & Security Baseline Standards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> DPDP Act 2023 Compliant
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bhashini NMT API Integrated
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ICMR Guidelines Grounded
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
