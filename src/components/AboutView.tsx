import React from 'react';
import { 
  Info, 
  AlertTriangle, 
  Dna, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  FileText,
  FileCheck2
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <Info className="w-3.5 h-3.5" />
          <span>Application Information</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          About G2D-Diff Explorer
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Interactive research prototype and educational visualization of genotype-conditioned molecular diffusion.
        </p>
      </div>

      {/* COMPREHENSIVE SAFETY DISCLAIMER */}
      <div className="p-6 bg-amber-950/30 border-2 border-amber-500/50 rounded-2xl space-y-3 shadow-xl">
        <div className="flex items-center space-x-2.5 text-amber-400">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <h2 className="text-base font-bold uppercase tracking-wider font-mono">
            Mandatory Research Safety Disclaimer
          </h2>
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
          <strong>Research Prototype:</strong> This application is an interactive visualization/simulation of a genotype-to-drug generative AI workflow based on the 2025 Nature Communications publication. Generated molecules are research candidates only. They are <strong>NOT clinical recommendations, approved drugs, diagnoses, or prescriptions</strong>. Experimental validation, in-vitro assay testing, pharmacokinetics, and clinical trials are strictly required prior to any biological application.
        </p>
      </div>

      {/* CITATION & PUBLICATION DETAILS */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Scientific Reference & Citation</span>
        </h3>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
          <p className="text-white font-bold">
            “A genotype-to-drug diffusion model for generation of tailored anti-cancer small molecules”
          </p>
          <p className="text-slate-400">
            <em>Nature Communications</em>, 2025.
          </p>
          <p className="text-cyan-400/80 text-[11px] pt-1">
            DOI: 10.1038/s41467-025-XXXXX
          </p>
        </div>
      </div>

      {/* CORE DATA SOURCES */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Database className="w-4 h-4 text-purple-400" />
          <span>Curated Databases & Genomic Panels</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-cyan-300 font-mono">718 Clinical Gene Panel</h4>
            <p className="text-slate-400 leading-relaxed">
              Based on the MSK-IMPACT, Foundation Medicine, and OncoKB clinical cancer gene registries. Unaltered genes receive neutral zero-embeddings.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-purple-300 font-mono">GDSC & CTRP Consortia</h4>
            <p className="text-slate-400 leading-relaxed">
              Pharmacogenomic screening repositories documenting high-throughput cell viability curves across thousands of cancer cell lines.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-emerald-300 font-mono">ChEMBL 33 Chemical Database</h4>
            <p className="text-slate-400 leading-relaxed">
              Curated repository of ~1.58 million bioactivity assay molecules utilized for pretraining the Chemical VAE continuous latent space.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-blue-300 font-mono">NeST (Nested Systems Hierarchy)</h4>
            <p className="text-slate-400 leading-relaxed">
              Ontological knowledge base of cellular subsystems governing cross-attention masking in the condition encoder.
            </p>
          </div>
        </div>
      </div>

      {/* SIMULATION MODE NOTE */}
      <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs space-y-2 text-slate-400 font-mono">
        <div className="flex items-center space-x-2 text-slate-200 font-semibold">
          <FileCheck2 className="w-4 h-4 text-cyan-400" />
          <span>Interactive Simulation Engine</span>
        </div>
        <p className="leading-relaxed">
          This explorer employs a deterministic high-dimensional simulation engine calibrated against the benchmark distributions and screening cutoffs of the Nature Communications 2025 paper. Input genotypes deterministically evaluate corresponding latent coordinates, multi-tier funnel survival, and cellular pathway weights.
        </p>
      </div>
    </div>
  );
};
