import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  X, 
  FileText, 
  FileCode, 
  History, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { MolecularCandidate, GeneticAlteration, ResponseClass, PathwayInsight } from '../../types';
import { MoleculeRenderer } from '../MoleculeRenderer';
import { CandidateDetailModal } from '../CandidateDetailModal';

interface Stage07ResultsProps {
  candidates: MolecularCandidate[];
  alterations: GeneticAlteration[];
  responseClass: ResponseClass;
  pathwayInsights: PathwayInsight[];
  onSaveToHistory: () => void;
  isSavedToHistory: boolean;
}

export const Stage07Results: React.FC<Stage07ResultsProps> = ({
  candidates,
  alterations,
  responseClass,
  pathwayInsights,
  onSaveToHistory,
  isSavedToHistory
}) => {
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [copiedSmiles, setCopiedSmiles] = useState<string | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'passed'>('passed');
  const [inspectCandidate, setInspectCandidate] = useState<MolecularCandidate | null>(null);

  // Filter to show passed candidates by default
  const displayCandidates = activeFilter === 'passed'
    ? candidates.filter(c => c.passedFilters)
    : candidates;

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
        alert('You can compare up to 3 candidate molecules simultaneously.');
        return;
      }
      setSelectedForComparison([...selectedForComparison, id]);
    }
  };

  // Export JSON Report
  const exportJSON = () => {
    const reportData = {
      pipeline: 'G2D-Diff (Genotype-to-Drug Diffusion)',
      paperReference: 'Nature Communications 2025',
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
        tanimotoMax: c.tanimotoMax,
        retrosynthesisDepth: c.retrosynthesisDepth,
        passesLipinski: c.passesLipinski,
        passedFilters: c.passedFilters,
        primaryPathwayTarget: c.primaryPathwayTarget
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `G2D_Diff_Generation_Report_${Date.now()}.json`;
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
      'Max_Tanimoto',
      'Retro_Depth',
      'Lipinski_Pass',
      'Filter_Status',
      'Pathway_Target'
    ];

    const rows = candidates.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.smiles}"`,
      c.formula,
      c.molecularWeight.toFixed(1),
      c.qed.toFixed(2),
      c.sas.toFixed(2),
      c.logP.toFixed(2),
      c.tanimotoMax.toFixed(2),
      c.retrosynthesisDepth,
      c.passesLipinski ? 'TRUE' : 'FALSE',
      c.passedFilters ? 'PASSED' : 'FILTERED',
      `"${c.primaryPathwayTarget}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `G2D_Diff_Candidates_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Markdown Summary
  const exportMarkdown = () => {
    const lines = [
      '# G2D-Diff: Genotype-to-Drug Diffusion Generation Summary',
      `*Generated on:* ${new Date().toUTCString()}`,
      `*Scientific Basis:* Nature Communications (2025)\n`,
      '## Input Cancer Genotype',
      `- **Response Target:** ${responseClass}`,
      `- **Alterations:**`,
      ...alterations.map(a => `  - ${a.gene} (${a.alterationType}: ${a.value})`),
      '\n## Filtered High-Confidence Candidates',
      '| ID | Molecule | Formula | QED | SAS | Tanimoto | Retro Depth | Target Pathway |',
      '|---|---|---|---|---|---|---|---|',
      ...candidates.filter(c => c.passedFilters).map(c => 
        `| ${c.id} | ${c.name} | ${c.formula} | ${c.qed.toFixed(2)} | ${c.sas.toFixed(2)} | ${c.tanimotoMax.toFixed(2)} | ${c.retrosynthesisDepth} | ${c.primaryPathwayTarget} |`
      ),
      '\n## SMILES Reference',
      ...candidates.filter(c => c.passedFilters).map(c => `- **${c.id} (${c.name}):** \`${c.smiles}\``),
      '\n---\n*Disclaimer: Research/educational prototype. Not for medical diagnosis or clinical prescription.*'
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `G2D_Diff_Summary_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const comparedCandidates = candidates.filter(c => selectedForComparison.includes(c.id));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Pill className="w-3.5 h-3.5" />
            <span>Pipeline Phase 07</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            07 — Final Candidate Molecules
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Synthesized anti-cancer small molecule candidates that passed in-silico screening criteria conditioned on your input genomic alterations.
          </p>
        </div>

        {/* Global Export & History Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start">
          <button
            onClick={onSaveToHistory}
            disabled={isSavedToHistory}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              isSavedToHistory
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-purple-950/60 hover:bg-purple-900 border-purple-500/40 text-purple-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{isSavedToHistory ? 'Saved to History' : 'Save Run'}</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={exportJSON}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={exportMarkdown}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Markdown</span>
          </button>
        </div>
      </div>

      {/* FILTER & COMPARISON TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/70 border border-slate-800 rounded-2xl">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveFilter('passed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === 'passed'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Passed Candidates ({candidates.filter(c => c.passedFilters).length})
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Generated ({candidates.length})
          </button>
        </div>

        {/* Side-by-Side Comparison Drawer Trigger */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-mono">
            Selected: <strong className="text-cyan-300">{selectedForComparison.length} / 3</strong>
          </span>
          <button
            onClick={() => setIsComparisonOpen(true)}
            disabled={selectedForComparison.length < 2}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedForComparison.length >= 2
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer'
                : 'bg-slate-950 border border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare Selected</span>
          </button>
        </div>
      </div>

      {/* CANDIDATE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCandidates.map((cand) => {
          const isSelected = selectedForComparison.includes(cand.id);
          const isPassed = cand.passedFilters;

          return (
            <motion.div
              key={cand.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isPassed
                  ? 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-500/60 shadow-xl'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              <div>
                {/* Header with Comparison Checkbox */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {cand.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {cand.formula}
                    </span>
                  </div>

                  <label className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400 cursor-pointer hover:text-cyan-300">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleComparison(cand.id)}
                      className="rounded accent-cyan-500 bg-slate-900 border-slate-700"
                    />
                    <span>Compare</span>
                  </label>
                </div>

                {/* 2D Molecule Viewer */}
                <div className="w-full h-44 mb-3">
                  <MoleculeRenderer candidate={cand} height={176} compact interactive={true} />
                </div>

                {/* Molecule Title & Target Pathway */}
                <h3 className="text-base font-bold text-white mb-1 leading-snug">
                  {cand.name}
                </h3>
                <div className="text-xs text-slate-400 mb-3 flex items-center space-x-1">
                  <span>Target Pathway:</span>
                  <span className="text-cyan-300 font-mono font-medium">{cand.primaryPathwayTarget}</span>
                </div>

                {/* Canonical SMILES with copy */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                    Canonical SMILES
                  </span>
                  <div className="p-2 bg-slate-950 border border-slate-800/90 rounded-xl font-mono text-[11px] text-cyan-300 flex items-center justify-between">
                    <span className="truncate mr-2">{cand.smiles}</span>
                    <button
                      onClick={() => handleCopy(cand.smiles)}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex-shrink-0"
                      title="Copy SMILES"
                    >
                      {copiedSmiles === cand.smiles ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Key Research Metric Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-3">
                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px] uppercase">Drug-Likeness (QED)</span>
                    <span className="text-emerald-400 font-bold">{cand.qed.toFixed(2)}</span>
                  </div>
                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px] uppercase">Synthetic Accessibility</span>
                    <span className="text-emerald-400 font-bold">{cand.sas.toFixed(2)}</span>
                  </div>
                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px] uppercase">Max Tanimoto Sim</span>
                    <span className="text-cyan-300 font-bold">{cand.tanimotoMax.toFixed(2)}</span>
                  </div>
                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px] uppercase">Retro Depth</span>
                    <span className="text-purple-300 font-bold">{cand.retrosynthesisDepth} steps</span>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <button
                  onClick={() => setInspectCandidate(cand)}
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer flex items-center space-x-1"
                >
                  <span>Inspect Dossier</span>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">Lipinski: {cand.passesLipinski ? '✓' : '✗'}</span>
                  <span className={isPassed ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
                    {isPassed ? '✓ Passed' : 'Filtered'}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CANDIDATE DOSSIER MODAL */}
      {inspectCandidate && (
        <CandidateDetailModal
          candidate={inspectCandidate}
          onClose={() => setInspectCandidate(null)}
        />
      )}

      {/* COMPARISON SIDE-BY-SIDE MODAL / DRAWER */}
      <AnimatePresence>
        {isComparisonOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">
                    Candidate Side-by-Side Comparison ({comparedCandidates.length} Selected)
                  </h3>
                </div>
                <button
                  onClick={() => setIsComparisonOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparedCandidates.map((cand) => (
                  <div key={cand.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-400">{cand.id}</span>
                      <span className="text-xs text-slate-400 font-mono">{cand.formula}</span>
                    </div>

                    <div className="h-36">
                      <MoleculeRenderer candidate={cand} height={144} compact interactive={false} />
                    </div>

                    <h4 className="text-sm font-bold text-white">{cand.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{cand.smiles}</p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Target Pathway:</span>
                        <span className="text-cyan-300">{cand.primaryPathwayTarget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Drug-Likeness (QED):</span>
                        <span className="text-emerald-400 font-bold">{cand.qed.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Synthetic Access (SAS):</span>
                        <span className="text-emerald-400 font-bold">{cand.sas.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Max Tanimoto:</span>
                        <span className="text-white">{cand.tanimotoMax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Retrosynthesis:</span>
                        <span className="text-purple-300">{cand.retrosynthesisDepth} steps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mol Weight:</span>
                        <span className="text-slate-300">{cand.molecularWeight.toFixed(1)} Da</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
