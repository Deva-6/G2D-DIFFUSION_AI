import React from 'react';
import { motion } from 'motion/react';
import { 
  Dna, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  FlaskConical, 
  Filter, 
  Network, 
  Pill, 
  Activity,
  Layers,
  BarChart2,
  CheckCircle2
} from 'lucide-react';
import { DEMO_PROFILES } from '../data/clinicalGenes';
import { GenotypeProfile, PipelineStage } from '../types';

interface HomeViewProps {
  onStartPipeline: () => void;
  onSelectDemoProfile: (profile: GenotypeProfile) => void;
  onNavigateMethod: () => void;
  onSelectStage?: (stage: PipelineStage) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartPipeline,
  onSelectDemoProfile,
  onNavigateMethod,
  onSelectStage
}) => {
  const PIPELINE_STAGES: Array<{
    id: PipelineStage;
    num: string;
    title: string;
    desc: string;
    icon: React.ElementType;
  }> = [
    { id: 'input', num: '01', title: 'INPUT', desc: 'Genotype alteration matrix & desired response', icon: Dna },
    { id: 'genotype', num: '02', title: 'GENOTYPE', desc: '718 clinical genes & alteration landscape', icon: Layers },
    { id: 'condition_encoder', num: '03', title: 'ENCODER', desc: 'NeST transformer hierarchy & condition c', icon: Cpu },
    { id: 'response_context', num: '04', title: 'RESPONSE', desc: 'AUC distributions & cell line sensitivity', icon: Activity },
    { id: 'diffusion', num: '05', title: 'DIFFUSION', desc: '300-step reverse SDE latent generation', icon: Sparkles },
    { id: 'decoding', num: '06', title: 'DECODING', desc: 'Chemical VAE latent to SMILES & graphs', icon: FlaskConical },
    { id: 'molecular_analysis', num: '07', title: 'PROPERTIES', desc: 'QED vs SAS, MW, LogP & retrosynthesis', icon: BarChart2 },
    { id: 'filtering', num: '08', title: 'FILTERING', desc: 'Multi-tier screening funnel & outlier triage', icon: Filter },
    { id: 'pathway_insights', num: '09', title: 'INSIGHTS', desc: 'Genotype-to-target cross-attention trace', icon: Network },
    { id: 'results', num: '10', title: 'CANDIDATES', desc: 'Generated research candidate molecules', icon: Pill },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* HERO SECTION */}
      <div className="relative rounded-2xl bg-[#070B12] border border-[#162032] p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Hero Text & Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#0B101A] border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Nature Communications 2025 • DOI: 10.1038/s41467-025-60763-9</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              From Cancer Genotype<br />
              <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                to Tailored Drug Candidates
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#9AA4B2] leading-relaxed max-w-2xl font-normal">
              Explore how genotype information and desired drug-response conditions can be transformed through a condition encoder, conditional latent diffusion, chemical VAE decoding, and candidate evaluation.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onStartPipeline}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono font-semibold text-xs tracking-wider uppercase flex items-center space-x-2 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Start New Generation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSelectDemoProfile(DEMO_PROFILES[0])}
                className="px-4 py-2.5 rounded-lg bg-[#0B101A] hover:bg-[#121826] border border-[#162032] hover:border-cyan-500/40 text-slate-200 font-mono text-xs flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Dna className="w-3.5 h-3.5 text-purple-400" />
                <span>Explore Demo Case (TNBC)</span>
              </button>
            </div>

            {/* Micro citation */}
            <div className="pt-4 border-t border-[#162032] flex items-center justify-between text-[11px] text-[#9AA4B2] font-mono">
              <span>G2D-Diff Architecture</span>
              <span className="text-cyan-400/90 hover:underline cursor-pointer" onClick={onNavigateMethod}>
                View Technical Specifications →
              </span>
            </div>
          </div>

          {/* Right Column: Scientific Visual Flow */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm p-5 rounded-xl bg-[#030509] border border-[#162032] relative shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#162032] text-[10px] font-mono text-slate-400">
                <span className="flex items-center space-x-1 text-purple-300">
                  <Activity className="w-3 h-3 text-purple-400" />
                  <span>TRANSFORMATION FLOW</span>
                </span>
                <span className="text-cyan-400">G2D-DIFF CORE</span>
              </div>

              <div className="mt-4 space-y-2.5 font-mono text-xs relative">
                {/* Step 1 */}
                <motion.div 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-2.5 rounded-lg bg-[#070B12] border border-[#162032] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-white font-semibold">DNA</span>
                  </div>
                  <span className="text-[10px] text-cyan-400">718 Clinical Genes</span>
                </motion.div>

                <div className="flex justify-center text-slate-600 text-xs py-0.5">↓</div>

                {/* Step 2 */}
                <motion.div 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-2.5 rounded-lg bg-[#070B12] border border-[#162032] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Dna className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-slate-200">Genetic Alterations</span>
                  </div>
                  <span className="text-[10px] text-purple-300">SNV / CNA / CND</span>
                </motion.div>

                <div className="flex justify-center text-slate-600 text-xs py-0.5">↓</div>

                {/* Step 3 */}
                <motion.div 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-2.5 rounded-lg bg-[#070B12] border border-[#162032] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-200">Latent Representation</span>
                  </div>
                  <span className="text-[10px] text-cyan-300">c ∈ ℝ⁶⁴ condition</span>
                </motion.div>

                <div className="flex justify-center text-slate-600 text-xs py-0.5">↓</div>

                {/* Step 4 */}
                <motion.div 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-2.5 rounded-lg bg-[#070B12] border border-purple-500/40 flex items-center justify-between shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    <span className="text-white font-semibold">Diffusion</span>
                  </div>
                  <span className="text-[10px] text-purple-300 font-mono">z₀ ∈ ℝ⁵⁶ (300 steps)</span>
                </motion.div>

                <div className="flex justify-center text-slate-600 text-xs py-0.5">↓</div>

                {/* Step 5 */}
                <motion.div 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-2.5 rounded-lg bg-[#070B12] border border-emerald-500/40 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-white font-semibold">Molecular Structures</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">Chemical VAE</span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10-STAGE PIPELINE: CLICKABLE STAGE ROW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wider font-mono uppercase">
              Complete 10-Stage Generative Pipeline
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#9AA4B2]">Click any stage to enter workflow</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {PIPELINE_STAGES.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (onSelectStage) {
                    onSelectStage(s.id);
                  } else {
                    onStartPipeline();
                  }
                }}
                className="bg-[#070B12] hover:bg-[#0B101A] border border-[#162032] hover:border-purple-500/50 rounded-xl p-3.5 text-left flex flex-col justify-between transition-all cursor-pointer group hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold group-hover:text-purple-300 transition-colors">
                      {s.num}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h4 className="text-[11px] font-bold text-white mb-1 font-mono tracking-tight">{s.title}</h4>
                  <p className="text-[10px] text-[#9AA4B2] leading-snug line-clamp-2">{s.desc}</p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#162032] flex items-center justify-between text-[9px] font-mono text-slate-500 group-hover:text-cyan-300">
                  <span>Explore</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* BENCHMARK GENOTYPE PROFILES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white tracking-wider font-mono uppercase">
              Pre-Configured Tumor Genotype Benchmarks
            </h2>
          </div>
          <span className="text-[11px] text-[#9AA4B2] font-mono">Select to populate pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {DEMO_PROFILES.slice(0, 3).map((profile) => (
            <div
              key={profile.id}
              onClick={() => onSelectDemoProfile(profile)}
              className="group bg-[#070B12] hover:bg-[#0B101A] border border-[#162032] hover:border-cyan-500/50 rounded-xl p-4.5 cursor-pointer transition-all duration-200 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#030509] text-cyan-300 border border-[#162032]">
                    {profile.cancerType}
                  </span>
                  <span className="text-[11px] font-mono text-purple-300">
                    {profile.recommendedResponse}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors font-mono">
                  {profile.name}
                </h3>
                <p className="text-[11px] text-[#9AA4B2] mt-1 leading-relaxed line-clamp-2">
                  {profile.description}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-[#162032] flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {profile.alterations.map((a) => (
                    <span
                      key={a.id}
                      className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#030509] text-slate-300 border border-[#162032]"
                    >
                      {a.gene}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Load Profile <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
