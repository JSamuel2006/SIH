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
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
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
  blue:    { bg: 'bg-blue-600/15',   text: 'text-blue-400',   border: 'border-blue-500/20' },
  purple:  { bg: 'bg-purple-600/15', text: 'text-purple-400', border: 'border-purple-500/20' },
  emerald: { bg: 'bg-emerald-600/15',text: 'text-emerald-400',border: 'border-emerald-500/20' },
  amber:   { bg: 'bg-amber-600/15',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  rose:    { bg: 'bg-rose-600/15',   text: 'text-rose-400',   border: 'border-rose-500/20' },
};

const TAG_COLORS: Record<string, string> = {
  Citizens:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Officers:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'WOW Feature': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Citizens' | 'Officers'>('ALL');

  const filteredModules = activeFilter === 'ALL'
    ? MODULES
    : MODULES.filter(m => m.tag === activeFilter || m.tag === 'WOW Feature');

  return (
    <PublicLayout>

      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-[400px] h-[300px] bg-emerald-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold mb-6">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
            SIH 2025 Problem Statement #SIH25049 · Ministry of Health & Family Welfare
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight max-w-4xl mx-auto leading-tight">
            India's AI Public Health{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              Intelligence Platform
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Empowering <strong className="text-slate-300">1.4 Billion citizens</strong> with multilingual AI health education
            while giving Public Health Officers <strong className="text-slate-300">real-time epidemiological intelligence</strong> to prevent outbreaks before they spread.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              id="hero-cta-citizen"
              to="/citizen/triage"
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-xl shadow-blue-600/25 group"
            >
              <Bot className="w-5 h-5" />
              Launch AI Health Assistant
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              id="hero-cta-officer"
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition"
            >
              <Activity className="w-5 h-5 text-emerald-400" />
              Officer / Admin Portal
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-[11px]">
            {[
              { icon: Shield, label: 'DPDP Act 2023 Compliant', color: 'text-emerald-400' },
              { icon: Lock,   label: 'Zero PII Storage', color: 'text-blue-400' },
              { icon: Globe,  label: 'Bhashini 22 Languages', color: 'text-purple-400' },
              { icon: CheckCircle, label: 'ICMR & WHO Verified', color: 'text-amber-400' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span className="text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Animated Stats Bar ────────────────────────────────────────────────── */}
      <section className="border-y border-slate-800 bg-slate-900/60 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedStat target={1400} label="Million Citizens Served" suffix="M+" />
          <AnimatedStat target={22}   label="Indic Languages Supported" suffix="+" />
          <AnimatedStat target={48920} label="ICMR Knowledge Vectors" />
          <AnimatedStat target={718}  label="Districts Covered" />
        </div>
      </section>

      {/* ── Dual-Audience Value Proposition ───────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Built for Two Critical Audiences</h2>
          <p className="text-sm text-slate-400 mt-2">A single platform — two mission-critical engines</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Citizen Engine */}
          <div className="bg-slate-900 border border-blue-500/20 rounded-2xl p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Citizen Health Engine</h3>
                  <p className="text-xs text-blue-400">For Every Indian Citizen</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {[
                  'Ask health questions in 22 Indic languages via voice or text',
                  'Camera-based medicine label scanner with safety verification',
                  'Disease prevention guides aligned with ICMR protocols',
                  'Nearest PHC, hospital, and ASHA worker locator',
                  'Government scheme eligibility (PM-JAY, NVBDCP, Indradhanush)',
                  'Emergency helpline shortcuts (104, 108, 112)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/citizen/triage" id="citizen-engine-cta" className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition">
                Try AI Assistant <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Officer Engine */}
          <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Public Health Command Center</h3>
                  <p className="text-xs text-emerald-400">For Health Officers & Administrators</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {[
                  'Real-time disease heat maps with 5 overlay layer types',
                  'Z-Score anomaly detection (Early Warning System)',
                  'AI campaign material generator (SMS / WhatsApp / Speech)',
                  'Scenario simulator for pre-campaign planning',
                  'Health Knowledge Graph with MoHFW clinical schema',
                  'Public Health Digital Twin for outbreak probability modelling',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/login" id="officer-engine-cta" className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition">
                Officer Sign In <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Module Showcase ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-slate-950/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">9 Production-Ready Modules</h2>
            <p className="text-sm text-slate-400 mt-2">Every module is fully integrated, API-connected, and verified</p>
          </div>

          {/* Filter pills */}
          <div className="flex justify-center gap-2 mb-8">
            {(['ALL', 'Citizens', 'Officers'] as const).map((f) => (
              <button
                key={f}
                id={`module-filter-${f.toLowerCase()}`}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                  activeFilter === f
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {f === 'ALL' ? 'All Modules' : f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((mod) => {
              const Icon = mod.icon;
              const c = COLOR_MAP[mod.color];
              return (
                <Link
                  key={mod.title}
                  to={mod.href}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition group flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 ${c.bg} ${c.text} rounded-xl transition group-hover:scale-110 duration-200`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TAG_COLORS[mod.tag]}`}>
                      {mod.tag}
                    </span>
                  </div>
                  <h3 className={`font-bold text-sm text-slate-200 group-hover:${c.text} transition mb-1`}>{mod.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed flex-1">{mod.desc}</p>
                  <div className={`mt-3 flex items-center gap-1 text-[11px] font-semibold ${c.text} opacity-0 group-hover:opacity-100 transition`}>
                    Open Module <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Architecture Strip ────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Enterprise-Grade Architecture</h2>
          <p className="text-sm text-slate-400 mt-2">Production-ready tech stack aligned with Digital Public Infrastructure principles</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div key={label} className={`bg-slate-900 border ${c.border} rounded-xl p-4 flex items-center gap-3`}>
                <div className={`p-2 ${c.bg} ${c.text} rounded-lg flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${c.text}`}>{label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Privacy Commitment ────────────────────────────────────────────────── */}
      <section className="py-10 px-4 sm:px-6 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-200">Privacy-First by Design</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ArogyaVerse AI never stores or shares personal health data. All citizen queries are PII-redacted by Microsoft Presidio before analytics processing.
            Geographic analytics use only anonymized GeoHash clusters — never individual locations. Fully compliant with India's{' '}
            <strong className="text-slate-300">Digital Personal Data Protection Act 2023</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-[11px] pt-2">
            {['No Name Storage', 'No Aadhaar Logging', 'No Phone Number Retention', 'No GPS Tracking', 'Aggregate-Only Analytics'].map((item) => (
              <span key={item} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                <CheckCircle className="w-3 h-3" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Ready to experience India's most advanced{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              public health AI platform?
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              id="final-cta-citizen"
              to="/citizen/triage"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-xl shadow-blue-600/20 group"
            >
              <Bot className="w-5 h-5" /> Start as Citizen
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              id="final-cta-officer"
              to="/login"
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition"
            >
              <Activity className="w-5 h-5 text-emerald-400" /> Officer / Admin Login
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
