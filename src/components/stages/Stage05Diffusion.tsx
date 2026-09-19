import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sliders, 
  Sparkles, 
  LineChart,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ScatterChart,
  Scatter,
  Cell,
  ReferenceLine
} from 'recharts';
import { createInitialDiffusionParticles } from '../../services/generationService';
import { DiffusionParticle, ResponseClass } from '../../types';

interface Stage05DiffusionProps {
  guidanceStrength: number;
  onChangeGuidanceStrength: (val: number) => void;
  responseClass?: ResponseClass;
  onProceedToChemicalVAE: () => void;
  onBackToResponseContext?: () => void;
}

const DIFFUSION_MILESTONES = [0, 20, 50, 100, 150, 200, 250, 300];

const DYNAMIC_STATUS_MESSAGES = [
  'Initializing latent representation...',
  'Sampling stochastic noise: z_T ~ N(0, I)...',
  'Applying genotype conditioning signal c...',
  'Guiding molecular latent via classifier-free guidance...',
  'Reducing stochastic noise with reverse SDE diffusion...',
  'Approaching structured chemical representation...',
  'Candidate latent stabilized.'
];

export const Stage05Diffusion: React.FC<Stage05DiffusionProps> = ({
  guidanceStrength,
  onChangeGuidanceStrength,
  responseClass = 'Very Sensitive',
  onProceedToChemicalVAE,
  onBackToResponseContext
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<DiffusionParticle[]>(createInitialDiffusionParticles(95));

  // Determine active dynamic status message
  const statusMessage = useMemo(() => {
    const fraction = currentStep / 300;
    const idx = Math.min(
      Math.floor(fraction * DYNAMIC_STATUS_MESSAGES.length),
      DYNAMIC_STATUS_MESSAGES.length - 1
    );
    return DYNAMIC_STATUS_MESSAGES[idx];
  }, [currentStep]);

  // Stepping timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 300) {
          setIsFinished(true);
          setIsPlaying(false);
          return 300;
        }
        return Math.min(prev + 5, 300);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Particles Canvas Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Coordinate grid
    ctx.strokeStyle = 'rgba(22, 32, 50, 0.7)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const t = currentStep / 300;
    const particles = particlesRef.current;

    // Draw pseudo-bonds when structured
    if (t > 0.4) {
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          if (particles[i].clusterId === particles[j].clusterId) {
            const xi = particles[i].noiseX + (particles[i].targetX - particles[i].noiseX) * t;
            const yi = particles[i].noiseY + (particles[i].targetY - particles[i].noiseY) * t;
            const xj = particles[j].noiseX + (particles[j].targetX - particles[j].noiseX) * t;
            const yj = particles[j].noiseY + (particles[j].targetY - particles[j].noiseY) * t;
            const dist = Math.hypot(xi - xj, yi - yj);

            if (dist < 28) {
              const alpha = Math.min(0.6, (t - 0.4) * 1.5 * (1 - dist / 28));
              ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(xi, yi);
              ctx.lineTo(xj, yj);
              ctx.stroke();
            }
          }
        }
      }
    }

    // Render particles
    particles.forEach((p) => {
      const curX = p.noiseX + (p.targetX - p.noiseX) * t;
      const curY = p.noiseY + (p.targetY - p.noiseY) * t;

      ctx.beginPath();
      ctx.arc(curX, curY, p.size * (0.8 + t * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = t > 0.5 ? p.color : `rgba(148, 163, 184, ${0.4 + t * 0.4})`;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = t > 0.6 ? 6 : 0;
      ctx.fill();
    });
  }, [currentStep]);

  // 2D Latent Space Projection Points that evolve with currentStep
  const latentSpaceData = useMemo(() => {
    const t = currentStep / 300;
    // Generate 48 latent points forming 4 molecular candidate clusters
    const points = [];
    const clusterCenters = [
      { cx: -2.2, cy: 1.8, color: '#06b6d4', label: 'Candidate Cluster A (EGFR/Kinase)' },
      { cx: 2.1, cy: 2.0, color: '#a855f7', label: 'Candidate Cluster B (PI3K/Lipid)' },
      { cx: -1.5, cy: -2.0, color: '#3b82f6', label: 'Candidate Cluster C (HDAC/Epigenetic)' },
      { cx: 2.4, cy: -1.7, color: '#10b981', label: 'Candidate Cluster D (CDK/Cycle)' },
    ];

    for (let c = 0; c < clusterCenters.length; c++) {
      const center = clusterCenters[c];
      for (let i = 0; i < 12; i++) {
        // Pseudo-random deterministic noise
        const seed = (c * 12 + i + 1) * 97;
        const randX = Math.sin(seed) * 3.8;
        const randY = Math.cos(seed * 1.3) * 3.8;

        // Interpolate from pure noise to clustered center + small jitter
        const jitterX = Math.sin(seed * 2.1) * 0.45;
        const jitterY = Math.cos(seed * 3.7) * 0.45;
        const targetX = center.cx + jitterX;
        const targetY = center.cy + jitterY;

        const x = randX + (targetX - randX) * Math.pow(t, 1.2);
        const y = randY + (targetY - randY) * Math.pow(t, 1.2);

        points.push({
          x: parseFloat(x.toFixed(2)),
          y: parseFloat(y.toFixed(2)),
          cluster: center.label,
          color: t > 0.5 ? center.color : '#64748b'
        });
      }
    }
    return points;
  }, [currentStep]);

  // Response Trajectory During Generation (X: Step 0..300, Y: Predicted response score)
  const trajectoryData = useMemo(() => {
    const steps = [0, 20, 50, 100, 150, 200, 250, 300];
    return steps.map((s) => {
      const normS = s / 300;
      // Target score stabilizes as diffusion approaches step 300
      const uncertainty = Math.exp(-normS * 3.5) * 0.65;
      const baseScore = 0.88;
      const score = s <= currentStep ? parseFloat((baseScore - uncertainty * Math.cos(s * 0.1)).toFixed(3)) : null;
      const lower = score !== null ? parseFloat((Math.max(0.2, score - uncertainty)).toFixed(3)) : null;
      const upper = score !== null ? parseFloat((Math.min(1.0, score + uncertainty)).toFixed(3)) : null;

      return {
        step: s,
        score,
        lower,
        upper,
        isCurrent: Math.abs(s - currentStep) <= 25
      };
    });
  }, [currentStep]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setCurrentStep(0);
    setIsFinished(false);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#162032] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Pipeline Phase 05</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            05 — Latent Diffusion — Generating Candidate Molecular Latents
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            A conditional continuous diffusion process operating in the 56-dimensional latent space of the Chemical VAE. 
            Random noise is iteratively denoised conditioned on the tumor genotype and desired response class.
          </p>
        </div>

        {/* Live Step Badge */}
        <div className="flex items-center space-x-3 bg-[#070B12] border border-[#162032] px-3.5 py-2 rounded-xl self-start text-xs font-mono">
          <span className="text-slate-400">Diffusion Step:</span>
          <span className="font-bold text-cyan-300 font-mono text-sm">{currentStep} / 300</span>
          {isFinished ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          )}
        </div>
      </div>

      {/* FLOW BANNER: NOISE -> x_t -> DENOISING -> STRUCTURED LATENT -> MOLECULAR LATENT */}
      <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300 shadow-xl">
        <div className={`px-2.5 py-1 rounded-lg border ${currentStep < 50 ? 'border-purple-500/60 bg-purple-950/40 text-purple-200' : 'border-[#162032] bg-[#030509]'}`}>
          <span>NOISE (z_T ~ N(0, I))</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className={`px-2.5 py-1 rounded-lg border ${currentStep >= 50 && currentStep < 150 ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200' : 'border-[#162032] bg-[#030509]'}`}>
          <span>x_t (Transition States)</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className={`px-2.5 py-1 rounded-lg border ${currentStep >= 150 && currentStep < 250 ? 'border-blue-500/60 bg-blue-950/40 text-blue-200' : 'border-[#162032] bg-[#030509]'}`}>
          <span>DENOISING (Score Matching)</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className={`px-2.5 py-1 rounded-lg border ${currentStep >= 250 && currentStep < 300 ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200' : 'border-[#162032] bg-[#030509]'}`}>
          <span>STRUCTURED LATENT</span>
        </div>
        <span className="text-slate-600">→</span>
        <div className={`px-2.5 py-1 rounded-lg border ${currentStep === 300 ? 'border-emerald-500/80 bg-emerald-950/60 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-[#162032] bg-[#030509]'}`}>
          <span>MOLECULAR LATENT [z_0]</span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKBENCH: CANVAS + CONTROLS & LATENT GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL: ANIMATED PARTICLE DIFFUSION CANVAS */}
        <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reverse Diffusion Particle Canvas</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Step {currentStep} / 300</span>
            </div>

            {/* Dynamic Status Message */}
            <div className="p-2.5 rounded-xl bg-[#030509] border border-[#162032] text-xs font-mono text-slate-300 flex items-center space-x-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{statusMessage}</span>
            </div>

            {/* Canvas Box */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#162032] bg-[#030509]">
              <canvas
                ref={canvasRef}
                width={560}
                height={320}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-500 bg-[#070B12]/80 px-2 py-0.5 rounded border border-[#162032]">
                Reverse SDE Particle Trajectory
              </div>
            </div>
          </div>

          {/* Diffusion Controls & Slider */}
          <div className="space-y-3 pt-2">
            {/* Step Milestones */}
            <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-slate-400">
              {DIFFUSION_MILESTONES.map((step) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    currentStep === step
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                      : 'hover:text-white'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="0"
              max="300"
              value={currentStep}
              onChange={(e) => {
                setCurrentStep(parseInt(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full accent-cyan-400 bg-[#030509] h-2 rounded-lg cursor-pointer"
            />

            {/* Play, Pause, Reset Buttons & CFG Slider */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePlayPause}
                  className="px-3.5 py-1.5 rounded-lg bg-[#030509] border border-[#162032] hover:border-cyan-500/60 text-xs font-mono text-white flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isPlaying ? 'Pause' : 'Start'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg bg-[#030509] border border-[#162032] hover:border-slate-500 text-xs font-mono text-slate-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Classifier-Free Guidance Slider */}
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-slate-400">CFG (s):</span>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.5"
                  value={guidanceStrength}
                  onChange={(e) => onChangeGuidanceStrength(parseFloat(e.target.value))}
                  className="w-20 accent-purple-500 bg-[#030509] h-1.5 rounded cursor-pointer"
                />
                <span className="font-bold text-purple-400">{guidanceStrength.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: 2D LATENT SPACE & RESPONSE TRAJECTORY */}
        <div className="space-y-6">
          {/* SECTION 7: INTERACTIVE 2D LATENT-SPACE GRAPH */}
          <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>2D Latent Space Evolution</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Latent vectors evolving from random noise (t=0) to distinct candidate clusters (t=300)
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#030509] text-cyan-300 border border-cyan-500/30">
                Step {currentStep}
              </span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Latent Dim 1" 
                    domain={[-4, 4]} 
                    stroke="#475569" 
                    fontSize={10} 
                    fontFamily="monospace"
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Latent Dim 2" 
                    domain={[-4, 4]} 
                    stroke="#475569" 
                    fontSize={10} 
                    fontFamily="monospace"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || !payload[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="p-2 rounded bg-[#070B12] border border-[#162032] text-[11px] font-mono text-slate-200">
                          <div className="font-bold text-cyan-300">{data.cluster}</div>
                          <div>z = [{data.x}, {data.y}]</div>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={latentSpaceData}>
                    {latentSpaceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-[#162032]">
              <span>t=0: Uncorrelated Gaussian noise</span>
              <span className="text-cyan-400 font-semibold">t=300: 4 discrete chemical scaffolds</span>
            </div>
          </div>

          {/* SECTION 8: AUC / RESPONSE TRAJECTORY DURING DIFFUSION */}
          <div className="bg-[#070B12] border border-[#162032] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <LineChart className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Response Trajectory During Generation</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Predicted response-related score conditioned on {responseClass}
                </p>
              </div>
              <span className="text-[10px] font-mono text-amber-400/80">
                Demonstration / simulated trajectory
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={trajectoryData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <XAxis 
                    dataKey="step" 
                    stroke="#475569" 
                    fontSize={10} 
                    fontFamily="monospace" 
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    fontFamily="monospace" 
                    domain={[0.0, 1.0]} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#070B12', borderColor: '#162032', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} 
                  />
                  <ReferenceLine x={currentStep} stroke="#a855f7" strokeDasharray="3 3" label={{ value: 't', fill: '#a855f7', fontSize: 10 }} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#06b6d4" 
                    strokeWidth={2} 
                    dot={{ fill: '#06b6d4', r: 3 }}
                    connectNulls={false}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[10px] font-mono text-slate-500">
              Illustrative model-behavior visualization: high variance at step 0 narrows toward conditioned response attractor.
            </div>
          </div>
        </div>
      </div>

      {/* CONTINUOUS PIPELINE NAVIGATION */}
      <div className="pt-2 flex items-center justify-between">
        {onBackToResponseContext && (
          <button
            onClick={onBackToResponseContext}
            className="px-4 py-2.5 rounded-xl border border-[#162032] bg-[#070B12] hover:bg-[#0B101A] text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Drug Response Context</span>
          </button>
        )}

        <button
          onClick={onProceedToChemicalVAE}
          className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
        >
          <span>PROCEED TO CHEMICAL VAE DECODING</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
