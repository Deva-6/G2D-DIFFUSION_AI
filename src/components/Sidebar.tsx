import React from 'react';
import { 
  Home, 
  Sparkles, 
  Database,
  Activity,
  FlaskConical,
  LineChart,
  Network,
  History, 
  BookOpen, 
  Info, 
  Dna, 
  AlertTriangle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isGenerating?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isGenerating = false
}) => {
  const NAV_ITEMS: Array<{ id: AppView; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'generate', label: 'GENERATE', icon: Sparkles, badge: isGenerating ? 'Active' : undefined },
    { id: 'dataset', label: 'DATASET & CELL LINES', icon: Database },
    { id: 'history', label: 'HISTORY', icon: History },
    { id: 'research_method', label: 'RESEARCH METHOD', icon: BookOpen },
    { id: 'about', label: 'ABOUT', icon: Info },
  ];

  return (
    <aside className="w-64 bg-[#030509] border-r border-[#162032] flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 select-none z-20 font-sans">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#162032]">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 text-left w-full group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-900/50 via-[#070B12] to-cyan-900/40 border border-purple-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.25)] group-hover:border-cyan-400/60 transition-all">
              <Dna className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-tight text-white text-base">G2D-Diff</span>
                <span className="text-[9px] font-mono px-1 py-0.2 bg-purple-950/60 border border-purple-500/40 text-purple-300 rounded">
                  2025
                </span>
              </div>
              <p className="text-[10px] text-[#9AA4B2] font-mono leading-tight">
                Genotype-to-Drug Diffusion
              </p>
            </div>
          </button>

          {/* Prototype / Simulation Mode Pill */}
          <div className="mt-3 px-2 py-1 rounded bg-[#070B12] border border-[#162032] flex items-center justify-between text-[10px] font-mono">
            <span className="flex items-center space-x-1.5 text-purple-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>SIMULATION MODE</span>
            </span>
            <span className="text-[9px] text-cyan-400/80">Nature Comms</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-2.5 space-y-0.5 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-thin">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0B101A] border border-purple-500/50 text-white shadow-[0_0_14px_rgba(168,85,247,0.18)] font-semibold'
                    : 'text-[#9AA4B2] hover:text-white hover:bg-[#070B12] border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Safety Disclaimer */}
      <div className="p-3 border-t border-[#162032] bg-[#020409]">
        <div className="p-2.5 rounded-lg bg-[#070B12] border border-amber-500/30 text-[10px] space-y-1">
          <div className="flex items-center space-x-1.5 text-amber-400 font-mono font-semibold">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span>RESEARCH PROTOTYPE</span>
          </div>
          <p className="text-[#9AA4B2] leading-relaxed text-[10px]">
            Not a clinical diagnosis or approved treatment. Experimental validation required.
          </p>
          <div className="pt-0.5 flex items-center justify-between text-[9px] text-slate-500 font-mono">
            <span className="text-purple-400/90">G2D-Diff</span>
            <span className="text-cyan-400/80">Interactive Prototype</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
