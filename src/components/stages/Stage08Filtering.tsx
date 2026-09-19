import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  ArrowRight, 
  ArrowLeft, 
  Sliders, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  Info
} from 'lucide-react';
import { MolecularCandidate, ScreeningCriteria } from '../../types';
import { evaluateCandidate } from '../../services/generationService';

interface Stage08FilteringProps {
  candidates: MolecularCandidate[];
  screeningCriteria: ScreeningCriteria;
  onChangeScreeningCriteria: (crit: ScreeningCriteria) => void;
  selectedCandidateId?: string | null;
  onSelectCandidate?: (id: string) => void;
  onProceedToBiologicalInsights: (evaluated: MolecularCandidate[]) => void;
  onBackToMolecularAnalysis?: () => void;
}

export const Stage08Filtering: React.FC<Stage08FilteringProps> = ({
  candidates,
  screeningCriteria,
  onChangeScreeningCriteria,
  selectedCandidateId: externalSelectedId,
  onSelectCandidate,
  onProceedToBiologicalInsights,
  onBackToMolecularAnalysis
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [internalSelectedId, setInternalSelectedId] = useState<string>(candidates[0]?.id || 'G2D-C01');

  const activeId = externalSelectedId || internalSelectedId;

  const handleSelect = (id: string) => {
    setInternalSelectedId(id);
    if (onSelectCandidate) onSelectCandidate(id);
  };

  // Dynamically evaluate all candidates based on active screening criteria
  const evaluatedCandidates = useMemo(() => {
    return candidates.map(cand => {
      const result = evaluateCandidate(cand, screeningCriteria);
      return {
        ...cand,
        passedFilters: result.passed,
        filterFailReasons: result.reasons
      };
    });
  }, [candidates, screeningCriteria]);

  const passedList = evaluatedCandidates.filter(c => c.passedFilters);

  // Calculate funnel numbers step by step
  const funnelSteps = useMemo(() => {
    const total = candidates.length;
    const valid = candidates.filter(c => c.isValid).length;
    const unique = candidates.filter(c => c.isUnique).length;
    const qedPassed = candidates.filter(c => c.qed >= screeningCriteria.minQED).length;
    const lipinskiPassed = candidates.filter(c => c.passesLipinski).length;
    const sasPassed = candidates.filter(c => c.sas <= screeningCriteria.maxSAS).length;
    const tanimotoPassed = candidates.filter(c => c.tanimotoMax <= screeningCriteria.maxTanimoto).length;
    const retroPassed = candidates.filter(c => c.retrosynthesisDepth <= screeningCriteria.maxRetrosynthesisDepth).length;
    const finalCount = passedList.length;

    return [
      { name: 'Generated Candidates', count: total, threshold: 'Initial diffusion pool', color: '#06b6d4' },
      { name: 'Valid Molecules', count: valid, threshold: 'Chemical valency satisfied', color: '#3b82f6' },
      { name: 'Unique Molecules', count: unique, threshold: 'Non-duplicate canonical SMILES', color: '#6366f1' },
      { name: 'QED Drug-likeness', count: qedPassed, threshold: `QED > ${screeningCriteria.minQED.toFixed(2)}`, color: '#8b5cf6' },
      { name: 'Lipinski Rule of 5', count: lipinskiPassed, threshold: 'MW ≤ 500, LogP ≤ 5, HBD ≤ 5, HBA ≤ 10', color: '#a855f7' },
      { name: 'SAS Feasibility', count: sasPassed, threshold: `SAS < ${screeningCriteria.maxSAS.toFixed(2)}`, color: '#d946ef' },
      { name: 'Tanimoto Novelty', count: tanimotoPassed, threshold: `Similarity < ${screeningCriteria.maxTanimoto.toFixed(2)}`, color: '#ec4899' },
      { name: 'Retrosynthesis Depth', count: retroPassed, threshold: `Depth ≤ ${screeningCriteria.maxRetrosynthesisDepth} steps`, color: '#10b981' },
      { name: 'Research Candidates', count: finalCount, threshold: 'Passed all criteria', color: '#06b6d4' },
    ];
  }, [candidates, screeningCriteria, passedList.length]);

  // Outlier categorizations
  const outliers = useMemo(() => {
    // QED outliers: QED < 0.70 or QED > 0.92
    const qedOutliers = candidates.filter(c => c.qed < 0.70 || c.qed > 0.92);
    // SAS outliers: SAS > 4.5
    const sasOutliers = candidates.filter(c => c.sas > 4.5);
    // LogP outliers: LogP < 1.0 or LogP > 4.8
    const logpOutliers = candidates.filter(c => c.logP < 1.0 || c.logP > 4.8);
    // MW outliers: MW > 500 or MW < 300
    const mwOutliers = candidates.filter(c => c.molecularWeight > 500 || c.molecularWeight < 300);
    // Tanimoto outliers: similarity > 0.35 (close to known drug) or < 0.12 (highly novel)
    const tanimotoOutliers = candidates.filter(c => c.tanimotoMax > 0.35 || c.tanimotoMax < 0.12);

    return {
      qed: qedOutliers,
      sas: sasOutliers,
      logp: logpOutliers,
      mw: mwOutliers,
      tanimoto: tanimotoOutliers
    };
  }, [candidates]);

  const activeCandidate = evaluatedCandidates.find(c => c.id === activeId) || evaluatedCandidates[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#162032] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Pipeline Phase 08</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            08 — Candidate Evaluation & Filtering
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Sequential in-silico triage applying paper-reported benchmark screening thresholds. 
            Molecules that breach drug-likeness, novelty, or synthetic accessibility thresholds are filtered out.
          </p>
        </div>

        {/* Funnel Result Badge */}
        <div className="flex items-center space-x-2 bg-[#070B12] border border-[#162032] px-3.5 py-2 rounded-xl self-start text-xs font-mono">
          <span className="text-slate-400">Yield:</span>
          <span className="text-emerald-400 font-bold">{passedList.length}</span>
          <span className="text-slate-500">of {candidates.length} candidates retained</span>
        </div>
      </div>

      {/* SECTION 1: VISUAL FILTERING FUNNEL */}
      <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Tier Filtering Funnel Cascade</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Strict filters sequentially applied according to Nature Communications 2025 benchmark criteria
            </p>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors self-start cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showSettings ? 'Hide Parameters' : 'Adjust Thresholds'}</span>
            {showSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Interactive Threshold Settings Drawer */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-[#030509] border border-[#162032] rounded-xl p-4 text-xs font-mono grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div>
                <span className="text-slate-400 block mb-1">Min QED: {screeningCriteria.minQED.toFixed(2)}</span>
                <input
                  type="range"
                  min="0.60"
                  max="0.90"
                  step="0.02"
                  value={screeningCriteria.minQED}
                  onChange={(e) => onChangeScreeningCriteria({ ...screeningCriteria, minQED: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 bg-[#070B12] h-1.5 rounded cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Paper: &gt; 0.80</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Max SAS: {screeningCriteria.maxSAS.toFixed(2)}</span>
                <input
                  type="range"
                  min="3.0"
                  max="6.0"
                  step="0.1"
                  value={screeningCriteria.maxSAS}
                  onChange={(e) => onChangeScreeningCriteria({ ...screeningCriteria, maxSAS: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 bg-[#070B12] h-1.5 rounded cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Paper: &lt; 4.56</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Max Tanimoto: {screeningCriteria.maxTanimoto.toFixed(2)}</span>
                <input
                  type="range"
                  min="0.15"
                  max="0.40"
                  step="0.01"
                  value={screeningCriteria.maxTanimoto}
                  onChange={(e) => onChangeScreeningCriteria({ ...screeningCriteria, maxTanimoto: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 bg-[#070B12] h-1.5 rounded cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Paper: &lt; 0.25</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Max Retrosynthesis Depth: {screeningCriteria.maxRetrosynthesisDepth}</span>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={screeningCriteria.maxRetrosynthesisDepth}
                  onChange={(e) => onChangeScreeningCriteria({ ...screeningCriteria, maxRetrosynthesisDepth: parseInt(e.target.value) })}
                  className="w-full accent-cyan-500 bg-[#070B12] h-1.5 rounded cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Paper: ≤ 4 steps</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Funnel Cascade Bars */}
        <div className="space-y-2 font-mono text-xs pt-1">
          {funnelSteps.map((step, idx) => {
            const pct = Math.max(8, (step.count / candidates.length) * 100);
            return (
              <div key={step.name} className="p-2 rounded-xl bg-[#030509] border border-[#162032] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-white flex items-center space-x-2">
                    <span className="text-slate-500 text-[10px]">#{idx + 1}</span>
                    <span>{step.name}</span>
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 text-[10px] hidden sm:inline">{step.threshold}</span>
                    <span className="font-bold text-cyan-300">{step.count} molecules</span>
                  </div>
                </div>
                <div className="w-full bg-[#070B12] h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: step.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CANDIDATE QUALITY / OUTLIER ANALYSIS */}
      <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#162032] gap-2">
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Candidate Quality / Outlier Analysis</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Outlier analysis is an application-level analysis used to inspect generated candidates.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Click an outlier to inspect its dossier</span>
        </div>

        {/* 5 Outlier Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
          {/* QED Outliers */}
          <div className="p-3 rounded-xl bg-[#030509] border border-[#162032] space-y-2">
            <div className="flex items-center justify-between text-purple-300 font-bold">
              <span>QED Outliers</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/30">
                {outliers.qed.length}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">QED &lt; 0.70 or &gt; 0.92</p>
            <div className="space-y-1">
              {outliers.qed.length === 0 ? (
                <span className="text-[10px] text-slate-600 italic">No outliers</span>
              ) : (
                outliers.qed.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id)}
                    className={`w-full text-left p-1 rounded text-[10px] flex items-center justify-between cursor-pointer ${
                      c.id === activeId ? 'bg-cyan-950 text-cyan-200 border border-cyan-500' : 'bg-[#070B12] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{c.id}</span>
                    <span>{c.qed.toFixed(2)}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* SAS Outliers */}
          <div className="p-3 rounded-xl bg-[#030509] border border-[#162032] space-y-2">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span>SAS Outliers</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                {outliers.sas.length}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">SAS &gt; 4.5</p>
            <div className="space-y-1">
              {outliers.sas.length === 0 ? (
                <span className="text-[10px] text-slate-600 italic">No outliers</span>
              ) : (
                outliers.sas.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id)}
                    className={`w-full text-left p-1 rounded text-[10px] flex items-center justify-between cursor-pointer ${
                      c.id === activeId ? 'bg-cyan-950 text-cyan-200 border border-cyan-500' : 'bg-[#070B12] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{c.id}</span>
                    <span>{c.sas.toFixed(2)}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* LogP Outliers */}
          <div className="p-3 rounded-xl bg-[#030509] border border-[#162032] space-y-2">
            <div className="flex items-center justify-between text-amber-300 font-bold">
              <span>LogP Outliers</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/30">
                {outliers.logp.length}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">LogP &lt; 1.0 or &gt; 4.8</p>
            <div className="space-y-1">
              {outliers.logp.length === 0 ? (
                <span className="text-[10px] text-slate-600 italic">No outliers</span>
              ) : (
                outliers.logp.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id)}
                    className={`w-full text-left p-1 rounded text-[10px] flex items-center justify-between cursor-pointer ${
                      c.id === activeId ? 'bg-cyan-950 text-cyan-200 border border-cyan-500' : 'bg-[#070B12] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{c.id}</span>
                    <span>{c.logP.toFixed(2)}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Molecular Weight Outliers */}
          <div className="p-3 rounded-xl bg-[#030509] border border-[#162032] space-y-2">
            <div className="flex items-center justify-between text-blue-300 font-bold">
              <span>MW Outliers</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 border border-blue-500/30">
                {outliers.mw.length}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">MW &gt; 500 or &lt; 300</p>
            <div className="space-y-1">
              {outliers.mw.length === 0 ? (
                <span className="text-[10px] text-slate-600 italic">No outliers</span>
              ) : (
                outliers.mw.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id)}
                    className={`w-full text-left p-1 rounded text-[10px] flex items-center justify-between cursor-pointer ${
                      c.id === activeId ? 'bg-cyan-950 text-cyan-200 border border-cyan-500' : 'bg-[#070B12] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{c.id}</span>
                    <span>{c.molecularWeight.toFixed(0)}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Tanimoto Novelty Outliers */}
          <div className="p-3 rounded-xl bg-[#030509] border border-[#162032] space-y-2">
            <div className="flex items-center justify-between text-rose-300 font-bold">
              <span>Tanimoto Outliers</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 border border-rose-500/30">
                {outliers.tanimoto.length}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Sim &gt; 0.35 or &lt; 0.12</p>
            <div className="space-y-1">
              {outliers.tanimoto.length === 0 ? (
                <span className="text-[10px] text-slate-600 italic">No outliers</span>
              ) : (
                outliers.tanimoto.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id)}
                    className={`w-full text-left p-1 rounded text-[10px] flex items-center justify-between cursor-pointer ${
                      c.id === activeId ? 'bg-cyan-950 text-cyan-200 border border-cyan-500' : 'bg-[#070B12] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{c.id}</span>
                    <span>{(c.tanimotoMax * 100).toFixed(0)}%</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Selected Outlier Candidate Quick Inspection */}
        {activeCandidate && (
          <div className="p-3 rounded-xl bg-[#030509] border border-cyan-500/40 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-white text-sm">{activeCandidate.id}</span>
              <span className="text-slate-400">{activeCandidate.name}</span>
              <span className={activeCandidate.passedFilters ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {activeCandidate.passedFilters ? '✓ Passed Screening' : '✗ Filtered Out'}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <span>QED: <strong className="text-white">{activeCandidate.qed.toFixed(2)}</strong></span>
              <span>SAS: <strong className="text-white">{activeCandidate.sas.toFixed(2)}</strong></span>
              <span>MW: <strong className="text-white">{activeCandidate.molecularWeight.toFixed(0)} Da</strong></span>
              <span>Tanimoto: <strong className="text-white">{(activeCandidate.tanimotoMax * 100).toFixed(0)}%</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* CONTINUOUS PIPELINE NAVIGATION */}
      <div className="pt-2 flex items-center justify-between">
        {onBackToMolecularAnalysis && (
          <button
            onClick={onBackToMolecularAnalysis}
            className="px-4 py-2.5 rounded-xl border border-[#162032] bg-[#070B12] hover:bg-[#0B101A] text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Molecular Property Analysis</span>
          </button>
        )}

        <button
          onClick={() => onProceedToBiologicalInsights(evaluatedCandidates)}
          className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
        >
          <span>PROCEED TO BIOLOGICAL INSIGHTS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
