import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sliders, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MolecularCandidate, ScreeningCriteria } from '../../types';
import { evaluateCandidate } from '../../services/generationService';
import { MoleculeRenderer } from '../MoleculeRenderer';

interface Stage05EvaluationProps {
  candidates: MolecularCandidate[];
  screeningCriteria: ScreeningCriteria;
  onChangeScreeningCriteria: (crit: ScreeningCriteria) => void;
  onProceedToPathwayInsights: (evaluatedCandidates: MolecularCandidate[]) => void;
}

const FILTER_STAGES = [
  { id: 'validity', name: 'Validity & Valence Filter', description: 'Checks valid chemical graph connectivity and Kekule structure' },
  { id: 'uniqueness', name: 'Uniqueness Filter', description: 'Removes duplicate generated structures within candidate pool' },
  { id: 'drug_likeness', name: 'Drug-Likeness (QED & Lipinski)', description: 'QED > 0.80 and Lipinski Rule of 5 (MW ≤ 500, LogP ≤ 5)' },
  { id: 'similarity', name: 'Max Tanimoto Similarity', description: 'Tanimoto < 0.25 against known training set (guarantees novelty)' },
  { id: 'synthetic_accessibility', name: 'Synthetic Accessibility (SAS)', description: 'SAS < 4.56 ensuring synthetic feasibility' },
  { id: 'retrosynthesis', name: 'Retrosynthesis Depth Cap', description: 'AiZynthFinder route depth ≤ 4 reaction steps' },
];

export const Stage05Evaluation: React.FC<Stage05EvaluationProps> = ({
  candidates,
  screeningCriteria,
  onChangeScreeningCriteria,
  onProceedToPathwayInsights
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'passed' | 'filtered'>('all');

  // Dynamically evaluate all candidates based on active screening criteria
  const evaluatedCandidates = candidates.map(cand => {
    const result = evaluateCandidate(cand, screeningCriteria);
    return {
      ...cand,
      passedFilters: result.passed,
      filterFailReasons: result.reasons
    };
  });

  const passedList = evaluatedCandidates.filter(c => c.passedFilters);
  const filteredList = evaluatedCandidates.filter(c => !c.passedFilters);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Pipeline Phase 05</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            05 — Candidate Evaluation & Filtering Funnel
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            In-silico screening laboratory applying the multi-stage filter thresholds defined in 
            <span className="text-purple-300 font-medium"> Nature Communications 2025</span> to screen for drug-likeness, novelty, and synthetic viability.
          </p>
        </div>

        {/* Screening Lab Stats Pill */}
        <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-xs font-mono self-start">
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
            <span>Generated:</span>
            <strong className="text-white">{candidates.length}</strong>
          </div>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
            <span>Passed:</span>
            <strong className="font-bold">{passedList.length}</strong>
          </div>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60">
            <span>Filtered:</span>
            <strong className="font-bold">{filteredList.length}</strong>
          </div>
        </div>
      </div>

      {/* VISUAL FILTERING FUNNEL DIAGRAM */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Tier Screening Funnel Cascade</span>
          </span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-1 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showSettings ? 'Hide Filter Parameters' : 'Adjust Thresholds'}</span>
            {showSettings ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>
        </div>

        {/* Interactive Criteria Settings Drawer */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-xs font-mono grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div>
                <span className="text-slate-400 block mb-1">Max Tanimoto: {screeningCriteria.maxTanimoto.toFixed(2)}</span>
                <input
                  type="range"
                  min="0.15"
                  max="0.40"
                  step="0.01"
                  value={screeningCriteria.maxTanimoto}
                  onChange={(e) => onChangeScreeningCriteria({ ...screeningCriteria, maxTanimoto: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 bg-slate-900 h-1.5 rounded"
                />
                <span className="text-[10px] text-slate-500">Paper default: &lt; 0.25</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Min QED: {screeningCriteria.minQED.toFixed(2)}</span>
                <input
                  type="range"
                  min="0.60"
                  max="0.90"
                  step="0.02"
                  value={screeningCriteria.minQED}
                  onChange={(e) => onChangeScreeningCriteria({ ...screeningCriteria, minQED: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 bg-slate-900 h-1.5 rounded"
                />
                <span className="text-[10px] text-slate-500">Paper default: &gt; 0.80</span>
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
                  className="w-full accent-cyan-500 bg-slate-900 h-1.5 rounded"
                />
                <span className="text-[10px] text-slate-500">Paper default: &lt; 4.56</span>
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
                  className="w-full accent-cyan-500 bg-slate-900 h-1.5 rounded"
                />
                <span className="text-[10px] text-slate-500">Paper default: &le; 4</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Funnel Pipeline Steps */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
          {FILTER_STAGES.map((st, i) => (
            <div
              key={st.id}
              className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-cyan-400 block mb-1">Filter {i + 1}</span>
                <h4 className="text-xs font-bold text-white leading-tight">{st.name}</h4>
              </div>
              <span className="text-[9px] text-slate-400 mt-2 block font-mono">
                {st.description.split('(')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER TABS & CANDIDATE CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Candidates ({evaluatedCandidates.length})
            </button>
            <button
              onClick={() => setActiveTab('passed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'passed'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Passed Surviving ({passedList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('filtered')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'filtered'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Filtered Out ({filteredList.length})</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Demonstration results benchmarked to Nature Communications 2025
          </span>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTab === 'all'
            ? evaluatedCandidates
            : activeTab === 'passed'
            ? passedList
            : filteredList
          ).map((cand) => {
            const passed = cand.passedFilters;

            return (
              <motion.div
                key={cand.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  passed
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-75'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-white">
                      {cand.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center space-x-1 ${
                        passed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-semibold'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {passed ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>PASSED ALL FILTERS</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-rose-400" />
                          <span>FILTERED OUT</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* 2D Molecule Viewer */}
                  <div className="w-full h-40 mb-3">
                    <MoleculeRenderer candidate={cand} height={160} compact interactive={true} />
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{cand.name}</h4>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Target: <span className="text-cyan-300 font-mono">{cand.primaryPathwayTarget}</span>
                  </p>

                  {/* Filter Metrics Breakdown */}
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono mb-3">
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80">
                      <span className="text-slate-500 block">QED (&gt;0.8)</span>
                      <span className={cand.qed >= screeningCriteria.minQED ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {cand.qed.toFixed(2)}
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80">
                      <span className="text-slate-500 block">SAS (&lt;4.56)</span>
                      <span className={cand.sas <= screeningCriteria.maxSAS ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {cand.sas.toFixed(2)}
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80">
                      <span className="text-slate-500 block">Tanimoto (&lt;0.25)</span>
                      <span className={cand.tanimotoMax < screeningCriteria.maxTanimoto ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {cand.tanimotoMax.toFixed(2)}
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80">
                      <span className="text-slate-500 block">Retro Depth (&le;4)</span>
                      <span className={cand.retrosynthesisDepth <= screeningCriteria.maxRetrosynthesisDepth ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {cand.retrosynthesisDepth} steps
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80">
                      <span className="text-slate-500 block">LogP</span>
                      <span className="text-slate-300 font-semibold">{cand.logP.toFixed(1)}</span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80">
                      <span className="text-slate-500 block">Lipinski</span>
                      <span className={cand.passesLipinski ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {cand.passesLipinski ? 'Pass' : 'Violated'}
                      </span>
                    </div>
                  </div>

                  {/* Filter rejection reason if failed */}
                  {!passed && cand.filterFailReasons.length > 0 && (
                    <div className="p-2 bg-rose-950/40 border border-rose-800/50 rounded-lg text-[10px] font-mono text-rose-300 space-y-0.5">
                      <span className="font-semibold text-rose-400 block">Filter reasons:</span>
                      {cand.filterFailReasons.map((r, i) => (
                        <div key={i}>• {r}</div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* PROCEED BUTTON */}
      <div className="pt-2">
        <button
          onClick={() => onProceedToPathwayInsights(evaluatedCandidates)}
          className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
        >
          <span>PROCEED TO PATHWAY & TARGET INSIGHTS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
