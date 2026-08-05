import React, { useState, useEffect } from 'react';
import { Share2, Search, Info, ShieldAlert, RefreshCw, WifiOff } from 'lucide-react';
import CitizenLayout from '../../layouts/CitizenLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  label: string;
  type: 'DISEASE' | 'SYMPTOM' | 'PREVENTION' | 'VACCINE' | 'SCHEME';
  description: string;
}

interface GraphLink {
  source: string;
  target: string;
}

// Static positions for node layout (SVG coordinate system)
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  dengue:     { x: 210, y: 180 },
  malaria:    { x: 100, y: 250 },
  fever:      { x: 100, y: 90  },
  rash:       { x: 290, y: 80  },
  chills:     { x: 55,  y: 170 },
  drainage:   { x: 330, y: 180 },
  repellent:  { x: 340, y: 280 },
  nets:       { x: 160, y: 330 },
  dengvaxia:  { x: 270, y: 340 },
  pmjay:      { x: 210, y: 280 },
  nvbdcp:     { x: 150, y: 140 },
};

const TYPE_COLORS: Record<string, string> = {
  DISEASE:    '#ef4444',
  SYMPTOM:    '#f59e0b',
  PREVENTION: '#3b82f6',
  VACCINE:    '#a855f7',
  SCHEME:     '#10b981',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function KnowledgeGraphPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const fetchGraph = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/analytics/knowledge-graph');
      const json = await res.json();
      if (json.success) {
        setNodes(json.data.nodes);
        setLinks(json.data.links);
        setSelectedNode(json.data.nodes[0] ?? null);
      } else {
        setError('Failed to load knowledge graph data.');
      }
    } catch {
      setError('Network error — unable to load graph. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGraph(); }, []);

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'ALL' || node.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

  const nodeCounts = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <CitizenLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-400" />
                <h1 className="text-xl font-bold text-slate-100 font-sans">Interactive Health Knowledge Graph</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">Explore relationships between diseases, symptoms, preventive actions, immunization protocols, and government welfare schemes.</p>
            </div>
            <button
              id="refresh-knowledge-graph"
              onClick={fetchGraph}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4">
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></span>
                {type} ({nodeCounts[type] ?? 0})
              </div>
            ))}
          </div>
        </header>

        {error && (
          <div className="flex items-center gap-2 text-amber-400 text-xs p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <WifiOff className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SVG Canvas */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[480px]">
            <div className="flex justify-between items-center mb-3 text-xs gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="kg-search"
                  type="text"
                  placeholder="Search nodes (e.g. Dengue, Vaccine)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                id="kg-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-950 text-slate-300 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="ALL">All Node Types</option>
                <option value="DISEASE">Diseases</option>
                <option value="SYMPTOM">Symptoms</option>
                <option value="PREVENTION">Prevention</option>
                <option value="VACCINE">Vaccines</option>
                <option value="SCHEME">Gov. Schemes</option>
              </select>
            </div>

            {/* SVG */}
            <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading graph…
                </div>
              ) : (
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {/* Edges */}
                  {links.map((link, idx) => {
                    const sPos = NODE_POSITIONS[link.source];
                    const tPos = NODE_POSITIONS[link.target];
                    if (!sPos || !tPos) return null;
                    const bothVisible = filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target);
                    return (
                      <line
                        key={idx}
                        x1={sPos.x}
                        y1={sPos.y}
                        x2={tPos.x}
                        y2={tPos.y}
                        stroke={bothVisible ? '#334155' : '#1e293b'}
                        strokeWidth={bothVisible ? 1.5 : 0.5}
                        strokeDasharray={bothVisible ? 'none' : '4 4'}
                        className="transition-all duration-300"
                      />
                    );
                  })}

                  {/* Nodes */}
                  {nodes.map((node) => {
                    const pos = NODE_POSITIONS[node.id];
                    if (!pos) return null;
                    const isSelected = selectedNode?.id === node.id;
                    const isVisible = filteredNodeIds.has(node.id);
                    const color = TYPE_COLORS[node.type] ?? '#94a3b8';

                    return (
                      <g
                        key={node.id}
                        id={`node-${node.id}`}
                        onClick={() => setSelectedNode(node)}
                        className="cursor-pointer"
                        style={{ opacity: isVisible ? 1 : 0.2, transition: 'opacity 0.3s' }}
                      >
                        {isSelected && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={22}
                            fill={color}
                            opacity={0.15}
                            className="animate-ping"
                          />
                        )}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected ? 13 : 9}
                          fill={color}
                          stroke={isSelected ? '#fff' : 'transparent'}
                          strokeWidth={isSelected ? 1.5 : 0}
                          className="transition-all duration-200"
                        />
                        <text
                          x={pos.x}
                          y={pos.y - 15}
                          textAnchor="middle"
                          fill={isVisible ? '#cbd5e1' : '#475569'}
                          fontSize="9"
                          className="pointer-events-none"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          {/* Node Inspector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[480px]">
            <h3 className="text-sm font-bold text-slate-200 pb-2 border-b border-slate-800 mb-4 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-400" /> Node Inspector
            </h3>

            {selectedNode ? (
              <div className="space-y-4 flex-1 overflow-y-auto text-xs">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border`} style={{
                    backgroundColor: `${TYPE_COLORS[selectedNode.type]}15`,
                    color: TYPE_COLORS[selectedNode.type],
                    borderColor: `${TYPE_COLORS[selectedNode.type]}30`,
                  }}>
                    {selectedNode.type}
                  </span>
                  <h4 className="font-bold text-slate-200 text-base mt-2">{selectedNode.label}</h4>
                </div>
                <p className="text-slate-400 leading-relaxed">{selectedNode.description}</p>

                {/* Connected nodes */}
                <div>
                  <span className="text-slate-500 font-semibold text-[10px] block mb-2">CONNECTED NODES</span>
                  <div className="flex flex-wrap gap-1.5">
                    {links
                      .filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
                      .map((l, i) => {
                        const connId = l.source === selectedNode.id ? l.target : l.source;
                        const connNode = nodes.find(n => n.id === connId);
                        if (!connNode) return null;
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedNode(connNode)}
                            className="text-[10px] px-2 py-0.5 rounded-md border transition hover:opacity-80"
                            style={{
                              backgroundColor: `${TYPE_COLORS[connNode.type]}10`,
                              color: TYPE_COLORS[connNode.type],
                              borderColor: `${TYPE_COLORS[connNode.type]}30`,
                            }}
                          >
                            {connNode.label}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs py-8 text-center">
                <Share2 className="w-8 h-8 mb-2 text-slate-700" />
                Click any node inside the knowledge graph to inspect its connections and clinical details.
              </div>
            )}

            <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-3 mt-4 flex items-center gap-1.5 justify-center">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              <span>MoHFW Clinical Schema Mapping Enabled.</span>
            </div>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}
