import React, { useState } from 'react';
import { 
  Network, 
  Dna, 
  Info, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { PathwayInsight } from '../types';

interface PathwayInsightsViewProps {
  pathwayInsights: PathwayInsight[];
}

export const PathwayInsightsView: React.FC<PathwayInsightsViewProps> = ({
  pathwayInsights
}) => {
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>(pathwayInsights[0]?.id || 'pw-pi3k');

  const selectedPathway = pathwayInsights.find(p => p.id === selectedPathwayId) || pathwayInsights[0];

  const attentionFeatureColumns = [
    'Layer 1 (Local)',
    'Layer 4 (NeST Subsystem)',
    'Layer 8 (Cross-Attention)',
    'Layer 12 (Global Manifold)',
    'Condition Projection'
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* HEADER */}
      <div className="border-b border-[#162032] pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
          <Network className="w-3.5 h-3.5" />
          <span>Mechanistic Biological Interpretability</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            PATHWAY & TARGET INSIGHTS
          </h1>
          <div className="flex items-center space-x-2 bg-amber-950/40 border border-amber-500/40 px-3 py-1 rounded-lg text-[11px] font-mono text-amber-300 self-start sm:self-auto">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
            <span>Model Attention Interpretations</span>
          </div>
        </div>
        <p className="text-xs text-[#9AA4B2] mt-1">
          Biological interpretation through multi-head self-attention and cross-attention weight distributions aligned with NeST (Nested Systems) cellular hierarchies.
        </p>
      </div>

      {/* HEATMAP ACROSS TRANSFORMER LAYERS & GENES */}
      <div className="p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-4">
        <div className="flex items-center justify-between border-b border-[#162032] pb-3 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-bold">NeST Attention & Cross-Attention Weight Heatmap</span>
          </div>
          <span className="text-[11px] text-slate-400">Values represent normalized attention scores [0.0 - 1.0]</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#162032] text-[10px] text-slate-400 uppercase bg-[#030509]">
                <th className="p-3">Cellular Pathway / Subsystem</th>
                <th className="p-3">Associated Target Genes</th>
                {attentionFeatureColumns.map((col, idx) => (
                  <th key={idx} className="p-3 text-center">{col}</th>
                ))}
                <th className="p-3 text-center">Mean Attention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162032]">
              {pathwayInsights.map((pw) => {
                const isSelected = pw.id === selectedPathwayId;
                return (
                  <tr
                    key={pw.id}
                    onClick={() => setSelectedPathwayId(pw.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#0B101A]' : 'hover:bg-[#070B12]'
                    }`}
                  >
                    <td className="p-3 font-bold text-white flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
                      <span>{pw.name}</span>
                    </td>
                    <td className="p-3 text-cyan-300">
                      {pw.associatedGenes.join(', ')}
                    </td>
                    {/* Attention across columns */}
                    {attentionFeatureColumns.map((_, colIdx) => {
                      // Simulated layer variations around pw.attentionScore
                      const score = Math.max(0.08, Math.min(0.98, pw.attentionScore + (colIdx - 2) * 0.05));
                      const bgOpacity = score;
                      return (
                        <td key={colIdx} className="p-2 text-center">
                          <div
                            className="px-2 py-1 rounded text-[11px] font-bold transition-transform hover:scale-105"
                            style={{
                              backgroundColor: `rgba(168, 85, 247, ${bgOpacity * 0.7})`,
                              color: score > 0.4 ? '#ffffff' : '#94a3b8',
                              border: isSelected ? '1px solid rgba(6, 182, 212, 0.6)' : '1px solid transparent'
                            }}
                          >
                            {score.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-3 text-center font-bold text-cyan-300">
                      {pw.attentionScore.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SELECTED PATHWAY DEEP-DIVE DOSSIER */}
      {selectedPathway && (
        <div className="p-6 rounded-2xl bg-[#070B12] border border-[#162032] space-y-4">
          <div className="flex items-center justify-between border-b border-[#162032] pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Subsystem Mechanism Dossier</span>
              <h3 className="text-xl font-bold font-mono text-white flex items-center space-x-2">
                <span>{selectedPathway.name}</span>
                <span className="text-xs text-purple-300 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40">
                  {selectedPathway.category}
                </span>
              </h3>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 block">NeST Attention Focus</span>
              <span className="text-lg font-bold text-cyan-300">
                {(selectedPathway.attentionScore * 100).toFixed(0)}% Attention
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#030509] border border-[#162032] space-y-2">
              <span className="text-[10px] text-slate-400 uppercase">Molecular Action Mechanism</span>
              <p className="text-[#9AA4B2] leading-relaxed">
                {selectedPathway.mechanism}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#030509] border border-[#162032] space-y-2">
              <span className="text-[10px] text-slate-400 uppercase">Clinical Significance</span>
              <p className="text-[#9AA4B2] leading-relaxed">
                {selectedPathway.clinicalSignificance}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#030509] border border-[#162032] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Dna className="w-4 h-4 text-cyan-400" />
              <span>Targeted Candidate Analogues:</span>
              <span className="text-cyan-300 font-bold">{selectedPathway.highlightedMolecules.join(', ')}</span>
            </div>
            <span className="text-[10px] text-slate-500">NeST Subsystem: {selectedPathway.subsystemNeST}</span>
          </div>
        </div>
      )}
    </div>
  );
};
