import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Play, Pause, RotateCcw, ArrowRight, CheckCircle2, Sliders, Activity } from 'lucide-react';
import { createInitialDiffusionParticles } from '../../services/generationService';
import { DiffusionParticle } from '../../types';

interface Stage03DiffusionProps {
  guidanceStrength: number;
  onChangeGuidanceStrength: (val: number) => void;
  onProceedToChemicalVAE: () => void;
}

const DIFFUSION_MILESTONES = [0, 20, 50, 100, 150, 200, 250, 300];

const DIFFUSION_MESSAGES = [
  'Initializing molecular latent space...',
  'Sampling latent noise: z_T ~ N(0, I)...',
  'Applying genotype condition vector c...',
  'Denoising molecular representation with U-Net...',
  'Condition influence increasing via classifier-free guidance...',
  'Refining molecular manifold and stereochemistry...',
  'Diffusion process complete. z_0 sampled.'
];

export const Stage03Diffusion: React.FC<Stage03DiffusionProps> = ({
  guidanceStrength,
  onChangeGuidanceStrength,
  onProceedToChemicalVAE
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [statusMessageIndex, setStatusMessageIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<DiffusionParticle[]>(createInitialDiffusionParticles(90));
  const animationFrameRef = useRef<number | null>(null);

  // Status message tracker
  useEffect(() => {
    const fraction = currentStep / 300;
    const msgIdx = Math.min(
      Math.floor(fraction * DIFFUSION_MESSAGES.length),
      DIFFUSION_MESSAGES.length - 1
    );
    setStatusMessageIndex(msgIdx);

    if (currentStep >= 300) {
      setIsFinished(true);
      setIsPlaying(false);
    }
  }, [currentStep]);

  // Stepping timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 300) {
          clearInterval(interval);
          return 300;
        }
        return Math.min(prev + 5, 300);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle coordinate grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Compute interpolation factor t from 0 (noise) to 1 (structured latent manifold)
      const t = currentStep / 300;
      const particles = particlesRef.current;

      // Draw inter-particle latent manifold connecting webs when t > 0.4
      if (t > 0.35) {
        const connectionAlpha = Math.min((t - 0.35) * 1.5, 0.45);
        ctx.lineWidth = 0.8;

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            if (particles[i].clusterId === particles[j].clusterId) {
              const p1x = particles[i].noiseX + (particles[i].targetX - particles[i].noiseX) * t;
              const p1y = particles[i].noiseY + (particles[i].targetY - particles[i].noiseY) * t;
              const p2x = particles[j].noiseX + (particles[j].targetX - particles[j].noiseX) * t;
              const p2y = particles[j].noiseY + (particles[j].targetY - particles[j].noiseY) * t;

              const distSq = (p1x - p2x) ** 2 + (p1y - p2y) ** 2;
              if (distSq < 3200) {
                ctx.strokeStyle = `rgba(6, 182, 212, ${connectionAlpha * (1 - Math.sqrt(distSq) / 60)})`;
                ctx.beginPath();
                ctx.moveTo(p1x, p1y);
                ctx.lineTo(p2x, p2y);
                ctx.stroke();
              }
            }
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        // Current position interpolated between noise and target manifold
        const curX = p.noiseX + (p.targetX - p.noiseX) * t;
        const curY = p.noiseY + (p.targetY - p.noiseY) * t;

        // Jitter decreases as denoising converges
        const jitterMagnitude = (1 - t) * 4;
        const jx = curX + (Math.random() - 0.5) * jitterMagnitude;
        const jy = curY + (Math.random() - 0.5) * jitterMagnitude;

        // Particle glow
        ctx.beginPath();
        ctx.arc(jx, jy, p.size * (1 + t * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();

        // Outer aura
        ctx.beginPath();
        ctx.arc(jx, jy, p.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.15 * t;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentStep]);

  const handleRestart = () => {
    particlesRef.current = createInitialDiffusionParticles(90);
    setCurrentStep(0);
    setIsFinished(false);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pipeline Phase 03</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            03 — Conditional Latent Diffusion
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            The diffusion model progressively transforms noisy molecular latent representations into structured molecular representations conditioned on the cancer genotype and desired response.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl self-start">
          <div className="flex items-center space-x-2">
            {isFinished ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            )}
            <span className="text-xs font-mono text-slate-200">
              {DIFFUSION_MESSAGES[statusMessageIndex]}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Display */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Canvas Header info */}
        <div className="flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-slate-300 font-semibold">
              Molecular Latent Manifold (z ∈ ℝ⁵⁶)
            </span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-cyan-400 font-bold text-sm">
              Step: {currentStep} / 300
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/60">
              Guidance (s = {guidanceStrength.toFixed(1)})
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              Denoising Mode: Simulated DDIM
            </span>
          </div>
        </div>

        {/* Diffusion Canvas */}
        <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800/90 overflow-hidden flex items-center justify-center shadow-inner">
          <canvas
            ref={canvasRef}
            width={580}
            height={320}
            className="w-full h-full object-contain pointer-events-none"
          />

          {/* Denoising Stage Watermark Tag */}
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-400">
            {currentStep < 50
              ? 'Phase: Isotropic Gaussian Noise (Step 0 - 50)'
              : currentStep < 180
              ? 'Phase: Coarse Manifold Assembly (Step 50 - 180)'
              : currentStep < 280
              ? 'Phase: Chemical Feature Specialization (Step 180 - 280)'
              : 'Phase: Fully Coherent Latent Vectors (Step 300)'}
          </div>

          {/* Milestone markers on canvas */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-1">
            {DIFFUSION_MILESTONES.map((m) => (
              <span
                key={m}
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  currentStep >= m
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-950 text-slate-600 border border-slate-800'
                }`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar with glowing indicator */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">Denoising Progress: 0 → 300</span>
            <span className="text-cyan-400 font-bold">{Math.round((currentStep / 300) * 100)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: `${(currentStep / 300) * 100}%` }}
            />
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause Denoising</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Resume</span>
                </>
              )}
            </button>

            <button
              onClick={handleRestart}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Step 0</span>
            </button>
          </div>

          {/* Guidance strength interactive slider */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="flex items-center space-x-1 text-xs font-mono text-purple-300 whitespace-nowrap">
              <Sliders className="w-3.5 h-3.5" />
              <span>Guidance Strength:</span>
              <strong className="text-white">{guidanceStrength.toFixed(1)}</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.5"
              value={guidanceStrength}
              onChange={(e) => onChangeGuidanceStrength(parseFloat(e.target.value))}
              className="w-28 sm:w-36 accent-purple-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Classifier-Free Guidance Scientific Note */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs space-y-1.5 font-mono">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-semibold text-cyan-300">Classifier-Free Diffusion Equation:</span>
          <span className="text-[10px] text-slate-500">Nature Communications 2025</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          <code className="text-purple-300">ε_θ(z_t, t, c) = ε_θ(z_t, t, ∅) + s · [ε_θ(z_t, t, c) - ε_θ(z_t, t, ∅)]</code>
          <br />
          Where <code className="text-cyan-300">c</code> is the genotype condition vector, <code className="text-slate-300">∅</code> is the null unconditional token, and <code className="text-purple-300">s</code> is the guidance scale amplifying cancer-target specific molecular trajectories.
        </p>
      </div>

      {/* Completion & Next Stage Trigger */}
      <div className="pt-2">
        {isFinished ? (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-semibold">✓ Latent molecular representation generated (300/300 steps)</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400/80">
                Ready for Chemical VAE Decoding
              </span>
            </div>

            <button
              onClick={onProceedToChemicalVAE}
              className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
            >
              <span>DECODE MOLECULAR CANDIDATES (CHEMICAL VAE)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCurrentStep(300)}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-mono transition-colors"
          >
            Fast-forward to Step 300 Completion →
          </button>
        )}
      </div>
    </div>
  );
};
