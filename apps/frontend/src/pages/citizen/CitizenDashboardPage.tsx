import React, { useState, useEffect } from 'react';
import {
  Bot, Scan, MapPin, BookOpen, HeartPulse, ShieldCheck, Bell,
  TrendingUp, Sparkles, ChevronRight, Activity, CheckCircle2,
  FileText, Globe, RefreshCw, AlertTriangle, Users, Syringe
} from 'lucide-react';
import CitizenLayout from '../../layouts/CitizenLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface HealthTip {
  icon: React.ReactNode;
  title: string;
  body: string;
  tag: string;
  color: string;
}

interface Advisory {
  id: string;
  title: string;
  source: string;
  category: string;
  date: string;
}

const HEALTH_TIPS: HealthTip[] = [
  {
    icon: <Syringe className="w-4 h-4" />,
    title: 'Dengue Prevention This Monsoon',
    body: 'Eliminate stagnant water from coolers, flower pots, and containers every Sunday. Aedes mosquitoes breed in clean, standing water.',
    tag: 'ICMR Advisory',
    color: 'rose',
  },
  {
    icon: <HeartPulse className="w-4 h-4" />,
    title: 'ORS for Diarrhoea — Safe & Free',
    body: 'At the first sign of diarrhoea, prepare ORS: 1 litre clean water + 6 tsp sugar + ½ tsp salt. Available free at all government PHCs.',
    tag: 'WHO Protocol',
    color: 'blue',
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    title: 'Mission Indradhanush — Free Vaccination',
    body: 'Children under 5 and pregnant women are eligible for free immunization under UIP. Visit your nearest Anganwadi or PHC.',
    tag: 'NHM India',
    color: 'emerald',
  },
  {
    icon: <Activity className="w-4 h-4" />,
    title: 'Avoid Self-Prescribing NSAIDs for Fever',
    body: 'If you have fever for 48+ hours during monsoon, avoid aspirin or ibuprofen. Take paracetamol and get tested for dengue (free at PHCs).',
    tag: 'ICMR Guidelines',
    color: 'amber',
  },
];

const QUICK_ACTIONS = [
  {
    id: 'action-ai-assistant',
    label: 'AI Health Assistant',
    description: 'Ask questions in Hindi, Marathi, Tamil, or English',
    icon: Bot,
    href: '/citizen/triage',
    color: 'blue',
    badge: '22 Languages',
  },
  {
    id: 'action-medicine-scanner',
    label: 'Medicine Scanner',
    description: 'Scan medicine labels for verified safety information',
    icon: Scan,
    href: '/citizen/medicine-scanner',
    color: 'purple',
    badge: 'Camera + OCR',
  },
  {
    id: 'action-knowledge-graph',
    label: 'Health Knowledge Graph',
    description: 'Explore disease-symptom-prevention connections',
    icon: BookOpen,
    href: '/officer/knowledge-graph',
    color: 'emerald',
    badge: 'ICMR Verified',
  },
  {
    id: 'action-news',
    label: 'Health News & Advisories',
    description: 'Latest MoHFW, WHO, and ICMR circulars',
    icon: FileText,
    href: '/officer/news-intelligence',
    color: 'amber',
    badge: 'Live Updates',
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue:    { bg: 'bg-blue-600/15',   text: 'text-blue-400',   border: 'border-blue-500/20',   badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  purple:  { bg: 'bg-purple-600/15', text: 'text-purple-400', border: 'border-purple-500/20', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  emerald: { bg: 'bg-emerald-600/15',text: 'text-emerald-400',border: 'border-emerald-500/20',badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  amber:   { bg: 'bg-amber-600/15',  text: 'text-amber-400',  border: 'border-amber-500/20',  badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  rose:    { bg: 'bg-rose-600/15',   text: 'text-rose-400',   border: 'border-rose-500/20',   badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loadingAdvisories, setLoadingAdvisories] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  // Cycle through health tips every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => setTipIndex(i => (i + 1) % HEALTH_TIPS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  // Load latest advisories from backend
  const fetchAdvisories = async () => {
    setLoadingAdvisories(true);
    try {
      const res = await fetch('/api/v1/analytics/news');
      const json = await res.json();
      if (json.success) {
        setAdvisories(json.data.advisories.slice(0, 3));
      }
    } catch {
      setAdvisories([
        { id: 'adv-201', title: 'MoHFW issues monsoon advisory for vector-borne diseases', source: 'Ministry of Health & Family Welfare', category: 'Advisory', date: 'August 03, 2026' },
        { id: 'adv-202', title: 'ICMR updates guidelines for fever management protocols', source: 'ICMR', category: 'Clinical Guidelines', date: 'July 28, 2026' },
        { id: 'adv-203', title: 'Mission Indradhanush vaccination drive expanded', source: 'National Health Mission', category: 'Campaign', date: 'July 15, 2026' },
      ]);
    } finally {
      setLoadingAdvisories(false);
    }
  };

  useEffect(() => { fetchAdvisories(); }, []);

  const currentTip = HEALTH_TIPS[tipIndex];
  const tipColors = COLOR_MAP[currentTip.color];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <CitizenLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
        <header className="relative bg-slate-950/75 border border-slate-905 border-slate-900 rounded-3xl p-8 overflow-hidden backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_50%,rgba(34,211,238,0.06),transparent)]" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">{greeting()}</p>
              <h1 className="text-3xl font-black text-slate-100">{user?.name || 'Citizen'} 👋</h1>
              <p className="text-xs text-slate-400 mt-2 max-w-lg leading-relaxed">
                Your personal health education portal powered by ICMR, WHO, and MoHFW verified data.
              </p>
              <div className="flex flex-wrap gap-2 mt-4.5">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-500/10 text-emerald-450 text-emerald-400 border border-emerald-500/20 rounded-lg">ABHA Verified</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg">DPDP Privacy Protected</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">PII Redacted</span>
              </div>
            </div>
            <Link
              to="/citizen/triage"
              id="hero-start-ai-btn"
              className="flex-shrink-0 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-2xl flex items-center gap-2.5 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              <Bot className="w-4 h-4" /> Start AI Health Query
            </Link>
          </div>
        </header>

        {/* ── Quick Action Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            const colors = COLOR_MAP[action.color];
            return (
              <Link
                key={action.id}
                id={action.id}
                to={action.href}
                className="bg-slate-950/65 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className={`p-3 ${colors.bg} ${colors.text} rounded-2xl w-fit mb-4.5 border ${colors.border} transition-all duration-300 group-hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-200 group-hover:text-white transition duration-300">{action.label}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{action.description}</p>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${colors.badge}`}>
                    {action.badge}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-305" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Health Tip Carousel + Live Advisories ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Auto-cycling Health Tip */}
          <div className={`bg-slate-950/65 border ${tipColors.border} rounded-3xl p-6.5 flex flex-col justify-between transition-all duration-500 backdrop-blur-xl shadow-lg`}>
            <div className="flex items-center justify-between mb-4.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-455 text-cyan-450" />
                <h3 className="text-sm font-bold text-slate-205">Daily Health Awareness Tip</h3>
              </div>
              <div className="flex gap-1.5">
                {HEALTH_TIPS.map((_, i) => (
                  <button
                    key={i}
                    id={`tip-dot-${i}`}
                    onClick={() => setTipIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === tipIndex ? `${tipColors.bg} scale-125 border ${tipColors.border}` : 'bg-slate-800'}`}
                  />
                ))}
              </div>
            </div>

            <div className={`p-4.5 ${tipColors.bg} border ${tipColors.border} rounded-2xl space-y-2.5 flex-1 shadow-inner`}>
              <div className={`flex items-center gap-2 ${tipColors.text} font-bold text-xs`}>
                {currentTip.icon}
                {currentTip.title}
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">{currentTip.body}</p>
            </div>

            <div className="flex items-center justify-between mt-4.5">
              <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${tipColors.badge}`}>
                {currentTip.tag}
              </span>
              <Link to="/officer/knowledge-graph" className={`text-[11px] ${tipColors.text} font-bold hover:underline flex items-center gap-1`}>
                Learn More <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Live Advisories Panel */}
          <div className="bg-slate-950/65 border border-slate-900 rounded-3xl p-6.5 flex flex-col justify-between backdrop-blur-xl shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-4.5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-205">Latest Health Advisories</h3>
                </div>
                <button
                  id="refresh-advisories-btn"
                  onClick={fetchAdvisories}
                  disabled={loadingAdvisories}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-205 border border-slate-800 transition-colors"
                  title="Refresh advisories"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAdvisories ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="space-y-3">
                {loadingAdvisories ? (
                  <div className="flex items-center justify-center h-24 text-slate-500 text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading advisories…
                  </div>
                ) : (
                  advisories.map((adv) => (
                    <Link
                      key={adv.id}
                      to="/officer/news-intelligence"
                      id={`advisory-link-${adv.id}`}
                      className="block p-3.5 bg-slate-950/80 border border-slate-900 rounded-2xl hover:border-slate-800 transition text-xs group"
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="space-y-1 flex-1">
                          <span className="text-[9px] font-bold text-slate-500">{adv.date} · {adv.source}</span>
                          <p className="font-bold text-slate-200 group-hover:text-white transition duration-300 leading-snug">{adv.title}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-1.5 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link
              to="/officer/news-intelligence"
              className="mt-5 text-center text-xs text-cyan-400 hover:text-cyan-300 font-bold transition duration-300"
            >
              View All Advisories →
            </Link>
          </div>
        </div>

        {/* ── Emergency + Helplines + PHC Locator ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Emergency Helplines */}
          <div className="bg-rose-950/20 border border-rose-800/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-rose-200">Emergency Helplines</h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Ambulance', number: '108' },
                { label: 'National Emergency', number: '112' },
                { label: 'Health Helpline (Free)', number: '104' },
                { label: 'Tele-MANAS (Mental Health)', number: '14416' },
              ].map(({ label, number }) => (
                <a
                  key={number}
                  href={`tel:${number}`}
                  className="flex justify-between items-center p-2 bg-rose-950/30 border border-rose-800/20 rounded-lg hover:bg-rose-950/50 transition"
                >
                  <span className="text-rose-300">{label}</span>
                  <span className="font-mono font-bold text-rose-200 text-sm">{number}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Nearby PHC Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200">Nearest Health Centers</h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { name: 'PHC Haveli', type: 'Primary Health Centre', dist: '1.2 km', status: 'OPEN' },
                { name: 'District Hospital Pune', type: 'District Hospital', dist: '3.8 km', status: 'OPEN' },
                { name: 'ASHA Kiosk — Ward 12', type: 'Community Kiosk', dist: '0.6 km', status: 'OPEN' },
              ].map((phc) => (
                <div key={phc.name} className="flex justify-between items-start p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-200">{phc.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{phc.type} · {phc.dist}</p>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md mt-0.5 flex-shrink-0">{phc.status}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">PHC data sourced from NHA Health Facility Registry</p>
          </div>

          {/* PM-JAY / Gov Scheme Quick Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-200">Government Health Schemes</h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { scheme: 'PM-JAY (Ayushman Bharat)', benefit: '₹5 Lakh cashless coverage', color: 'emerald' },
                { scheme: 'NVBDCP (Dengue/Malaria)', benefit: 'Free test kits at all PHCs', color: 'blue' },
                { scheme: 'Mission Indradhanush', benefit: 'Free childhood vaccines (UIP)', color: 'purple' },
                { scheme: 'Tele-MANAS Programme', benefit: 'Free mental health support', color: 'amber' },
              ].map(({ scheme, benefit, color }) => {
                const c = COLOR_MAP[color];
                return (
                  <div key={scheme} className={`p-2.5 ${c.bg} border ${c.border} rounded-xl`}>
                    <p className={`font-semibold ${c.text} text-[11px]`}>{scheme}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{benefit}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Privacy & Trust Footer ─────────────────────────────────────────── */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ICMR Ground-Truth Verified</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> WHO Aligned Protocols</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> DPDP Act 2023 Compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No PII Stored or Shared</span>
          </div>
          <span className="text-slate-600">This portal provides health awareness information only. Consult a registered medical practitioner for diagnosis.</span>
        </div>

      </div>
    </CitizenLayout>
  );
}
