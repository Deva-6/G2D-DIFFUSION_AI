import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill, 
  Copy, 
  Check, 
  Layers, 
  X, 
  FileText, 
  FileCode, 
  History, 
  ShieldAlert,
  ArrowUpDown,
  ArrowLeft,
  RotateCcw,
  Eye
} from 'lucide-react';
import { MolecularCandidate, GeneticAlteration, ResponseClass, PathwayInsight } from '../../types';
import { MoleculeRenderer } from '../MoleculeRenderer';
import { CandidateDetailModal } from '../CandidateDetailModal';

interface Stage10ResultsProps {
  candidates: MolecularCandidate[];
  alterations: GeneticAlteration[];
  responseClass: ResponseClass;
  pathwayInsights: PathwayInsight[];
  onSaveToHistory: () => void;
  isSavedToHistory: boolean;
  onBackToBiologicalInsights?: () => void;
  onRestartPipeline?: () => void;
}

type SortField = 'qed' | 'sas' | 'tanimoto' | 'mw';

export const Stage10Results: React.FC<Stage10ResultsProps> = ({
  candidates,
  alterations,
  responseClass,
  pathwayInsights,
  onSaveToHistory,
  isSavedToHistory,
  onBackToBiologicalInsights,
  onRestartPipeline
}) => {
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [copiedSmiles, setCopiedSmiles] = useState<string | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'passed'>('passed');
  const [sortBy, setSortBy] = useState<SortField>('qed');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [inspectCandidate, setInspectCandidate] = useState<MolecularCandidate | null>(null);

  // Filter candidates
  const filteredCandidates = activeFilter === 'passed'
    ? candidates.filter(c => c.passedFilters)
    : candidates;

  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortBy === 'qed') { valA = a.qed; valB = b.qed; }
    else if (sortBy === 'sas') { valA = a.sas; valB = b.sas; }
    else if (sortBy === 'tanimoto') { valA = a.tanimotoMax; valB = b.tanimotoMax; }
    else if (sortBy === 'mw') { valA = a.molecularWeight; valB = b.molecularWeight; }

    return sortAsc ? valA - valB : valB - valA;
  });

  const handleCopy = (smiles: string) => {
    navigator.clipboard.writeText(smiles);
    setCopiedSmiles(smiles);
    setTimeout(() => setCopiedSmiles(null), 2000);
  };

  const toggleComparison = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter(item => item !== id));
    } else {
      if (selectedForComparison.length >= 3) {
        return;
      }
      setSelectedForComparison([...selectedForComparison, id]);
    }
  };

  // Export JSON Report
  const exportJSON = () => {
    const reportData = {
      pipeline: 'G2D-Diff (Genotype-to-Drug Diffusion)',
      paperReference: 'Nature Communications 2025 (DOI: 10.1038/s41467-025-60763-9)',
      classification: 'Research Prototype — In-silico Generated Research Candidates',
      timestamp: new Date().toISOString(),
      cancerGenotypeInput: alterations,
      responseCondition: responseClass,
      highlightedPathways: pathwayInsights.map(p => ({
        pathway: p.name,
        attentionScore: p.attentionScore,
        associatedGenes: p.associatedGenes
      })),
      candidates: candidates.map(c => ({
        id: c.id,
        name: c.name,
        smiles: c.smiles,
        formula: c.formula,
        molecularWeight: c.molecularWeight,
        qed: c.qed,
        sas: c.sas,
        logP: c.logP,
        tanimotoSimilarity: c.tanimotoMax,
        targetGene: c.targetGene,
        retrosynthesisSteps: c.retrosynthesisDepth,
        lipinskiViolations: c.lipinskiViolations,
        passedFilters: c.passedFilters,
        primaryPathwayTarget: c.primaryPathwayTarget
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `G2D_Diff_Research_Candidates_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV Report
  const exportCSV = () => {
    const headers = [
      'Candidate_ID',
      'Name',
      'SMILES',
      'Formula',
      'MW_Da',
      'QED',
      'SAS',
      'LogP',
      'Tanimoto_Similarity',
      'Target_Gene',
      'Retro_Steps',
      'Lipinski_Violations',
      'Filter_Status',
      'Pathway_Target'
    ];

    const rows = candidates.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.smiles}"`,
      c.formula,
      c.molecularWeight.toFixed(1),
      c.qed.toFixed(3),
      c.sas.toFixed(2),
      c.logP.toFixed(2),
      c.tanimotoMax.toFixed(3),
      `"${c.targetGene}"`,
      c.retrosynthesisDepth,
      c.lipinskiViolations,
      c.passedFilters ? 'PASSED' : 'FILTERED',
      `"${c.primaryPathwayTarget}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `G2D_Diff_Candidates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#162032] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Pill className="w-3.5 h-3.5" />
            <span>Pipeline Phase 10</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            10 — Generated Research Candidates
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            In-silico research candidate molecules generated conditioned on the tumor genotype and target response class. 
            All candidates evaluated against benchmark drug-likeness, novelty, and synthetic viability thresholds.
          </p>
        </div>

        {/* Action Buttons: Save & Export */}
        <div className="flex flex-wrap items-center gap-2 self-start">
          <button
            onClick={onSaveToHistory}
            disabled={isSavedToHistory}
            className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer ${
              isSavedToHistory
                ? 'bg-emerald-950/60 border border-emerald-500/60 text-emerald-300'
                : 'bg-[#070B12] border border-[#162032] hover:border-cyan-500 text-slate-300 hover:text-white'
            }`}
          >
            {isSavedToHistory ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <History className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isSavedToHistory ? 'Saved to History' : 'Save Session'}</span>
          </button>

          <button
            onClick={exportJSON}
            className="px-3 py-2 bg-[#070B12] border border-[#162032] hover:border-cyan-500 rounded-xl text-xs font-mono text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-[#070B12] border border-[#162032] hover:border-cyan-500 rounded-xl text-xs font-mono text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* SCIENTIFIC DISCLAIMER CALLOUT */}
      <div className="p-3 bg-[#070B12] border border-[#162032] rounded-xl flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Research Prototype — Chemical structures are computational research candidates generated in silico. Not approved medical treatments.</span>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline">DOI: 10.1038/s41467-025-60763-9</span>
      </div>

      {/* FILTER & SORT TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#070B12] border border-[#162032] p-3 rounded-2xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Filter:</span>
          <div className="flex items-center bg-[#030509] p-1 rounded-xl border border-[#162032] text-xs font-mono">
            <button
              onClick={() => setActiveFilter('passed')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'passed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Passing Candidates ({candidates.filter(c => c.passedFilters).length})
            </button>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Generated ({candidates.length})
            </button>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-slate-400">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            className="bg-[#030509] border border-[#162032] rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="qed">QED (Drug-likeness)</option>
            <option value="sas">SAS (Synthesizability)</option>
            <option value="tanimoto">Tanimoto Novelty</option>
            <option value="mw">Molecular Weight</option>
          </select>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="p-1 rounded bg-[#030509] border border-[#162032] text-slate-400 hover:text-white cursor-pointer"
            title={sortAsc ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          {/* Comparison Trigger */}
          {selectedForComparison.length > 0 && (
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="px-3 py-1 bg-purple-950 border border-purple-500/60 text-purple-300 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.3)]"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare ({selectedForComparison.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* CANDIDATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedCandidates.map((candidate) => {
          const isSelected = selectedForComparison.includes(candidate.id);

          return (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-[#070B12] border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all ${
                candidate.passedFilters 
                  ? 'border-[#162032] hover:border-cyan-500/50' 
                  : 'border-rose-900/30 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-cyan-300">{candidate.id}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    candidate.passedFilters 
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                  }`}>
                    {candidate.passedFilters ? 'PASSED FILTERS' : 'FILTERED OUT'}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base truncate mb-1">
                  {candidate.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3 truncate">
                  Target: <strong className="text-slate-300">{candidate.primaryPathwayTarget}</strong>
                </p>

                {/* 2D Molecule Canvas */}
                <div className="relative aspect-video rounded-xl bg-[#030509] border border-[#162032] overflow-hidden mb-3">
                  <MoleculeRenderer candidate={candidate} height={150} />
                </div>

                {/* SMILES with Copy Button */}
                <div className="p-2 rounded-lg bg-[#030509] border border-[#162032] font-mono text-[11px] text-cyan-300/90 flex items-center justify-between mb-3">
                  <span className="truncate mr-2">{candidate.smiles}</span>
                  <button
                    onClick={() => handleCopy(candidate.smiles)}
                    className="p-1 rounded bg-[#070B12] text-slate-400 hover:text-white cursor-pointer"
                    title="Copy SMILES"
                  >
                    {copiedSmiles === candidate.smiles ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-[#030509] border border-[#162032]">
                    <span className="text-slate-500 block text-[10px]">QED Drug-likeness:</span>
                    <strong className="text-emerald-400 text-xs">{candidate.qed.toFixed(3)}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#030509] border border-[#162032]">
                    <span className="text-slate-500 block text-[10px]">SAS Synthesizability:</span>
                    <strong className="text-cyan-400 text-xs">{candidate.sas.toFixed(2)}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#030509] border border-[#162032]">
                    <span className="text-slate-500 block text-[10px]">LogP Lipophilicity:</span>
                    <strong className="text-amber-400 text-xs">{candidate.logP.toFixed(2)}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#030509] border border-[#162032]">
                    <span className="text-slate-500 block text-[10px]">Molecular Weight:</span>
                    <strong className="text-purple-400 text-xs">{candidate.molecularWeight.toFixed(1)} Da</strong>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-[#162032] flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Retro: {candidate.retrosynthesisDepth} steps</span>
                  <span>Lipinski Violations: {candidate.lipinskiViolations}</span>
                  <span>Sim: {(candidate.tanimotoMax * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center space-x-2 pt-2 border-t border-[#162032]">
                <button
                  onClick={() => setInspectCandidate(candidate)}
                  className="flex-1 py-2 rounded-xl bg-[#030509] border border-[#162032] hover:border-cyan-500/60 text-xs font-mono text-cyan-300 hover:text-white flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Dossier</span>
                </button>

                <button
                  onClick={() => toggleComparison(candidate.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950 border border-purple-500 text-purple-200 font-bold'
                      : 'bg-[#030509] border border-[#162032] text-slate-400 hover:text-white'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Compare'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* COMPARISON MODAL / DRAWER */}
      <AnimatePresence>
        {isComparisonOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#070B12] border border-[#162032] rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#162032]">
                <h3 className="font-bold text-white text-lg font-mono flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span>Multi-Candidate Comparative Dossier</span>
                </h3>
                <button
                  onClick={() => setIsComparisonOpen(false)}
                  className="p-1 rounded-lg bg-[#030509] text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedForComparison.map(id => {
                  const c = candidates.find(item => item.id === id);
                  if (!c) return null;

                  return (
                    <div key={c.id} className="p-4 rounded-xl bg-[#030509] border border-[#162032] space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300">{c.id}</span>
                        <span className="text-[10px] text-slate-400">{c.name}</span>
                      </div>
                      <div className="aspect-video bg-[#070B12] rounded-lg overflow-hidden border border-[#162032]">
                        <MoleculeRenderer candidate={c} height={120} />
                      </div>
                      <div className="space-y-1 text-slate-300">
                        <div className="flex justify-between"><span>QED:</span><strong className="text-emerald-400">{c.qed.toFixed(3)}</strong></div>
                        <div className="flex justify-between"><span>SAS:</span><strong className="text-cyan-400">{c.sas.toFixed(2)}</strong></div>
                        <div className="flex justify-between"><span>MW:</span><strong className="text-purple-400">{c.molecularWeight.toFixed(1)} Da</strong></div>
                        <div className="flex justify-between"><span>LogP:</span><strong className="text-amber-400">{c.logP.toFixed(2)}</strong></div>
                        <div className="flex justify-between"><span>Retro:</span><strong>{c.retrosynthesisDepth} steps</strong></div>
                        <div className="flex justify-between"><span>Novelty:</span><strong className="text-emerald-400">{(c.tanimotoMax * 100).toFixed(0)}%</strong></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED CANDIDATE DOSSIER MODAL */}
      <CandidateDetailModal
        candidate={inspectCandidate}
        alterations={alterations}
        responseClass={responseClass}
        onClose={() => setInspectCandidate(null)}
      />

      {/* CONTINUOUS PIPELINE NAVIGATION */}
      <div className="pt-4 flex items-center justify-between border-t border-[#162032]">
        {onBackToBiologicalInsights && (
          <button
            onClick={onBackToBiologicalInsights}
            className="px-4 py-2.5 rounded-xl border border-[#162032] bg-[#070B12] hover:bg-[#0B101A] text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Biological Insights</span>
          </button>
        )}

        {onRestartPipeline && (
          <button
            onClick={onRestartPipeline}
            className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>START NEW GENOTYPE RUN</span>
          </button>
        )}
      </div>
    </div>
  );
};
