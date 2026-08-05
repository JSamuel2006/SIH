import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  AlertTriangle,
  MapPin,
  Users,
  FileText,
  Send,
  TrendingUp,
  ShieldCheck,
  Download,
  Search,
  Sliders,
  Sparkles,
  Database,
  Calendar,
  Layers,
  BarChart2,
  Clock,
  Briefcase,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import CitizenLayout from '../../layouts/CitizenLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OutbreakAlert {
  id: string;
  district: string;
  block: string;
  diseaseTag: string;
  zScore: number;
  baseline24h: number;
  current24h: number;
  increasePercentage: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  acknowledged?: boolean;
}

interface ResourceItem {
  name: string;
  current: number;
  total: number;
  unit: string;
  status: 'OK' | 'WARNING' | 'CRITICAL';
}

interface TwinResult {
  simulatedOutbreakProbability: number;
  hospitalStressIndex: number;
  riskLevel: string;
  recommendation: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OfficerDashboardPage() {
  // Filter Controls
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedDisease, setSelectedDisease] = useState('Dengue');

  // Map Layer
  const [mapLayer, setMapLayer] = useState<'symptom' | 'reports' | 'campaign' | 'hospital' | 'vaccination'>('symptom');

  // Alerts (fetched from API)
  const [alerts, setAlerts] = useState<OutbreakAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState('');

  // Resources (fetched from API)
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);

  // Digital Twin State
  const [twinCampaignCoverage, setTwinCampaignCoverage] = useState(65);
  const [twinHospitalBeds, setTwinHospitalBeds] = useState(82);
  const [twinAwarenessLevel, setTwinAwarenessLevel] = useState(70);
  const [twinResult, setTwinResult] = useState<TwinResult | null>(null);
  const [twinLoading, setTwinLoading] = useState(false);

  // Awareness Index (driven by awareness slider for KPI card)
  const awarenessIndex = twinAwarenessLevel;

  // ── Fetch Alerts ────────────────────────────────────────────────────────────
  const fetchAlerts = useCallback(async () => {
    setAlertsLoading(true);
    setAlertsError('');
    try {
      const res = await fetch('/api/v1/analytics/anomalies');
      const json = await res.json();
      if (json.success) {
        setAlerts(json.data.alerts.map((a: OutbreakAlert) => ({ ...a, acknowledged: false })));
      } else {
        setAlertsError('Failed to load outbreak alerts.');
      }
    } catch {
      setAlertsError('Network error — using cached alert data.');
      setAlerts([
        { id: 'alt-101', district: 'Pune', block: 'Haveli', diseaseTag: 'Dengue / High Fever', zScore: 3.42, baseline24h: 45, current24h: 189, increasePercentage: '320%', severity: 'HIGH', timestamp: new Date().toISOString(), acknowledged: false },
        { id: 'alt-102', district: 'Nagpur', block: 'Nagpur Urban', diseaseTag: 'Acute Diarrheal Disease', zScore: 2.85, baseline24h: 30, current24h: 92, increasePercentage: '206%', severity: 'MEDIUM', timestamp: new Date().toISOString(), acknowledged: false },
      ]);
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  // ── Fetch Resources ─────────────────────────────────────────────────────────
  const fetchResources = useCallback(async () => {
    setResourcesLoading(true);
    try {
      const res = await fetch('/api/v1/analytics/resources');
      const json = await res.json();
      if (json.success) {
        setResources(json.data.resources);
      }
    } catch {
      setResources([
        { name: 'Dengue Test Kits (Pune)', current: 12400, total: 15000, unit: 'kits', status: 'OK' },
        { name: 'ASHA Mosquito Nets (Haveli)', current: 1200, total: 8000, unit: 'nets', status: 'CRITICAL' },
        { name: 'ORS Packet Stock (ASHA Network)', current: 45000, total: 50000, unit: 'packets', status: 'OK' },
        { name: 'Malaria RDT Kits (Nagpur)', current: 3800, total: 6000, unit: 'kits', status: 'WARNING' },
        { name: 'Chlorine Tablets (Flood Zone)', current: 9200, total: 12000, unit: 'tablets', status: 'OK' },
      ]);
    } finally {
      setResourcesLoading(false);
    }
  }, []);

  // ── Digital Twin API call ───────────────────────────────────────────────────
  const runDigitalTwin = useCallback(async () => {
    setTwinLoading(true);
    try {
      const res = await fetch('/api/v1/analytics/digital-twin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignCoverage: twinCampaignCoverage,
          hospitalBeds: twinHospitalBeds,
          awarenessLevel: twinAwarenessLevel,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTwinResult(json.data);
      }
    } catch {
      // Fallback local computation
      const prob = Math.max(5, Math.min(95, Math.round(120 - twinCampaignCoverage * 0.8 - twinAwarenessLevel * 0.5)));
      setTwinResult({
        simulatedOutbreakProbability: prob,
        hospitalStressIndex: Math.max(0, Math.min(100, Math.round(100 - twinHospitalBeds * 0.7 + prob * 0.3))),
        riskLevel: prob > 60 ? 'HIGH RISK' : prob > 30 ? 'MODERATE RISK' : 'LOW RISK',
        recommendation: 'Continue monitoring. Increase campaign coverage to reduce outbreak probability.',
      });
    } finally {
      setTwinLoading(false);
    }
  }, [twinCampaignCoverage, twinHospitalBeds, twinAwarenessLevel]);

  // Run twin on slider change (debounced via useEffect)
  useEffect(() => {
    const timer = setTimeout(() => runDigitalTwin(), 400);
    return () => clearTimeout(timer);
  }, [runDigitalTwin]);

  // Initial data load
  useEffect(() => {
    fetchAlerts();
    fetchResources();
  }, [fetchAlerts, fetchResources]);

  // ── Acknowledge Alert ───────────────────────────────────────────────────────
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  // ── Export Report (proper Blob download, no alert()) ────────────────────────
  const handleExport = (format: 'CSV' | 'TXT') => {
    const activeAlerts = alerts.filter(a => !a.acknowledged);
    const lines: string[] = [
      `ArogyaVerse AI — Public Health Command Center Report`,
      `Jurisdiction: ${selectedDistrict} | Timeframe: ${selectedTimeframe} | Generated: ${new Date().toLocaleString()}`,
      '',
      '=== EARLY WARNING ALERTS ===',
      ...activeAlerts.map(a =>
        `[${a.severity}] ${a.diseaseTag} | ${a.district} — ${a.block} | Z-Score: ${a.zScore} | +${a.increasePercentage} vs baseline`
      ),
      '',
      '=== DIGITAL TWIN SIMULATION ===',
      `Campaign Coverage: ${twinCampaignCoverage}% | Hospital Beds: ${twinHospitalBeds}% | Awareness: ${twinAwarenessLevel}%`,
      `Simulated Outbreak Probability: ${twinResult?.simulatedOutbreakProbability ?? '--'}%`,
      `Risk Level: ${twinResult?.riskLevel ?? '--'}`,
      `Hospital Stress Index: ${twinResult?.hospitalStressIndex ?? '--'}%`,
      `AI Recommendation: ${twinResult?.recommendation ?? '--'}`,
      '',
      '=== RESOURCE INVENTORY ===',
      ...resources.map(r => `${r.name}: ${r.current.toLocaleString()} / ${r.total.toLocaleString()} ${r.unit} [${r.status}]`),
      '',
      'DISCLAIMER: This report is generated for planning purposes only. Not for clinical use.',
    ];

    const content = lines.join('\n');
    const mimeType = format === 'CSV' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    const ext = format === 'CSV' ? 'csv' : 'txt';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ArogyaVerse_CommandCenter_${selectedDistrict}_${Date.now()}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ── Derived Values ──────────────────────────────────────────────────────────
  const activeAlertCount = alerts.filter(a => !a.acknowledged).length;
  const simulatedOutbreakProbability = twinResult?.simulatedOutbreakProbability ?? Math.max(5, Math.min(95, Math.round(120 - twinCampaignCoverage * 0.8 - twinAwarenessLevel * 0.5)));

  const resourceStatusColor = (status: string) => {
    if (status === 'CRITICAL') return { bar: 'bg-rose-500', text: 'text-rose-400', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    if (status === 'WARNING') return { bar: 'bg-amber-500', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  };

  const layerInfo: Record<string, { title: string; detail: string }> = {
    symptom: { title: 'Symptom Density Layer', detail: `High query clustering detected around ${selectedDistrict} Haveli district (Fever symptoms: +32% over baseline).` },
    reports: { title: 'Disease Reports Layer', detail: `Verified clinical records: 189 active ${selectedDisease} cases in ${selectedDistrict} across 4 sub-districts.` },
    campaign: { title: 'Campaign Coverage Layer', detail: `Awareness campaign status: ${twinCampaignCoverage}% geographic reach across local schools and PHCs.` },
    hospital: { title: 'Hospital Bed Capacity', detail: `Emergency bed allocation status: ${twinHospitalBeds}% occupied. ${twinHospitalBeds > 85 ? '⚠️ Near saturation — consider temporary ward activation.' : 'Within normal operational range.'}` },
    vaccination: { title: 'Vaccination Coverage', detail: `Mission Indradhanush UIP coverage rate: ${awarenessIndex < 60 ? '61' : '78'}% — ${awarenessIndex < 60 ? 'below target, intensify drive' : 'on track for district target'}.` },
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <CitizenLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Top Command Banner ─────────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans">Public Health Command Center & Digital Twin</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Jurisdiction: State Command Hub | Dynamic epidemiological analytics and planning simulator</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              id="district-selector"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="Pune">Pune District</option>
              <option value="Mumbai">Mumbai District</option>
              <option value="Nagpur">Nagpur District</option>
            </select>

            <select
              id="timeframe-selector"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            <button
              id="refresh-alerts-btn"
              onClick={() => { fetchAlerts(); fetchResources(); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              title="Refresh data"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>

            <div className="flex items-center gap-1">
              <button
                id="export-csv-btn"
                onClick={() => handleExport('CSV')}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button
                id="export-txt-btn"
                onClick={() => handleExport('TXT')}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition"
              >
                <FileText className="w-3.5 h-3.5" /> TXT
              </button>
            </div>
          </div>
        </header>

        {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-slate-500 font-semibold text-[11px] block">Citizen Awareness Index</span>
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-extrabold text-slate-100">{awarenessIndex}%</h3>
              <span className="text-[10px] text-emerald-400 font-mono">↑ 4.2% MoM</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${awarenessIndex}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-slate-500 font-semibold text-[11px] block">Active Outbreak Signals</span>
            <div className="flex justify-between items-end">
              <h3 className={`text-2xl font-extrabold ${activeAlertCount > 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
                {alertsLoading ? '—' : `${activeAlertCount} Alerts`}
              </h3>
              <span className="text-[10px] text-rose-400 font-mono">Z-Score &gt; 2.5</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 truncate">
              {activeAlertCount > 0 ? `${alerts.find(a => !a.acknowledged)?.block}: ${alerts.find(a => !a.acknowledged)?.diseaseTag}` : 'All clear — no active signals'}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-slate-500 font-semibold text-[11px] block">Active Awareness Campaigns</span>
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-extrabold text-slate-100">4 Active</h3>
              <span className="text-[10px] text-blue-400 font-mono">{twinCampaignCoverage}% Reach</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${twinCampaignCoverage}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-slate-500 font-semibold text-[11px] block">Hospital Stress Index</span>
            <div className="flex justify-between items-end">
              <h3 className={`text-2xl font-extrabold ${(twinResult?.hospitalStressIndex ?? 30) > 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {twinResult?.hospitalStressIndex ?? '—'}%
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Bed Utilisation</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Based on {twinHospitalBeds}% declared availability</p>
          </div>
        </div>

        {/* ── Heatmap & Resource Planner ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Interactive Hotspot Map */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-96">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-200">Interactive Hotspot Map (Bhuvan Layer Overlay)</h3>
              </div>
              <select
                id="disease-selector"
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
                className="bg-slate-950 text-[10px] text-slate-300 border border-slate-800 rounded-lg px-2 py-1"
              >
                <option value="Dengue">Dengue Hotspots</option>
                <option value="Malaria">Malaria Hotspots</option>
                <option value="TB">Tuberculosis Clusters</option>
              </select>
            </div>

            {/* Layer Tab Bar */}
            <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl mb-3 border border-slate-800">
              {(['symptom', 'reports', 'campaign', 'hospital', 'vaccination'] as const).map((layer) => (
                <button
                  key={layer}
                  id={`map-layer-${layer}`}
                  onClick={() => setMapLayer(layer)}
                  className={`px-2.5 py-1 text-[10px] rounded-lg font-semibold transition ${
                    mapLayer === layer ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {layer === 'symptom' ? 'Symptom Density' : layer === 'reports' ? 'Disease Reports' : layer === 'campaign' ? 'Campaign Coverage' : layer === 'hospital' ? 'Hospital Capacity' : 'Vaccination Coverage'}
                </button>
              ))}
            </div>

            {/* Map Canvas */}
            <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

              {/* Animated Hotspot Pings */}
              <div className="absolute top-1/3 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-20 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600"></span>
              </div>
              <div className="absolute top-2/3 left-1/3 w-6 h-6 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-20 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
              </div>
              <div className="absolute top-1/2 left-2/3 w-5 h-5 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-20 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </div>

              {/* Layer Info Card */}
              <div className="z-10">
                <div className="bg-slate-900/95 border border-slate-800 rounded-lg p-2.5 text-[10px] max-w-[240px]">
                  <span className="font-bold text-slate-100 block">{layerInfo[mapLayer].title}</span>
                  <span className="text-slate-400 block mt-0.5">{layerInfo[mapLayer].detail}</span>
                </div>
              </div>

              <div className="flex justify-between items-end z-10 text-[10px] text-slate-500">
                <span>Active Layer: <span className="text-slate-300 font-mono">{mapLayer.toUpperCase()}</span> | {selectedDistrict} | 18.5204° N, 73.8567° E</span>
                <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">Heat Overlay Active</span>
              </div>
            </div>
          </div>

          {/* Resource Planning Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-96">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-400" />
              Resource Planning & Inventory
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto text-xs pr-1">
              {resourcesLoading ? (
                <div className="flex justify-center items-center h-32 text-slate-500 text-[11px]">Loading inventory…</div>
              ) : (
                resources.map((r, idx) => {
                  const pct = Math.round((r.current / r.total) * 100);
                  const colors = resourceStatusColor(r.status);
                  return (
                    <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between text-slate-300">
                        <span className="truncate pr-2">{r.name}</span>
                        <span className={`font-bold flex-shrink-0 ${colors.text}`}>
                          {r.current.toLocaleString()} / {r.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className={`${colors.bar} h-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                      </div>
                      {r.status !== 'OK' && (
                        <span className={`text-[10px] block font-semibold px-2 py-0.5 rounded-md border w-fit ${colors.badge}`}>
                          {r.status === 'CRITICAL' ? '⚠️ CRITICAL — Reallocate Immediately' : '⚡ WARNING — Stock Below Threshold'}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ── Timeline + Alerts & AI Trends ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Community Timeline Chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              Community Awareness Timeline Trends — {selectedDistrict}
            </h3>
            <div className="grid grid-cols-7 gap-2 h-36 items-end px-4 border-b border-slate-800 pb-2 flex-1">
              {[
                { day: 'Mon', pct: 40, count: 45 },
                { day: 'Tue', pct: 55, count: 62 },
                { day: 'Wed', pct: 50, count: 59 },
                { day: 'Thu', pct: 75, count: 85 },
                { day: 'Fri', pct: 100, count: 189, spike: true },
                { day: 'Sat', pct: 80, count: 92 },
                { day: 'Sun', pct: 60, count: 70 },
              ].map(({ day, pct, count, spike }) => (
                <div
                  key={day}
                  className={`rounded-t-md cursor-pointer transition relative group ${spike ? 'bg-rose-600' : 'bg-slate-800 hover:bg-blue-600/30'}`}
                  style={{ height: `${pct}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-slate-950 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    {day}: {count} queries{spike ? ' (SPIKE)' : ''}
                  </span>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-slate-500">{day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 mt-6 px-1">
              <span>Aug 01</span>
              <span className="text-rose-400">▲ Aug 04 — {selectedDisease} Query Cluster Alert triggered</span>
              <span>Aug 07</span>
            </div>
          </div>

          {/* Early Warning Alerts & AI Trends */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Early Warning Alerts
              </h3>
              {!alertsLoading && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${activeAlertCount > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                  {activeAlertCount} Active
                </span>
              )}
            </div>

            {alertsLoading ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">Loading alerts…</div>
            ) : alertsError ? (
              <div className="flex items-center gap-2 text-amber-400 text-[11px] p-2 bg-amber-500/5 border border-amber-500/20 rounded-lg mb-2">
                <WifiOff className="w-3.5 h-3.5 flex-shrink-0" /> {alertsError}
              </div>
            ) : null}

            <div className="space-y-2 overflow-y-auto flex-1 text-xs pr-1 min-h-0">
              {!alertsLoading && alerts.filter(a => !a.acknowledged).length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-[11px] flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                  All outbreak alerts acknowledged.
                </div>
              ) : (
                alerts.filter(a => !a.acknowledged).map((alert) => (
                  <div key={alert.id} className={`p-2.5 border rounded-xl space-y-1.5 ${alert.severity === 'HIGH' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className={`font-bold block ${alert.severity === 'HIGH' ? 'text-rose-300' : 'text-amber-300'}`}>{alert.diseaseTag}</span>
                        <span className="text-[10px] text-slate-500">{alert.district} — {alert.block} | Z: {alert.zScore}</span>
                      </div>
                      <button
                        id={`ack-alert-${alert.id}`}
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg hover:bg-emerald-500/20 transition flex-shrink-0"
                      >
                        Acknowledge
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Queries: {alert.current24h} (baseline: {alert.baseline24h}) — +{alert.increasePercentage} spike
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* AI Epidemiological Suggestion */}
            <div className="mt-3 pt-3 border-t border-slate-800 bg-slate-950/40 p-2.5 rounded-xl space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Epidemiological Suggestion
                </span>
                <span className="text-emerald-400 font-mono font-bold">91% Conf</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {activeAlertCount > 1
                  ? `Fever counts and search indicators suggest localized ${selectedDisease} spike in Haveli block. Recommendation: Initiate mosquito net distributions and school awareness campaigns.`
                  : `Current signals are within acceptable thresholds for ${selectedDistrict}. Continue routine ASHA surveillance and maintain campaign momentum.`}
              </p>
            </div>
          </div>
        </div>

        {/* ── WOW Feature: Public Health Digital Twin ─────────────────────── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-200">WOW Feature: Public Health Digital Twin Simulation</h3>
            </div>
            {twinLoading && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Simulating…
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            {/* Slider Controls */}
            <div className="space-y-5">
              <h4 className="font-bold text-slate-300">Adjust Planning Parameters</h4>

              {[
                { label: 'Target Campaign Coverage', value: twinCampaignCoverage, setter: setTwinCampaignCoverage, id: 'slider-campaign' },
                { label: 'District Hospital Bed Availability', value: twinHospitalBeds, setter: setTwinHospitalBeds, id: 'slider-hospital' },
                { label: 'General Health Literacy Index', value: twinAwarenessLevel, setter: setTwinAwarenessLevel, id: 'slider-awareness' },
              ].map(({ label, value, setter, id }) => (
                <div key={id} className="space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>{label}</span>
                    <span className="font-bold text-slate-200">{value}%</span>
                  </div>
                  <input
                    id={id}
                    type="range"
                    min="10"
                    max="100"
                    value={value}
                    onChange={(e) => setter(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-600/50 h-full transition-all duration-300" style={{ width: `${value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Outcome */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-300">Simulated Outbreak Probability</h4>

                <div className="flex items-center gap-3">
                  <div className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${
                    simulatedOutbreakProbability > 60 ? 'from-rose-400 to-red-400' :
                    simulatedOutbreakProbability > 30 ? 'from-amber-400 to-orange-400' :
                    'from-emerald-400 to-teal-400'
                  }`}>
                    {simulatedOutbreakProbability}%
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] rounded-lg border font-bold ${
                    simulatedOutbreakProbability > 60
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : simulatedOutbreakProbability > 30
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {twinResult?.riskLevel ?? (simulatedOutbreakProbability > 60 ? 'HIGH RISK' : simulatedOutbreakProbability > 30 ? 'MODERATE RISK' : 'LOW RISK')}
                  </span>
                </div>

                {twinResult && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Hospital Stress Index</span>
                      <span className={`font-bold ${twinResult.hospitalStressIndex > 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {twinResult.hospitalStressIndex}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${twinResult.hospitalStressIndex > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${twinResult.hospitalStressIndex}%` }}></div>
                    </div>
                  </div>
                )}

                {/* AI Recommendation from Backend */}
                {twinResult?.recommendation && (
                  <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-300 leading-relaxed">{twinResult.recommendation}</p>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-3 mt-4">
                *Outputs are simulated for epidemiological planning purposes only — not for clinical diagnosis.
              </div>
            </div>
          </div>
        </div>

      </div>
    </CitizenLayout>
  );
}
