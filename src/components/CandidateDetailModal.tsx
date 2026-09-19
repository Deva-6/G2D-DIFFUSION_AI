import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  FlaskConical, 
  Dna, 
  Network, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Layers,
  Activity,
  Sparkles
} from 'lucide-react';
import { MolecularCandidate, ResponseClass, GeneticAlteration } from '../types';
import { MoleculeRenderer } from './MoleculeRenderer';

interface CandidateDetailModalProps {
  candidate: MolecularCandidate | null;
  alterations?: GeneticAlteration[];
  responseClass?: ResponseClass;
  onClose: () => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  alterations,
  responseClass,
  onClose
}) => {
  const [copiedSmiles, setCopiedSmiles] = useState(false);

  if (!candidate) return null;

  const handleCopySmiles = () => {
    navigator.clipboard.writeText(candidate.smiles);
    setCopiedSmiles(true);
    setTimeout(() => setCopiedSmiles(false), 2000);
  };

  const estimatedAUC = (0.28 + (1 - candidate.qed) * 0.35 + (candidate.sas / 10) * 0.1).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#070B12] border border-[#162032] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-auto font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#162032] bg-[#030509]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{candidate.id}</span>
                <span className="text-sm font-bold text-white font-mono">{candidate.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  candidate.passedFilters 
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                }`}>
                  {candidate.passedFilters ? 'PASSED IN-SILICO FILTERS' : 'FLAGGED / FILTERED'}
                </span>
              </div>
              <p className="text-[11px] text-[#9AA4B2] font-mono">
                Formula: {candidate.formula} • Molecular Weight: {candidate.molecularWeight.toFixed(1)} g/mol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#070B12] hover:bg-[#0B101A] border border-[#162032] text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto scrollbar-thin">
          {/* TOP SECTION: 2D STRUCTURE & PRIMARY ATTRIBUTES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 2D Structure Renderer */}
            <div className="lg:col-span-6 bg-[#030509] border border-[#162032] rounded-xl p-4 flex flex-col items-center justify-center relative">
              <span className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider">
                2D Molecular Topology
              </span>
              <div className="my-3">
                <MoleculeRenderer
                  candidate={candidate}
                  width={340}
                  height={220}
                />
              </div>
              {/* SMILES box */}
              <div className="w-full mt-2 p-2.5 rounded-lg bg-[#070B12] border border-[#162032] flex items-center justify-between font-mono text-xs">
                <div className="truncate text-slate-300 text-[11px] pr-2" title={candidate.smiles}>
                  <span className="text-slate-500 select-none">SMILES: </span>
                  {candidate.smiles}
                </div>
                <button
                  onClick={handleCopySmiles}
                  className="px-2 py-1 rounded bg-[#030509] border border-[#162032] hover:border-cyan-500/50 text-cyan-300 text-[11px] flex items-center space-x-1 cursor-pointer flex-shrink-0"
                >
                  {copiedSmiles ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSmiles ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Right: Key Descriptors & Filtering Criteria */}
            <div className="lg:col-span-6 space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#030509] border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">QED Drug-likeness</span>
                  <div className="text-base font-bold text-cyan-300 flex items-center space-x-1.5">
                    <span>{candidate.qed.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 font-normal">(target &gt; 0.80)</span>
                  </div>
                  <span className={`text-[10px] ${candidate.qed >= 0.8 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {candidate.qed >= 0.8 ? '✓ High drug-likeness' : '✗ Below threshold'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#030509] border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">SAS Synthesizability</span>
                  <div className="text-base font-bold text-purple-300 flex items-center space-x-1.5">
                    <span>{candidate.sas.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 font-normal">(target &lt; 4.56)</span>
                  </div>
                  <span className={`text-[10px] ${candidate.sas <= 4.56 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {candidate.sas <= 4.56 ? '✓ Accessible synthesis' : '✗ Complex synthetic route'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#030509] border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">Max Tanimoto Similarity</span>
                  <div className="text-base font-bold text-emerald-300 flex items-center space-x-1.5">
                    <span>{candidate.tanimotoMax.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 font-normal">(target &lt; 0.25)</span>
                  </div>
                  <span className={`text-[10px] ${candidate.tanimotoMax <= 0.25 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {candidate.tanimotoMax <= 0.25 ? '✓ High chemical novelty' : '⚠ Structural analog'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#030509] border border-[#162032]">
                  <span className="text-[10px] text-slate-500 block">AiZynthFinder Retrosynthesis</span>
                  <div className="text-base font-bold text-white flex items-center space-x-1.5">
                    <span>{candidate.retrosynthesisDepth} steps</span>
                    <span className="text-[10px] text-slate-400 font-normal">(target ≤ 4)</span>
                  </div>
                  <span className={`text-[10px] ${candidate.retrosynthesisDepth <= 4 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {candidate.retrosynthesisDepth <= 4 ? '✓ Commercial precursor route' : '✗ Deep reaction tree'}
                  </span>
                </div>
              </div>

              {/* Extended Physico-Chemical Descriptors */}
              <div className="p-3.5 rounded-xl bg-[#030509] border border-[#162032] space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block border-b border-[#162032] pb-1.5">
                  Physicochemical Properties & Lipinski Rule-of-5
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="p-1.5 bg-[#070B12] rounded border border-[#162032]">
                    <span className="text-[9px] text-slate-500 block">LogP</span>
                    <span className="font-bold text-slate-200">{candidate.logP.toFixed(2)}</span>
                  </div>
                  <div className="p-1.5 bg-[#070B12] rounded border border-[#162032]">
                    <span className="text-[9px] text-slate-500 block">HBD</span>
                    <span className="font-bold text-slate-200">{candidate.hbd}</span>
                  </div>
                  <div className="p-1.5 bg-[#070B12] rounded border border-[#162032]">
                    <span className="text-[9px] text-slate-500 block">HBA</span>
                    <span className="font-bold text-slate-200">{candidate.hba}</span>
                  </div>
                  <div className="p-1.5 bg-[#070B12] rounded border border-[#162032]">
                    <span className="text-[9px] text-slate-500 block">TPSA</span>
                    <span className="font-bold text-slate-200">{candidate.tpsa} Å²</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-400">Lipinski Compliance:</span>
                  <span className={`font-bold ${candidate.passesLipinski ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {candidate.passesLipinski ? 'Passes Lipinski (0 Violations)' : `${candidate.lipinskiViolations} Violation(s)`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: GENOTYPE CONTEXT & PATHWAY ASSOCIATIONS */}
          <div className="p-4 rounded-xl bg-[#030509] border border-[#162032] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#162032] pb-2">
              <span className="text-slate-300 font-bold flex items-center space-x-2">
                <Network className="w-4 h-4 text-purple-400" />
                <span>Conditioning Context & Pathway Associations</span>
              </span>
              <span className="text-[10px] text-cyan-400">NeST Subsystem Mapping</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-[#070B12] rounded-lg border border-[#162032]">
                <span className="text-[10px] text-slate-500 block">Target Gene Focus</span>
                <span className="text-sm font-bold text-cyan-300">{candidate.targetGene}</span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Primary oncogenic vulnerability identified by cross-attention weights.
                </p>
              </div>

              <div className="p-3 bg-[#070B12] rounded-lg border border-[#162032]">
                <span className="text-[10px] text-slate-500 block">Primary Pathway Target</span>
                <span className="text-xs font-bold text-purple-300">{candidate.primaryPathwayTarget}</span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Subsystem cascade with highest attention coupling during reverse diffusion.
                </p>
              </div>

              <div className="p-3 bg-[#070B12] rounded-lg border border-[#162032]">
                <span className="text-[10px] text-slate-500 block">Illustrative Predicted AUC</span>
                <span className="text-sm font-bold text-emerald-300">{estimatedAUC}</span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Estimated sensitivity band: {responseClass || 'Sensitive'} (AUC ≤ 0.45).
                </p>
              </div>
            </div>
          </div>

          {/* RESEARCH DISCLAIMER */}
          <div className="p-3.5 rounded-xl bg-[#020409] border border-amber-500/30 flex items-start space-x-2.5 font-mono text-[11px] text-amber-300/90">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block mb-0.5">RESEARCH-GENERATED CANDIDATE MOLECULE</span>
              <p className="text-[#9AA4B2] leading-relaxed">
                This molecule is generated by an in-silico deep generative model for computational exploration and experimental follow-up. 
                It is <strong>NOT an approved medicine</strong>, NOT a clinical diagnosis, and NOT a recommended patient therapy. 
                Rigorous wet-lab binding assays, pharmacokinetic profiling, and cytotoxicity validation are mandatory.
              </p>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3 border-t border-[#162032] bg-[#030509] flex items-center justify-between text-xs font-mono">
          <span className="text-[11px] text-slate-500">G2D-Diff Candidate Dossier • Nature Comms 2025</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#070B12] hover:bg-[#0B101A] border border-[#162032] text-white text-xs font-mono cursor-pointer transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
