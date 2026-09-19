import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart as LineChartIcon, 
  ArrowRight, 
  ArrowLeft, 
  Activity, 
  Layers, 
  Sparkles, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter,
  Grid,
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
  Cell
} from 'recharts';
import { 
  AUC_DENSITY_DATA, 
  CELL_LINE_RECORDS, 
  DRUG_RESPONSE_OBSERVATIONS,
  HEATMAP_CELL_LINES,
  HEATMAP_DRUGS,
  HEATMAP_MATRIX,
  HeatmapCell,
  DrugResponseObservation
} from '../../data/cellLineDatabase';
import { GeneticAlteration, ResponseClass } from '../../types';

interface Stage04ResponseContextProps {
  alterations: GeneticAlteration[];
  responseClass: ResponseClass;
  onProceedToDiffusion: () => void;
  onBackToConditionEncoder?: () => void;
}

type SubViewTab = 'density' | 'scatter' | 'matrix' | 'manifold';

export const Stage04ResponseContext: React.FC<Stage04ResponseContextProps> = ({
  alterations,
  responseClass,
  onProceedToDiffusion,
  onBackToConditionEncoder
}) => {
  const [activeTab, setActiveTab] = useState<SubViewTab>('density');
  const [scatterLineage, setScatterLineage] = useState<string>('all');
  const [selectedObservation, setSelectedObservation] = useState<DrugResponseObservation | null>(null);
  const [selectedMatrixCell, setSelectedMatrixCell] = useState<HeatmapCell | null>(null);

  // Dynamic density calculation conditioned on the current responseClass
  const conditionedDensityData = useMemo(() => {
    let peakShift = 0;
    if (responseClass === 'Very Sensitive') peakShift = -0.15;
    if (responseClass === 'Sensitive') peakShift = -0.05;
    if (responseClass === 'Moderate') peakShift = 0.1;
    if (responseClass === 'Resistant') peakShift = 0.25;
    if (responseClass === 'Very Resistant') peakShift = 0.4;

    return AUC_DENSITY_DATA.map(pt => {
      const factor = Math.exp(-Math.pow((pt.auc - (0.45 + peakShift)), 2) / 0.08);
      return {
        ...pt,
        conditionedDensity: parseFloat((pt.candidatesDensity * (0.3 + factor * 0.9)).toFixed(2))
      };
    });
  }, [responseClass]);

  // Scatter chart data
  const scatterChartData = useMemo(() => {
    return DRUG_RESPONSE_OBSERVATIONS.filter(obs => {
      if (scatterLineage !== 'all' && obs.cancerType !== scatterLineage) return false;
      return true;
    }).map(obs => {
      const cl = CELL_LINE_RECORDS.find(c => c.cellLine === obs.cellLine);
      const alterationsCount = cl ? cl.mutationCount + cl.cnaCount + cl.cndCount : 120;
      return {
        x: obs.auc,
        y: alterationsCount,
        name: `${obs.cellLine} + ${obs.drug}`,
        responseClass: obs.responseClass,
        raw: obs
      };
    });
  }, [scatterLineage]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#162032] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Pipeline Phase 04</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            04 — Drug Response Context
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            The research framework uses pharmacological drug-response information measured using Area Under the Curve (AUC). 
            Integrating this context with the tumor genotype establishes the conditioning signal that guides molecular latent diffusion.
          </p>
        </div>

        {/* Target Response Pill */}
        <div className="flex items-center space-x-3 bg-[#070B12] border border-[#162032] px-3.5 py-2 rounded-xl self-start text-xs font-mono">
          <span className="text-slate-400">Condition Target:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
            {responseClass}
          </span>
        </div>
      </div>

      {/* SCIENTIFIC AUC INTERPRETATION & CONDITIONING FORMULA STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#070B12] border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between text-cyan-300 font-bold">
            <span>AUC = 0</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40">Total Elimination</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Total cancer cell elimination across evaluated concentration range. Maximal in-vitro therapeutic cytotoxicity.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#070B12] border border-slate-700/60 space-y-1">
          <div className="flex items-center justify-between text-slate-200 font-bold">
            <span>AUC = 1.0</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">No Effect</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Cellular viability unchanged compared to vehicle control. Neutral pharmacological baseline.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#070B12] border border-rose-500/30 space-y-1">
          <div className="flex items-center justify-between text-rose-300 font-bold">
            <span>AUC &gt; 1.0</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 border border-rose-500/40">Growth Promotion</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Compound promotes proliferation / growth induction. Adverse pharmacological outcome.
          </p>
        </div>
      </div>

      {/* CONDITIONING SIGNAL INTEGRATION BANNER */}
      <div className="p-3.5 rounded-xl bg-[#030509] border border-[#162032] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
        <div className="flex items-center space-x-2 text-cyan-300 font-bold">
          <span>GENOTYPE ({alterations.length} genes)</span>
          <span className="text-slate-600">+</span>
          <span>DESIRED RESPONSE ({responseClass})</span>
          <span className="text-slate-600">+</span>
          <span>DRUG RESPONSE CONTEXT</span>
        </div>
        <div className="flex items-center space-x-2 text-purple-300 font-bold">
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/50 text-purple-200">
            CONDITIONING SIGNAL [c]
          </span>
        </div>
      </div>

      {/* INTERACTIVE AUC SUB-VIEWS CONTAINER */}
      <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#162032]">
          <div className="flex items-center space-x-1.5 bg-[#030509] p-1 rounded-xl border border-[#162032] text-xs font-mono">
            <button
              onClick={() => setActiveTab('density')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'density' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              AUC Density & Regions
            </button>
            <button
              onClick={() => setActiveTab('scatter')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'scatter' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cell-Line vs AUC Scatter
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'matrix' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cell Line × Drug AUC Matrix
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Application visualization — illustrative</span>
            <span>•</span>
            <span>Demo/reference data</span>
          </div>
        </div>

        {/* TAB 1: AUC DENSITY & REGIONS */}
        {activeTab === 'density' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>AUC Distribution Density Conditioned on: <strong className="text-cyan-300">{responseClass}</strong></span>
              <span>Reference Dataset: GDSC / ChEMBL</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={conditionedDensityData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="condGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="refGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="auc" 
                    stroke="#64748b" 
                    fontSize={11} 
                    fontFamily="monospace"
                    label={{ value: 'Area Under the Curve (AUC)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    fontFamily="monospace"
                    label={{ value: 'Probability Density', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#070B12', borderColor: '#162032', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} 
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px' }} />
                  {/* Sensitive response boundary illustrative indicator */}
                  <ReferenceLine x={0.6} stroke="#06b6d4" strokeDasharray="3 3" label={{ value: 'Target Region', fill: '#06b6d4', fontSize: 10 }} />
                  <ReferenceLine x={1.0} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Neutral (1.0)', fill: '#f43f5e', fontSize: 10 }} />
                  <Area 
                    type="monotone" 
                    dataKey="conditionedDensity" 
                    name={`Conditioned Target (${responseClass})`} 
                    stroke="#06b6d4" 
                    fillOpacity={1} 
                    fill="url(#condGrad)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="referenceDensity" 
                    name="Reference GDSC Baseline" 
                    stroke="#64748b" 
                    fillOpacity={1} 
                    fill="url(#refGrad)" 
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-[#030509] border border-[#162032] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Notice: Shifting the desired response condition shifts the target probability manifold to prioritize cytotoxic vs contrast states.</span>
              <span className="text-cyan-400 font-semibold">AUC Domain [0, 1.2]</span>
            </div>
          </div>
        )}

        {/* TAB 2: CELL-LINE VS AUC SCATTER */}
        {activeTab === 'scatter' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Filter Lineage:</span>
                <select
                  value={scatterLineage}
                  onChange={(e) => setScatterLineage(e.target.value)}
                  className="bg-[#030509] border border-[#162032] rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Cancer Types</option>
                  <option value="Breast">Breast</option>
                  <option value="Lung">Lung</option>
                  <option value="Colorectal">Colorectal</option>
                  <option value="Skin">Melanoma</option>
                  <option value="Ovary">Ovarian</option>
                </select>
              </div>
              <span className="text-slate-500">Click an observation point to inspect details</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="AUC" 
                    stroke="#64748b" 
                    fontSize={11} 
                    fontFamily="monospace"
                    domain={[0.1, 1.1]}
                    label={{ value: 'Pharmacological AUC', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Alterations" 
                    stroke="#64748b" 
                    fontSize={11} 
                    fontFamily="monospace"
                    label={{ value: 'Total Genomic Alterations', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || !payload[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-lg bg-[#070B12] border border-[#162032] text-xs font-mono text-slate-200 shadow-xl space-y-1">
                          <div className="font-bold text-cyan-300">{data.name}</div>
                          <div>AUC: <strong className="text-white">{data.x}</strong></div>
                          <div>Alterations: <strong className="text-white">{data.y}</strong></div>
                          <div>Class: <span className="text-purple-300">{data.responseClass}</span></div>
                        </div>
                      );
                    }}
                  />
                  <Scatter 
                    data={scatterChartData} 
                    onClick={(entry: any) => setSelectedObservation(entry?.raw || entry?.payload?.raw || null)}
                    className="cursor-pointer"
                  >
                    {scatterChartData.map((entry, index) => {
                      const color = entry.x < 0.4 ? '#06b6d4' : entry.x < 0.7 ? '#a855f7' : '#f43f5e';
                      return <Cell key={`cell-${index}`} fill={color} fillOpacity={0.8} />;
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {selectedObservation && (
              <div className="p-3 rounded-xl bg-[#030509] border border-cyan-500/40 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="font-bold text-white mr-2">{selectedObservation.cellLine}</span>
                  <span className="text-slate-400 mr-3">({selectedObservation.cancerType})</span>
                  <span className="text-cyan-300 mr-2">Drug: {selectedObservation.drug}</span>
                  <span className="text-slate-400">AUC: <strong className="text-white">{selectedObservation.auc}</strong> ({selectedObservation.responseClass})</span>
                </div>
                <button
                  onClick={() => setSelectedObservation(null)}
                  className="text-slate-400 hover:text-white underline text-xs"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CELL LINE X DRUG AUC MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Benchmark Cell Line × Compound Response Matrix:</span>
              <span className="text-slate-500">GDSC Pharmacogenomic Pairs</span>
            </div>

            <div className="overflow-x-auto border border-[#162032] rounded-xl">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-[#030509] border-b border-[#162032] text-slate-400">
                    <th className="p-2.5 text-left font-semibold">Cell Line</th>
                    <th className="p-2.5 text-left font-semibold">Lineage</th>
                    {HEATMAP_DRUGS.map(d => (
                      <th key={d} className="p-2.5 text-center font-semibold">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#162032]/60">
                  {HEATMAP_CELL_LINES.map(cellLineName => {
                    const clRecord = CELL_LINE_RECORDS.find(c => c.cellLine === cellLineName);
                    return (
                      <tr key={cellLineName} className="hover:bg-[#030509]/60">
                        <td className="p-2.5 font-bold text-white">{cellLineName}</td>
                        <td className="p-2.5 text-slate-400 text-[11px]">{clRecord?.cancerType || 'Carcinoma'}</td>
                        {HEATMAP_DRUGS.map(d => {
                          const cell = HEATMAP_MATRIX.find(m => m.cellLine === cellLineName && m.drug === d);
                          const auc = cell ? cell.auc : 0.65;
                          const bg = auc < 0.35 
                            ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/40' 
                            : auc < 0.65 
                            ? 'bg-purple-950/60 text-purple-300' 
                            : 'bg-slate-900/60 text-slate-400';

                          return (
                            <td 
                              key={d} 
                              onClick={() => setSelectedMatrixCell(cell || null)}
                              className="p-1.5 text-center cursor-pointer"
                            >
                              <div className={`py-1 px-1.5 rounded text-[10px] ${bg}`}>
                                {auc.toFixed(2)}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedMatrixCell && (
              <div className="p-3 rounded-xl bg-[#030509] border border-purple-500/40 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-white font-bold mr-2">{selectedMatrixCell.cellLine}</span>
                  <span className="text-slate-400 mr-2">x</span>
                  <span className="text-cyan-300 font-bold mr-3">{selectedMatrixCell.drug}</span>
                  <span>AUC: <strong className="text-white">{selectedMatrixCell.auc}</strong> ({selectedMatrixCell.responseClass})</span>
                </div>
                <button
                  onClick={() => setSelectedMatrixCell(null)}
                  className="text-slate-400 hover:text-white underline text-xs cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONTINUOUS PIPELINE NAVIGATION */}
      <div className="pt-2 flex items-center justify-between">
        {onBackToConditionEncoder && (
          <button
            onClick={onBackToConditionEncoder}
            className="px-4 py-2.5 rounded-xl border border-[#162032] bg-[#070B12] hover:bg-[#0B101A] text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Condition Encoder</span>
          </button>
        )}

        <button
          onClick={onProceedToDiffusion}
          className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
        >
          <span>PROCEED TO LATENT DIFFUSION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
