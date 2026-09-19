import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Network, ArrowRight, Dna, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { PathwayInsight } from '../../types';

interface Stage06PathwayInsightsProps {
  pathwayInsights: PathwayInsight[];
  onProceedToResults: () => void;
}

export const Stage06PathwayInsights: React.FC<Stage06PathwayInsightsProps> = ({
  pathwayInsights,
  onProceedToResults
}) => {
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>(pathwayInsights[0]?.id || 'pw-pi3k');

  const selectedPathway = pathwayInsights.find(p => p.id === selectedPathwayId) || pathwayInsights[0];

  // Attention matrix columns for the heatmap visualization across diffusion layers
  const attentionFeatureColumns = [
    'Layer 1 (Local)',
    'Layer 4 (NeST)',
    'Layer 8 (Cross-Attn)',
    'Layer 12 (Global)',
    'Condition Projection'
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>Pipeline Phase 06</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            06 — Pathway & Target Insights
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Biological interpretation via the model's self-attention and cross-attention matrices mapped against the 
            <span className="text-purple-300 font-medium"> NeST (Nested Systems)</span> cellular hierarchy.
          </p>
        </div>

        {/* Disclaimer Pill */}
        <div className="flex items-center space-x-2 bg-amber-950/40 border border-amber-500/40 px-3 py-2 rounded-xl text-xs font-mono text-amber-300 self-start">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
          <span>Model-derived research interpretations only</span>
        </div>
      </div>

      {/* HEATMAP VISUALIZATION */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
              Attention / Pathway Interpretation Heatmap
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Genotype Attention Weights</span>
          </div>
          <span className="text-[11px] font-mono text-purple-300">
            Higher weight indicates stronger conditioning signal
          </span>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                <th className="py-2.5 px-3 min-w-[200px]">Pathway / NeST Subsystem</th>
                {attentionFeatureColumns.map((col, idx) => (
                  <th key={idx} className="py-2.5 px-3 text-center">
                    {col}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-right">Aggregate Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pathwayInsights.map((pw, rowIdx) => {
                const isSelected = selectedPathwayId === pw.id;
                return (
                  <tr
                    key={pw.id}
                    onClick={() => setSelectedPathwayId(pw.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-950/40 border-l-2 border-cyan-400'
                        : 'hover:bg-slate-850/50'
                    }`}
                  >
                    <td className="py-3 px-3 font-medium">
                      <div className="text-white flex items-center space-x-2">
                        <span className="font-sans font-semibold">{pw.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{pw.subsystemNeST}</div>
                    </td>

                    {/* Heatmap cells across columns */}
                    {attentionFeatureColumns.map((_, colIdx) => {
                      // Simulated layer attention distribution
                      const base = pw.attentionScore;
                      const noise = ((rowIdx * 7 + colIdx * 11) % 15) / 100 - 0.05;
                      const cellWeight = Math.max(0.2, Math.min(0.99, base + noise));

                      return (
                        <td key={colIdx} className="py-2.5 px-3 text-center">
                          <div
                            className="w-16 h-8 mx-auto rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all"
                            style={{
                              backgroundColor: `rgba(6, 182, 212, ${cellWeight * 0.85})`,
                              borderColor: `rgba(6, 182, 212, ${cellWeight * 0.9})`,
                              color: cellWeight > 0.5 ? '#ffffff' : '#94a3b8'
                            }}
                          >
                            {cellWeight.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 text-right font-bold text-cyan-300">
                      {(pw.attentionScore * 100).toFixed(0)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED PATHWAY CARDS */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Potentially Highlighted Biological Pathways
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pathwayInsights.map((pw) => {
            const isSelected = selectedPathwayId === pw.id;
            return (
              <motion.div
                key={pw.id}
                onClick={() => setSelectedPathwayId(pw.id)}
                whileHover={{ y: -2 }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                      {pw.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-300">
                      Attention: {(pw.attentionScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                    {pw.name}
                  </h4>

                  {/* Associated Genes Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pw.associatedGenes.map((gene) => (
                      <span
                        key={gene}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60"
                      >
                        {gene}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {pw.mechanism}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <strong className="text-slate-300 block mb-0.5">Model Insight:</strong>
                  <span>{pw.clinicalSignificance}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SCIENTIFIC GUARDRAIL NOTICE */}
      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs space-y-1">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold font-mono">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Research Interpretability Notice:</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          Pathway attention scores represent computational weights learned during model training on pharmacogenomic cell line datasets (GDSC, CTRP). These weights provide mathematical explainability of condition steering and do NOT constitute verified clinical mechanisms or personalized therapy recommendations.
        </p>
      </div>

      {/* PROCEED TO RESULTS BUTTON */}
      <div className="pt-2">
        <button
          onClick={onProceedToResults}
          className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
        >
          <span>VIEW FINAL GENOTYPE-GUIDED RESEARCH CANDIDATES</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
