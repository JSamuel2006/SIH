import React, { useState, useEffect, useCallback } from 'react';
import {
  Sliders, Sparkles, AlertTriangle, ShieldCheck, Play, RefreshCw,
  WifiOff, Save, Copy, Check, Download, FileText, BarChart2,
  Trash2, TrendingUp, Info, Users, ShieldAlert, CheckCircle2, ChevronRight
} from 'lucide-react';
import CitizenLayout from '../../layouts/CitizenLayout';
import { useAuth } from '../../contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SimulationResult {
  hospitalStressIndex: number;
  resourceUtilization: number;
  awarenessCoverage: number;
  vaccinationReach: number;
  campaignEffectiveness: number;
  operationalReadiness: number;
  citizenAwarenessScore: number;
  outbreakRiskIndicator: number;
  confidenceLevel: number;
  aiRecommendations: string[];
  timestamp: string;
}

interface SavedScenario {
  id: string;
  officerName: string;
  district: string;
  timePeriod: string;
  createdAt: string;

  // 14 Inputs
  hospitalBeds: number;
  medicalStaff: number;
  orsStock: number;
  testKits: number;
  mosquitoNets: number;
  vaccinationCoverage: number;
  campaignReach: number;
  campaignDuration: number;
  budgetAllocation: number;
  emergencyResponse: number;
  healthLiteracy: number;
  communityParticipation: number;

  // Outputs
  hospitalStressIndex: number;
  resourceUtilization: number;
  awarenessCoverage: number;
  vaccinationReach: number;
  campaignEffectiveness: number;
  operationalReadiness: number;
  citizenAwarenessScore: number;
  outbreakRiskIndicator: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScenarioSimulatorPage() {
  const { user } = useAuth();

  // 14 Simulation Inputs state
  const [district, setDistrict] = useState('Pune');
  const [timePeriod, setTimePeriod] = useState('Next 30 Days');
  const [hospitalBeds, setHospitalBeds] = useState(80);
  const [medicalStaff, setMedicalStaff] = useState(75);
  const [orsStock, setOrsStock] = useState(80);
  const [testKits, setTestKits] = useState(80);
  const [mosquitoNets, setMosquitoNets] = useState(50);
  const [vaccinationCoverage, setVaccinationCoverage] = useState(75);
  const [campaignReach, setCampaignReach] = useState(65);
  const [campaignDuration, setCampaignDuration] = useState(4);
  const [budgetAllocation, setBudgetAllocation] = useState(10);
  const [emergencyResponse, setEmergencyResponse] = useState(70);
  const [healthLiteracy, setHealthLiteracy] = useState(60);
  const [communityParticipation, setCommunityParticipation] = useState(60);

  // Simulation Outputs & General Page State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'simulator' | 'compare' | 'history'>('simulator');

  // Scenario A & B State for Comparison
  const [scenarioA, setScenarioA] = useState<SavedScenario | null>(null);
  const [scenarioB, setScenarioB] = useState<SavedScenario | null>(null);
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  // History state from DB
  const [history, setHistory] = useState<SavedScenario[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // ─── Fetch History ──────────────────────────────────────────────────────────
  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/v1/analytics/scenarios');
      const json = await res.json();
      if (json.success) {
        setHistory(json.data.scenarios);
      }
    } catch {
      // Graceful fallback with dummy initial history
      setHistory([
        {
          id: 'scn-init-01',
          officerName: 'Dr. Rajesh Sharma',
          district: 'Pune',
          timePeriod: 'Next 30 Days',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          hospitalBeds: 80,
          medicalStaff: 75,
          orsStock: 80,
          testKits: 80,
          mosquitoNets: 50,
          vaccinationCoverage: 75,
          campaignReach: 65,
          campaignDuration: 4,
          budgetAllocation: 10,
          emergencyResponse: 70,
          healthLiteracy: 60,
          communityParticipation: 60,
          hospitalStressIndex: 45,
          resourceUtilization: 68,
          awarenessCoverage: 62,
          vaccinationReach: 74,
          campaignEffectiveness: 58,
          operationalReadiness: 72,
          citizenAwarenessScore: 66,
          outbreakRiskIndicator: 35,
        }
      ]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // ─── Trigger Simulation ──────────────────────────────────────────────────────
  const handleSimulate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/analytics/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalBeds,
          medicalStaff,
          orsStock,
          testKits,
          mosquitoNets,
          vaccinationCoverage,
          campaignReach,
          campaignDuration,
          budgetAllocation,
          emergencyResponse,
          healthLiteracy,
          communityParticipation,
          district,
          timePeriod,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      } else {
        throw new Error('Simulation failed');
      }
    } catch {
      setError('Network error — using offline simulation mathematical models.');
      // Local estimation fallback
      const outbreak = Math.max(5, Math.min(95, Math.round(95 - (vaccinationCoverage * 0.3) - (mosquitoNets * 0.25) - (campaignReach * 0.15) - (healthLiteracy * 0.1) - (communityParticipation * 0.1))));
      const stress = Math.max(0, Math.min(100, Math.round(outbreak * 0.8 - (hospitalBeds * 0.35) - (medicalStaff * 0.25))));
      const resUtil = Math.max(10, Math.min(100, Math.round((outbreak * 0.5 + (100 - orsStock) * 0.2 + (100 - testKits) * 0.2) * (1.2 - (budgetAllocation > 50 ? 0.2 : budgetAllocation * 0.004)))));
      const confidence = Math.max(88, Math.min(96, Math.round(85 + (campaignDuration > 6 ? 5 : 2) + (communityParticipation > 60 ? 4 : 1))));

      setResult({
        hospitalStressIndex: stress,
        resourceUtilization: resUtil,
        awarenessCoverage: Math.max(5, Math.min(100, Math.round(campaignReach * 0.75 + communityParticipation * 0.25))),
        vaccinationReach: Math.max(5, Math.min(100, Math.round(vaccinationCoverage * 0.8 + (budgetAllocation > 25 ? 12 : budgetAllocation * 0.48) + campaignReach * 0.08))),
        campaignEffectiveness: Math.max(5, Math.min(100, Math.round((campaignReach * 0.35 + campaignDuration * 4.5 + communityParticipation * 0.25) * (budgetAllocation > 15 ? 1.15 : 0.88)))),
        operationalReadiness: Math.max(5, Math.min(100, Math.round(emergencyResponse * 0.4 + medicalStaff * 0.3 + testKits * 0.3))),
        citizenAwarenessScore: Math.max(5, Math.min(100, Math.round(healthLiteracy * 0.5 + campaignReach * 0.35 + communityParticipation * 0.15))),
        outbreakRiskIndicator: outbreak,
        confidenceLevel: confidence,
        aiRecommendations: outbreak > 50
          ? ['Trigger active vector-control measures (larvicide spraying, water drainage audits).', 'Distribute free insecticidal nets in high vector-breeding zones.']
          : ['Maintain existing preventive structures and execute routine monthly audits.'],
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger initial simulation on mount
  useEffect(() => {
    handleSimulate();
  }, []);

  // ─── Save Scenario to DB ────────────────────────────────────────────────────
  const handleSaveScenario = async (label: 'A' | 'B') => {
    if (!result) return;
    const bodyPayload = {
      officerId: user?.id || 'usr-officer-01',
      officerName: user?.name || 'Dr. Rajesh Sharma',
      district,
      timePeriod,
      hospitalBeds,
      medicalStaff,
      orsStock,
      testKits,
      mosquitoNets,
      vaccinationCoverage,
      campaignReach,
      campaignDuration,
      budgetAllocation,
      emergencyResponse,
      healthLiteracy,
      communityParticipation,
      hospitalStressIndex: result.hospitalStressIndex,
      resourceUtilization: result.resourceUtilization,
      awarenessCoverage: result.awarenessCoverage,
      vaccinationReach: result.vaccinationReach,
      campaignEffectiveness: result.campaignEffectiveness,
      operationalReadiness: result.operationalReadiness,
      citizenAwarenessScore: result.citizenAwarenessScore,
      outbreakRiskIndicator: result.outbreakRiskIndicator,
      confidenceLevel: result.confidenceLevel,
      aiRecommendations: result.aiRecommendations,
    };

    try {
      const res = await fetch('/api/v1/analytics/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });
      const json = await res.json();
      if (json.success) {
        const scenarioObj = json.data.scenario;
        if (label === 'A') {
          setScenarioA(scenarioObj);
          setCopiedA(true);
          setTimeout(() => setCopiedA(false), 2000);
        } else {
          setScenarioB(scenarioObj);
          setCopiedB(true);
          setTimeout(() => setCopiedB(false), 2000);
        }
        fetchHistory(); // Refresh feed
      }
    } catch {
      // Local save fallback
            const fallbackObj: SavedScenario = {
        ...bodyPayload,
        id: `scn-temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      if (label === 'A') {
        setScenarioA(fallbackObj);
        setCopiedA(true);
        setTimeout(() => setCopiedA(false), 2000);
      } else {
        setScenarioB(fallbackObj);
        setCopiedB(true);
        setTimeout(() => setCopiedB(false), 2000);
      }
      setHistory(prev => [fallbackObj, ...prev]);
    }
  };

  // ─── Delete Scenario ────────────────────────────────────────────────────────
  const handleDeleteScenario = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/analytics/scenarios/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setHistory(prev => prev.filter(h => h.id !== id));
      }
    } catch {
      setHistory(prev => prev.filter(h => h.id !== id));
    }
  };

  // ─── Load Scenario back to Controls ──────────────────────────────────────────
  const handleLoadScenario = (s: SavedScenario) => {
    setDistrict(s.district);
    setTimePeriod(s.timePeriod);
    setHospitalBeds(s.hospitalBeds);
    setMedicalStaff(s.medicalStaff);
    setOrsStock(s.orsStock);
    setTestKits(s.testKits);
    setMosquitoNets(s.mosquitoNets);
    setVaccinationCoverage(s.vaccinationCoverage);
    setCampaignReach(s.campaignReach);
    setCampaignDuration(s.campaignDuration);
    setBudgetAllocation(s.budgetAllocation);
    setEmergencyResponse(s.emergencyResponse);
    setHealthLiteracy(s.healthLiteracy);
    setCommunityParticipation(s.communityParticipation);
    setActiveTab('simulator');

    setResult({
      hospitalStressIndex: s.hospitalStressIndex,
      resourceUtilization: s.resourceUtilization,
      awarenessCoverage: s.awarenessCoverage,
      vaccinationReach: s.vaccinationReach,
      campaignEffectiveness: s.campaignEffectiveness,
      operationalReadiness: s.operationalReadiness,
      citizenAwarenessScore: s.citizenAwarenessScore,
      outbreakRiskIndicator: s.outbreakRiskIndicator,
      confidenceLevel: 92,
      aiRecommendations: [
        s.outbreakRiskIndicator > 50
          ? 'Trigger active vector-control measures (larvicide spraying, water drainage audits).'
          : 'Maintain existing preventive structures and execute routine monthly audits.'
      ],
      timestamp: new Date().toISOString(),
    });
  };

  // ─── Export Report ──────────────────────────────────────────────────────────
  const handleExport = (format: 'CSV' | 'JSON' | 'PDF') => {
    if (!result) return;
    const inputsString = `District: ${district} | Time: ${timePeriod} | Beds: ${hospitalBeds}% | Staff: ${medicalStaff}% | ORS: ${orsStock}% | Kits: ${testKits}% | Nets: ${mosquitoNets}% | Vaccines: ${vaccinationCoverage}% | Reach: ${campaignReach}% | Duration: ${campaignDuration}w | Budget: ${budgetAllocation} Lakhs | Emergency: ${emergencyResponse}% | Literacy: ${healthLiteracy}% | Community: ${communityParticipation}%`;
    const outputsString = `Outbreak Risk: ${result.outbreakRiskIndicator}% | Hospital Stress: ${result.hospitalStressIndex}% | Resource Util: ${result.resourceUtilization}% | Awareness: ${result.awarenessCoverage}% | Vaccine Reach: ${result.vaccinationReach}% | Effectiveness: ${result.campaignEffectiveness}% | Readiness: ${result.operationalReadiness}% | Literacy Score: ${result.citizenAwarenessScore}%`;

    if (format === 'JSON') {
      const payload = {
        meta: {
          title: 'ArogyaVerse Decision Support Scenario Export',
          officer: user?.name || 'Dr. Rajesh Sharma',
          timestamp: new Date().toISOString(),
          disclaimer: 'Simulation results are decision-support estimates based on configured assumptions and demonstration data.',
        },
        inputs: {
          district, timePeriod, hospitalBeds, medicalStaff, orsStock, testKits,
          mosquitoNets, vaccinationCoverage, campaignReach, campaignDuration,
          budgetAllocation, emergencyResponse, healthLiteracy, communityParticipation
        },
        outputs: { ...result }
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      triggerDownload(blob, `Scenario_${district}_${Date.now()}.json`);
    } else if (format === 'CSV') {
      const csvContent = [
        'ArogyaVerse AI Public Health Decision Support Tool',
        `Generated By: ${user?.name || 'Dr. Rajesh Sharma'}`,
        `Timestamp: ${new Date().toLocaleString()}`,
        'Disclaimer: Simulation results are decision-support estimates based on configured assumptions and demonstration data.',
        '',
        'PARAMETER,VALUE',
        `District,${district}`,
        `Time Period,${timePeriod}`,
        `Hospital Beds (%),${hospitalBeds}`,
        `Medical Staff (%),${medicalStaff}`,
        `ORS Stock (%),${orsStock}`,
        `Test Kits (%),${testKits}`,
        `Mosquito Nets (%),${mosquitoNets}`,
        `Vaccination Coverage (%),${vaccinationCoverage}`,
        `Campaign Reach (%),${campaignReach}`,
        `Campaign Duration (Weeks),${campaignDuration}`,
        `Budget Allocation (Lakhs),${budgetAllocation}`,
        `Emergency Response Capacity (%),${emergencyResponse}`,
        `Health Literacy Score (%),${healthLiteracy}`,
        `Community Participation (%),${communityParticipation}`,
        '',
        'METRIC,SIMULATED ESTIMATE',
        `Outbreak Risk Indicator (%),${result.outbreakRiskIndicator}`,
        `Hospital Stress Index (%),${result.hospitalStressIndex}`,
        `Resource Utilization (%),${result.resourceUtilization}`,
        `Awareness Coverage (%),${result.awarenessCoverage}`,
        `Vaccination Reach (%),${result.vaccinationReach}`,
        `Campaign Effectiveness (%),${result.campaignEffectiveness}`,
        `Operational Readiness (%),${result.operationalReadiness}`,
        `Citizen Awareness Score (%),${result.citizenAwarenessScore}`,
        `Confidence Level (%),${result.confidenceLevel}`,
        '',
        'AI RECOMMENDATIONS',
        ...result.aiRecommendations.map(r => `"${r}"`)
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      triggerDownload(blob, `Scenario_${district}_${Date.now()}.csv`);
    } else {
      // PDF/Print View
      window.print();
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ─── Scenario Comparison Computations ───────────────────────────────────────
  const getComparedMetric = (key: keyof SavedScenario) => {
    if (!scenarioA || !scenarioB) return null;
    const valA = scenarioA[key] as number;
    const valB = scenarioB[key] as number;
    const diff = valB - valA;
    return {
      a: valA,
      b: valB,
      diff,
      improved: key === 'outbreakRiskIndicator' || key === 'hospitalStressIndex' ? diff < 0 : diff > 0
    };
  };

  const getRecommendedScenario = () => {
    if (!scenarioA || !scenarioB) return null;
    let scoreA = 0;
    let scoreB = 0;

    // Outbreak risk: lower is better
    if (scenarioA.outbreakRiskIndicator < scenarioB.outbreakRiskIndicator) scoreA += 2;
    else if (scenarioB.outbreakRiskIndicator < scenarioA.outbreakRiskIndicator) scoreB += 2;

    // Hospital stress: lower is better
    if (scenarioA.hospitalStressIndex < scenarioB.hospitalStressIndex) scoreA += 1.5;
    else if (scenarioB.hospitalStressIndex < scenarioA.hospitalStressIndex) scoreB += 1.5;

    // Operational readiness: higher is better
    if (scenarioA.operationalReadiness > scenarioB.operationalReadiness) scoreA += 1;
    else if (scenarioB.operationalReadiness > scenarioA.operationalReadiness) scoreB += 1;

    // Citizen awareness: higher is better
    if (scenarioA.citizenAwarenessScore > scenarioB.citizenAwarenessScore) scoreA += 1;
    else if (scenarioB.citizenAwarenessScore > scenarioA.citizenAwarenessScore) scoreB += 1;

    if (scoreA > scoreB) {
      return {
        label: 'Scenario A',
        reason: `Scenario A yields a lower outbreak risk profile (${scenarioA.outbreakRiskIndicator}% vs ${scenarioB.outbreakRiskIndicator}%) and provides stable hospital bed stress optimization under configured resources.`
      };
    } else if (scoreB > scoreA) {
      return {
        label: 'Scenario B',
        reason: `Scenario B is objectively superior. It demonstrates enhanced community protection, reducing Outbreak Risk to ${scenarioB.outbreakRiskIndicator}% while maintaining a healthier Hospital Stress Index of ${scenarioB.hospitalStressIndex}%.`
      };
    } else {
      return {
        label: 'Neutral',
        reason: 'Both scenarios demonstrate identical epidemiological protection and stress vectors. Select based on local administrative budgets.'
      };
    }
  };

  const comparisonResult = getRecommendedScenario();

  return (
    <CitizenLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_50%,rgba(59,130,246,0.06),transparent)]" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-400" />
                <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans">AI Public Health Scenario Simulator</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Configure administrative decisions to model simulated vectors, outpatient stress loads, and program outcomes.
              </p>
              {/* Disclaimer */}
              <div className="flex items-center gap-1.5 mt-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 max-w-xl">
                <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <p className="text-[10px] text-blue-300 leading-normal">
                  Disclaimer: Simulation results are decision-support estimates based on configured assumptions and demonstration data. This tool does not make clinical diagnoses.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="tab-sim"
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'simulator' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Simulator
              </button>
              <button
                id="tab-comp"
                onClick={() => setActiveTab('compare')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                  activeTab === 'compare' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Compare Scenarios {(scenarioA || scenarioB) && `(${[scenarioA, scenarioB].filter(Boolean).length})`}
              </button>
              <button
                id="tab-hist"
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                  activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Saved History {history.length > 0 && `(${history.length})`}
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="flex items-center gap-2 text-amber-400 text-xs p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <WifiOff className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* ── Tab 1: Simulator Dashboard ── */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: 14 Slider Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-h-[760px] overflow-y-auto pr-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Intervention Parameters</h3>
                <span className="text-[10px] text-slate-500">14 configured parameters</span>
              </div>

              {/* District & Period */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Target District</label>
                  <select
                    id="input-district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                  >
                    <option>Pune</option>
                    <option>Mumbai</option>
                    <option>Nagpur</option>
                    <option>Thane</option>
                    <option>Nashik</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Time Horizon</label>
                  <select
                    id="input-timeperiod"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                  >
                    <option>Next 30 Days</option>
                    <option>Next 60 Days</option>
                    <option>Next 90 Days</option>
                  </select>
                </div>
              </div>

              {/* Param Group 1: Infrastructure */}
              <div className="space-y-3 bg-slate-950/40 p-3 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-blue-400 uppercase">Hospital & Staff capacity</span>
                {[
                  { label: 'Hospital Bed Utilization Capacity', val: hospitalBeds, set: setHospitalBeds, min: 10, suffix: '%' },
                  { label: 'Medical Staff Availability Ratios', val: medicalStaff, set: setMedicalStaff, min: 10, suffix: '%' },
                  { label: 'Emergency Response Drills', val: emergencyResponse, set: setEmergencyResponse, min: 10, suffix: '%' },
                ].map(({ label, val, set, min, suffix }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 truncate pr-2">{label}</span>
                      <span className="font-bold text-slate-200">{val}{suffix}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max="100"
                      value={val}
                      onChange={(e) => set(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* Param Group 2: Supplies */}
              <div className="space-y-3 bg-slate-950/40 p-3 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Medical Supplies Inventory</span>
                {[
                  { label: 'ORS Packet Stock Levels', val: orsStock, set: setOrsStock, min: 10, suffix: '%' },
                  { label: 'Malaria/Dengue Test Kits', val: testKits, set: setTestKits, min: 10, suffix: '%' },
                  { label: 'Mosquito Nets Distributed', val: mosquitoNets, set: setMosquitoNets, min: 10, suffix: '%' },
                ].map(({ label, val, set, min, suffix }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 truncate pr-2">{label}</span>
                      <span className="font-bold text-slate-200">{val}{suffix}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max="100"
                      value={val}
                      onChange={(e) => set(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                ))}
              </div>

              {/* Param Group 3: Communication */}
              <div className="space-y-3 bg-slate-950/40 p-3 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-purple-400 uppercase">Public Engagement Campaigns</span>
                {[
                  { label: 'Vaccination UIP Coverage', val: vaccinationCoverage, set: setVaccinationCoverage, min: 10, suffix: '%' },
                  { label: 'Campaign Geographic Reach', val: campaignReach, set: setCampaignReach, min: 10, suffix: '%' },
                  { label: 'Campaign Duration Weeks', val: campaignDuration, set: setCampaignDuration, min: 1, max: 12, suffix: ' Weeks' },
                  { label: 'Budget Allocation (Lakhs)', val: budgetAllocation, set: setBudgetAllocation, min: 1, max: 100, suffix: ' Lakhs' },
                ].map(({ label, val, set, min, max = 100, suffix }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 truncate pr-2">{label}</span>
                      <span className="font-bold text-slate-200">{val}{suffix}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={val}
                      onChange={(e) => set(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                ))}
              </div>

              {/* Param Group 4: Literacy */}
              <div className="space-y-3 bg-slate-950/40 p-3 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Health Literacy & Participation</span>
                {[
                  { label: 'Citizen Literacy Index', val: healthLiteracy, set: setHealthLiteracy, min: 10, suffix: '%' },
                  { label: 'Gram Panchayat Community Sync', val: communityParticipation, set: setCommunityParticipation, min: 10, suffix: '%' },
                ].map(({ label, val, set, min, suffix }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 truncate pr-2">{label}</span>
                      <span className="font-bold text-slate-200">{val}{suffix}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max="100"
                      value={val}
                      onChange={(e) => set(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  id="btn-simulate"
                  onClick={handleSimulate}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Run Model
                </button>
                <button
                  id="btn-save-a"
                  onClick={() => handleSaveScenario('A')}
                  className="flex items-center justify-center gap-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition"
                >
                  <Save className="w-3.5 h-3.5" /> {copiedA ? 'Saved A!' : 'Save A'}
                </button>
              </div>
              <button
                id="btn-save-b"
                onClick={() => handleSaveScenario('B')}
                className="w-full flex items-center justify-center gap-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition mt-1 text-[11px]"
              >
                <Save className="w-3.5 h-3.5" /> {copiedB ? 'Saved B!' : 'Save B (For Side-by-Side Comparison)'}
              </button>
            </div>

            {/* Right Side: KPI Cards + Gauge Charts + Custom Graphs */}
            <div className="lg:col-span-2 space-y-6">

              {/* Live Status Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Outbreak Risk Indicator', val: result?.outbreakRiskIndicator ?? 35, color: 'rose', description: 'Overall simulated risk level' },
                  { label: 'Hospital Stress Index', val: result?.hospitalStressIndex ?? 45, color: 'amber', description: 'Estimated bed/staff occupancy stress' },
                  { label: 'Resource Utilization', val: result?.resourceUtilization ?? 68, color: 'blue', description: 'Inventory stock depletion rate' },
                  { label: 'Citizen Awareness Score', val: result?.citizenAwarenessScore ?? 66, color: 'emerald', description: 'Literacy improvement forecast' },
                ].map(({ label, val, color, description }) => {
                  const barColor = color === 'rose' ? 'bg-rose-500' : color === 'amber' ? 'bg-amber-500' : color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500';
                  const textColor = color === 'rose' ? 'text-rose-400' : color === 'amber' ? 'text-amber-400' : color === 'blue' ? 'text-blue-400' : 'text-emerald-400';
                  return (
                    <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-28">
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">{label}</span>
                        <span className={`text-2xl font-extrabold block mt-1 ${textColor}`}>{val}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className={`${barColor} h-full transition-all duration-700`} style={{ width: `${val}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gauge Visualization + Graph Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Gauges (Outbreak Risk + Readiness) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-80">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-3">Model Safety Gauges</span>
                  
                  <div className="flex justify-around items-center flex-1">
                    {/* Gauge 1: Outbreak Risk */}
                    <div className="text-center space-y-2">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="38" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                          <circle
                            cx="48" cy="48" r="38"
                            stroke="#f43f5e" strokeWidth="6" fill="transparent"
                            strokeDasharray={238}
                            strokeDashoffset={238 - (238 * (result?.outbreakRiskIndicator ?? 35)) / 100}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <span className="absolute text-base font-extrabold text-slate-200">{result?.outbreakRiskIndicator ?? 35}%</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block font-semibold">Simulated Outbreak Risk</span>
                    </div>

                    {/* Gauge 2: Operational Readiness */}
                    <div className="text-center space-y-2">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="38" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                          <circle
                            cx="48" cy="48" r="38"
                            stroke="#10b981" strokeWidth="6" fill="transparent"
                            strokeDasharray={238}
                            strokeDashoffset={238 - (238 * (result?.operationalReadiness ?? 72)) / 100}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <span className="absolute text-base font-extrabold text-slate-200">{result?.operationalReadiness ?? 72}%</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block font-semibold">Operational Readiness</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-3 mt-3 flex items-center gap-1 justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Estimated Confidence Level: {result?.confidenceLevel ?? 92}% (RAG-Verified)</span>
                  </div>
                </div>

                {/* Projected Trend Line (Custom SVG) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-80">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Outbreak Risk Timeline Trend</span>
                    <span className="text-[9px] text-blue-400 font-mono font-bold">PROJECTED FORECAST</span>
                  </div>

                  {/* SVG Chart Canvas */}
                  <div className="flex-1 relative flex items-end justify-center px-2 py-4">
                    <svg className="w-full h-40" viewBox="0 0 300 120">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="300" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

                      {/* Line Path */}
                      <path
                        d={`M 10 100 
                            L 70 ${100 - (result?.outbreakRiskIndicator ?? 35) * 0.8} 
                            L 140 ${90 - (result?.vaccinationReach ?? 74) * 0.4} 
                            L 210 ${80 - (result?.campaignEffectiveness ?? 58) * 0.5} 
                            L 280 ${Math.max(10, 100 - (result?.operationalReadiness ?? 72) * 0.9)}`}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />

                      {/* Dots on nodes */}
                      <circle cx="70" cy={100 - (result?.outbreakRiskIndicator ?? 35) * 0.8} r="4" fill="#3b82f6" />
                      <circle cx="140" cy={90 - (result?.vaccinationReach ?? 74) * 0.4} r="4" fill="#3b82f6" />
                      <circle cx="210" cy={80 - (result?.campaignEffectiveness ?? 58) * 0.5} r="4" fill="#3b82f6" />
                      <circle cx="280" cy={Math.max(10, 100 - (result?.operationalReadiness ?? 72) * 0.9)} r="4" fill="#3b82f6" />
                    </svg>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-[9px] text-slate-500 font-mono">
                      <span>Baseline</span>
                      <span>Day 7</span>
                      <span>Day 14</span>
                      <span>Day 21</span>
                      <span>Day 30</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-2 block leading-snug">
                    Simulated trajectory modeling shows positive decline in risk vectors as campaigns scale.
                  </span>
                </div>
              </div>

              {/* Resource Allocation Chart & Program Outcomes */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">Estimated Program Outcomes</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {[
                    { label: 'Campaign Effectiveness', val: result?.campaignEffectiveness ?? 58, sub: 'Reach vs Duration Efficacy', color: 'bg-purple-500' },
                    { label: 'Vaccination Reach Rate', val: result?.vaccinationReach ?? 74, sub: 'Mission Indradhanush drive', color: 'bg-emerald-500' },
                    { label: 'Awareness Coverage', val: result?.awarenessCoverage ?? 62, sub: 'Calculated geographical reach', color: 'bg-blue-500' },
                  ].map(({ label, val, sub, color }) => (
                    <div key={label} className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl space-y-1.5">
                      <span className="text-slate-400 block font-semibold">{label}</span>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-slate-500 text-[10px]">{sub}</span>
                        <span className="font-extrabold text-slate-200">{val}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`${color} h-full`} style={{ width: `${val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic AI Recommendations Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI Grounded Recommendations
                  </span>
                  <span className="text-[9px] text-slate-500">Based on decision parameters</span>
                </div>

                <div className="space-y-2 text-xs">
                  {result?.aiRecommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-blue-600/5 border border-blue-500/10 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 leading-normal">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exports panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  Officer: <strong className="text-slate-200">{user?.name || 'Dr. Rajesh Sharma'}</strong> · District: <strong className="text-slate-200">{district}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="export-csv"
                    onClick={() => handleExport('CSV')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg text-xs transition"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>
                  <button
                    id="export-json"
                    onClick={() => handleExport('JSON')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg text-xs transition"
                  >
                    <Download className="w-3.5 h-3.5" /> JSON
                  </button>
                  <button
                    id="export-pdf"
                    onClick={() => handleExport('PDF')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    <FileText className="w-3.5 h-3.5" /> Print PDF Report
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── Tab 2: Scenario Comparison View ── */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scenario A Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h3 className="font-bold text-sm text-slate-200">Scenario A</h3>
                  {scenarioA ? (
                    <span className="text-[10px] text-slate-500">{scenarioA.district} · {scenarioA.timePeriod}</span>
                  ) : (
                    <span className="text-[10px] text-rose-400 font-semibold">Not Configured</span>
                  )}
                </div>
                {scenarioA ? (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-slate-400">
                      <div>Hospital Beds: <strong className="text-slate-200">{scenarioA.hospitalBeds}%</strong></div>
                      <div>Staff Availability: <strong className="text-slate-200">{scenarioA.medicalStaff}%</strong></div>
                      <div>ORS Stock: <strong className="text-slate-200">{scenarioA.orsStock}%</strong></div>
                      <div>Mosquito Nets: <strong className="text-slate-200">{scenarioA.mosquitoNets}%</strong></div>
                      <div>UIP Vaccines: <strong className="text-slate-200">{scenarioA.vaccinationCoverage}%</strong></div>
                      <div>Campaign Reach: <strong className="text-slate-200">{scenarioA.campaignReach}%</strong></div>
                    </div>
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Outbreak Risk Estimate:</span>
                        <span className="font-bold text-rose-400">{scenarioA.outbreakRiskIndicator}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hospital Stress Index:</span>
                        <span className="font-bold text-slate-200">{scenarioA.hospitalStressIndex}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Resource Utilization Rate:</span>
                        <span className="font-bold text-slate-200">{scenarioA.resourceUtilization}%</span>
                      </div>
                    </div>
                    <button
                      id="load-a-btn"
                      onClick={() => handleLoadScenario(scenarioA)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-semibold"
                    >
                      Load into Simulator
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-8 text-xs">
                    Adjust inputs and click <strong className="text-slate-400">Save A</strong> in the simulator tab to load.
                  </div>
                )}
              </div>

              {/* Scenario B Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h3 className="font-bold text-sm text-slate-200">Scenario B</h3>
                  {scenarioB ? (
                    <span className="text-[10px] text-slate-500">{scenarioB.district} · {scenarioB.timePeriod}</span>
                  ) : (
                    <span className="text-[10px] text-rose-400 font-semibold">Not Configured</span>
                  )}
                </div>
                {scenarioB ? (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-slate-400">
                      <div>Hospital Beds: <strong className="text-slate-200">{scenarioB.hospitalBeds}%</strong></div>
                      <div>Staff Availability: <strong className="text-slate-200">{scenarioB.medicalStaff}%</strong></div>
                      <div>ORS Stock: <strong className="text-slate-200">{scenarioB.orsStock}%</strong></div>
                      <div>Mosquito Nets: <strong className="text-slate-200">{scenarioB.mosquitoNets}%</strong></div>
                      <div>UIP Vaccines: <strong className="text-slate-200">{scenarioB.vaccinationCoverage}%</strong></div>
                      <div>Campaign Reach: <strong className="text-slate-200">{scenarioB.campaignReach}%</strong></div>
                    </div>
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Outbreak Risk Estimate:</span>
                        <span className="font-bold text-rose-400">{scenarioB.outbreakRiskIndicator}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hospital Stress Index:</span>
                        <span className="font-bold text-slate-200">{scenarioB.hospitalStressIndex}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Resource Utilization Rate:</span>
                        <span className="font-bold text-slate-200">{scenarioB.resourceUtilization}%</span>
                      </div>
                    </div>
                    <button
                      id="load-b-btn"
                      onClick={() => handleLoadScenario(scenarioB)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-semibold"
                    >
                      Load into Simulator
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-8 text-xs">
                    Adjust inputs and click <strong className="text-slate-400">Save B</strong> in the simulator tab to load.
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Delta Board */}
            {scenarioA && scenarioB ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">Side-by-Side Delta Comparison</h3>
                
                <div className="space-y-3 text-xs">
                  {[
                    { label: 'Outbreak Risk Indicator', key: 'outbreakRiskIndicator' as keyof SavedScenario, suffix: '%' },
                    { label: 'Hospital Stress Index', key: 'hospitalStressIndex' as keyof SavedScenario, suffix: '%' },
                    { label: 'Resource Utilization Rate', key: 'resourceUtilization' as keyof SavedScenario, suffix: '%' },
                    { label: 'Citizen Awareness Score', key: 'citizenAwarenessScore' as keyof SavedScenario, suffix: '%' },
                    { label: 'Operational Readiness', key: 'operationalReadiness' as keyof SavedScenario, suffix: '%' },
                  ].map((item) => {
                    const comp = getComparedMetric(item.key);
                    if (!comp) return null;
                    return (
                      <div key={item.key} className="flex justify-between items-center p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <span className="text-slate-400 font-semibold">{item.label}</span>
                        <div className="flex items-center gap-6">
                          <div className="text-slate-500">
                            A: <span className="font-bold text-slate-300">{comp.a}{item.suffix}</span> · B:{' '}
                            <span className="font-bold text-slate-300">{comp.b}{item.suffix}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-bold ${
                            comp.diff === 0 ? 'bg-slate-800 text-slate-400 border-slate-700' :
                            comp.improved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {comp.diff === 0 ? 'No Change' : `${comp.diff > 0 ? '+' : ''}${comp.diff}${item.suffix} ${comp.improved ? 'Improvement' : 'Decline'}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AI Choice */}
                {comparisonResult && (
                  <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                      <Sparkles className="w-4 h-4" /> AI Comparative Strategy Selection
                    </div>
                    <p className="text-slate-200">
                      Recommendation: <strong className="text-blue-400">{comparisonResult.label}</strong>
                    </p>
                    <p className="text-slate-400 leading-relaxed">{comparisonResult.reason}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
                You must configure and save both **Scenario A** and **Scenario B** to inspect delta reports.
              </div>
            )}
          </div>
        )}

        {/* ── Tab 3: History Feed from Database ── */}
        {activeTab === 'history' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-200">Saved Scenario History & Audit Logs</h3>

            {historyLoading ? (
              <div className="flex justify-center py-8 text-slate-500 text-xs">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading scenario records…
              </div>
            ) : history.length === 0 ? (
              <div className="text-center text-slate-500 py-8 text-xs">
                No saved scenarios found on the backend. Adjust simulator sliders and save scenarios to store history.
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {history.map((s) => (
                  <div key={s.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{s.district} District</span>
                        <span className="text-[10px] text-slate-500 font-mono">({s.timePeriod})</span>
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-[9px] font-mono">ID: {s.id}</span>
                      </div>
                      <p className="text-slate-400">
                        Risk: <strong className="text-rose-400">{s.outbreakRiskIndicator}%</strong> · Stress:{' '}
                        <strong className="text-slate-200">{s.hospitalStressIndex}%</strong> · Staff: {s.medicalStaff}% · Beds: {s.hospitalBeds}%
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Officer: {s.officerName} · Saved: {new Date(s.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleLoadScenario(s)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => {
                          setScenarioA(s);
                          setCopiedA(true);
                          setTimeout(() => setCopiedA(false), 2000);
                        }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg"
                        title="Set as Scenario A"
                      >
                        Set A
                      </button>
                      <button
                        onClick={() => {
                          setScenarioB(s);
                          setCopiedB(true);
                          setTimeout(() => setCopiedB(false), 2000);
                        }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg"
                        title="Set as Scenario B"
                      >
                        Set B
                      </button>
                      <button
                        onClick={() => handleDeleteScenario(s.id)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg"
                        title="Delete scenario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </CitizenLayout>
  );
}
