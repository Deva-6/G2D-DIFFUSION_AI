import React from 'react';
import { 
  Check, 
  Dna, 
  Layers,
  Cpu, 
  LineChart,
  Activity,
  FlaskConical, 
  BarChart2,
  Filter, 
  Network, 
  Pill,
  ChevronRight
} from 'lucide-react';
import { PipelineStage } from '../types';

interface PipelineNavbarProps {
  currentStage: PipelineStage;
  completedStages: Set<PipelineStage>;
  onSelectStage: (stage: PipelineStage) => void;
}

const STAGES: Array<{
  id: PipelineStage;
  number: string;
  label: string;
  icon: React.ElementType;
}> = [
  { id: 'input', number: '01', label: 'INPUT', icon: Dna },
  { id: 'genotype', number: '02', label: 'GENOTYPE', icon: Layers },
  { id: 'condition_encoder', number: '03', label: 'CONDITION ENCODER', icon: Cpu },
  { id: 'response_context', number: '04', label: 'RESPONSE CONTEXT', icon: LineChart },
  { id: 'diffusion', number: '05', label: 'DIFFUSION', icon: Activity },
  { id: 'decoding', number: '06', label: 'DECODING', icon: FlaskConical },
  { id: 'molecular_analysis', number: '07', label: 'MOLECULAR ANALYSIS', icon: BarChart2 },
  { id: 'filtering', number: '08', label: 'FILTERING', icon: Filter },
  { id: 'pathway_insights', number: '09', label: 'BIOLOGICAL INSIGHTS', icon: Network },
  { id: 'results', number: '10', label: 'RESULTS', icon: Pill },
];

export const PipelineNavbar: React.FC<PipelineNavbarProps> = ({
  currentStage,
  completedStages,
  onSelectStage
}) => {
  return (
    <div className="w-full bg-[#030509]/95 backdrop-blur-md border-b border-[#162032] px-4 py-2.5 sticky top-0 z-30 font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-thin">
        <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-max py-0.5">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCurrent = currentStage === stage.id;
            const isCompleted = completedStages.has(stage.id);

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => onSelectStage(stage.id)}
                  className={`group relative flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0B101A] border border-purple-500/80 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                      : isCompleted
                      ? 'bg-[#070B12] hover:bg-[#0B101A] border border-cyan-500/40 text-cyan-200 hover:text-white'
                      : 'bg-[#030509] hover:bg-[#070B12] border border-[#162032] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {/* Status Indicator / Step Icon */}
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors ${
                      isCurrent
                        ? 'bg-purple-500 text-white shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                        : isCompleted
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60'
                        : 'bg-[#070B12] text-slate-500 border border-[#162032]'
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                    ) : (
                      <span>{stage.number}</span>
                    )}
                  </div>

                  <span className={`whitespace-nowrap text-[11px] ${isCurrent ? 'font-bold tracking-wide text-white' : ''}`}>
                    {stage.label}
                  </span>

                  {/* Pulsing indicator on current active stage */}
                  {isCurrent && (
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                    </span>
                  )}
                </button>

                {/* Pipeline Step Arrow */}
                {idx < STAGES.length - 1 && (
                  <ChevronRight
                    className={`w-3 h-3 flex-shrink-0 ${
                      completedStages.has(STAGES[idx + 1].id) || isCurrent
                        ? 'text-cyan-500/70'
                        : 'text-slate-700'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
