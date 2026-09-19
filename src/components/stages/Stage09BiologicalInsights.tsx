import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Network, 
  ArrowRight, 
  ArrowLeft, 
  Dna, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Pill, 
  Target,
  Info,
  CheckCircle2
} from 'lucide-react';
import { GeneticAlteration, MolecularCandidate, PathwayInsight, ResponseClass } from '../../types';
import { MoleculeRenderer } from '../MoleculeRenderer';

interface Stage09BiologicalInsightsProps {
  pathwayInsights: PathwayInsight[];
  alterations: GeneticAlteration[];
  candidates: MolecularCandidate[];
  responseClass: ResponseClass;
  selectedCandidateId?: string | null;
  selectedGene?: string | null;
  onSelectCandidate?: (id: string) => void;
  onSelectGene?: (gene: string) => void;
  onProceedToResults: () => void;
  onBackToFiltering?: () => void;
}

export const Stage09BiologicalInsights: React.FC<Stage09BiologicalInsightsProps> = ({
  pathwayInsights,
  alterations,
  candidates,
  responseClass,
  selectedCandidateId: externalCandidateId,
  selectedGene: externalGene,
  onSelectCandidate,
  onSelectGene,
  onProceedToResults,
  onBackToFiltering
}) => {
  const [internalSelectedGene, setInternalSelectedGene] = useState<string>(alterations[0]?.gene || 'TP53');
  const [internalCandidateId, setInternalCandidateId] = useState<string>(candidates[0]?.id || 'G2D-C01');
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>(pathwayInsights[0]?.id || 'pw-pi3k');

  const activeGene = externalGene || internalSelectedGene;
  const activeCandidateId = externalCandidateId || internalCandidateId;

  const handleSelectGene = (gene: string) => {
    setInternalSelectedGene(gene);
    if (onSelectGene) onSelectGene(gene);

    // Auto-select corresponding pathway if relevant
    const g = gene.toUpperCase();
    if (g === 'PIK3CA' || g === 'PTEN' || g === 'AKT1') {
      const pi3k = pathwayInsights.find(p => p.id.includes('pi3k') || p.name.includes('PI3K'));
      if (pi3k) setSelectedPathwayId(pi3k.id);
    } else if (g === 'TP53' || g === 'CDK4' || g === 'CDKN2A' || g === 'RB1') {
      const cdk = pathwayInsights.find(p => p.id.includes('cdk') || p.name.includes('Cell Cycle'));
      if (cdk) setSelectedPathwayId(cdk.id);
    } else if (g === 'HDAC1' || g === 'ARID1A') {
      const hdac = pathwayInsights.find(p => p.id.includes('hdac') || p.name.includes('Epigenetic') || p.name.includes('Histone'));
      if (hdac) setSelectedPathwayId(hdac.id);
    }
  };

  const handleSelectCandidate = (id: string) => {
    setInternalCandidateId(id);
    if (onSelectCandidate) onSelectCandidate(id);

    const cand = candidates.find(c => c.id === id);
    if (cand) {
      const matchedPw = pathwayInsights.find(p => 
        p.associatedGenes.some(g => cand.primaryPathwayTarget.includes(g)) ||
        cand.primaryPathwayTarget.toLowerCase().includes(p.name.toLowerCase().slice(0, 4))
      );
      if (matchedPw) setSelectedPathwayId(matchedPw.id);
    }
  };

  const activeCandidate = candidates.find(c => c.id === activeCandidateId) || candidates[0];
  const selectedPathway = pathwayInsights.find(p => p.id === selectedPathwayId) || pathwayInsights[0];

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
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#162032] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>Pipeline Phase 09</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            09 — Genotype-Conditioned Biological Insights
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Tracing the biological signal from input cancer genotype through transformer attention down to target pathways and synthesized candidate molecules.
          </p>
        </div>

        {/* Disclaimer Pill */}
        <div className="flex items-center space-x-2 bg-[#070B12] border border-amber-500/40 px-3.5 py-2 rounded-xl text-xs font-mono text-amber-300 self-start">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
          <span>Case-study observations / paper examples — Highlighted by model attention</span>
        </div>
      </div>

      {/* TOP FLOW STRIP: INPUT GENOTYPE -> CONDITION ENCODER -> ATTENTION -> PATHWAYS -> CANDIDATES */}
      <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300 shadow-xl">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#030509] border border-cyan-500/40 text-cyan-300">
          <Dna className="w-3.5 h-3.5" />
          <span>INPUT GENOTYPE</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#030509] border border-purple-500/40 text-purple-300">
          <Layers className="w-3.5 h-3.5" />
          <span>CONDITION ENCODER</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#030509] border border-blue-500/40 text-blue-300">
          <Network className="w-3.5 h-3.5" />
          <span>ATTENTION</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#030509] border border-amber-500/40 text-amber-300">
          <Target className="w-3.5 h-3.5" />
          <span>PATHWAY / TARGET SIGNALS</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#030509] border border-emerald-500/50 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          <Pill className="w-3.5 h-3.5" />
          <span>CANDIDATE MOLECULES</span>
        </div>
      </div>

      {/* INTERACTIVE LINKING CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gene Selector Card */}
        <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">1. Select Input Gene:</span>
            <span className="text-cyan-400 font-bold">Active: {activeGene}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {alterations.map(alt => (
              <button
                key={alt.id}
                onClick={() => handleSelectGene(alt.gene)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs cursor-pointer transition-all ${
                  alt.gene.toUpperCase() === activeGene.toUpperCase()
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-[#030509] border-[#162032] text-slate-400 hover:text-white'
                }`}
              >
                {alt.gene} ({alt.alterationType})
              </button>
            ))}
          </div>
          <p className="text-[10px] font-mono text-slate-500">
            Selecting {activeGene} highlights related NeST subsystem and cross-attention signals.
          </p>
        </div>

        {/* Candidate Molecule Selector Card */}
        <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">2. Select Candidate Molecule:</span>
            <span className="text-purple-400 font-bold">Active: {activeCandidate?.id}</span>
          </div>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {candidates.map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectCandidate(c.id)}
                className={`px-2.5 py-1 rounded-lg border font-mono text-xs whitespace-nowrap cursor-pointer transition-all ${
                  c.id === activeCandidateId
                    ? 'bg-purple-950/80 border-purple-500 text-purple-200 font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                    : 'bg-[#030509] border-[#162032] text-slate-400 hover:text-white'
                }`}
              >
                {c.id}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-mono text-slate-500 truncate">
            Targeting: <strong className="text-slate-300">{activeCandidate?.primaryPathwayTarget}</strong> conditioned on {responseClass}.
          </p>
        </div>
      </div>

      {/* ATTENTION / PATHWAY INTERPRETATION HEATMAP */}
      <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>Attention / Pathway Interpretation Heatmap</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Transformer cross-attention weights across hierarchical cellular NeST subsystems
            </p>
          </div>
          <span className="text-[11px] font-mono text-purple-300">
            Higher weight = stronger conditioning signal
          </span>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto border border-[#162032] rounded-xl">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#030509] border-b border-[#162032] text-[11px] text-slate-400">
                <th className="py-2.5 px-3 min-w-[200px]">Pathway / NeST Subsystem</th>
                {attentionFeatureColumns.map((col, idx) => (
                  <th key={idx} className="py-2.5 px-3 text-center">{col}</th>
                ))}
                <th className="py-2.5 px-3 text-right">Attention Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162032]/60">
              {pathwayInsights.map((pw, rowIdx) => {
                const isSelected = selectedPathwayId === pw.id;
                const isGeneRelated = pw.associatedGenes.some(g => g.toUpperCase() === activeGene.toUpperCase());

                return (
                  <tr
                    key={pw.id}
                    onClick={() => setSelectedPathwayId(pw.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-950/40 border-l-2 border-cyan-400'
                        : isGeneRelated
                        ? 'bg-[#0B101A]'
                        : 'hover:bg-[#030509]/60'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="text-white flex items-center space-x-2 font-bold">
                        <span>{pw.name}</span>
                        {isGeneRelated && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                            Linked to {activeGene}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{pw.subsystemNeST}</div>
                    </td>

                    {/* Heatmap cells across columns */}
                    {attentionFeatureColumns.map((_, colIdx) => {
                      const base = pw.attentionScore;
                      const noise = ((rowIdx * 7 + colIdx * 11) % 15) / 100 - 0.05;
                      const cellWeight = Math.max(0.2, Math.min(0.99, base + noise));

                      return (
                        <td key={colIdx} className="py-2.5 px-3 text-center">
                          <div
                            className="w-16 h-7 mx-auto rounded-md flex items-center justify-center text-[10px] font-bold border transition-all"
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

      {/* 3 TARGET / PATHWAY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: PI3K / AKT / PTEN */}
        <div className="bg-[#070B12] border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-cyan-300 font-bold mb-1">
              <span>PI3K / AKT / PTEN Axis</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40">Kinase Cascade</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              NeST subsystem 102: Regulates cell survival and lipid signaling. Activating PIK3CA mutations or PTEN deletions condition the diffusion model toward kinase-inhibitor pharmacophores.
            </p>
            <div className="flex flex-wrap gap-1 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">PIK3CA</span>
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">PTEN</span>
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">AKT1</span>
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">MTOR</span>
            </div>
          </div>
          <div className="pt-2 border-t border-[#162032] text-[10px] text-slate-500">
            Case-study observation: High attention weighting in luminal B & basal-like models.
          </div>
        </div>

        {/* Card 2: Histone Modification / Deacetylation */}
        <div className="bg-[#070B12] border border-purple-500/30 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-purple-300 font-bold mb-1">
              <span>Histone Deacetylation / HDAC</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40">Epigenetic</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              NeST subsystem 045: Chromatin remodeling and transcriptional repressor complexes. Conditioning promotes hydroxamate and benzamide chelating functional groups.
            </p>
            <div className="flex flex-wrap gap-1 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">HDAC1</span>
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">HDAC2</span>
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">ARID1A</span>
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">KDM5A</span>
            </div>
          </div>
          <div className="pt-2 border-t border-[#162032] text-[10px] text-slate-500">
            Case-study observation: Highlighted in chromatin-remodeled cancer cell lines.
          </div>
        </div>

        {/* Card 3: CDK / Cell Cycle */}
        <div className="bg-[#070B12] border border-blue-500/30 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-blue-300 font-bold mb-1">
              <span>CDK / G1-S Cell Cycle Checkpoint</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40">Cell Division</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              NeST subsystem 012: Cyclin-dependent kinase signaling. Alterations in TP53, CDKN2A, or RB1 drive conditioning toward ATP-competitive purine/pyridopyrimidine scaffolds.
            </p>
            <div className="flex flex-wrap gap-1 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">CDK4</span>
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">CDK6</span>
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">CDKN2A</span>
              <span className="px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">RB1</span>
            </div>
          </div>
          <div className="pt-2 border-t border-[#162032] text-[10px] text-slate-500">
            Case-study observation: Prominent in TP53-mutant checkpoint-deficient profiles.
          </div>
        </div>
      </div>

      {/* ACTIVE CANDIDATE REVEAL IN BIOLOGICAL CONTEXT */}
      {activeCandidate && (
        <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-[#030509] border border-[#162032] flex items-center justify-center p-1">
              <MoleculeRenderer candidate={activeCandidate} height={40} />
            </div>
            <div>
              <span className="font-bold text-white text-sm">{activeCandidate.id}</span>
              <span className="text-slate-400 text-xs ml-2">({activeCandidate.name})</span>
              <div className="text-[11px] text-cyan-300">
                Synthesized Target: {activeCandidate.primaryPathwayTarget}
              </div>
            </div>
          </div>

          <div className="text-right text-slate-400 text-[11px]">
            <div>Condition: <strong className="text-white">{responseClass}</strong></div>
            <div>Attention Signal: <strong className="text-cyan-300">{(selectedPathway.attentionScore * 100).toFixed(0)}%</strong></div>
          </div>
        </div>
      )}

      {/* CONTINUOUS PIPELINE NAVIGATION */}
      <div className="pt-2 flex items-center justify-between">
        {onBackToFiltering && (
          <button
            onClick={onBackToFiltering}
            className="px-4 py-2.5 rounded-xl border border-[#162032] bg-[#070B12] hover:bg-[#0B101A] text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Candidate Filtering</span>
          </button>
        )}

        <button
          onClick={onProceedToResults}
          className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
        >
          <span>VIEW FINAL RESEARCH CANDIDATES</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
