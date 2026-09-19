import React from 'react';
import { 
  BookOpen, 
  Dna, 
  Cpu, 
  Sparkles, 
  FlaskConical, 
  Filter, 
  Network, 
  ExternalLink,
  ShieldAlert,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const ResearchMethodView: React.FC = () => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Scientific Documentation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Research Methodology & Model Architecture
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed technical breakdown of the G2D-Diff framework based strictly on 
          <span className="text-cyan-300 font-semibold"> Nature Communications (2025)</span>.
        </p>
      </div>

      {/* SECTION 1: GENOTYPE-TO-DRUG VS TRADITIONAL VIRTUAL SCREENING */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Dna className="w-5 h-5 text-cyan-400" />
          <span>1. The Genotype-to-Drug Generative Paradigm</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Traditional computational drug discovery relies predominantly on <strong>Virtual Screening (VS)</strong> of fixed libraries (e.g., ZINC, Enamine) against a single crystallized protein target pocket. However, cancer is driven by heterogeneous networks of co-occurring mutations, copy number variations, and pathway crosstalk that frequently render single-target inhibitors ineffective due to secondary bypass mechanisms.
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>G2D-Diff</strong> fundamentally inverts this workflow: instead of testing existing chemical libraries against an isolated protein, it trains a <em>conditional generative diffusion model</em> directly on cell-wide genotype profiles. By conditioning on a patient's genetic alterations (mutations, amplifications, deletions across 718 clinical cancer genes) together with a target cellular response class (e.g., Very Sensitive), G2D-Diff synthesizes <strong>de-novo chemical structures</strong> tailored to the tumor’s systemic biological state.
        </p>
      </section>

      {/* SECTION 2: CONDITION ENCODER & NeST SUBSYSTEMS */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <span>2. Condition Encoder & NeST Subsystem Masking</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          The condition encoder converts discrete clinical alterations into continuous latent representations <code className="text-cyan-300 font-mono">c ∈ ℝ⁶⁴</code>. Rather than using an unconstrained fully-connected transformer that might hallucinate non-physical biological correlations, G2D-Diff incorporates the <strong>Nested Systems (NeST)</strong> hierarchy:
        </p>
        <ul className="space-y-2 text-xs text-slate-400 list-disc pl-5">
          <li>
            <strong className="text-slate-200">Gene Embeddings:</strong> Each gene alteration (point mutation, amplification, homozygous deletion, or neutral diploid) is mapped to a 128-dimensional dense token.
          </li>
          <li>
            <strong className="text-slate-200">NeST Subsystem Attention Masking:</strong> The self-attention matrix is constrained by biological subsystems (e.g., PI3K/AKT signaling, Cell Cycle checkpoints, DNA Damage Repair, Histone acetylation). Genes within the same functional subsystem attend strongly to each other, preserving known cellular wiring.
          </li>
          <li>
            <strong className="text-slate-200">Response Conditioning:</strong> Desired sensitivity level (Very Sensitive, Sensitive, Moderate, Resistant, Very Resistant) is fused via cross-attention to produce the final condition vector <code className="text-purple-300 font-mono">c</code>.
          </li>
        </ul>
      </section>

      {/* SECTION 3: CONDITIONAL LATENT DIFFUSION */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>3. Conditional Latent Diffusion Process</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Diffusion operates not directly on discrete graph adjacency matrices (which suffer from combinatorial explosions and gradient instability), but in the continuous latent manifold of a chemical autoencoder <code className="text-purple-300 font-mono">z ∈ ℝ⁵⁶</code>.
        </p>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300">
          {'Reverse Diffusion: z_{t-1} = 1/√α_t · (z_t - (1 - α_t)/√(1 - ᾱ_t) · ε_θ(z_t, t, c)) + σ_t · ε'}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          During inference, the model samples isotropic Gaussian noise <code className="text-slate-400 font-mono">z_T ~ N(0, I)</code> and executes <strong>300 denoising steps</strong> using classifier-free guidance with scale parameter <code className="text-purple-300 font-mono">s ∈ [1.0, 5.0]</code>.
        </p>
      </section>

      {/* SECTION 4: CHEMICAL VAE DECODER */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <FlaskConical className="w-5 h-5 text-emerald-400" />
          <span>4. Pretrained Chemical VAE Latent Decoder</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          The continuous denoised vector <code className="text-cyan-300 font-mono">z_0</code> is passed to an autoregressive bidirectional Gated Recurrent Unit (GRU) decoder pretrained on <strong>~1.58 million drug-like bioactive molecules</strong> from the ChEMBL and PubChem databases. The decoder outputs valid canonical SMILES strings that are parsed into 2D chemical structures.
        </p>
      </section>

      {/* SECTION 5: MULTI-TIER SCREENING CRITERIA */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Filter className="w-5 h-5 text-rose-400" />
          <span>5. Strict In-Silico Filtering Funnel</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          To ensure generated candidates are viable, drug-like, and synthetically tractable rather than theoretical artifacts, the paper establishes 6 strict filtering criteria:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold block">1. Maximum Tanimoto Similarity</span>
            <span className="text-slate-300 text-[11px]">&lt; 0.25 against training set</span>
            <p className="text-[10px] text-slate-500 font-sans mt-1">
              Guarantees the model has not memorized existing compounds and generated truly novel scaffolds.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold block">2. Quantitative Drug-Likeness (QED)</span>
            <span className="text-slate-300 text-[11px]">&gt; 0.80</span>
            <p className="text-[10px] text-slate-500 font-sans mt-1">
              Ensures high physicochemical drug-likeness based on molecular weight, polar surface area, and rotatable bonds.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold block">3. Synthetic Accessibility Score (SAS)</span>
            <span className="text-slate-300 text-[11px]">&lt; 4.56</span>
            <p className="text-[10px] text-slate-500 font-sans mt-1">
              Screening threshold ensuring organic chemists can realistically synthesize the molecule.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold block">4. Retrosynthesis Depth</span>
            <span className="text-slate-300 text-[11px]">&le; 4 reaction steps</span>
            <p className="text-[10px] text-slate-500 font-sans mt-1">
              Validated via AiZynthFinder using commercially available building blocks.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: TRAINING DATASETS & BENCHMARKS */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Network className="w-5 h-5 text-amber-400" />
          <span>6. Pharmacogenomic Training Data & Benchmarks</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          The G2D-Diff model was trained across two major pharmacogenomic consortia:
        </p>
        <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-5">
          <li><strong>GDSC (Genomics of Drug Sensitivity in Cancer):</strong> ~1,000 human cancer cell lines screened against 400+ anti-cancer agents.</li>
          <li><strong>CTRP (Cancer Therapeutics Response Portal):</strong> High-throughput viability screens across 860+ cancer cell lines and 481 compounds.</li>
        </ul>
        <p className="text-xs text-slate-400 leading-relaxed pt-1">
          Benchmarked against GAN-based, RL-based (Reinforcement Learning), and genetic algorithm molecular generators, G2D-Diff achieved superior balance of valid novelty, genotype condition fidelity, and synthetic accessibility.
        </p>
      </section>
    </div>
  );
};
