import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Dna, 
  Layers, 
  Network, 
  Zap, 
  Sliders, 
  Info 
} from 'lucide-react';
import { ConditionEncodingResult, GeneticAlteration, ResponseClass } from '../../types';

interface Stage03ConditionEncoderProps {
  alterations: GeneticAlteration[];
  responseClass: ResponseClass;
  encodingResult: ConditionEncodingResult;
  onProceedToResponseContext: () => void;
  onBackToGenotype?: () => void;
}

const ENCODER_STATUS_MESSAGES = [
  'Encoding genetic alterations into embedding space...',
  'Projecting 718-gene tokens to 128-dimensional dense vectors...',
  'Applying multi-head transformer with NeST subsystem attention...',
  'Integrating target response condition vector...',
  'Synthesizing 64-dimensional conditioning representation c...',
  'Condition representation ready for generative diffusion'
];

export const Stage03ConditionEncoder: React.FC<Stage03ConditionEncoderProps> = ({
  alterations,
  responseClass,
  encodingResult,
  onProceedToResponseContext,
  onBackToGenotype
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hoveredGeneIndex, setHoveredGeneIndex] = useState<number>(0);

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
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const activeToken = encodingResult.geneTokens[hoveredGeneIndex] || encodingResult.geneTokens[0];
  const attentionWeightsForActive = encodingResult.attentionMatrix[hoveredGeneIndex] || [];
  const meanAttention = attentionWeightsForActive.length > 0 
    ? attentionWeightsForActive.reduce((a, b) => a + b, 0) / attentionWeightsForActive.length 
    : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#162032] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Pipeline Phase 03</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            03 — Building Condition Representation
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            The condition encoder transforms genetic alteration information and the desired response condition into a representation used to guide molecular generation.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center space-x-3 bg-[#070B12] border border-[#162032] px-3.5 py-2 rounded-xl self-start">
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

      {/* TOP ARCHITECTURAL FLOW STRIP */}
      <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#030509] border border-cyan-500/40 text-cyan-300">
          <Dna className="w-3.5 h-3.5 text-cyan-400" />
          <span>GENOTYPE</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#030509] border border-purple-500/40 text-purple-300">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>GENE EMBEDDINGS</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#030509] border border-blue-500/40 text-blue-300">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span>TRANSFORMER</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#030509] border border-amber-500/40 text-amber-300">
          <Network className="w-3.5 h-3.5 text-amber-400" />
          <span>ATTENTION</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#030509] border border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-bold">
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>CONDITION REPRESENTATION [c]</span>
        </div>
      </div>

      {/* THREE PANELS ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL A: GENE EMBEDDINGS */}
        <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase flex items-center space-x-1.5">
                <Dna className="w-3.5 h-3.5" />
                <span>Panel A — Gene Embeddings</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#030509] text-slate-400 border border-[#162032]">
                Hover to Inspect
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Genes projected into dense vector space. Hover over genes to inspect token vectors and attention weights:
            </p>

            <div className="space-y-2">
              {alterations.map((alt, idx) => {
                const isSelected = hoveredGeneIndex === idx;
                return (
                  <div
                    key={alt.id || idx}
                    onMouseEnter={() => setHoveredGeneIndex(idx)}
                    onClick={() => setHoveredGeneIndex(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'bg-[#030509] border-[#162032] hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-white">
                        {alt.gene}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#070B12] text-cyan-300 border border-slate-700">
                        {alt.alterationType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center justify-between font-mono">
                      <span>Val: {alt.value}</span>
                      <span className="text-[10px] text-purple-400">NeST Token #{idx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Gene Token Vector Preview */}
          <div className="p-3 bg-[#030509] border border-[#162032] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">
                Vector: <strong className="text-cyan-300">{activeToken?.gene}</strong>
              </span>
              <span className="text-[10px] text-purple-300">{activeToken?.subsystem}</span>
            </div>

            <div className="grid grid-cols-8 gap-1 pt-1">
              {activeToken?.vector.slice(0, 16).map((val, i) => {
                const intensity = Math.abs(val);
                return (
                  <div
                    key={i}
                    className="p-1 rounded text-center text-[9px] font-mono border"
                    style={{
                      backgroundColor: val >= 0 ? `rgba(6, 182, 212, ${0.15 + intensity * 0.45})` : `rgba(168, 85, 247, ${0.15 + intensity * 0.45})`,
                      borderColor: val >= 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(168, 85, 247, 0.4)',
                      color: val >= 0 ? '#a5f3fc' : '#f5d0fe'
                    }}
                    title={`Index ${i}: ${val}`}
                  >
                    {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PANEL B: TRANSFORMER ATTENTION HEATMAP */}
        <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-purple-400 font-semibold uppercase flex items-center space-x-1.5">
              <Network className="w-3.5 h-3.5" />
              <span>Panel B — Transformer Attention</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Softmax(QKᵀ/√d)</span>
          </div>

          <p className="text-xs text-slate-400">
            Interactive NeST attention matrix. Hovering a gene highlights its cross-attention contributions:
          </p>

          {/* Attention Heatmap Grid */}
          <div className="bg-[#030509] p-4 rounded-xl border border-[#162032] space-y-3">
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Attention Source / Target:</span>
              <span className="text-cyan-300 font-bold">Active: {activeToken?.gene}</span>
            </div>

            <div 
              className="grid gap-1.5" 
              style={{ 
                gridTemplateColumns: `repeat(${encodingResult.attentionMatrix[0]?.length || 3}, minmax(0, 1fr))` 
              }}
            >
              {encodingResult.attentionMatrix.map((row, rIdx) =>
                row.map((weight, cIdx) => {
                  const isHighlightedRow = rIdx === hoveredGeneIndex;
                  const isHighlightedCol = cIdx === hoveredGeneIndex;
                  const isCellFocused = isHighlightedRow || isHighlightedCol;

                  return (
                    <motion.div
                      key={`${rIdx}-${cIdx}`}
                      onMouseEnter={() => setHoveredGeneIndex(rIdx)}
                      className={`aspect-square rounded flex flex-col items-center justify-center text-[10px] font-mono border transition-all cursor-pointer ${
                        isCellFocused ? 'ring-1 ring-cyan-400 scale-[1.03]' : ''
                      }`}
                      style={{
                        backgroundColor: `rgba(6, 182, 212, ${Math.max(0.12, weight * 1.6)})`,
                        borderColor: isCellFocused ? 'rgba(6, 182, 212, 0.9)' : `rgba(6, 182, 212, ${Math.max(0.2, weight * 2)})`,
                        color: weight > 0.4 ? '#ffffff' : '#94a3b8'
                      }}
                      title={`Head attention [${encodingResult.geneTokens[rIdx]?.gene} -> ${encodingResult.geneTokens[cIdx]?.gene}]: ${weight.toFixed(3)}`}
                    >
                      <span className="font-bold">{weight.toFixed(2)}</span>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Gene contribution indicator */}
            <div className="p-2.5 rounded-lg bg-[#070B12] border border-[#162032] text-[11px] font-mono space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span>Gene Attention Contribution:</span>
                <span className="text-cyan-400 font-bold">{(meanAttention * 100).toFixed(1)}%</span>
              </div>
              <div className="text-[10px] text-slate-500">
                NeST subsystem hierarchy constrains cross-talk across biological modules.
              </div>
            </div>
          </div>
        </div>

        {/* PANEL C: CONDITION VECTOR REPRESENTATION */}
        <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Panel C — Condition Vector [c]</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#030509] text-emerald-400 border border-emerald-500/40">
                c ∈ ℝ⁶⁴
              </span>
            </div>

            {/* Architecture transformation flowchart */}
            <div className="p-3 bg-[#030509] border border-[#162032] rounded-xl text-xs space-y-2 mb-3 font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-cyan-300 font-semibold">Genotype Embeddings</span>
                <span className="text-slate-500">+</span>
                <span className="text-purple-300 font-semibold">{responseClass}</span>
              </div>
              <div className="text-center text-slate-500 text-[10px]">
                ↓ Condition Encoder MLP / Cross-Attention
              </div>
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-center font-bold">
                Condition Vector [c]
              </div>
            </div>

            {/* Explanatory text */}
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              The condition encoder transforms genetic alteration information and the desired response condition into a representation used to guide molecular generation.
            </p>

            {/* Compact Latent/Embedding Vector Preview */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Latent Condition Dimensions (64-dim)</span>
                <span className="text-[10px] text-amber-400/90">Model Latent</span>
              </div>
              <div className="bg-[#030509] border border-[#162032] rounded-xl p-2.5 max-h-40 overflow-y-auto font-mono text-[10px] text-cyan-300/90 grid grid-cols-4 gap-1.5 scrollbar-thin">
                {encodingResult.conditionVector.slice(0, 32).map((val, idx) => (
                  <div
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-[#070B12] border border-[#162032] text-center"
                  >
                    <span className="text-[9px] text-slate-500 mr-1">c{idx}:</span>
                    <span>{val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-2 flex items-center justify-between gap-2">
            {onBackToGenotype && (
              <button
                onClick={onBackToGenotype}
                className="px-3 py-2.5 rounded-xl border border-[#162032] bg-[#030509] hover:bg-[#070B12] text-slate-400 hover:text-white text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Genotype</span>
              </button>
            )}

            <button
              onClick={onProceedToResponseContext}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
            >
              <span>PROCEED TO DRUG RESPONSE CONTEXT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
