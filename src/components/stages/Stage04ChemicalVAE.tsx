import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FlaskConical, ArrowRight, CheckCircle2, Copy, Check, Eye } from 'lucide-react';
import { MolecularCandidate } from '../../types';
import { MoleculeRenderer } from '../MoleculeRenderer';

interface Stage04ChemicalVAEProps {
  candidates: MolecularCandidate[];
  onProceedToEvaluation: () => void;
}

export const Stage04ChemicalVAE: React.FC<Stage04ChemicalVAEProps> = ({
  candidates,
  onProceedToEvaluation
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
        setStatusMessage(`Candidate ${current < 10 ? '0' : ''}${current} generated`);
      } else {
        clearInterval(interval);
        setStatusMessage(`${candidates.length} molecular candidates generated`);
      }
    }, 280);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Pipeline Phase 04</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            04 — Chemical VAE Decoder
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Decodes continuous latent vectors <code className="text-purple-300 font-mono">z_0</code> into valid discrete molecular graph representations and canonical SMILES strings using a bidirectional GRU / autoregressive decoder pretrained on <span className="text-cyan-300 font-mono">~1.58M compounds</span>.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl self-start">
          <div className="flex items-center space-x-2">
            {isAllGenerated ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            )}
            <span className="text-xs font-mono text-slate-200">
              {statusMessage}
            </span>
          </div>
        </div>
      </div>

      {/* Latent Vector -> Chemical Decoder Architecture Flow */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300 shadow-lg">
        <div className="flex items-center space-x-2 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-purple-400 font-bold">Latent Vector [z_0]</span>
          <span className="text-slate-500">∈ ℝ⁵⁶</span>
        </div>
        <span className="text-slate-600 hidden md:inline">→</span>
        <div className="flex items-center space-x-2 p-2 bg-slate-950/80 rounded-xl border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
          <FlaskConical className="w-4 h-4" />
          <span className="font-semibold">Pretrained Chemical VAE Decoder</span>
        </div>
        <span className="text-slate-600 hidden md:inline">→</span>
        <div className="flex items-center space-x-2 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-emerald-400 font-bold">SMILES String</span>
        </div>
        <span className="text-slate-600 hidden md:inline">→</span>
        <div className="flex items-center space-x-2 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-cyan-400 font-bold">2D Molecular Graph</span>
        </div>
      </div>

      {/* Primary Inspector & Active Molecule */}
      {selectedCandidate && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          {/* Left: 2D Molecule Viewer */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                  Primary Candidate Preview
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
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
            <MoleculeRenderer candidate={selectedCandidate} height={230} />
          </div>

          {/* Right: Decoding Details & Chemical Properties */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Decoded Canonical SMILES</span>
                  <span className="text-[10px] text-amber-400/90">Simulated demonstration SMILES</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 flex items-center justify-between group">
                  <span className="break-all">{selectedCandidate.smiles}</span>
                  <button
                    onClick={() => handleCopySmiles(selectedCandidate.smiles)}
                    className="ml-2 p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex-shrink-0"
                    title="Copy SMILES"
                  >
                    {copiedSmiles === selectedCandidate.smiles ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Physicochemical Preliminary Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase block">Formula</span>
                  <span className="text-white font-semibold">{selectedCandidate.formula}</span>
                </div>
                <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase block">Mol Weight</span>
                  <span className="text-cyan-300 font-semibold">{selectedCandidate.molecularWeight.toFixed(1)} Da</span>
                </div>
                <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase block">Drug-Likeness (QED)</span>
                  <span className={`font-semibold ${selectedCandidate.qed >= 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedCandidate.qed.toFixed(2)}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase block">Synth Access (SAS)</span>
                  <span className={`font-semibold ${selectedCandidate.sas <= 4.56 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedCandidate.sas.toFixed(2)}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase block">LogP</span>
                  <span className="text-slate-200 font-semibold">{selectedCandidate.logP.toFixed(2)}</span>
                </div>
                <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase block">Tanimoto Max</span>
                  <span className={`font-semibold ${selectedCandidate.tanimotoMax < 0.25 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedCandidate.tanimotoMax.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400">
              Generated in accordance with the G2D-Diff autoencoder manifold. Will undergo strict 6-stage filtering in Phase 05.
            </div>
          </div>
        </div>
      )}

      {/* PROGRESSIVE CANDIDATES GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-300 font-semibold uppercase">
              Generated Molecular Candidate Pool
            </span>
            <span className="text-xs text-cyan-400 font-mono font-bold">
              ({visibleCount}/{candidates.length} decoded)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Click candidate card to inspect structure
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {candidates.slice(0, visibleCount).map((cand) => {
            const isSelected = selectedCandidateId === cand.id;
            return (
              <motion.div
                key={cand.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSelectedCandidateId(cand.id)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1 text-[10px] font-mono">
                    <span className="font-bold text-cyan-300">{cand.id}</span>
                    <span className="text-slate-400">MW {cand.molecularWeight.toFixed(0)}</span>
                  </div>
                  <div className="w-full h-24 mb-1">
                    <MoleculeRenderer candidate={cand} height={96} compact interactive={false} />
                  </div>
                  <h4 className="text-[11px] font-semibold text-white truncate">
                    {cand.name}
                  </h4>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">QED: {cand.qed.toFixed(2)}</span>
                  <span className="text-purple-300">SAS: {cand.sas.toFixed(1)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* PROCEED TO EVALUATION BUTTON */}
      <div className="pt-2">
        <button
          onClick={onProceedToEvaluation}
          disabled={!isAllGenerated}
          className={`w-full py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            isAllGenerated
              ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.35)]'
              : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>PROCEED TO CANDIDATE EVALUATION & FILTERING FUNNEL</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
