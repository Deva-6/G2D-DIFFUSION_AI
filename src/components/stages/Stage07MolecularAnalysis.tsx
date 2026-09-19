import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart2, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Filter, 
  Eye, 
  CheckCircle2, 
  HelpCircle,
  Activity,
  Atom,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  ReferenceLine,
  BarChart,
  Bar
} from 'recharts';
import { MolecularCandidate } from '../../types';
import { MoleculeRenderer } from '../MoleculeRenderer';

interface Stage07MolecularAnalysisProps {
  candidates: MolecularCandidate[];
  selectedCandidateId?: string | null;
  onSelectCandidate?: (id: string) => void;
  onProceedToFiltering: () => void;
  onBackToDecoding?: () => void;
}

export const Stage07MolecularAnalysis: React.FC<Stage07MolecularAnalysisProps> = ({
  candidates,
  selectedCandidateId: externalSelectedId,
  onSelectCandidate,
  onProceedToFiltering,
  onBackToDecoding
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string>(candidates[0]?.id || 'G2D-C01');
  const activeId = externalSelectedId || internalSelectedId;

  const handleSelect = (id: string) => {
    setInternalSelectedId(id);
    if (onSelectCandidate) onSelectCandidate(id);
  };

  const activeCandidate = candidates.find(c => c.id === activeId) || candidates[0];

  // GRAPH 1: QED vs SAS Scatter Data
  const qedSasData = useMemo(() => {
    return candidates.map(c => ({
      x: c.qed,
      y: c.sas,
      id: c.id,
      name: c.name,
      qed: c.qed,
      sas: c.sas,
      mw: c.molecularWeight,
      logp: c.logP,
      tanimoto: c.tanimotoMax,
      targetGene: c.targetGene,
      retroSteps: c.retrosynthesisDepth,
      candidate: c
    }));
  }, [candidates]);

  // GRAPH 2: Molecular Weight Bins Data
  const mwBinsData = useMemo(() => {
    const bins = [
      { bin: '200-300', count: 0, candidates: [] as MolecularCandidate[] },
      { bin: '300-400', count: 0, candidates: [] as MolecularCandidate[] },
      { bin: '400-500', count: 0, candidates: [] as MolecularCandidate[] },
      { bin: '500-600', count: 0, candidates: [] as MolecularCandidate[] },
      { bin: '>600', count: 0, candidates: [] as MolecularCandidate[] },
    ];

    candidates.forEach(c => {
      const mw = c.molecularWeight;
      if (mw < 300) { bins[0].count++; bins[0].candidates.push(c); }
      else if (mw < 400) { bins[1].count++; bins[1].candidates.push(c); }
      else if (mw < 500) { bins[2].count++; bins[2].candidates.push(c); }
      else if (mw < 600) { bins[3].count++; bins[3].candidates.push(c); }
      else { bins[4].count++; bins[4].candidates.push(c); }
    });

    return bins;
  }, [candidates]);

  // GRAPH 3: LogP Distribution Data
  const logpBinsData = useMemo(() => {
    const bins = [
      { bin: '< 1.0', count: 0, candidates: [] as MolecularCandidate[] },
      { bin: '1.0-2.5', count: 0, candidates: [] as MolecularCandidate[] },
      { bin: '2.5-4.0', count: 0, candidates: [] as MolecularCandidate[] },
      { bin: '4.0-5.0', count: 0, candidates: [] as MolecularCandidate[] },
      { bin: '> 5.0', count: 0, candidates: [] as MolecularCandidate[] },
    ];

    candidates.forEach(c => {
      const lp = c.logP;
      if (lp < 1.0) { bins[0].count++; bins[0].candidates.push(c); }
      else if (lp < 2.5) { bins[1].count++; bins[1].candidates.push(c); }
      else if (lp < 4.0) { bins[2].count++; bins[2].candidates.push(c); }
      else if (lp < 5.0) { bins[3].count++; bins[3].candidates.push(c); }
      else { bins[4].count++; bins[4].candidates.push(c); }
    });

    return bins;
  }, [candidates]);

  // GRAPH 4: Tanimoto Similarity Distribution
  const tanimotoData = useMemo(() => {
    return candidates.map(c => ({
      id: c.id,
      name: c.name,
      similarity: c.tanimotoMax,
      targetGene: c.targetGene,
      candidate: c
    }));
  }, [candidates]);

  // GRAPH 5: Retrosynthesis Depth
  const retrosynthesisData = useMemo(() => {
    const stepsMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    candidates.forEach(c => {
      const s = Math.min(6, Math.max(1, c.retrosynthesisDepth));
      stepsMap[s] = (stepsMap[s] || 0) + 1;
    });

    return Object.keys(stepsMap).map(k => ({
      steps: `${k} steps`,
      numSteps: parseInt(k),
      count: stepsMap[parseInt(k)]
    }));
  }, [candidates]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#162032] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Pipeline Phase 07</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            07 — Molecular Property Analysis
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Multi-dimensional property profiling of {candidates.length} generated research candidates. 
            Click any molecule point in any chart to cross-highlight its profile across all 5 analytical dimensions.
          </p>
        </div>

        {/* Selected Candidate Quick Badge */}
        {activeCandidate && (
          <div className="flex items-center space-x-3 bg-[#070B12] border border-[#162032] px-3.5 py-2 rounded-xl self-start text-xs font-mono">
            <span className="text-slate-400">Inspecting:</span>
            <span className="text-cyan-300 font-bold">{activeCandidate.id} ({activeCandidate.name})</span>
          </div>
        )}
      </div>

      {/* CANDIDATE SELECTOR CAROUSEL / HORIZONTAL STRIP */}
      <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-4 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Candidate Molecular Pool ({candidates.length} molecules):</span>
          <span className="text-cyan-400">Click to cross-highlight across all charts</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {candidates.map(c => {
            const isSelected = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={`px-3 py-1.5 rounded-xl border font-mono text-xs whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold'
                    : 'bg-[#030509] border-[#162032] text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                <span>{c.id}</span>
                <span className="text-[10px] text-purple-400">QED {c.qed.toFixed(2)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE MOLECULE INSPECTION HERO BOX */}
      {activeCandidate && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#070B12] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl">
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-cyan-400 font-bold">{activeCandidate.id}</span>
                <span className="text-slate-400">{activeCandidate.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2 truncate">
                Pathway Target: <strong className="text-white">{activeCandidate.primaryPathwayTarget}</strong>
              </p>
            </div>
            <div className="relative aspect-video rounded-xl bg-[#030509] border border-[#162032] overflow-hidden">
              <MoleculeRenderer candidate={activeCandidate} height={140} />
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-[#030509] border border-[#162032]">
              <span className="text-[10px] text-slate-500 block">QED Drug-likeness:</span>
              <span className="text-sm font-bold text-emerald-400">{activeCandidate.qed.toFixed(3)}</span>
              <span className="text-[10px] text-slate-500 block">Paper filter: &gt;0.80</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#030509] border border-[#162032]">
              <span className="text-[10px] text-slate-500 block">Synthetic Accessibility (SAS):</span>
              <span className="text-sm font-bold text-cyan-400">{activeCandidate.sas.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500 block">Paper filter: &lt;4.56</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#030509] border border-[#162032]">
              <span className="text-[10px] text-slate-500 block">Molecular Weight:</span>
              <span className="text-sm font-bold text-purple-400">{activeCandidate.molecularWeight.toFixed(1)} Da</span>
              <span className="text-[10px] text-slate-500 block">Lipinski: &lt;500</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#030509] border border-[#162032]">
              <span className="text-[10px] text-slate-500 block">LogP Lipophilicity:</span>
              <span className="text-sm font-bold text-amber-400">{activeCandidate.logP.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500 block">Target: -0.4 to 5.6</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#030509] border border-[#162032]">
              <span className="text-[10px] text-slate-500 block">Nearest Known Target:</span>
              <span className="text-sm font-bold text-white truncate block">{activeCandidate.targetGene}</span>
              <span className="text-[10px] text-cyan-400">Tanimoto: {(activeCandidate.tanimotoMax * 100).toFixed(0)}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#030509] border border-[#162032]">
              <span className="text-[10px] text-slate-500 block">Retrosynthesis Depth:</span>
              <span className="text-sm font-bold text-blue-400">{activeCandidate.retrosynthesisDepth} synthetic steps</span>
              <span className="text-[10px] text-slate-500 block">Route feasible</span>
            </div>
          </div>
        </div>
      )}

      {/* THE 5 INTEGRATED CONNECTED GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAPH 1: QED vs SAS Scatter */}
        <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <span>Graph 1: QED vs Synthetic Accessibility (SAS)</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">Click point to select</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="QED" 
                  domain={[0.5, 1.0]} 
                  stroke="#64748b" 
                  fontSize={10} 
                  fontFamily="monospace"
                  label={{ value: 'QED (Drug-likeness)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="SAS" 
                  domain={[1.0, 6.0]} 
                  stroke="#64748b" 
                  fontSize={10} 
                  fontFamily="monospace"
                  label={{ value: 'SAS (Synthesizability)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload[0]) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded bg-[#070B12] border border-[#162032] text-xs font-mono text-slate-200">
                        <div className="font-bold text-cyan-300">{d.id}: {d.name}</div>
                        <div>QED: <strong className="text-white">{d.qed.toFixed(3)}</strong></div>
                        <div>SAS: <strong className="text-white">{d.sas.toFixed(2)}</strong></div>
                        <div>MW: {d.mw.toFixed(1)} Da</div>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0.8} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'QED > 0.8', fill: '#10b981', fontSize: 9 }} />
                <ReferenceLine y={4.56} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'SAS < 4.56', fill: '#f59e0b', fontSize: 9 }} />
                <Scatter 
                  data={qedSasData} 
                  onClick={(entry: any) => {
                    const c = entry?.candidate || entry?.payload?.candidate;
                    if (c) handleSelect(c.id);
                  }}
                  className="cursor-pointer"
                >
                  {qedSasData.map((entry) => {
                    const isSelected = entry.id === activeId;
                    return (
                      <Cell 
                        key={entry.id} 
                        fill={isSelected ? '#06b6d4' : '#a855f7'} 
                        stroke={isSelected ? '#ffffff' : '#162032'}
                        strokeWidth={isSelected ? 2 : 1}
                        r={isSelected ? 7 : 5}
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            High QED (&gt;0.8) and low SAS (&lt;4.56) characterize drug-like candidates with feasible synthesis.
          </div>
        </div>

        {/* GRAPH 2: Molecular Weight Distribution */}
        <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <span>Graph 2: Molecular Weight Distribution</span>
            </h3>
            <span className="text-[10px] font-mono text-purple-400">Daltons (Da)</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mwBinsData} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
                <XAxis dataKey="bin" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070B12', borderColor: '#162032', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                  {mwBinsData.map((entry, idx) => {
                    const containsActive = entry.candidates.some(c => c.id === activeId);
                    return (
                      <Cell 
                        key={`cell-${idx}`} 
                        fill={containsActive ? '#06b6d4' : '#8b5cf6'} 
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Lipinski Rule of Five threshold: Molecular Weight &lt; 500 Da.
          </div>
        </div>

        {/* GRAPH 3: LogP Distribution */}
        <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <span>Graph 3: LogP Distribution (Lipophilicity)</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400">Octanol-Water Partition</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={logpBinsData} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
                <XAxis dataKey="bin" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070B12', borderColor: '#162032', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                  {logpBinsData.map((entry, idx) => {
                    const containsActive = entry.candidates.some(c => c.id === activeId);
                    return (
                      <Cell 
                        key={`cell-${idx}`} 
                        fill={containsActive ? '#06b6d4' : '#f59e0b'} 
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Optimum oral drug bioavailability range: LogP between 1.0 and 4.5.
          </div>
        </div>

        {/* GRAPH 4 & 5: TANIMOTO & RETROSYNTHESIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* GRAPH 4: Tanimoto Similarity */}
          <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-4 shadow-xl space-y-2">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Graph 4: Tanimoto Novelty
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin text-xs font-mono">
              {tanimotoData.map(t => {
                const isSelected = t.id === activeId;
                return (
                  <div 
                    key={t.id} 
                    onClick={() => handleSelect(t.id)}
                    className={`p-1.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold' : 'bg-[#030509] border-[#162032] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{t.id}</span>
                    <span className="text-[10px] truncate max-w-[90px]">{t.targetGene}</span>
                    <span className="text-emerald-400 font-bold">{(t.similarity * 100).toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[9px] font-mono text-slate-500">Similarity to nearest FDA / ChEMBL compound.</p>
          </div>

          {/* GRAPH 5: Retrosynthesis Depth */}
          <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-4 shadow-xl space-y-2">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Graph 5: Retrosynthesis Steps
            </h3>
            <div className="space-y-1.5 text-xs font-mono">
              {retrosynthesisData.map(r => {
                const isMatchingStep = activeCandidate?.retrosynthesisDepth === r.numSteps;
                return (
                  <div 
                    key={r.steps}
                    className={`p-1.5 rounded-lg border flex items-center justify-between ${
                      isMatchingStep ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold' : 'bg-[#030509] border-[#162032] text-slate-400'
                    }`}
                  >
                    <span>{r.steps}</span>
                    <span className="text-white font-bold">{r.count} mols</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[9px] font-mono text-slate-500">Predicted reaction steps from catalog building blocks.</p>
          </div>
        </div>
      </div>

      {/* CONTINUOUS PIPELINE NAVIGATION */}
      <div className="pt-2 flex items-center justify-between">
        {onBackToDecoding && (
          <button
            onClick={onBackToDecoding}
            className="px-4 py-2.5 rounded-xl border border-[#162032] bg-[#070B12] hover:bg-[#0B101A] text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Chemical VAE Decoding</span>
          </button>
        )}

        <button
          onClick={onProceedToFiltering}
          className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
        >
          <span>PROCEED TO CANDIDATE FILTERING</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
