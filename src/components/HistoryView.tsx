import React from 'react';
import { 
  History, 
  Trash2, 
  ArrowRight, 
  Download, 
  FileCode, 
  CheckCircle2, 
  Calendar,
  Layers,
  Dna
} from 'lucide-react';
import { GenerationRun } from '../types';

interface HistoryViewProps {
  history: GenerationRun[];
  onReloadRun: (run: GenerationRun) => void;
  onClearHistory: () => void;
  onNavigateGenerate: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onReloadRun,
  onClearHistory,
  onNavigateGenerate
}) => {
  const exportRunJSON = (run: GenerationRun) => {
    const blob = new Blob([JSON.stringify(run, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `G2D_Diff_Run_${run.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Archive</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Generation History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Saved generative diffusion runs, candidate screenings, and molecular profiles.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1.5 px-3 py-2 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/60 text-rose-300 rounded-xl text-xs font-medium transition-colors self-start"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Saved Generations Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Run the 7-stage generative diffusion pipeline and click "Save Run" at the Results stage to archive candidates.
          </p>
          <button
            onClick={onNavigateGenerate}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold inline-flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <span>Start New Generation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((run) => {
            const passedCount = run.candidates.filter(c => c.passedFilters).length;

            return (
              <div
                key={run.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="text-cyan-400 font-bold">{run.id}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(run.timestamp).toLocaleString()}</span>
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
                      Target: {run.responseClass}
                    </span>
                  </div>

                  {/* Alterations summary */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Genotype alterations:</span>
                    <div className="flex flex-wrap gap-1">
                      {run.alterations.map((a) => (
                        <span
                          key={a.id}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          {a.gene} ({a.alterationType})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-xs font-mono pt-1">
                    <span className="text-slate-400">
                      Generated: <strong className="text-white">{run.candidates.length}</strong>
                    </span>
                    <span className="text-emerald-400">
                      Passed: <strong>{passedCount}</strong>
                    </span>
                    <span className="text-slate-500">
                      Guidance: <strong>s={run.guidanceStrength.toFixed(1)}</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => exportRunJSON(run)}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Export Run JSON"
                  >
                    <FileCode className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onReloadRun(run)}
                    className="px-4 py-2.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer"
                  >
                    <span>Reopen Pipeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
