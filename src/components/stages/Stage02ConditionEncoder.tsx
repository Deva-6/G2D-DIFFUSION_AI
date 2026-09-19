import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, CheckCircle2, ArrowRight, Dna, Layers, Network, Zap, Sliders } from 'lucide-react';
import { ConditionEncodingResult, GeneticAlteration, ResponseClass } from '../../types';

interface Stage02ConditionEncoderProps {
  alterations: GeneticAlteration[];
  responseClass: ResponseClass;
  encodingResult: ConditionEncodingResult;
  onProceedToDiffusion: () => void;
}

const ENCODER_STATUS_MESSAGES = [
  'Encoding genetic alterations...',
  'Computing gene embeddings...',
  'Applying transformer attention...',
  'Integrating response condition...',
  'Generating condition vector...',
  'Condition encoded successfully'
];

export const Stage02ConditionEncoder: React.FC<Stage02ConditionEncoderProps> = ({
  alterations,
  responseClass,
  encodingResult,
  onProceedToDiffusion
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [selectedGeneIndex, setSelectedGeneIndex] = useState<number>(0);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < ENCODER_STATUS_MESSAGES.length) {
        setCurrentStepIndex(index);
      } else {
        clearInterval(interval);
        setIsCompleted(true);
      }
    }, 700);

    return () => clearInterval(interval);
  }, []);

  const selectedGene = encodingResult.geneTokens[selectedGeneIndex] || encodingResult.geneTokens[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Pipeline Phase 02</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            02 — Condition Encoder
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Transforms discrete clinical genetic alterations into dense numerical embeddings. A multi-head transformer with 
            <span className="text-purple-300 font-medium"> NeST subsystem masking</span> integrates gene tokens with the target response class to yield the continuous conditioning vector <code className="text-cyan-300 font-mono">c</code>.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl self-start">
          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            )}
            <span className="text-xs font-mono text-slate-200">
              {ENCODER_STATUS_MESSAGES[currentStepIndex]}
            </span>
          </div>
        </div>
      </div>

      {/* THREE PANELS ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL A: GENETIC ALTERATIONS */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase flex items-center space-x-1.5">
                <Dna className="w-3.5 h-3.5" />
                <span>Panel A — Genetic Alterations</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                {alterations.length} Detected
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Discrete genomic inputs extracted from the clinical cancer profile:
            </p>

            <div className="space-y-2.5">
              {alterations.map((alt, idx) => (
                <div
                  key={alt.id}
                  onClick={() => setSelectedGeneIndex(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedGeneIndex === idx
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white">
                      {alt.gene}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                      {alt.alterationType}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center justify-between font-mono">
                    <span>Val: {alt.value}</span>
                    <span className="text-[10px] text-slate-500">NeST Subsystem Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs space-y-1">
            <span className="text-slate-400 block font-mono text-[10px] uppercase">Unaltered Baseline:</span>
            <p className="text-[11px] text-slate-500">
              Remaining {718 - alterations.length} genes in clinical panel assigned diploid wild-type neutral zero-embeddings.
            </p>
          </div>
        </div>

        {/* PANEL B: GENETIC EMBEDDINGS & TRANSFORMER ATTENTION */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-purple-400 font-semibold uppercase flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Panel B — Genetic Embeddings</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">128-dim Tokens</span>
          </div>

          {/* Active Gene Token Embedding visualization */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300">
                Token: <strong className="text-cyan-300">{selectedGene?.gene}</strong> ({selectedGene?.subsystem})
              </span>
              <span className="text-[10px] font-mono text-purple-300">Dense Projection</span>
            </div>

            {/* Numerical embedding blocks */}
            <div className="grid grid-cols-8 gap-1.5 pt-1">
              {selectedGene?.vector.map((val, i) => {
                const intensity = Math.abs(val);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="p-1 rounded text-center text-[9px] font-mono border"
                    style={{
                      backgroundColor: val >= 0 ? `rgba(6, 182, 212, ${0.15 + intensity * 0.45})` : `rgba(168, 85, 247, ${0.15 + intensity * 0.45})`,
                      borderColor: val >= 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(168, 85, 247, 0.4)',
                      color: val >= 0 ? '#a5f3fc' : '#f5d0fe'
                    }}
                    title={`Index ${i}: ${val}`}
                  >
                    {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Transformer Self-Attention Heatmap */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center space-x-1">
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>Transformer NeST Attention Matrix</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Softmax(QKᵀ/√d)</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${encodingResult.attentionMatrix[0]?.length || 3}, minmax(0, 1fr))` }}>
                {encodingResult.attentionMatrix.map((row, rIdx) =>
                  row.map((weight, cIdx) => (
                    <motion.div
                      key={`${rIdx}-${cIdx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (rIdx * 3 + cIdx) * 0.03 }}
                      className="aspect-square rounded flex items-center justify-center text-[10px] font-mono border"
                      style={{
                        backgroundColor: `rgba(6, 182, 212, ${Math.max(0.1, weight * 1.8)})`,
                        borderColor: `rgba(6, 182, 212, ${Math.max(0.2, weight * 2)})`,
                        color: weight > 0.4 ? '#ffffff' : '#94a3b8'
                      }}
                      title={`Head attention [${rIdx}, ${cIdx}]: ${weight.toFixed(3)}`}
                    >
                      {weight.toFixed(2)}
                    </motion.div>
                  ))
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-mono text-center">
                NeST subsystem hierarchy masks cross-attention between unrelated biological pathways.
              </p>
            </div>
          </div>
        </div>

        {/* PANEL C: CONDITION VECTOR SYNTHESIS */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Panel C — Condition Vector</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                c ∈ ℝ⁶⁴
              </span>
            </div>

            {/* Architecture transformation flowchart */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-2 mb-4 font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-cyan-300 font-semibold">Genotype Embeddings</span>
                <span className="text-slate-500">+</span>
                <span className="text-purple-300 font-semibold">{responseClass}</span>
              </div>
              <div className="text-center text-slate-500 text-[10px]">↓ Condition Encoder MLP / Cross-Attention</div>
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-center font-bold">
                Condition Vector [c]
              </div>
            </div>

            {/* Animated Condition Vector Stream */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Latent Condition Dimensions (64-dim)</span>
                <span className="text-[10px] text-amber-400/90">Demo representation</span>
              </div>
              <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 max-h-48 overflow-y-auto font-mono text-[11px] text-cyan-300/90 grid grid-cols-4 gap-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                {encodingResult.conditionVector.slice(0, 32).map((val, idx) => (
                  <div
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-center"
                  >
                    <span className="text-[9px] text-slate-500 mr-1">c{idx}:</span>
                    <span>{val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="pt-2">
            <button
              onClick={onProceedToDiffusion}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <span>PROCEED TO CONDITIONAL DIFFUSION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
