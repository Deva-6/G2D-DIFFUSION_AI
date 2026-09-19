import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  FlaskConical, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  Sparkles,
  Zap
} from 'lucide-react';
import { MolecularCandidate } from '../../types';
import { MoleculeRenderer } from '../MoleculeRenderer';

interface Stage06DecodingProps {
  candidates: MolecularCandidate[];
  onProceedToMolecularAnalysis: () => void;
  onBackToDiffusion?: () => void;
}

export const Stage06Decoding: React.FC<Stage06DecodingProps> = ({
  candidates,
  onProceedToMolecularAnalysis,
  onBackToDiffusion
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(1);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || 'G2D-C01');
  const [statusMessage, setStatusMessage] = useState<string>('Decoding molecular latent representations...');
  const [copiedSmiles, setCopiedSmiles] = useState<string | null>(null);

  // Progressive candidate generation animation
  useEffect(() => {
    let current = 1;
    const interval = setInterval(() => {
      current++;
      if (current <= candidates.length) {
        setVisibleCount(current);
        setStatusMessage(`Candidate ${current < 10 ? '0' : ''}${current} decoded`);
      } else {
        clearInterval(interval);
        setStatusMessage(`${candidates.length} molecular candidates decoded`);
      }
    }, 240);

    return () => clearInterval(interval);
  }, [candidates.length]);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  const handleCopySmiles = (smiles: string) => {
    navigator.clipboard.writeText(smiles);
    setCopiedSmiles(smiles);
    setTimeout(() => setCopiedSmiles(null), 2000);
  };

  const isAllGenerated = visibleCount >= candidates.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#162032] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Pipeline Phase 06</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            06 — Decoding Molecular Latents
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Continuous latent vectors <code className="text-purple-300 font-mono">z_0 ∈ ℝ⁵⁶</code> are decoded into discrete SMILES strings and chemical structures by the pretrained Chemical VAE decoder.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center space-x-3 bg-[#070B12] border border-[#162032] px-3.5 py-2 rounded-xl self-start">
          <div className="flex items-center space-x-2">
            {isAllGenerated ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            )}
            <span className="text-xs font-mono text-slate-200">
              {statusMessage}
            </span>
          </div>
        </div>
      </div>

      {/* Latent Vector -> Chemical Decoder Architecture Flow */}
      <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300 shadow-xl">
        <div className="flex items-center space-x-2 p-2 bg-[#030509] rounded-xl border border-[#162032]">
          <span className="text-purple-400 font-bold">LATENT [z_0]</span>
          <span className="text-slate-500">∈ ℝ⁵⁶</span>
        </div>
        <span className="text-slate-600 hidden md:inline">→</span>
        <div className="flex items-center space-x-2 p-2 bg-[#030509] rounded-xl border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
          <FlaskConical className="w-4 h-4" />
          <span className="font-semibold">CHEMICAL VAE DECODER</span>
        </div>
        <span className="text-slate-600 hidden md:inline">→</span>
        <div className="flex items-center space-x-2 p-2 bg-[#030509] rounded-xl border border-emerald-500/40 text-emerald-300">
          <span className="font-bold">SMILES STRING</span>
        </div>
        <span className="text-slate-600 hidden md:inline">→</span>
        <div className="flex items-center space-x-2 p-2 bg-[#030509] rounded-xl border border-blue-500/40 text-blue-300">
          <span className="font-bold">MOLECULAR STRUCTURE</span>
        </div>
      </div>

      {/* Primary Inspector & Active Molecule */}
      {selectedCandidate && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#070B12] border border-[#162032] rounded-2xl p-6 shadow-2xl">
          {/* Left: 2D Molecule Viewer */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                  Primary Candidate Preview
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#030509] text-slate-400 border border-[#162032]">
                  ID: {selectedCandidate.id}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {selectedCandidate.name}
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                Conditioned on target pathway: <span className="text-cyan-300">{selectedCandidate.primaryPathwayTarget}</span>
              </p>
            </div>

            {/* Molecule Canvas */}
            <div className="relative">
              <MoleculeRenderer candidate={selectedCandidate} height={230} />
              <div className="absolute top-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded bg-[#030509]/90 border border-amber-500/40 text-amber-300">
                Demonstration-generated candidate
              </div>
            </div>
          </div>

          {/* Right: Decoded SMILES and Generated Pool */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Decoded Canonical SMILES</span>
                  <span className="text-[10px] text-amber-400/90">Demonstration-generated candidate</span>
                </div>
                <div className="p-3 bg-[#030509] border border-[#162032] rounded-xl font-mono text-xs text-cyan-300 flex items-center justify-between group">
                  <span className="break-all">{selectedCandidate.smiles}</span>
                  <button
                    onClick={() => handleCopySmiles(selectedCandidate.smiles)}
                    className="ml-2 p-1.5 rounded bg-[#070B12] hover:bg-[#162032] text-slate-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                    title="Copy SMILES"
                  >
                    {copiedSmiles === selectedCandidate.smiles ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Candidates Pool Matrix */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 block">
                  Generated Decoded Candidates ({visibleCount} of {candidates.length}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto scrollbar-thin">
                  {candidates.slice(0, visibleCount).map((c, idx) => {
                    const isSelected = c.id === selectedCandidate.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCandidateId(c.id)}
                        className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                            : 'bg-[#030509] border-[#162032] text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-[11px]">{c.id}</span>
                          <span className="text-[9px] text-emerald-400">QED {c.qed.toFixed(2)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-1">
                          {c.smiles}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#030509] rounded-xl border border-[#162032] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>All candidates generated with valid chemical valency rules.</span>
              <span className="text-purple-400 font-semibold">Pretrained ChEMBL VAE</span>
            </div>
          </div>
        </div>
      )}

      {/* CONTINUOUS PIPELINE NAVIGATION */}
      <div className="pt-2 flex items-center justify-between">
        {onBackToDiffusion && (
          <button
            onClick={onBackToDiffusion}
            className="px-4 py-2.5 rounded-xl border border-[#162032] bg-[#070B12] hover:bg-[#0B101A] text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Latent Diffusion</span>
          </button>
        )}

        <button
          onClick={onProceedToMolecularAnalysis}
          className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
        >
          <span>PROCEED TO MOLECULAR PROPERTY ANALYSIS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
