import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, Cpu, CheckCircle2, Sparkles } from 'lucide-react';
import { GeneticAlteration, ResponseClass } from '../types';

interface PipelineTransitionModalProps {
  isOpen: boolean;
  alterations: GeneticAlteration[];
  responseClass: ResponseClass;
  onComplete: () => void;
}

const TRANSITION_STEPS = [
  { id: 1, text: 'Reading genetic alterations...', duration: 600 },
  { id: 2, text: 'Constructing genotype representation across 718 clinical genes...', duration: 750 },
  { id: 3, text: 'Loading response condition vector (Target: Cell sensitivity)...', duration: 650 },
  { id: 4, text: 'Preparing condition encoder and NeST subsystem hierarchy...', duration: 700 },
];

export const PipelineTransitionModal: React.FC<PipelineTransitionModalProps> = ({
  isOpen,
  alterations,
  responseClass,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(10);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(10);
      return;
    }

    let timer: NodeJS.Timeout;
    const runSteps = (index: number) => {
      if (index >= TRANSITION_STEPS.length) {
        setProgress(100);
        timer = setTimeout(() => {
          onComplete();
        }, 500);
        return;
      }

      setCurrentStepIndex(index);
      setProgress(Math.round(((index + 1) / TRANSITION_STEPS.length) * 90));

      timer = setTimeout(() => {
        runSteps(index + 1);
      }, TRANSITION_STEPS[index].duration);
    };

    runSteps(0);

    return () => clearTimeout(timer);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl px-4"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-xl bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden"
        >
          {/* Neon decorative background glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Dna className="w-6 h-6 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>G2D-Diff Generative Pipeline</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Initializing G2D-Diff
              </h2>
            </div>
          </div>

          {/* Genomic Summary Pill */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-6">
            <div className="flex flex-wrap items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Genetic alterations:</span>
                <span className="font-mono text-cyan-300 font-semibold px-2 py-0.5 bg-cyan-950/60 rounded border border-cyan-800">
                  {alterations.length} Detected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Response target:</span>
                <span className="font-mono text-purple-300 font-semibold px-2 py-0.5 bg-purple-950/60 rounded border border-purple-800">
                  {responseClass}
                </span>
              </div>
            </div>

            {/* Gene tags */}
            <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-slate-800/80">
              {alterations.map(a => (
                <span
                  key={a.id}
                  className="font-mono text-[11px] px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-700/70"
                >
                  <strong className="text-cyan-400">{a.gene}</strong> ({a.alterationType}: {a.value})
                </span>
              ))}
            </div>
          </div>

          {/* Sequential Status Log */}
          <div className="space-y-2.5 mb-6">
            {TRANSITION_STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 text-xs font-mono p-2 rounded-lg transition-all duration-300 ${
                    isCurrent
                      ? 'bg-cyan-950/50 border border-cyan-500/40 text-cyan-200'
                      : isDone
                      ? 'text-emerald-400/90'
                      : 'text-slate-600'
                  }`}
                >
                  <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                  <span className={isCurrent ? 'font-semibold' : ''}>
                    {step.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Pipeline Dispatch</span>
              <span className="text-cyan-400">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
