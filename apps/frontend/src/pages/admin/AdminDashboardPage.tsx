import React, { useState } from 'react';
import {
  Shield, Users, Server, Database, Key, Activity, CheckCircle2,
  RefreshCw, AlertTriangle, TrendingUp, Sparkles, ChevronRight,
  Lock, Eye, Trash2, UserPlus, Download, BarChart2, Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CitizenLayout from '../../layouts/CitizenLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OfficerRecord {
  id: string;
  name: string;
  role: 'ROLE_OFFICER' | 'ROLE_ADMIN';
  jurisdiction: string;
  abhaId: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  lastLogin: string;
}

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

// ─── Static Demo Data ─────────────────────────────────────────────────────────

const OFFICERS: OfficerRecord[] = [
  { id: 'off-01', name: 'Dr. Rajesh Sharma',   role: 'ROLE_OFFICER', jurisdiction: 'Pune District, MH',    abhaId: 'ABHA-91-8842-1029', status: 'ACTIVE',    lastLogin: '2026-08-04 09:12' },
  { id: 'off-02', name: 'Dr. Sunita Deshmukh', role: 'ROLE_OFFICER', jurisdiction: 'Nagpur District, MH',  abhaId: 'ABHA-91-7712-4011', status: 'ACTIVE',    lastLogin: '2026-08-04 08:44' },
  { id: 'off-03', name: 'Dr. Amit Kulkarni',   role: 'ROLE_OFFICER', jurisdiction: 'Mumbai District, MH',  abhaId: 'ABHA-91-5531-0021', status: 'SUSPENDED', lastLogin: '2026-07-20 14:03' },
  { id: 'off-04', name: 'Dr. Priya Nair',       role: 'ROLE_OFFICER', jurisdiction: 'Thane District, MH',  abhaId: 'ABHA-91-3310-8821', status: 'PENDING',   lastLogin: 'Never' },
];

const AUDIT_LOG: AuditEntry[] = [
  { id: 'aud-01', actor: 'admin@arogyaverse.gov.in',  action: 'PROVISION_OFFICER',  resource: 'Dr. Priya Nair',        timestamp: '2026-08-04 11:02', severity: 'INFO' },
  { id: 'aud-02', actor: 'admin@arogyaverse.gov.in',  action: 'SUSPEND_OFFICER',    resource: 'Dr. Amit Kulkarni',     timestamp: '2026-08-03 15:30', severity: 'WARNING' },
  { id: 'aud-03', actor: 'rajesh@pune.nic.in',        action: 'EXPORT_REPORT',      resource: 'Pune Heatmap CSV',      timestamp: '2026-08-04 09:20', severity: 'INFO' },
  { id: 'aud-04', actor: 'rajesh@pune.nic.in',        action: 'ACK_ALERT',          resource: 'alt-101 (Dengue HIGH)', timestamp: '2026-08-04 09:15', severity: 'INFO' },
  { id: 'aud-05', actor: 'SYSTEM',                    action: 'AI_PROMPT_VERSION',  resource: 'assistant-v1.4.2',      timestamp: '2026-08-04 00:00', severity: 'INFO' },
  { id: 'aud-06', actor: 'SYSTEM',                    action: 'QDRANT_SYNC',        resource: '48,920 chunks indexed', timestamp: '2026-08-03 23:00', severity: 'INFO' },
  { id: 'aud-07', actor: 'SYSTEM',                    action: 'ANOMALY_DETECTED',   resource: 'Haveli Z-Score 3.42',   timestamp: '2026-08-02 06:30', severity: 'CRITICAL' },
];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  SUSPENDED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  PENDING:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const SEVERITY_STYLES: Record<string, string> = {
  INFO:     'text-blue-400',
  WARNING:  'text-amber-400',
  CRITICAL: 'text-rose-400',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [officers, setOfficers] = useState<OfficerRecord[]>(OFFICERS);
  const [activeTab, setActiveTab] = useState<'rbac' | 'audit' | 'system'>('rbac');
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerJurisdiction, setNewOfficerJurisdiction] = useState('Pune District, MH');
  const [provisionSuccess, setProvisionSuccess] = useState('');

  const handleToggleStatus = (id: string) => {
    setOfficers(prev =>
      prev.map(o =>
        o.id === id
          ? { ...o, status: o.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : o
      )
    );
  };

  const handleProvision = () => {
    if (!newOfficerName.trim()) return;
    const newOfficer: OfficerRecord = {
      id: `off-${Date.now()}`,
      name: newOfficerName.trim(),
      role: 'ROLE_OFFICER',
      jurisdiction: newOfficerJurisdiction,
      abhaId: `ABHA-91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'PENDING',
      lastLogin: 'Never',
    };
    setOfficers(prev => [newOfficer, ...prev]);
    setProvisionSuccess(`${newOfficerName} provisioned. Credentials dispatched to official email.`);
    setNewOfficerName('');
    setTimeout(() => { setShowProvisionModal(false); setProvisionSuccess(''); }, 2500);
  };

  const handleExportAudit = () => {
    const lines = [
      'ArogyaVerse AI — Platform Audit Log',
      `Exported: ${new Date().toLocaleString()}`,
      '',
      'Timestamp | Actor | Action | Resource | Severity',
      ...AUDIT_LOG.map(e => `${e.timestamp} | ${e.actor} | ${e.action} | ${e.resource} | ${e.severity}`),
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArogyaVerse_AuditLog_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeCount = officers.filter(o => o.status === 'ACTIVE').length;

  return (
    <CitizenLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Admin Banner ─────────────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-blue-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100">National Platform Administration & Governance</h1>
            </div>
            <p className="text-xs text-slate-400">RBAC Management · AI Prompt Versioning · Audit Logs · System Health Monitoring</p>
          </div>
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-mono flex-shrink-0">
            ✓ ALL SYSTEMS OPERATIONAL
          </span>
        </header>

        {/* ── System KPI Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Registered Officers',   value: `${officers.length}`,  sub: `${activeCount} Active`,  color: 'text-slate-100', icon: Users },
            { label: 'Qdrant Vector Chunks',  value: '48,920',              sub: 'ICMR Ground-Truth Indexed', color: 'text-emerald-400', icon: Database },
            { label: 'TimescaleDB Events',    value: '14.8 M',              sub: 'Anonymized Geo Events', color: 'text-purple-400', icon: BarChart2 },
            { label: 'Bhashini API',          value: 'ACTIVE',              sub: '22 Indic Languages', color: 'text-emerald-400', icon: Globe },
          ].map(({ label, value, sub, color, icon: Icon }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{label}</span>
                <Icon className="w-4 h-4 text-slate-600" />
              </div>
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Tab Navigation ───────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1.5">
          {(['rbac', 'audit', 'system'] as const).map((tab) => (
            <button
              key={tab}
              id={`admin-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition ${
                activeTab === tab ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'rbac' ? '👥 RBAC & Officers' : tab === 'audit' ? '📋 Audit Log' : '⚙️ System Health'}
            </button>
          ))}
        </div>

        {/* ── RBAC Tab ─────────────────────────────────────────────────────── */}
        {activeTab === 'rbac' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-200">Role-Based Access Control (RBAC) Governance</h3>
              <button
                id="provision-officer-btn"
                onClick={() => setShowProvisionModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
              >
                <UserPlus className="w-3.5 h-3.5" /> Provision Officer
              </button>
            </div>

            {/* Provision Modal */}
            {showProvisionModal && (
              <div className="p-4 bg-slate-950 border border-blue-500/30 rounded-xl space-y-3 text-xs">
                <h4 className="font-bold text-slate-200">New Officer Provisioning</h4>
                {provisionSuccess ? (
                  <div className="flex items-center gap-2 text-emerald-400 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" /> {provisionSuccess}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Officer Full Name</label>
                      <input
                        id="new-officer-name"
                        type="text"
                        value={newOfficerName}
                        onChange={(e) => setNewOfficerName(e.target.value)}
                        placeholder="e.g. Dr. Meera Patil"
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Assigned Jurisdiction</label>
                      <select
                        id="new-officer-jurisdiction"
                        value={newOfficerJurisdiction}
                        onChange={(e) => setNewOfficerJurisdiction(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                      >
                        <option>Pune District, MH</option>
                        <option>Mumbai District, MH</option>
                        <option>Nagpur District, MH</option>
                        <option>Thane District, MH</option>
                        <option>Nashik District, MH</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 flex gap-2">
                      <button
                        id="confirm-provision-btn"
                        onClick={handleProvision}
                        disabled={!newOfficerName.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50 transition"
                      >
                        Confirm & Dispatch Credentials
                      </button>
                      <button
                        onClick={() => setShowProvisionModal(false)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Officer Name</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Jurisdiction</th>
                    <th className="py-2.5 px-3">ABHA ID</th>
                    <th className="py-2.5 px-3">Last Login</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {officers.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-3 font-semibold text-slate-200">{o.name}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                          {o.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">{o.jurisdiction}</td>
                      <td className="py-3 px-3 font-mono text-[11px]">{o.abhaId}</td>
                      <td className="py-3 px-3 text-slate-500">{o.lastLogin}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${STATUS_STYLES[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            id={`toggle-status-${o.id}`}
                            onClick={() => handleToggleStatus(o.id)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border transition ${
                              o.status === 'ACTIVE'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            }`}
                          >
                            {o.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Audit Log Tab ─────────────────────────────────────────────────── */}
        {activeTab === 'audit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-200">Platform Immutable Audit Trail</h3>
              <button
                id="export-audit-btn"
                onClick={handleExportAudit}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" /> Export Log
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {AUDIT_LOG.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 p-3 bg-slate-950/60 border border-slate-800 rounded-xl"
                >
                  <div className="flex-shrink-0 w-32 text-slate-500 font-mono text-[10px] pt-0.5">{entry.timestamp}</div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold font-mono ${SEVERITY_STYLES[entry.severity]}`}>{entry.action}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        entry.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : entry.severity === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>{entry.severity}</span>
                    </div>
                    <div className="text-slate-400">
                      <span className="text-slate-500">Actor:</span> {entry.actor} ·{' '}
                      <span className="text-slate-500">Resource:</span> {entry.resource}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── System Health Tab ─────────────────────────────────────────────── */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Status */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400" /> Service Status
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { service: 'Express.js API Gateway',     status: 'OPERATIONAL', uptime: '99.98%' },
                  { service: 'Bhashini Translation API',   status: 'OPERATIONAL', uptime: '99.91%' },
                  { service: 'Qdrant Vector Database',     status: 'OPERATIONAL', uptime: '100%' },
                  { service: 'TimescaleDB Hypertable',     status: 'OPERATIONAL', uptime: '99.99%' },
                  { service: 'Presidio PII Redaction',     status: 'OPERATIONAL', uptime: '100%' },
                  { service: 'AI Health Assistant Engine', status: 'OPERATIONAL', uptime: '99.85%' },
                  { service: 'OCR / Medicine Scanner',     status: 'OPERATIONAL', uptime: '99.72%' },
                ].map(({ service, status, uptime }) => (
                  <div key={service} className="flex justify-between items-center p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <span className="text-slate-300">{service}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-slate-500 font-mono">{uptime}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Prompt Version Control */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" /> AI Prompt Versioning & Knowledge Sync
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { label: 'Active Prompt Version',       value: 'assistant-v1.4.2', badge: 'LIVE', badgeColor: 'emerald' },
                  { label: 'ICMR Knowledge Base Version', value: 'icmr-kb-2026-08',  badge: 'SYNCED', badgeColor: 'blue' },
                  { label: 'WHO ICD-11 Codes',            value: 'ICD-11-2024',      badge: 'CURRENT', badgeColor: 'emerald' },
                  { label: 'NVBDCP Protocol Version',     value: 'nvbdcp-v3.1',      badge: 'SYNCED', badgeColor: 'blue' },
                  { label: 'Last Qdrant Sync',            value: '2026-08-04 23:00', badge: '48,920 chunks', badgeColor: 'purple' },
                ].map(({ label, value, badge, badgeColor }) => {
                  const c = COLOR_MAP_ADMIN[badgeColor] || COLOR_MAP_ADMIN['blue'];
                  return (
                    <div key={label} className="flex justify-between items-center p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                      <div>
                        <span className="text-slate-400 block">{label}</span>
                        <span className="text-slate-200 font-mono">{value}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${c}`}>{badge}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-[11px] text-blue-300">
                <span className="font-bold block text-blue-400 mb-0.5">Next scheduled sync</span>
                Knowledge base re-ingestion from ICMR portals scheduled for 2026-08-05 02:00 IST.
              </div>
            </div>
          </div>
        )}

      </div>
    </CitizenLayout>
  );
}

const COLOR_MAP_ADMIN: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  blue:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  purple:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rose:    'bg-rose-500/10 text-rose-400 border-rose-500/20',
};
