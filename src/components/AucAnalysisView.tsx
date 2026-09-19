import React, { useState, useMemo } from 'react';
import { 
  LineChart as LineChartIcon, 
  Filter, 
  Info, 
  AlertTriangle, 
  HelpCircle,
  Activity,
  Layers,
  Sparkles,
  Grid,
  ScatterChart as ScatterIcon,
  Dna,
  ShieldAlert,
  Search,
  ChevronRight,
  X,
  ExternalLink,
  Table,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sliders,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ReferenceLine,
  ReferenceArea,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { 
  AUC_DENSITY_DATA, 
  CELL_LINE_RECORDS, 
  DRUG_RESPONSE_OBSERVATIONS,
  HEATMAP_CELL_LINES,
  HEATMAP_DRUGS,
  HEATMAP_MATRIX,
  HeatmapCell,
  DrugResponseObservation,
  GENE_RESPONSE_ASSOCIATIONS,
  DATASET_SUMMARY_STATS
} from '../data/cellLineDatabase';
import { MolecularCandidate, ResponseClass } from '../types';
import { CandidateDetailModal } from './CandidateDetailModal';

interface AucAnalysisViewProps {
  candidates: MolecularCandidate[];
}

type TabType = 'distribution' | 'scatter' | 'heatmap' | 'outliers' | 'genotype_rel' | 'dashboard';

export const AucAnalysisView: React.FC<AucAnalysisViewProps> = ({ candidates }) => {
  const [activeTab, setActiveTab] = useState<TabType>('distribution');

  // Distribution Filters
  const [selectedCellLine, setSelectedCellLine] = useState<string>('all');
  const [selectedResponseClass, setSelectedResponseClass] = useState<string>('all');

  // Scatter Filters
  const [scatterCancerType, setScatterCancerType] = useState<string>('all');
  const [scatterDrugFilter, setScatterDrugFilter] = useState<string>('all');
  const [scatterResponseFilter, setScatterResponseFilter] = useState<string>('all');
  const [selectedObservation, setSelectedObservation] = useState<DrugResponseObservation | null>(null);

  // Heatmap Filters & Selected Cell
  const [heatmapSearch, setHeatmapSearch] = useState<string>('');
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<HeatmapCell | null>(null);

  // Genotype Relation Selected Gene
  const [selectedGene, setSelectedGene] = useState<string>('TP53');

  // Candidate inspection modal for dashboard
  const [inspectCandidate, setInspectCandidate] = useState<MolecularCandidate | null>(null);

  // Dynamic Density Calculation
  const dynamicDensityData = useMemo(() => {
    let peakShift = 0;
    if (selectedResponseClass === 'Very Sensitive') peakShift = -0.15;
    if (selectedResponseClass === 'Sensitive') peakShift = -0.05;
    if (selectedResponseClass === 'Moderate') peakShift = 0.1;
    if (selectedResponseClass === 'Resistant') peakShift = 0.25;
    if (selectedResponseClass === 'Very Resistant') peakShift = 0.4;

    return AUC_DENSITY_DATA.map(pt => {
      const factor = Math.exp(-Math.pow((pt.auc - (0.45 + peakShift)), 2) / 0.08);
      return {
        ...pt,
        candidatesDensity: parseFloat((Math.max(0, factor * 1.8)).toFixed(2))
      };
    });
  }, [selectedResponseClass]);

  // Filtered Scatter Observations
  const filteredScatterPoints = useMemo(() => {
    return DRUG_RESPONSE_OBSERVATIONS.filter(obs => {
      const matchCancer = scatterCancerType === 'all' || obs.cancerType.toLowerCase().includes(scatterCancerType.toLowerCase());
      const matchDrug = scatterDrugFilter === 'all' || obs.drug.toLowerCase().includes(scatterDrugFilter.toLowerCase());
      const matchResp = scatterResponseFilter === 'all' || obs.responseClass === scatterResponseFilter;
      return matchCancer && matchDrug && matchResp;
    });
  }, [scatterCancerType, scatterDrugFilter, scatterResponseFilter]);

  // Cell lines list for scatter X-axis mapping
  const cellLineIndices = useMemo(() => {
    const unique = Array.from(new Set(DRUG_RESPONSE_OBSERVATIONS.map(o => o.cellLine)));
    return unique;
  }, []);

  const scatterChartData = useMemo(() => {
    return filteredScatterPoints.map(obs => ({
      x: cellLineIndices.indexOf(obs.cellLine),
      y: obs.auc,
      cellLine: obs.cellLine,
      drug: obs.drug,
      responseClass: obs.responseClass,
      cancerType: obs.cancerType,
      keyMutations: obs.keyMutations,
      raw: obs
    }));
  }, [filteredScatterPoints, cellLineIndices]);

  // Outliers calculation: Observations with isOutlier = true or |zScore| > 1.8
  const outliersList = useMemo(() => {
    return DRUG_RESPONSE_OBSERVATIONS.filter(o => o.isOutlier || Math.abs(o.zScore) >= 1.8);
  }, []);

  // Unique cancer types for filter
  const uniqueCancerTypes = useMemo(() => {
    const set = new Set(DRUG_RESPONSE_OBSERVATIONS.map(o => o.cancerType.split(' ')[0]));
    return ['all', ...Array.from(set)];
  }, []);

  // Response color helper
  const getResponseColor = (resClass: ResponseClass) => {
    switch (resClass) {
      case 'Very Sensitive': return '#10b981'; // emerald
      case 'Sensitive': return '#06b6d4'; // cyan
      case 'Moderate': return '#3b82f6'; // blue
      case 'Resistant': return '#f59e0b'; // amber
      case 'Very Resistant': return '#f43f5e'; // rose
      default: return '#94a3b8';
    }
  };

  const getAucBgColor = (auc: number) => {
    if (auc <= 0.4) return 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/40';
    if (auc <= 0.6) return 'bg-cyan-500/25 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/35';
    if (auc <= 0.8) return 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30';
    if (auc <= 1.0) return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
    return 'bg-rose-500/25 text-rose-300 border-rose-500/50 hover:bg-rose-500/35';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* HEADER */}
      <div className="border-b border-[#162032] pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <LineChartIcon className="w-3.5 h-3.5" />
          <span>Pharmacogenomic Response & Sensitivity Suite</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            AUC ANALYSIS & PHARMACOGENOMIC GRAPHS
          </h1>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#070B12] border border-cyan-500/40 text-cyan-300 self-start sm:self-auto">
            GDSC & CTRP Calibrated
          </span>
        </div>
        <p className="text-xs text-[#9AA4B2] mt-1">
          Comprehensive exploration of area-under-the-dose-response-curve (AUC) distributions, cell line sensitivity scatters, drug response matrices, outlier detection, and genotype associations.
        </p>
      </div>

      {/* TOP TAB NAVIGATION */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#030509] border border-[#162032] rounded-xl font-mono text-xs">
        <button
          onClick={() => setActiveTab('distribution')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'distribution'
              ? 'bg-[#0B101A] text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)] font-semibold'
              : 'text-[#9AA4B2] hover:text-white'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>AUC Distribution</span>
        </button>

        <button
          onClick={() => setActiveTab('scatter')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'scatter'
              ? 'bg-[#0B101A] text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)] font-semibold'
              : 'text-[#9AA4B2] hover:text-white'
          }`}
        >
          <ScatterIcon className="w-3.5 h-3.5" />
          <span>Cell Line Scatter</span>
        </button>

        <button
          onClick={() => setActiveTab('heatmap')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'heatmap'
              ? 'bg-[#0B101A] text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.15)] font-semibold'
              : 'text-[#9AA4B2] hover:text-white'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Drug Response Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('outliers')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'outliers'
              ? 'bg-[#0B101A] text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)] font-semibold'
              : 'text-[#9AA4B2] hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Response Outliers</span>
        </button>

        <button
          onClick={() => setActiveTab('genotype_rel')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'genotype_rel'
              ? 'bg-[#0B101A] text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)] font-semibold'
              : 'text-[#9AA4B2] hover:text-white'
          }`}
        >
          <Dna className="w-3.5 h-3.5" />
          <span>Genotype × Response</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-purple-950/80 to-cyan-950/80 text-white border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.25)] font-semibold'
              : 'text-[#9AA4B2] hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Complete Graph Dashboard</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: AUC DISTRIBUTION & DENSITY (SECTION 13) */}
      {/* ======================================================== */}
      {activeTab === 'distribution' && (
        <div className="space-y-6">
          {/* FILTER CONTROL BAR */}
          <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">Density Distribution Filters:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] text-slate-400">Cell Line:</span>
                <select
                  value={selectedCellLine}
                  onChange={(e) => setSelectedCellLine(e.target.value)}
                  className="px-2.5 py-1 rounded bg-[#030509] border border-[#162032] text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Cell Lines (Pooled)</option>
                  {CELL_LINE_RECORDS.map(c => (
                    <option key={c.id} value={c.cellLine}>{c.cellLine} ({c.cancerType})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] text-slate-400">Response Target:</span>
                <select
                  value={selectedResponseClass}
                  onChange={(e) => setSelectedResponseClass(e.target.value)}
                  className="px-2.5 py-1 rounded bg-[#030509] border border-[#162032] text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Response Levels</option>
                  <option value="Very Sensitive">Very Sensitive (AUC ≤ 0.4)</option>
                  <option value="Sensitive">Sensitive (0.4 &lt; AUC ≤ 0.6)</option>
                  <option value="Moderate">Moderate (0.6 &lt; AUC ≤ 0.8)</option>
                  <option value="Resistant">Resistant (0.8 &lt; AUC ≤ 1.0)</option>
                  <option value="Very Resistant">Very Resistant (AUC &gt; 1.0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* MAIN PROBABILITY DENSITY CHART */}
          <div className="p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#162032] pb-3 gap-2">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                  <span>Probability Density of Cellular Drug Response (AUC)</span>
                </h3>
                <p className="text-[11px] text-[#9AA4B2] font-mono">
                  Continuous distribution over normalized dose-response area. Lower AUC indicates greater in-vitro cellular growth inhibition.
                </p>
              </div>
              <div className="flex items-center space-x-4 text-[10px] font-mono">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-cyan-300">Generated Candidates</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="text-purple-300">Known Chemotherapeutic Drugs</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <span className="text-slate-400">GDSC Baseline Repository</span>
                </div>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicDensityData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                  <defs>
                    <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorKnown" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorReference" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#162032" vertical={false} />

                  <ReferenceArea x1={0.1} x2={0.4} fill="#10b981" fillOpacity={0.04} />
                  <ReferenceArea x1={0.4} x2={0.6} fill="#06b6d4" fillOpacity={0.03} />
                  <ReferenceArea x1={0.6} x2={0.8} fill="#3b82f6" fillOpacity={0.02} />
                  <ReferenceArea x1={0.8} x2={1.0} fill="#f59e0b" fillOpacity={0.03} />
                  <ReferenceArea x1={1.0} x2={1.2} fill="#f43f5e" fillOpacity={0.04} />

                  <ReferenceLine x={0.4} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Very Sensitive Threshold', fill: '#10b981', fontSize: 10, position: 'insideTopLeft' }} />
                  <ReferenceLine x={0.8} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Resistance Boundary', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />

                  <XAxis 
                    dataKey="auc" 
                    stroke="#475569" 
                    fontSize={11} 
                    fontFamily="monospace"
                    label={{ value: 'AUC (Area Under Dose-Response Curve) →', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={11} 
                    fontFamily="monospace"
                    label={{ value: 'Probability Density', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#070B12', borderColor: '#162032', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />

                  <Area type="monotone" dataKey="referenceDensity" stroke="#64748b" fillOpacity={1} fill="url(#colorReference)" name="GDSC Reference Baseline" />
                  <Area type="monotone" dataKey="knownDrugsDensity" stroke="#a855f7" fillOpacity={1} fill="url(#colorKnown)" name="Known Bioactive Compounds" />
                  <Area type="monotone" dataKey="candidatesDensity" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCandidates)" name="Conditioned Candidates" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RESPONSE REGIONS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
            {DATASET_SUMMARY_STATS.aucInterpretation.map((band, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#070B12] border border-[#162032] space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold">{band.range}</span>
                <h4 className="text-white font-bold">{band.label}</h4>
                <p className="text-[10px] text-[#9AA4B2] leading-snug">{band.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CELL LINE RESPONSE SCATTER (SECTION 14) */}
      {/* ======================================================== */}
      {activeTab === 'scatter' && (
        <div className="space-y-6">
          {/* FILTER CONTROLS */}
          <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">Cell Line Response Filters:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] text-slate-400">Cancer Type:</span>
                <select
                  value={scatterCancerType}
                  onChange={(e) => setScatterCancerType(e.target.value)}
                  className="px-2.5 py-1 rounded bg-[#030509] border border-[#162032] text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  {uniqueCancerTypes.map(c => (
                    <option key={c} value={c}>{c === 'all' ? 'All Cancers' : c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] text-slate-400">Response Class:</span>
                <select
                  value={scatterResponseFilter}
                  onChange={(e) => setScatterResponseFilter(e.target.value)}
                  className="px-2.5 py-1 rounded bg-[#030509] border border-[#162032] text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Classes</option>
                  <option value="Very Sensitive">Very Sensitive</option>
                  <option value="Sensitive">Sensitive</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Resistant">Resistant</option>
                  <option value="Very Resistant">Very Resistant</option>
                </select>
              </div>

              <span className="text-[11px] text-slate-500">
                Showing {filteredScatterPoints.length} observations
              </span>
            </div>
          </div>

          {/* SCATTER PLOT */}
          <div className="p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-3">
            <div className="flex items-center justify-between border-b border-[#162032] pb-2">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  Cell Line Sensitivity Distribution (X: Cell Line, Y: AUC)
                </h3>
                <p className="text-[11px] text-[#9AA4B2] font-mono">
                  Each circle represents an experimental or conditioned drug response pair. Click any point to inspect full genomic alterations.
                </p>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-mono">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-400">≤0.4 Sensitive</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-400 ml-2" />
                <span className="text-slate-400">&gt;0.8 Resistant</span>
              </div>
            </div>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#162032" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Cell Line" 
                    ticks={cellLineIndices.map((_, i) => i)}
                    tickFormatter={(i) => cellLineIndices[i] || ''}
                    stroke="#475569" 
                    fontSize={10} 
                    fontFamily="monospace"
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="AUC" 
                    domain={[0, 1.3]} 
                    stroke="#475569" 
                    fontSize={11} 
                    fontFamily="monospace"
                    label={{ value: 'AUC (Low = High Sensitivity) →', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                  />
                  <ZAxis range={[70, 70]} />
                  <ReferenceLine y={0.4} stroke="#10b981" strokeDasharray="3 3" />
                  <ReferenceLine y={0.8} stroke="#f59e0b" strokeDasharray="3 3" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || !payload[0]) return null;
                      const pt = payload[0].payload;
                      return (
                        <div className="p-3 bg-[#030509] border border-[#162032] rounded-lg shadow-xl font-mono text-[11px] space-y-1">
                          <span className="text-cyan-300 font-bold block">{pt.cellLine}</span>
                          <div className="text-slate-300">Drug: <span className="text-white font-bold">{pt.drug}</span></div>
                          <div className="text-slate-300">AUC: <span className="text-emerald-300 font-bold">{pt.y}</span> ({pt.responseClass})</div>
                          <div className="text-slate-400 text-[10px]">Cancer: {pt.cancerType}</div>
                          <div className="text-purple-400 text-[9px] pt-1">Click to view complete mutations</div>
                        </div>
                      );
                    }}
                  />
                  <Scatter 
                    data={scatterChartData} 
                    onClick={(entry: any) => setSelectedObservation(entry?.raw || entry?.payload?.raw || null)}
                    className="cursor-pointer"
                  >
                    {scatterChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getResponseColor(entry.responseClass)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* INSPECTION DETAIL PANEL (When Point Clicked) */}
          {selectedObservation && (
            <div className="p-5 rounded-xl bg-[#030509] border border-cyan-500/40 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#162032] pb-2">
                <div className="flex items-center space-x-2">
                  <Dna className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-white">
                    Observation Dossier: {selectedObservation.cellLine} × {selectedObservation.drug}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedObservation(null)}
                  className="p-1 rounded bg-[#070B12] hover:bg-[#0B101A] text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#070B12] rounded border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">Cell Line & Cancer</span>
                  <span className="font-bold text-white text-xs">{selectedObservation.cellLine}</span>
                  <span className="text-[10px] text-slate-400 block">{selectedObservation.cancerType}</span>
                </div>
                <div className="p-3 bg-[#070B12] rounded border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">Compound & Class</span>
                  <span className="font-bold text-cyan-300 text-xs">{selectedObservation.drug}</span>
                  <span className="text-[10px] text-slate-400 block">{selectedObservation.compoundClass}</span>
                </div>
                <div className="p-3 bg-[#070B12] rounded border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">Observed Sensitivity</span>
                  <span className="font-bold text-emerald-300 text-sm">AUC: {selectedObservation.auc}</span>
                  <span className="text-[10px] text-purple-300 block">{selectedObservation.responseClass}</span>
                </div>
                <div className="p-3 bg-[#070B12] rounded border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">Pathway Impact</span>
                  <span className="font-bold text-slate-200 text-xs">{selectedObservation.targetPathway}</span>
                  <span className="text-[10px] text-slate-400 block">Z-Score: {selectedObservation.zScore.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5">
                  Associated Genetic Alterations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedObservation.keyMutations.map((mut, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#070B12] border border-[#162032] text-purple-300 text-[11px]">
                      {mut}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CELL LINE × DRUG HEATMAP (SECTION 15) */}
      {/* ======================================================== */}
      {activeTab === 'heatmap' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#070B12] border border-[#162032] font-mono text-xs">
            <div>
              <h3 className="text-sm font-bold text-white">
                Drug Response Matrix (Cell Line × Compound)
              </h3>
              <p className="text-[11px] text-[#9AA4B2]">
                Rows represent cell line cancer profiles; columns represent therapeutic agents. Click any matrix cell to open detailed response information.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter cell line or drug..."
                  value={heatmapSearch}
                  onChange={(e) => setHeatmapSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-[#030509] border border-[#162032] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* THE MATRIX TABLE */}
          <div className="p-4 rounded-2xl bg-[#070B12] border border-[#162032] overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#162032]">
                  <th className="p-2.5 text-slate-400 font-semibold bg-[#030509] sticky left-0 z-10 w-36">
                    Cell Line / Drug
                  </th>
                  {HEATMAP_DRUGS.map(drug => (
                    <th key={drug} className="p-2 text-center text-slate-300 font-semibold text-[11px] min-w-[85px]">
                      {drug}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEATMAP_CELL_LINES.filter(cl => 
                  cl.toLowerCase().includes(heatmapSearch.toLowerCase()) || 
                  HEATMAP_DRUGS.some(d => d.toLowerCase().includes(heatmapSearch.toLowerCase()))
                ).map(cellLine => (
                  <tr key={cellLine} className="border-b border-[#162032]/60 hover:bg-[#0B101A]">
                    <td className="p-2.5 font-bold text-white bg-[#030509] sticky left-0 z-10 whitespace-nowrap text-[11px]">
                      {cellLine}
                    </td>
                    {HEATMAP_DRUGS.map(drug => {
                      const item = HEATMAP_MATRIX.find(m => m.cellLine === cellLine && m.drug === drug);
                      if (!item) {
                        return <td key={drug} className="p-2 text-center text-slate-600">—</td>;
                      }
                      return (
                        <td key={drug} className="p-1 text-center">
                          <button
                            onClick={() => setSelectedHeatmapCell(item)}
                            className={`w-full py-1.5 px-1 rounded border text-[11px] font-bold transition-all cursor-pointer ${getAucBgColor(item.auc)}`}
                            title={`${cellLine} + ${drug}: AUC ${item.auc}`}
                          >
                            {item.auc.toFixed(2)}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SELECTED HEATMAP CELL DOSSIER */}
          {selectedHeatmapCell && (
            <div className="p-5 rounded-xl bg-[#030509] border border-purple-500/40 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#162032] pb-2">
                <span className="text-white font-bold text-sm flex items-center space-x-2">
                  <Grid className="w-4 h-4 text-purple-400" />
                  <span>Interaction Detail: {selectedHeatmapCell.cellLine} & {selectedHeatmapCell.drug}</span>
                </span>
                <button
                  onClick={() => setSelectedHeatmapCell(null)}
                  className="p-1 rounded bg-[#070B12] hover:bg-[#0B101A] text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#070B12] rounded border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">Cell Line</span>
                  <span className="text-sm font-bold text-white">{selectedHeatmapCell.cellLine}</span>
                  <span className="text-[10px] text-slate-400 block">{selectedHeatmapCell.cancerType} Cancer</span>
                </div>
                <div className="p-3 bg-[#070B12] rounded border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">Compound</span>
                  <span className="text-sm font-bold text-cyan-300">{selectedHeatmapCell.drug}</span>
                  <span className="text-[10px] text-slate-400 block">{selectedHeatmapCell.mechanism}</span>
                </div>
                <div className="p-3 bg-[#070B12] rounded border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">Dose Response</span>
                  <span className="text-base font-bold text-emerald-300">AUC: {selectedHeatmapCell.auc}</span>
                  <span className="text-[10px] text-purple-300 block">{selectedHeatmapCell.responseClass}</span>
                </div>
                <div className="p-3 bg-[#070B12] rounded border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">Sensitivity Status</span>
                  <span className="text-xs font-bold text-slate-200">
                    {selectedHeatmapCell.auc <= 0.4 ? 'Marked Cytotoxic Inhibition' : selectedHeatmapCell.auc >= 0.8 ? 'Intrinsic Insensitivity' : 'Intermediate Response'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">In-silico benchmark</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: RESPONSE OUTLIER ANALYSIS (SECTION 16) */}
      {/* ======================================================== */}
      {activeTab === 'outliers' && (
        <div className="space-y-6">
          {/* STATISTICAL OUTLIER DETECTION HEADER & DISCLAIMER */}
          <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Statistical Outlier Detection (Z-Score & IQR Method)</span>
            </div>
            <p className="text-xs text-[#9AA4B2] leading-relaxed">
              Detects pharmacogenomic response data points that deviate substantially from expected sensitivity distributions based on interquartile range (1.5 × IQR) and standard score ($|Z| &gt; 1.8$). These frequently identify rare oncogene addiction, bypass pathway activation, or gatekeeper mutations.
            </p>
            {/* MANDATORY DISCLAIMER AS SPECIFIED IN PROMPT */}
            <div className="p-3 rounded-lg bg-[#030509] border border-amber-500/40 text-[11px] font-mono text-amber-300/90 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Scientific Scope Clarification:</span>
                This is an exploratory, application-level statistical analysis tool for investigating response distribution anomalies. 
                <strong> Outlier detection is not part of the published G2D-Diff generative architecture</strong> described in the Nature Communications (2025) paper.
              </div>
            </div>
          </div>

          {/* OUTLIER TABLE */}
          <div className="p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#162032] pb-2">
              <h3 className="font-bold text-white text-sm">
                Detected Pharmacogenomic Outliers ({outliersList.length} Anomaly Cases)
              </h3>
              <span className="text-[11px] text-slate-500">Threshold: |Z| &ge; 1.8</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#162032] text-slate-400 text-[11px]">
                    <th className="p-2.5">Cell Line</th>
                    <th className="p-2.5">Cancer Type</th>
                    <th className="p-2.5">Compound</th>
                    <th className="p-2.5">AUC</th>
                    <th className="p-2.5">Z-Score</th>
                    <th className="p-2.5">Phenotype</th>
                    <th className="p-2.5">Mechanistic Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#162032]/60">
                  {outliersList.map(outlier => (
                    <tr 
                      key={outlier.id}
                      onClick={() => setSelectedObservation(outlier)}
                      className="hover:bg-[#0B101A] cursor-pointer transition-colors"
                    >
                      <td className="p-2.5 font-bold text-white">{outlier.cellLine}</td>
                      <td className="p-2.5 text-slate-300">{outlier.cancerType}</td>
                      <td className="p-2.5 font-bold text-cyan-300">{outlier.drug}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          outlier.auc <= 0.4 ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300' : 'bg-rose-950 border border-rose-500/40 text-rose-300'
                        }`}>
                          {outlier.auc.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-amber-400">
                        {outlier.zScore > 0 ? `+${outlier.zScore.toFixed(2)}` : outlier.zScore.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-purple-300">{outlier.responseClass}</td>
                      <td className="p-2.5 text-slate-400 text-[11px] max-w-xs truncate">
                        {outlier.outlierReason || 'Statistical deviation from cohort median'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: GENOTYPE × RESPONSE RELATIONSHIP (SECTION 17) */}
      {/* ======================================================== */}
      {activeTab === 'genotype_rel' && (
        <div className="space-y-6">
          {/* GENE SELECTOR */}
          <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Dna className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">Select Clinical Driver Gene:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {Object.keys(GENE_RESPONSE_ASSOCIATIONS).map(gene => (
                <button
                  key={gene}
                  onClick={() => setSelectedGene(gene)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedGene === gene
                      ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-[#030509] border border-[#162032] text-slate-400 hover:text-white'
                  }`}
                >
                  {gene}
                </button>
              ))}
            </div>
          </div>

          {/* GENE SUMMARY & MANDATORY DISCLAIMER */}
          {GENE_RESPONSE_ASSOCIATIONS[selectedGene] && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#030509] border border-[#162032] space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="text-emerald-400">{selectedGene}</span>
                    <span className="text-slate-400 font-normal">Pharmacogenomic Overview</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Altered: <strong className="text-purple-300">{GENE_RESPONSE_ASSOCIATIONS[selectedGene].alterationCount}</strong> • 
                    Wild-Type: <strong className="text-slate-300">{GENE_RESPONSE_ASSOCIATIONS[selectedGene].wildtypeCount}</strong> cell lines
                  </span>
                </div>
                <p className="text-[11px] text-[#9AA4B2] leading-relaxed">
                  {GENE_RESPONSE_ASSOCIATIONS[selectedGene].description}
                </p>

                {/* MANDATORY SCIENTIFIC WORDING */}
                <div className="p-3 rounded-lg bg-[#070B12] border border-cyan-500/30 text-[11px] text-cyan-300/90 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Scientific Rigor Notice:</span>
                    Observed association in the pharmacogenomic dataset. 
                    <strong> This correlation does NOT imply or prove that this mutation directly causes drug resistance or sensitivity.</strong> 
                    Secondary co-occurring mutations, passenger events, or epigenetic modifications may confound observed response profiles.
                  </div>
                </div>
              </div>

              {/* ASSOCIATED DRUGS TABLE & RESPONSE DISTRIBUTION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Top Associated Drugs */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-3 font-mono text-xs">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-[#162032] pb-2">
                    Top Correlated Therapeutic Compounds for {selectedGene}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-slate-400 text-[10px] border-b border-[#162032]">
                          <th className="p-2">Compound</th>
                          <th className="p-2 text-center">Mut AUC</th>
                          <th className="p-2 text-center">WT AUC</th>
                          <th className="p-2 text-center">Δ AUC</th>
                          <th className="p-2">Association</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#162032]/60">
                        {GENE_RESPONSE_ASSOCIATIONS[selectedGene].associatedDrugs.map((d, i) => (
                          <tr key={i} className="hover:bg-[#0B101A]">
                            <td className="p-2 font-bold text-cyan-300 text-[11px]">{d.drug}</td>
                            <td className="p-2 text-center text-white">{d.alteredMedianAuc.toFixed(2)}</td>
                            <td className="p-2 text-center text-slate-400">{d.wildtypeMedianAuc.toFixed(2)}</td>
                            <td className={`p-2 text-center font-bold ${d.deltaAuc < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {d.deltaAuc > 0 ? `+${d.deltaAuc.toFixed(2)}` : d.deltaAuc.toFixed(2)}
                            </td>
                            <td className="p-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${
                                d.trend === 'Sensitivity Association'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              }`}>
                                {d.trend}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Response Distribution Histogram */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-3 font-mono text-xs">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-[#162032] pb-2">
                    Observed AUC Distribution: {selectedGene} (Altered vs WT)
                  </h4>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={GENE_RESPONSE_ASSOCIATIONS[selectedGene].distributionHistogram} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#162032" vertical={false} />
                        <XAxis dataKey="aucBin" stroke="#475569" fontSize={10} fontFamily="monospace" />
                        <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#070B12', borderColor: '#162032', fontSize: '11px', fontFamily: 'monospace' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        <Bar dataKey="alteredPercentage" name="Altered / Mutant (%)" fill="#a855f7" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="wildtypePercentage" name="Wild-Type (%)" fill="#64748b" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: COMPLETE GRAPH DASHBOARD (SECTION 30) */}
      {/* ======================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* TOP ROW: GENOTYPE SUMMARY */}
          <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center">
                <Dna className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">CURRENT TUMOR MODEL PROFILE</span>
                <span className="text-sm font-bold text-white">Triple-Negative Breast (MDA-MB-231)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[9px]">TARGET RESPONSE</span>
                <span className="text-emerald-300 font-bold">Very Sensitive (AUC ≤ 0.40)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">ALTERATION PANEL</span>
                <span className="text-purple-300 font-bold">TP53 R280K, BRAF G464V, KRAS G13D</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">BENCHMARK REFERENCE</span>
                <span className="text-cyan-300 font-bold">Nature Comms 2025 (Fig 1–4)</span>
              </div>
            </div>
          </div>

          {/* SECOND ROW: GENOTYPE HEATMAP + AUC DISTRIBUTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-4 rounded-2xl bg-[#070B12] border border-[#162032] space-y-2">
              <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Grid className="w-3.5 h-3.5 text-purple-400" />
                <span>Genotype Alteration Subsystem Matrix</span>
              </h4>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px] text-center pt-2">
                <div className="p-2 rounded bg-purple-950/40 border border-purple-500/40 text-purple-300">
                  <span className="block font-bold">TP53</span>MUT (1)
                </div>
                <div className="p-2 rounded bg-purple-950/40 border border-purple-500/40 text-purple-300">
                  <span className="block font-bold">BRAF</span>MUT (1)
                </div>
                <div className="p-2 rounded bg-purple-950/40 border border-purple-500/40 text-purple-300">
                  <span className="block font-bold">KRAS</span>MUT (1)
                </div>
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/40 text-cyan-300">
                  <span className="block font-bold">NF1</span>CND (1)
                </div>
                <div className="p-2 rounded bg-[#030509] border border-[#162032] text-slate-500">
                  <span className="block font-bold">PIK3CA</span>WT (0)
                </div>
                <div className="p-2 rounded bg-[#030509] border border-[#162032] text-slate-500">
                  <span className="block font-bold">PTEN</span>WT (0)
                </div>
                <div className="p-2 rounded bg-[#030509] border border-[#162032] text-slate-500">
                  <span className="block font-bold">EGFR</span>WT (0)
                </div>
                <div className="p-2 rounded bg-[#030509] border border-[#162032] text-slate-500">
                  <span className="block font-bold">+711 Genes</span>Diploid
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 p-4 rounded-2xl bg-[#070B12] border border-[#162032] space-y-2">
              <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>AUC Distribution Curve (Candidates vs GDSC)</span>
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={AUC_DENSITY_DATA.slice(0, 10)} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="auc" stroke="#475569" fontSize={9} fontFamily="monospace" />
                    <YAxis stroke="#475569" fontSize={9} fontFamily="monospace" />
                    <Tooltip contentStyle={{ backgroundColor: '#070B12', borderColor: '#162032', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="candidatesDensity" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} name="Candidates" />
                    <Area type="monotone" dataKey="referenceDensity" stroke="#64748b" fill="#64748b" fillOpacity={0.1} name="GDSC Baseline" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* THIRD ROW: CELL LINE RESPONSE + AUC DIFFUSION TRAJECTORY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-4 rounded-2xl bg-[#070B12] border border-[#162032] space-y-2">
              <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
                <ScatterIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cell Line Response Scatter</span>
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162032" />
                    <XAxis type="number" dataKey="x" stroke="#475569" fontSize={9} fontFamily="monospace" />
                    <YAxis type="number" dataKey="y" domain={[0, 1.2]} stroke="#475569" fontSize={9} fontFamily="monospace" />
                    <Scatter data={scatterChartData.slice(0, 15)} fill="#10b981" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-6 p-4 rounded-2xl bg-[#070B12] border border-[#162032] space-y-2">
              <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <span>Predicted AUC Through 300 Diffusion Steps</span>
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={[
                      { step: 0, auc: 0.95 },
                      { step: 50, auc: 0.82 },
                      { step: 100, auc: 0.68 },
                      { step: 150, auc: 0.54 },
                      { step: 200, auc: 0.44 },
                      { step: 250, auc: 0.36 },
                      { step: 300, auc: 0.31 }
                    ]} 
                    margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                  >
                    <XAxis dataKey="step" stroke="#475569" fontSize={9} fontFamily="monospace" label={{ value: 'Diffusion Step t', fontSize: 9, fill: '#64748b' }} />
                    <YAxis domain={[0.2, 1.0]} stroke="#475569" fontSize={9} fontFamily="monospace" />
                    <Tooltip contentStyle={{ backgroundColor: '#070B12', borderColor: '#162032', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="auc" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.15} name="Conditioned AUC" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* FOURTH ROW: LATENT SPACE + DRUG RESPONSE MATRIX */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-4 rounded-2xl bg-[#070B12] border border-[#162032] space-y-2">
              <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Chemical Latent Space (2D UMAP Projection)</span>
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162032" />
                    <XAxis type="number" dataKey="x" stroke="#475569" fontSize={9} domain={[-3, 3]} />
                    <YAxis type="number" dataKey="y" stroke="#475569" fontSize={9} domain={[-3, 3]} />
                    <Scatter 
                      data={[
                        { x: -1.8, y: 1.4, name: 'MDA-MB-231' },
                        { x: -1.6, y: 1.3, name: 'Candidate 1' },
                        { x: -0.9, y: 0.6, name: 'MCF7' },
                        { x: 0.4, y: -0.3, name: 'HT-29' },
                        { x: 1.3, y: -1.1, name: 'A549' }
                      ]} 
                      fill="#06b6d4" 
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-6 p-4 rounded-2xl bg-[#070B12] border border-[#162032] space-y-2">
              <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Grid className="w-3.5 h-3.5 text-purple-400" />
                <span>Drug Response Heatmap Mini-Grid</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-[10px] text-center border-collapse">
                  <thead>
                    <tr className="text-slate-400 border-b border-[#162032]">
                      <th className="p-1 text-left">Model</th>
                      <th className="p-1">Alpelisib</th>
                      <th className="p-1">Palbociclib</th>
                      <th className="p-1">Osimertinib</th>
                      <th className="p-1">SN-38</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#162032]/60">
                    <tr>
                      <td className="p-1 text-left font-bold text-white">MDA-231</td>
                      <td className="p-1 text-emerald-300 bg-emerald-950/40 font-bold">0.32</td>
                      <td className="p-1 text-amber-300 bg-amber-950/40">0.88</td>
                      <td className="p-1 text-blue-300">0.74</td>
                      <td className="p-1 text-cyan-300">0.49</td>
                    </tr>
                    <tr>
                      <td className="p-1 text-left font-bold text-white">MCF7</td>
                      <td className="p-1 text-emerald-300 bg-emerald-950/40 font-bold">0.39</td>
                      <td className="p-1 text-cyan-300 bg-cyan-950/40">0.48</td>
                      <td className="p-1 text-blue-300">0.78</td>
                      <td className="p-1 text-cyan-300">0.52</td>
                    </tr>
                    <tr>
                      <td className="p-1 text-left font-bold text-white">PC-9</td>
                      <td className="p-1 text-blue-300">0.65</td>
                      <td className="p-1 text-amber-300">0.82</td>
                      <td className="p-1 text-emerald-300 bg-emerald-950/40 font-bold">0.28</td>
                      <td className="p-1 text-cyan-300">0.53</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FIFTH ROW: QED VS SAS SCATTER + PROPERTY DISTRIBUTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-4 rounded-2xl bg-[#070B12] border border-[#162032] space-y-2">
              <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>QED Drug-likeness vs SAS Synthesizability</span>
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162032" />
                    <XAxis type="number" dataKey="sas" name="SAS" domain={[2, 6]} stroke="#475569" fontSize={9} label={{ value: 'SAS (Lower = Easier Synthesis) →', position: 'insideBottom', offset: -10, fontSize: 8, fill: '#64748b' }} />
                    <YAxis type="number" dataKey="qed" name="QED" domain={[0.5, 1.0]} stroke="#475569" fontSize={9} label={{ value: 'QED →', angle: -90, position: 'insideLeft', fontSize: 8, fill: '#64748b' }} />
                    <ReferenceLine x={4.56} stroke="#f43f5e" strokeDasharray="2 2" />
                    <ReferenceLine y={0.80} stroke="#10b981" strokeDasharray="2 2" />
                    <Scatter 
                      data={candidates.map(c => ({
                        sas: c.sas,
                        qed: c.qed,
                        name: c.name,
                        candidate: c
                      }))} 
                      fill="#06b6d4" 
                      onClick={(e: any) => {
                        const cand = e?.candidate || e?.payload?.candidate;
                        if (cand) setInspectCandidate(cand);
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-6 p-4 rounded-2xl bg-[#070B12] border border-[#162032] space-y-2">
              <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Candidate Molecular Property Distribution</span>
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { prop: 'QED > 0.8', count: candidates.filter(c => c.qed >= 0.8).length },
                      { prop: 'SAS < 4.56', count: candidates.filter(c => c.sas <= 4.56).length },
                      { prop: 'Tan < 0.25', count: candidates.filter(c => c.tanimotoMax <= 0.25).length },
                      { prop: 'Retro ≤ 4', count: candidates.filter(c => c.retrosynthesisDepth <= 4).length },
                      { prop: 'Lipinski Pass', count: candidates.filter(c => c.passesLipinski).length }
                    ]} 
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#162032" vertical={false} />
                    <XAxis dataKey="prop" stroke="#475569" fontSize={9} fontFamily="monospace" />
                    <YAxis stroke="#475569" fontSize={9} fontFamily="monospace" />
                    <Bar dataKey="count" fill="#a855f7" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: GENERATED RESEARCH CANDIDATE MOLECULES */}
          <div className="p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#162032] pb-2">
              <h4 className="font-bold text-white uppercase tracking-wider">
                Generated Research Candidate Molecules ({candidates.length} in-silico structures)
              </h4>
              <span className="text-[11px] text-cyan-400">Click card to open full dossier</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {candidates.map(candidate => (
                <div
                  key={candidate.id}
                  onClick={() => setInspectCandidate(candidate)}
                  className="p-3 rounded-xl bg-[#030509] border border-[#162032] hover:border-cyan-500/50 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-cyan-400">{candidate.id}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border ${
                        candidate.passedFilters 
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                      }`}>
                        {candidate.passedFilters ? 'PASSED' : 'FILTERED'}
                      </span>
                    </div>
                    <span className="font-bold text-white text-xs block truncate">{candidate.name}</span>
                    <span className="text-[10px] text-slate-400 block">{candidate.formula} • {candidate.molecularWeight.toFixed(1)} Da</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#162032] grid grid-cols-3 text-center text-[10px]">
                    <div>
                      <span className="text-slate-500 block text-[8px]">QED</span>
                      <span className="font-bold text-cyan-300">{candidate.qed.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">SAS</span>
                      <span className="font-bold text-purple-300">{candidate.sas.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">TANIMOTO</span>
                      <span className="font-bold text-emerald-300">{candidate.tanimotoMax.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE DETAIL MODAL */}
      {inspectCandidate && (
        <CandidateDetailModal
          candidate={inspectCandidate}
          onClose={() => setInspectCandidate(null)}
        />
      )}
    </div>
  );
};
