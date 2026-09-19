import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  Layers,
  Cpu
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceArea, 
  ReferenceLine 
} from 'recharts';
import { createInitialDiffusionParticles } from '../services/generationService';
import { DiffusionParticle } from '../types';

interface DiffusionLabViewProps {
  initialGuidanceStrength?: number;
}

export const DiffusionLabView: React.FC<DiffusionLabViewProps> = ({
  initialGuidanceStrength = 2.5
}) => {
  // Diffusion state
  const [totalSteps, setTotalSteps] = useState<number>(300);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [guidanceStrength, setGuidanceStrength] = useState<number>(initialGuidanceStrength);

  // Particles ref & animation state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particles, setParticles] = useState<DiffusionParticle[]>(() => 
    createInitialDiffusionParticles(95)
  );

  // Play / Pause timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps) {
            setIsPlaying(false);
            return totalSteps;
          }
          return prev + Math.max(1, Math.round(totalSteps / 100));
        });
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalSteps]);

  // Render particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear dark canvas
    ctx.fillStyle = '#030509';
    ctx.fillRect(0, 0, width, height);

    // Draw subtle coordinate grid
    ctx.strokeStyle = 'rgba(22, 32, 50, 0.7)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const progress = Math.min(1, currentStep / totalSteps);
    // Non-linear transition: noise dominates until step 100, then clusters coalesce
    const smoothProgress = Math.pow(progress, 1.4);

    // Draw inter-particle pseudo-bonds when close in structured state
    if (progress > 0.4) {
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          if (particles[i].clusterId === particles[j].clusterId) {
            const xi = particles[i].noiseX + (particles[i].targetX - particles[i].noiseX) * smoothProgress;
            const yi = particles[i].noiseY + (particles[i].targetY - particles[i].noiseY) * smoothProgress;
            const xj = particles[j].noiseX + (particles[j].targetX - particles[j].noiseX) * smoothProgress;
            const yj = particles[j].noiseY + (particles[j].targetY - particles[j].noiseY) * smoothProgress;
            const dist = Math.hypot(xi - xj, yi - yj);

            if (dist < 32) {
              const alpha = Math.min(0.7, (progress - 0.4) * 1.5 * (1 - dist / 32));
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

    // Draw particles
    particles.forEach((p) => {
      const curX = p.noiseX + (p.targetX - p.noiseX) * smoothProgress;
      const curY = p.noiseY + (p.targetY - p.noiseY) * smoothProgress;

      ctx.beginPath();
      ctx.arc(curX, curY, p.size, 0, Math.PI * 2);

      if (progress < 0.25) {
        // Disconnected noisy state (cyan/blue/white)
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.fill();
      } else {
        // Coherent molecular manifold state
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = progress * 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

  }, [currentStep, totalSteps, particles]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setParticles(createInitialDiffusionParticles(95));
  };

  // Predicted AUC trajectory as a function of diffusion step
  // As diffusion denoises, the predicted response converges from unstructured (AUC ~0.75) to target (AUC ~0.41 Sensitive)
  const aucCurveData = [
    { step: 0, auc: 0.76, std: 0.22 },
    { step: Math.round(totalSteps * 0.1), auc: 0.74, std: 0.19 },
    { step: Math.round(totalSteps * 0.2), auc: 0.71, std: 0.16 },
    { step: Math.round(totalSteps * 0.35), auc: 0.65, std: 0.13 },
    { step: Math.round(totalSteps * 0.5), auc: 0.58, std: 0.10 },
    { step: Math.round(totalSteps * 0.65), auc: 0.51, std: 0.08 },
    { step: Math.round(totalSteps * 0.8), auc: 0.45, std: 0.05 },
    { step: totalSteps, auc: 0.41, std: 0.04 }
  ];

  // Interpolated current predicted AUC
  const currentAUC = parseFloat(
    (0.76 - (0.76 - 0.41) * Math.pow(Math.min(1, currentStep / totalSteps), 1.2)).toFixed(2)
  );

  const currentResponseClass = 
    currentAUC <= 0.4 ? 'Very Sensitive' :
    currentAUC <= 0.6 ? 'Sensitive' :
    currentAUC <= 0.8 ? 'Moderate' :
    currentAUC <= 1.0 ? 'Resistant' : 'Very Resistant';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* HEADER */}
      <div className="border-b border-[#162032] pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
          <Activity className="w-3.5 h-3.5" />
          <span>Continuous Latent Molecular Generation</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            DIFFUSION LAB
          </h1>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#070B12] border border-purple-500/40 text-purple-300 self-start sm:self-auto">
            Diffusion Process — Interactive Simulation
          </span>
        </div>
        <p className="text-xs text-[#9AA4B2] mt-1">
          Observe reverse-time diffusion transforming isotropic Gaussian noise into structured molecular manifold representations guided by genotype conditions.
        </p>
      </div>

      {/* DIFFUSION PROGRESSION TIMELINE STRIP */}
      <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032]">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
          <span>REVERSE DIFFUSION STEP TIMELINE</span>
          <span className="text-cyan-400 font-bold">t = {totalSteps - currentStep} → 0</span>
        </div>
        <div className="grid grid-cols-8 gap-1.5 font-mono text-center text-[10px]">
          {[
            { label: 'Initial Noise', step: 0 },
            { label: 't = 0', step: Math.round(totalSteps * 0.16) },
            { label: 't = 50', step: Math.round(totalSteps * 0.33) },
            { label: 't = 100', step: Math.round(totalSteps * 0.5) },
            { label: 't = 150', step: Math.round(totalSteps * 0.66) },
            { label: 't = 200', step: Math.round(totalSteps * 0.75) },
            { label: 't = 250', step: Math.round(totalSteps * 0.9) },
            { label: 'Generated z₀', step: totalSteps }
          ].map((item, idx) => {
            const isPassed = currentStep >= item.step;
            const isCurrent = Math.abs(currentStep - item.step) < totalSteps / 8;
            return (
              <div 
                key={idx}
                className={`p-2 rounded-lg border transition-all ${
                  isCurrent ? 'bg-[#0B101A] border-purple-500 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]' :
                  isPassed ? 'bg-[#070B12] border-cyan-500/40 text-cyan-300' :
                  'bg-[#030509] border-[#162032] text-slate-600'
                }`}
              >
                <div className="truncate">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: CANVAS & PROCESS CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Latent Space Canvas (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-4">
          <div className="flex items-center justify-between border-b border-[#162032] pb-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold">Latent Space Manifold Projection (ℝ⁵⁶)</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="text-slate-400">Denoising Progress:</span>
              <span className="text-purple-300 font-bold">{currentStep} / {totalSteps}</span>
            </div>
          </div>

          {/* Canvas */}
          <div className="w-full h-80 rounded-xl overflow-hidden border border-[#162032] relative bg-[#030509]">
            <canvas 
              ref={canvasRef} 
              width={640} 
              height={320} 
              className="w-full h-full object-cover"
            />
            {/* Step Overlay Pill */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#030509]/80 border border-[#162032] text-[11px] font-mono text-cyan-300 backdrop-blur-sm">
              Step {currentStep} • {currentStep === 0 ? 'Noise Initialized' : currentStep === totalSteps ? 'Convergence Manifold' : 'Denoising Phase'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-[#9AA4B2]">
              <span>Reverse SDE Iteration</span>
              <span>{((currentStep / totalSteps) * 100).toFixed(0)}% Completed</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#030509] border border-[#162032] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 transition-all duration-100"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono text-xs font-semibold flex items-center space-x-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Diffusion' : currentStep >= totalSteps ? 'Restart Diffusion' : 'Start Diffusion'}</span>
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-lg bg-[#030509] hover:bg-[#0B101A] border border-[#162032] text-[#9AA4B2] hover:text-white font-mono text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Step Selection Buttons [ 50 / 100 / 200 / 300 ] */}
            <div className="flex items-center space-x-1 font-mono text-xs">
              <span className="text-[11px] text-slate-400 mr-1.5">Diffusion Steps:</span>
              {[50, 100, 200, 300].map((steps) => (
                <button
                  key={steps}
                  onClick={() => {
                    setTotalSteps(steps);
                    setCurrentStep(0);
                    setIsPlaying(false);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer ${
                    totalSteps === steps
                      ? 'bg-purple-950 border-purple-500/60 text-purple-200 font-bold'
                      : 'bg-[#030509] border-[#162032] text-slate-400 hover:text-white'
                  }`}
                >
                  {steps}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Guidance, Live Process Log & Math (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Classifier-Free Guidance Slider */}
          <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#162032]">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold">Guidance Strength (s)</span>
              </div>
              <span className="text-cyan-300 font-bold text-sm">{guidanceStrength.toFixed(1)}</span>
            </div>

            <input 
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={guidanceStrength}
              onChange={(e) => setGuidanceStrength(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1.0 (Unconditioned)</span>
              <span>2.5 (Paper Optimal)</span>
              <span>5.0 (Strict Steering)</span>
            </div>
            <p className="text-[10px] text-[#9AA4B2] leading-relaxed">
              In classifier-free guidance, scale <code className="text-purple-300">s</code> blends conditioned and unconditioned score estimates: <code className="text-cyan-300">ε_guided = ε_uncond + s · (ε_cond - ε_uncond)</code>.
            </p>
          </div>

          {/* Live Process Log */}
          <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] space-y-2.5 font-mono text-xs">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Live Diffusion Execution Log</span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                <span>Initializing molecular latent space (z_T ~ N(0, I))</span>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep >= totalSteps * 0.2 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                <span>Applying genotype condition (c ∈ ℝ⁶⁴)</span>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep >= totalSteps * 0.4 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                <span>Denoising molecular representation</span>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep >= totalSteps * 0.7 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                <span>Conditioning latent representation</span>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep >= totalSteps ? 'text-cyan-300 font-bold' : 'text-slate-600'}`}>
                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                <span>Generating candidate latent vector (z₀ ∈ ℝ⁵⁶)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 9: PREDICTED AUC VISUALIZATION DURING DIFFUSION */}
      <div className="p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#162032] pb-3 font-mono">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>PREDICTED AUC DURING DIFFUSION</span>
            </h3>
            <p className="text-[11px] text-[#9AA4B2] mt-0.5">
              Simulated pharmacogenomic sensitivity trajectory converging toward target response as reverse diffusion denoises.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 self-start sm:self-auto">
            Illustrative / Demo prediction
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Recharts AUC Trajectory (8 cols) */}
          <div className="lg:col-span-8 h-64 w-full bg-[#030509] p-4 rounded-xl border border-[#162032]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aucCurveData} margin={{ top: 10, right: 15, bottom: 20, left: 10 }}>
                {/* Background colored AUC regions */}
                <ReferenceArea y1={0} y2={0.4} fill="#065f46" fillOpacity={0.15} label={{ value: 'Very Sensitive (≤0.4)', fill: '#34d399', fontSize: 9, position: 'insideTopLeft' }} />
                <ReferenceArea y1={0.4} y2={0.6} fill="#0891b2" fillOpacity={0.12} label={{ value: 'Sensitive (0.4-0.6)', fill: '#38bdf8', fontSize: 9, position: 'insideTopLeft' }} />
                <ReferenceArea y1={0.6} y2={0.8} fill="#1e3a8a" fillOpacity={0.10} label={{ value: 'Moderate (0.6-0.8)', fill: '#60a5fa', fontSize: 9, position: 'insideTopLeft' }} />
                <ReferenceArea y1={0.8} y2={1.0} fill="#78350f" fillOpacity={0.12} label={{ value: 'Resistant (0.8-1.0)', fill: '#fbbf24', fontSize: 9, position: 'insideTopLeft' }} />
                <ReferenceArea y1={1.0} y2={1.2} fill="#7f1d1d" fillOpacity={0.15} label={{ value: 'Very Resistant (>1.0)', fill: '#f87171', fontSize: 9, position: 'insideTopLeft' }} />

                <XAxis 
                  dataKey="step" 
                  stroke="#475569" 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                  label={{ value: 'Diffusion Step', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis 
                  domain={[0, 1.2]} 
                  stroke="#475569" 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                  label={{ value: 'Predicted AUC', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                />
                <Tooltip 
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#070B12] border border-[#162032] p-2 rounded text-[11px] font-mono">
                        <span className="text-slate-400">Step {d.step}: </span>
                        <span className="text-cyan-300 font-bold">AUC {d.auc}</span>
                      </div>
                    );
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="auc" 
                  stroke="#a855f7" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: '#c084fc' }} 
                  activeDot={{ r: 5 }}
                />
                {/* Current step line */}
                <ReferenceLine x={currentStep} stroke="#38bdf8" strokeDasharray="3 3" label={{ value: 'Current', fill: '#38bdf8', fontSize: 9 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Current Predicted Response Metric Card (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-xl bg-[#030509] border border-[#162032] space-y-3 font-mono text-xs">
            <span className="text-[10px] text-[#9AA4B2] uppercase">Live Convergence State</span>
            <div>
              <div className="text-xs text-slate-400">Current Predicted AUC:</div>
              <div className="text-3xl font-extrabold text-cyan-300 mt-0.5">{currentAUC}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#070B12] border border-[#162032] space-y-1">
              <span className="text-[10px] text-slate-400">Response Category:</span>
              <div className="text-sm font-bold text-purple-300">{currentResponseClass}</div>
              <p className="text-[10px] text-[#9AA4B2] leading-snug">
                {currentAUC <= 0.4 ? 'Sub-0.4 AUC marks cytotoxic cancer cell elimination.' :
                 currentAUC <= 0.6 ? 'Sensitive anti-proliferative response bracket.' :
                 'Intermediate cytostatic threshold.'}
              </p>
            </div>

            <div className="text-[10px] text-slate-500 pt-1 leading-relaxed">
              Simulated demonstration values illustrating classifier-free trajectory convergence towards desired tumor sensitivity.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
