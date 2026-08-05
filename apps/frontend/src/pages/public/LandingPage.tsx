import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, Shield, Activity, Globe, ArrowRight, HeartPulse,
  Sparkles, Scan, Share2, FileText, Sliders, MapPin,
  CheckCircle, Users, Database, Zap, Lock, ChevronRight,
  Send, TrendingUp, AlertTriangle, BarChart2
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedStat({ target, label, suffix = '' }: { target: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <div className="text-center p-6 bg-slate-950/65 border border-slate-900/60 rounded-2xl backdrop-blur-xl shadow-[0_0_15px_rgba(0,0,0,0.2)]">
      <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">{label}</div>
    </div>
  );
}

// ─── Module Cards ─────────────────────────────────────────────────────────────
const MODULES = [
  {
    icon: Bot,
    color: 'blue',
    title: 'AI Health Assistant',
    desc: '22-language voice & text queries grounded in ICMR/WHO protocols. Never diagnoses — always redirects to professionals.',
    tag: 'Citizens',
    href: '/citizen/triage',
  },
  {
    icon: Scan,
    color: 'purple',
    title: 'Medicine Intelligence Scanner',
    desc: 'Camera-based OCR scans medicine labels and returns verified safety, composition, and dosage information.',
    tag: 'Citizens',
    href: '/citizen/medicine-scanner',
  },
  {
    icon: Activity,
    color: 'rose',
    title: 'Disease Heat Map',
    desc: 'Anonymized geo-indexed health query density visualized on live Bhuvan overlay maps across districts and blocks.',
    tag: 'Officers',
    href: '/officer/dashboard',
  },
  {
    icon: AlertTriangle,
    color: 'amber',
    title: 'Early Warning System',
    desc: 'Prophet time-series anomaly detection flags Z-Score > 2.5 spikes across disease categories up to 14 days ahead.',
    tag: 'Officers',
    href: '/officer/dashboard',
  },
  {
    icon: Send,
    color: 'emerald',
    title: 'AI Campaign Generator',
    desc: 'Auto-drafts NVBDCP-grounded SMS, WhatsApp messages, and school assembly speeches for any health topic.',
    tag: 'Officers',
    href: '/officer/campaign-generator',
  },
  {
    icon: Sliders,
    color: 'blue',
    title: 'AI Scenario Simulator',
    desc: 'Simulate campaign impact and estimate public health literacy improvements before budget allocation.',
    tag: 'Officers',
    href: '/officer/scenario-simulator',
  },
  {
    icon: Share2,
    color: 'purple',
    title: 'Health Knowledge Graph',
    desc: 'Interactive disease-symptom-prevention-vaccine-scheme relationship graph with MoHFW clinical schema mapping.',
    tag: 'Officers',
    href: '/officer/knowledge-graph',
  },
  {
    icon: FileText,
    color: 'amber',
    title: 'Health News Intelligence',
    desc: 'Aggregates verified circulars from MoHFW, WHO-SEARO, ICMR and NHM with AI executive summaries.',
    tag: 'Officers',
    href: '/officer/news-intelligence',
  },
  {
    icon: Sparkles,
    color: 'emerald',
    title: 'Public Health Digital Twin',
    desc: 'WOW feature: adjust planning parameters and get real-time AI-computed outbreak probability forecasts.',
    tag: 'WOW Feature',
    href: '/officer/dashboard',
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue:    { bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   border: 'border-cyan-500/20' },
  purple:  { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  emerald: { bg: 'bg-emerald-500/10',text: 'text-emerald-400',border: 'border-emerald-500/20' },
  amber:   { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  rose:    { bg: 'bg-rose-500/10',   text: 'text-rose-400',   border: 'border-rose-500/20' },
};

const TAG_COLORS: Record<string, string> = {
  Citizens:    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Officers:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'WOW Feature': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

export default function LandingPage() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Citizens' | 'Officers'>('ALL');

  const filteredModules = activeFilter === 'ALL'
    ? MODULES
    : MODULES.filter(m => m.tag === activeFilter || m.tag === 'WOW Feature');

  return (
    <PublicLayout>
      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-cyan-950/20 border border-cyan-800/35 text-cyan-400 rounded-full text-xs font-bold mb-8 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            SIH 2025 Problem Statement #SIH25049 · Ministry of Health & Family Welfare
          </div>

          <h1 className="text-4xl sm:text-7xl font-black text-slate-100 tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
            India's AI Public Health{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">
              Intelligence Platform
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            Empowering <strong className="text-slate-200 font-bold">1.4 Billion citizens</strong> with multilingual AI health education
            while giving Public Health Officers <strong className="text-slate-200 font-bold font-mono">real-time command intelligence</strong> to mitigate epidemic outbreaks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              id="hero-cta-citizen"
              to="/citizen/triage"
              className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 transition shadow-[0_0_20px_rgba(59,130,246,0.3)] group"
            >
              <Bot className="w-4 h-4" />
              Launch AI Health Assistant
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              id="hero-cta-officer"
              to="/login"
              className="w-full sm:w-auto px-7 py-4 bg-slate-950/80 hover:bg-slate-900 border border-slate-900 text-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 transition backdrop-blur-xl"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              Officer / Admin Portal
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-[10px] font-bold uppercase tracking-wider">
            {[
              { icon: Shield, label: 'DPDP Act 2023 Compliant', color: 'text-cyan-450' },
              { icon: Lock,   label: 'Zero PII Storage', color: 'text-indigo-405' },
              { icon: Globe,  label: 'Bhashini 22 Languages', color: 'text-purple-405' },
              { icon: CheckCircle, label: 'ICMR & WHO Grounded', color: 'text-amber-405' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 bg-slate-950/70 border border-slate-900 rounded-xl backdrop-blur-md">
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Animated Stats Bar ────────────────────────────────────────────────── */}
      <section className="border-y border-slate-900/60 bg-slate-950/30 py-12 px-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <AnimatedStat target={1400} label="Million Citizens Served" suffix="M+" />
          <AnimatedStat target={22}   label="Indic Languages Supported" suffix="+" />
          <AnimatedStat target={48920} label="ICMR Knowledge Vectors" />
          <AnimatedStat target={718}  label="Districts Covered" />
        </div>
      </section>

      {/* ── Dual-Audience Value Proposition ───────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100">Built for Two Critical Audiences</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">A single platform — two mission-critical engines</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Citizen Engine */}
          <div className="bg-slate-950/60 border border-cyan-500/10 rounded-3xl p-8 space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/15">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Citizen Health Engine</h3>
                  <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">For Every Indian Citizen</p>
                </div>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-400">
                {[
                  'Ask health questions in 22 Indic languages via voice or text',
                  'Camera-based medicine label scanner with safety verification',
                  'Disease prevention guides aligned with ICMR protocols',
                  'Nearest PHC, hospital, and ASHA worker locator',
                  'Government scheme eligibility (PM-JAY, NVBDCP, Indradhanush)',
                  'Emergency helpline shortcuts (104, 108, 112)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-350">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/citizen/triage" id="citizen-engine-cta" className="mt-8 inline-flex items-center gap-2 px-5 py-3 bg-cyan-650 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                Try AI Assistant <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Officer Engine */}
          <div className="bg-slate-950/60 border border-emerald-500/10 rounded-3xl p-8 space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/15">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Public Health Command Center</h3>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">For Health Officers & Administrators</p>
                </div>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-400">
                {[
                  'Real-time disease heat maps with 5 overlay layer types',
                  'Z-Score anomaly detection (Early Warning System)',
                  'AI campaign material generator (SMS / WhatsApp / Speech)',
                  'Scenario simulator for pre-campaign planning',
                  'Health Knowledge Graph with MoHFW clinical schema',
                  'Public Health Digital Twin for outbreak probability modelling',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-355">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/login" id="officer-engine-cta" className="mt-8 inline-flex items-center gap-2 px-5 py-3 bg-emerald-650 hover:bg-emerald-650 text-white rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                Officer Sign In <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Module Showcase ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-slate-950/20 border-y border-slate-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100">9 Production-Ready Modules</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Every module is fully integrated, API-connected, and verified</p>
          </div>

          {/* Filter pills */}
          <div className="flex justify-center gap-2.5 mb-12">
            {(['ALL', 'Citizens', 'Officers'] as const).map((f) => (
              <button
                key={f}
                id={`module-filter-${f.toLowerCase()}`}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                  activeFilter === f
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.35)]'
                    : 'bg-slate-950/60 text-slate-400 border-slate-900 hover:text-slate-200'
                }`}
              >
                {f === 'ALL' ? 'All Modules' : f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((mod) => {
              const Icon = mod.icon;
              const c = COLOR_MAP[mod.color];
              return (
                <Link
                  key={mod.title}
                  to={mod.href}
                  className="bg-slate-950/65 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 ${c.bg} ${c.text} rounded-2xl border ${c.border} transition-all duration-300 group-hover:scale-110`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${TAG_COLORS[mod.tag]}`}>
                        {mod.tag}
                      </span>
                    </div>
                    <h3 className={`font-bold text-sm text-slate-200 group-hover:${c.text} transition duration-300 mb-2`}>{mod.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
                  </div>
                  <div className={`mt-5 flex items-center gap-1.5 text-[11px] font-bold ${c.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    Open Module <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Architecture Strip ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100">Enterprise-Grade Architecture</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Production-ready tech stack aligned with Digital Public Infrastructure principles</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Database, label: 'Qdrant Vector DB',   sub: 'ICMR Knowledge RAG',       color: 'blue' },
            { icon: Globe,    label: 'Bhashini API',        sub: '22 Indic Languages',       color: 'purple' },
            { icon: Lock,     label: 'Presidio Redaction',  sub: 'DPDP Act PII Shield',      color: 'emerald' },
            { icon: Zap,      label: 'TimescaleDB',         sub: '14.8M Geo Events',         color: 'amber' },
            { icon: TrendingUp, label: 'Prophet ML',        sub: 'Anomaly Detection',        color: 'rose' },
            { icon: Shield,   label: 'ABHA Auth',           sub: 'DigiLocker OAuth2',         color: 'blue' },
            { icon: MapPin,   label: 'Bhuvan Maps',         sub: 'ISRO Geo Layers',          color: 'emerald' },
            { icon: Sparkles, label: 'Gemini AI Core',      sub: 'Grounded Health RAG',      color: 'purple' },
          ].map(({ icon: Icon, label, sub, color }) => {
            const c = COLOR_MAP[color];
            return (
              <div key={label} className={`bg-slate-950/70 border ${c.border} rounded-2xl p-5 flex items-center gap-3.5 backdrop-blur-md`}>
                <div className={`p-2.5 ${c.bg} ${c.text} rounded-xl border ${c.border} flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${c.text}`}>{label}</div>
                  <div className="text-[10px] text-slate-500 font-bold tracking-tight mt-0.5">{sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Privacy Commitment ────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-slate-950/60 border-t border-slate-900/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-emerald-450 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-200">Privacy-First by Design</h3>
          </div>
          <p className="text-xs text-slate-405 leading-relaxed max-w-3xl mx-auto">
            ArogyaVerse AI never stores or shares personal health data. All citizen queries are PII-redacted by Microsoft Presidio before analytics processing.
            Geographic analytics use only anonymized GeoHash clusters — never individual locations. Fully compliant with India's{' '}
            <strong className="text-slate-300">Digital Personal Data Protection Act 2023</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {['No Name Storage', 'No Aadhaar Logging', 'No Phone Number Retention', 'No GPS Tracking', 'Aggregate-Only Analytics'].map((item) => (
              <span key={item} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/10 text-emerald-450 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold">
                <CheckCircle className="w-3 h-3" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-100 leading-tight">
            Ready to experience India's most advanced{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              public health AI platform?
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              id="final-cta-citizen"
              to="/citizen/triage"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 transition shadow-[0_0_20px_rgba(59,130,246,0.25)] group"
            >
              <Bot className="w-4 h-4" /> Start as Citizen
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              id="final-cta-officer"
              to="/login"
              className="px-8 py-4 bg-slate-950/80 hover:bg-slate-900 border border-slate-900 text-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 transition backdrop-blur-xl"
            >
              <Activity className="w-4 h-4 text-emerald-400" /> Officer / Admin Login
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
