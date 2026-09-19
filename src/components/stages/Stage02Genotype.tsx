import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Dna, 
  Search, 
  BarChart2, 
  Info,
  Flame,
  Zap,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { GeneticAlteration, ResponseClass } from '../../types';
import { CLINICAL_718_GENES } from '../../data/clinicalGenes';

interface Stage02GenotypeProps {
  alterations: GeneticAlteration[];
  responseClass: ResponseClass;
  onProceedToConditionEncoder: () => void;
  onBackToInput?: () => void;
}

export const Stage02Genotype: React.FC<Stage02GenotypeProps> = ({
  alterations,
  responseClass,
  onProceedToConditionEncoder,
  onBackToInput,
}) => {
  const [geneFilter, setGeneFilter] = useState<string>('');
  const [selectedHeatmapGene, setSelectedHeatmapGene] = useState<string | null>(null);

  // Map entered alterations for fast lookup
  const alteredGenesMap = useMemo(() => {
    const map = new Map<string, GeneticAlteration>();
    alterations.forEach(alt => {
      map.set(alt.gene.toUpperCase().trim(), alt);
    });
    return map;
  }, [alterations]);

  // Summary counts
  const mutationCount = alterations.filter(a => a.alterationType === 'mutation').length;
  const amplificationCount = alterations.filter(a => a.alterationType === 'amplification').length;
  const deletionCount = alterations.filter(a => a.alterationType === 'deletion').length;
  const cnaCount = alterations.filter(a => a.alterationType === 'cna').length;
  const totalAltered = alterations.length;
  const totalRepresented = CLINICAL_718_GENES.length; // 718

  // Alteration Type Bar Chart Data
  const barChartData = [
    { type: 'Mutation', count: mutationCount, color: '#f43f5e' },
    { type: 'Amplification', count: amplificationCount + cnaCount, color: '#a855f7' },
    { type: 'Deletion', count: deletionCount, color: '#f59e0b' },
  ];

  // Filter 718 genes for the heatmap view
  const filtered718Genes = useMemo(() => {
    if (!geneFilter.trim()) return CLINICAL_718_GENES;
    return CLINICAL_718_GENES.filter(g => g.toLowerCase().includes(geneFilter.toLowerCase().trim()));
  }, [geneFilter]);

  const selectedAltInfo = selectedHeatmapGene ? alteredGenesMap.get(selectedHeatmapGene) : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#162032] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Pipeline Phase 02</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            02 — Understanding Genotype
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            The G2D-Diff framework converts entered discrete genetic alterations into dense numerical tokens mapped across the{' '}
            <span className="text-cyan-300 font-mono font-medium">718 clinical cancer genes</span> evaluated in the benchmark paper. Unaltered loci serve as diploid reference baselines.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center space-x-3 bg-[#070B12] border border-[#162032] px-3.5 py-2 rounded-xl self-start text-xs font-mono">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-200">
              {totalAltered} alterations parsed across 718 panel
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: GENE -> ALTERATION -> ENCODING PIPELINE ANIMATION */}
      <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Gene → Alteration → Model Encoding Stream</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#030509] text-purple-300 border border-purple-500/30">
            Target: {responseClass}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Visualizing each entered genomic alteration tokenized with NeST subsystem contextual positional embeddings:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {alterations.map((alt, idx) => {
            const shortCode = alt.alterationType === 'mutation' ? 'MUT' : alt.alterationType === 'amplification' ? 'CNA' : 'CND';
            const colorClass = alt.alterationType === 'mutation' 
              ? 'border-rose-500/50 bg-rose-950/20 text-rose-300' 
              : alt.alterationType === 'amplification'
              ? 'border-purple-500/50 bg-purple-950/20 text-purple-300'
              : 'border-amber-500/50 bg-amber-950/20 text-amber-300';

            return (
              <motion.div
                key={alt.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                className={`p-3 rounded-xl border ${colorClass} text-xs font-mono flex flex-col justify-between space-y-2 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm tracking-wide">{alt.gene}</span>
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-black/40 border border-current font-semibold">
                    {shortCode}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {alt.value || 'Altered'}
                </div>
                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Token #{idx + 1}</span>
                  <span className="text-emerald-400 font-medium">✓ Encoded</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: GENOTYPE ALTERATION PROFILE & ALTERATION TYPE BAR CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Summary Cards */}
        <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#162032]">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Genotype Alteration Profile</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Paper Reference Panel</span>
          </div>

          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#030509] border border-[#162032]">
              <span className="text-xs text-rose-400 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Mutation Count:</span>
              </span>
              <span className="text-sm font-bold text-white">{mutationCount}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#030509] border border-[#162032]">
              <span className="text-xs text-purple-400 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Amplification Count:</span>
              </span>
              <span className="text-sm font-bold text-white">{amplificationCount + cnaCount}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#030509] border border-[#162032]">
              <span className="text-xs text-amber-400 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Deletion Count:</span>
              </span>
              <span className="text-sm font-bold text-white">{deletionCount}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#030509] border border-cyan-500/30">
              <span className="text-xs text-cyan-300 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Altered Genes:</span>
              </span>
              <span className="text-sm font-bold text-cyan-200">{totalAltered}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#030509] border border-[#162032]">
              <span className="text-xs text-slate-400 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                <span>Total Represented Genes:</span>
              </span>
              <span className="text-sm font-bold text-slate-300">{totalRepresented}</span>
            </div>
          </div>
        </div>

        {/* Small Bar Chart: Alteration Type */}
        <div className="lg:col-span-2 bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Alteration Type Distribution</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Distribution of genomic lesions inputted for condition encoding
              </p>
            </div>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <XAxis 
                  dataKey="type" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="monospace" 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="monospace" 
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#070B12', 
                    borderColor: '#162032', 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }} 
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-[#162032] flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Model representation: One-hot alteration feature per gene</span>
            <span className="text-purple-400 font-semibold">NeST Subsystem Partitioned</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: 718-GENE ALTERATION HEATMAP */}
      <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#162032]">
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Flame className="w-4 h-4 text-cyan-400" />
              <span>718-Gene Alteration Heatmap Representation</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              The model projects genetic alterations onto the 718-gene clinical manifold. Entered alterations glow distinctly.
            </p>
          </div>

          {/* Gene Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search 718 genes..."
              value={geneFilter}
              onChange={(e) => setGeneFilter(e.target.value)}
              className="w-full bg-[#030509] border border-[#162032] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-mono"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
            <span className="text-slate-300">Mutation (MUT)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
            <span className="text-slate-300">Amplification (CNA)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            <span className="text-slate-300">Deletion (CND)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#0a1120] border border-[#1e293b]" />
            <span className="text-slate-500">Diploid Wild Type (Reference)</span>
          </div>
        </div>

        {/* 718 Gene Tiles Grid */}
        <div className="p-3 bg-[#030509] rounded-xl border border-[#162032] max-h-72 overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-1.5 font-mono text-[10px]">
            {filtered718Genes.map((gene) => {
              const alt = alteredGenesMap.get(gene.toUpperCase());
              const isAltered = !!alt;
              const isSelected = selectedHeatmapGene === gene;

              let tileClass = 'bg-[#070B12] text-slate-600 border border-[#162032]/60 hover:border-slate-500 hover:text-slate-300';
              if (alt) {
                if (alt.alterationType === 'mutation') {
                  tileClass = 'bg-rose-950/80 text-rose-300 border border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)] font-bold';
                } else if (alt.alterationType === 'amplification') {
                  tileClass = 'bg-purple-950/80 text-purple-300 border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)] font-bold';
                } else {
                  tileClass = 'bg-amber-950/80 text-amber-300 border border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] font-bold';
                }
              }

              return (
                <button
                  key={gene}
                  onClick={() => setSelectedHeatmapGene(gene)}
                  title={`${gene}: ${alt ? `${alt.alterationType.toUpperCase()} (${alt.value})` : 'Diploid (Wild Type)'}`}
                  className={`p-1.5 rounded text-center truncate transition-all cursor-pointer ${tileClass} ${
                    isSelected ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-[#030509]' : ''
                  }`}
                >
                  {gene}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Gene Inspection Drawer */}
        {selectedHeatmapGene && (
          <div className="p-3 rounded-xl bg-[#030509] border border-cyan-500/40 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-white text-sm">{selectedHeatmapGene}</span>
              {selectedAltInfo ? (
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  {selectedAltInfo.alterationType.toUpperCase()}: {selectedAltInfo.value}
                </span>
              ) : (
                <span className="text-slate-500">Diploid Wild Type (baseline representation in condition vector)</span>
              )}
            </div>
            <button
              onClick={() => setSelectedHeatmapGene(null)}
              className="text-slate-400 hover:text-white text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* CONTINUOUS PIPELINE NAVIGATION */}
      <div className="pt-2 flex items-center justify-between">
        {onBackToInput && (
          <button
            onClick={onBackToInput}
            className="px-4 py-2.5 rounded-xl border border-[#162032] bg-[#070B12] hover:bg-[#0B101A] text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Edit Input Genotype</span>
          </button>
        )}

        <button
          onClick={onProceedToConditionEncoder}
          className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
        >
          <span>PROCEED TO CONDITION ENCODER</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
