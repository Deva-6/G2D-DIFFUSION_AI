import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  BarChart2,
  Sliders,
  Eye,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { MolecularCandidate } from '../types';
import { MoleculeRenderer } from './MoleculeRenderer';
import { CandidateDetailModal } from './CandidateDetailModal';

interface MoleculesViewProps {
  candidates: MolecularCandidate[];
  onOpenCandidateModal?: (candidate: MolecularCandidate) => void;
}

type DisplayMode = 'cards' | 'table' | 'distributions';

export const MoleculesView: React.FC<MoleculesViewProps> = ({
  candidates,
  onOpenCandidateModal
}) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'passed' | 'lipinski'>('all');
  const [sortField, setSortField] = useState<keyof MolecularCandidate>('qed');
  const [sortAsc, setSortAsc] = useState(false);
  const [copiedSmiles, setCopiedSmiles] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [modalCandidate, setModalCandidate] = useState<MolecularCandidate | null>(null);

  // Filter & Sort
  const filteredCandidates = useMemo(() => {
    return candidates.filter(cand => {
      const matchSearch = 
        cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.smiles.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.targetGene.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.primaryPathwayTarget.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchFilter = 
        selectedFilter === 'all' ? true :
        selectedFilter === 'passed' ? cand.passedFilters :
        cand.passesLipinski;

      return matchSearch && matchFilter;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [candidates, searchTerm, selectedFilter, sortField, sortAsc]);

  const handleCopy = (smiles: string) => {
    navigator.clipboard.writeText(smiles);
    setCopiedSmiles(smiles);
    setTimeout(() => setCopiedSmiles(null), 2000);
  };

  const handleInspect = (candidate: MolecularCandidate) => {
    if (onOpenCandidateModal) {
      onOpenCandidateModal(candidate);
    } else {
      setModalCandidate(candidate);
    }
  };

  const handleToggleCompare = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter(item => item !== id));
    } else {
      if (selectedForComparison.length >= 3) {
        alert('You can compare up to 3 candidate molecules simultaneously.');
        return;
      }
      setSelectedForComparison([...selectedForComparison, id]);
    }
  };

  const exportCSV = () => {
    const headers = ['ID,Name,SMILES,Formula,MW,QED,SAS,LogP,TanimotoMax,RetrosynthesisDepth,TargetGene,Pathway,PassedFilters\n'];
    const rows = filteredCandidates.map(c => 
      `"${c.id}","${c.name}","${c.smiles}","${c.formula}",${c.molecularWeight},${c.qed},${c.sas},${c.logP},${c.tanimotoMax},${c.retrosynthesisDepth},"${c.targetGene}","${c.primaryPathwayTarget}",${c.passedFilters}`
    );
    const blob = new Blob([...headers, ...rows.map(r => r + '\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `g2d_diff_research_candidates_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Distribution chart data
  const qedDistribution = useMemo(() => {
    const bins = [
      { bin: '<0.70', count: 0 },
      { bin: '0.70-0.75', count: 0 },
      { bin: '0.75-0.80', count: 0 },
      { bin: '0.80-0.85', count: 0 },
      { bin: '0.85-0.90', count: 0 },
      { bin: '>0.90', count: 0 }
    ];
    candidates.forEach(c => {
      if (c.qed < 0.70) bins[0].count++;
      else if (c.qed < 0.75) bins[1].count++;
      else if (c.qed < 0.80) bins[2].count++;
      else if (c.qed < 0.85) bins[3].count++;
      else if (c.qed < 0.90) bins[4].count++;
      else bins[5].count++;
    });
    return bins;
  }, [candidates]);

  const sasDistribution = useMemo(() => {
    const bins = [
      { bin: '<2.5', count: 0 },
      { bin: '2.5-3.5', count: 0 },
      { bin: '3.5-4.5', count: 0 },
      { bin: '4.5-5.5', count: 0 },
      { bin: '>5.5', count: 0 }
    ];
    candidates.forEach(c => {
      if (c.sas < 2.5) bins[0].count++;
      else if (c.sas < 3.5) bins[1].count++;
      else if (c.sas < 4.5) bins[2].count++;
      else if (c.sas < 5.5) bins[3].count++;
      else bins[4].count++;
    });
    return bins;
  }, [candidates]);

  // Comparison comparison chart data
  const comparisonChartData = useMemo(() => {
    const selected = candidates.filter(c => selectedForComparison.includes(c.id));
    return [
      {
        metric: 'QED (x10)',
        ...Object.fromEntries(selected.map(c => [c.name, parseFloat((c.qed * 10).toFixed(2))]))
      },
      {
        metric: 'SAS (Synthesizability)',
        ...Object.fromEntries(selected.map(c => [c.name, c.sas]))
      },
      {
        metric: 'Max Tanimoto (x10)',
        ...Object.fromEntries(selected.map(c => [c.name, parseFloat((c.tanimotoMax * 10).toFixed(2))]))
      },
      {
        metric: 'Retro Steps',
        ...Object.fromEntries(selected.map(c => [c.name, c.retrosynthesisDepth]))
      }
    ];
  }, [candidates, selectedForComparison]);

  const candidateColors = ['#06b6d4', '#a855f7', '#10b981'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* HEADER */}
      <div className="border-b border-[#162032] pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Chemical VAE Decoded Molecular Space</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            GENERATED RESEARCH CANDIDATES REPOSITORY
          </h1>
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 rounded-lg bg-[#070B12] hover:bg-[#0B101A] border border-cyan-500/40 text-cyan-300 hover:text-white font-mono text-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Dataset</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-[#9AA4B2] mt-1">
          Explore in-silico conditioned candidate molecules decoded from the chemical VAE continuous latent space. Click any candidate to open its full preclinical research dossier.
        </p>
      </div>

      {/* VIEW CONTROLS & SEARCH BAR */}
      <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search candidate name, SMILES, target gene..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#030509] border border-[#162032] text-white text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-[#030509] p-1 rounded-lg border border-[#162032]">
          <button
            onClick={() => setDisplayMode('cards')}
            className={`px-3 py-1 rounded text-xs flex items-center space-x-1 cursor-pointer transition-all ${
              displayMode === 'cards'
                ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setDisplayMode('table')}
            className={`px-3 py-1 rounded text-xs flex items-center space-x-1 cursor-pointer transition-all ${
              displayMode === 'table'
                ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-3 h-3" />
            <span>Table</span>
          </button>
          <button
            onClick={() => setDisplayMode('distributions')}
            className={`px-3 py-1 rounded text-xs flex items-center space-x-1 cursor-pointer transition-all ${
              displayMode === 'distributions'
                ? 'bg-purple-950/70 border border-purple-500/40 text-purple-200 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>Distributions</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-purple-950/60 border-purple-500/60 text-purple-200 font-bold'
                : 'bg-[#030509] border-[#162032] text-slate-400 hover:text-white'
            }`}
          >
            All ({candidates.length})
          </button>
          <button
            onClick={() => setSelectedFilter('passed')}
            className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
              selectedFilter === 'passed'
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-bold'
                : 'bg-[#030509] border-[#162032] text-slate-400 hover:text-white'
            }`}
          >
            Passed ({candidates.filter(c => c.passedFilters).length})
          </button>
          <button
            onClick={() => setSelectedFilter('lipinski')}
            className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
              selectedFilter === 'lipinski'
                ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200 font-bold'
                : 'bg-[#030509] border-[#162032] text-slate-400 hover:text-white'
            }`}
          >
            Lipinski Compliant ({candidates.filter(c => c.passesLipinski).length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: CARDS GALLERY */}
      {/* ======================================================== */}
      {displayMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map((c) => {
            const isComparing = selectedForComparison.includes(c.id);
            return (
              <div
                key={c.id}
                className={`p-5 rounded-2xl bg-[#070B12] border transition-all flex flex-col justify-between ${
                  isComparing ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'border-[#162032] hover:border-cyan-500/50'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-[#162032] pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">{c.id}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#030509] border border-[#162032] text-slate-300">
                        {c.formula}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      c.passedFilters 
                        ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
                    }`}>
                      {c.passedFilters ? 'Passed Filters' : 'Flagged'}
                    </span>
                  </div>

                  {/* Candidate Name & Target */}
                  <div className="mt-2.5">
                    <h3 className="text-sm font-bold text-white font-mono">{c.name}</h3>
                    <div className="text-[11px] font-mono text-purple-300 mt-0.5">
                      Target: {c.targetGene} • {c.primaryPathwayTarget}
                    </div>
                  </div>

                  {/* 2D Molecular Topology Display */}
                  <div 
                    onClick={() => handleInspect(c)}
                    className="mt-3 bg-[#030509] p-3 rounded-xl border border-[#162032] flex justify-center cursor-pointer hover:border-cyan-500/40 transition-colors group relative"
                    title="Click to view full dossier"
                  >
                    <MoleculeRenderer
                      candidate={c}
                      width={220}
                      height={140}
                    />
                    <div className="absolute inset-0 bg-cyan-950/0 group-hover:bg-cyan-950/20 rounded-xl transition-all flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-[#070B12]/90 border border-cyan-500/50 px-2 py-1 rounded text-[10px] text-cyan-300 font-mono transition-opacity flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Inspect Dossier</span>
                      </span>
                    </div>
                  </div>

                  {/* Chemical Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-xs">
                    <div className="p-2 rounded-lg bg-[#030509] border border-[#162032]">
                      <span className="text-[10px] text-slate-500 block">QED Drug-likeness</span>
                      <span className="text-cyan-300 font-bold">{c.qed.toFixed(2)}</span>
                      <span className="text-[9px] text-slate-500 block">&gt;0.80 target</span>
                    </div>

                    <div className="p-2 rounded-lg bg-[#030509] border border-[#162032]">
                      <span className="text-[10px] text-slate-500 block">SAS Synthesizability</span>
                      <span className="text-purple-300 font-bold">{c.sas.toFixed(2)}</span>
                      <span className="text-[9px] text-slate-500 block">&lt;4.56 target</span>
                    </div>

                    <div className="p-2 rounded-lg bg-[#030509] border border-[#162032]">
                      <span className="text-[10px] text-slate-500 block">Max Tanimoto</span>
                      <span className="text-emerald-300 font-bold">{c.tanimotoMax.toFixed(2)}</span>
                      <span className="text-[9px] text-slate-500 block">&lt;0.25 target</span>
                    </div>
                  </div>

                  {/* SMILES Snippet */}
                  <div className="mt-3 p-2 rounded-lg bg-[#030509] border border-[#162032] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 truncate max-w-[200px]" title={c.smiles}>
                      {c.smiles}
                    </span>
                    <button
                      onClick={() => handleCopy(c.smiles)}
                      className="p-1 text-slate-400 hover:text-cyan-300 ml-1 cursor-pointer"
                      title="Copy SMILES"
                    >
                      {copiedSmiles === c.smiles ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-[#162032] flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleInspect(c)}
                      className="px-2.5 py-1 rounded text-[11px] bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:text-white cursor-pointer transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Dossier</span>
                    </button>
                    <button
                      onClick={() => handleToggleCompare(c.id)}
                      className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer transition-colors ${
                        isComparing
                          ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold'
                          : 'bg-[#030509] border-[#162032] text-slate-400 hover:text-white'
                      }`}
                    >
                      {isComparing ? 'Comparing' : '+ Compare'}
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-500">
                    MW: {c.molecularWeight.toFixed(1)} g/mol
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: DETAILED TABLE */}
      {/* ======================================================== */}
      {displayMode === 'table' && (
        <div className="p-5 rounded-2xl bg-[#070B12] border border-[#162032] overflow-x-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#162032] text-slate-400 text-[11px]">
                <th className="p-2.5">ID & Name</th>
                <th className="p-2.5">Target Gene</th>
                <th className="p-2.5">Formula</th>
                <th className="p-2.5">MW (g/mol)</th>
                <th className="p-2.5">QED</th>
                <th className="p-2.5">SAS</th>
                <th className="p-2.5">LogP</th>
                <th className="p-2.5">Max Tan</th>
                <th className="p-2.5">Retro Steps</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162032]/60">
              {filteredCandidates.map(c => {
                const isComparing = selectedForComparison.includes(c.id);
                return (
                  <tr key={c.id} className="hover:bg-[#0B101A] transition-colors">
                    <td className="p-2.5">
                      <span className="font-bold text-cyan-300 block">{c.id}</span>
                      <span className="text-white text-xs block truncate max-w-[140px]">{c.name}</span>
                    </td>
                    <td className="p-2.5 font-bold text-purple-300">{c.targetGene}</td>
                    <td className="p-2.5 text-slate-300">{c.formula}</td>
                    <td className="p-2.5 text-white">{c.molecularWeight.toFixed(1)}</td>
                    <td className="p-2.5 font-bold text-cyan-300">{c.qed.toFixed(2)}</td>
                    <td className="p-2.5 font-bold text-purple-300">{c.sas.toFixed(2)}</td>
                    <td className="p-2.5 text-slate-300">{c.logP.toFixed(2)}</td>
                    <td className="p-2.5 text-emerald-300">{c.tanimotoMax.toFixed(2)}</td>
                    <td className="p-2.5 text-slate-300">{c.retrosynthesisDepth}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.passedFilters 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}>
                        {c.passedFilters ? 'PASSED' : 'FLAGGED'}
                      </span>
                    </td>
                    <td className="p-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleInspect(c)}
                          className="px-2 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] cursor-pointer"
                        >
                          Dossier
                        </button>
                        <button
                          onClick={() => handleToggleCompare(c.id)}
                          className={`px-2 py-1 rounded text-[10px] border cursor-pointer ${
                            isComparing
                              ? 'bg-purple-950 border-purple-500 text-purple-200'
                              : 'bg-[#030509] border-[#162032] text-slate-400 hover:text-white'
                          }`}
                        >
                          {isComparing ? 'Comparing' : '+ Compare'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: PROPERTY DISTRIBUTIONS & CHARTS */}
      {/* ======================================================== */}
      {displayMode === 'distributions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* QED vs SAS Scatter */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-[#162032] pb-2 text-xs">
                <span className="font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>QED vs Synthetic Accessibility (SAS)</span>
                </span>
                <span className="text-[10px] text-slate-500">Target: QED &ge; 0.8, SAS &le; 4.56</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162032" />
                    <XAxis type="number" dataKey="sas" name="SAS" domain={[2, 6]} stroke="#475569" fontSize={10} label={{ value: 'SAS (Lower = Easier) →', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#64748b' }} />
                    <YAxis type="number" dataKey="qed" name="QED" domain={[0.5, 1.0]} stroke="#475569" fontSize={10} label={{ value: 'QED →', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
                    <ReferenceLine x={4.56} stroke="#f43f5e" strokeDasharray="3 3" />
                    <ReferenceLine y={0.80} stroke="#10b981" strokeDasharray="3 3" />
                    <Tooltip 
                      content={({ payload }) => {
                        if (!payload || !payload[0]) return null;
                        const pt = payload[0].payload;
                        return (
                          <div className="p-2 bg-[#030509] border border-[#162032] rounded text-[10px] font-mono space-y-0.5">
                            <span className="font-bold text-white">{pt.name}</span>
                            <div className="text-cyan-300">QED: {pt.qed}</div>
                            <div className="text-purple-300">SAS: {pt.sas}</div>
                          </div>
                        );
                      }}
                    />
                    <Scatter 
                      data={candidates.map(c => ({
                        sas: c.sas,
                        qed: c.qed,
                        name: c.name,
                        candidate: c
                      }))} 
                      fill="#06b6d4" 
                      onClick={(e: any) => {
                        const cand = e?.candidate || e?.payload?.candidate;
                        if (cand) handleInspect(cand);
                      }}
                      className="cursor-pointer"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* QED Histogram */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-[#162032] pb-2 text-xs">
                <span className="font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>QED Drug-likeness Distribution</span>
                </span>
                <span className="text-[10px] text-slate-500">Binned Frequencies</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qedDistribution} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162032" vertical={false} />
                    <XAxis dataKey="bin" stroke="#475569" fontSize={10} fontFamily="monospace" />
                    <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" />
                    <Tooltip contentStyle={{ backgroundColor: '#070B12', borderColor: '#162032', fontSize: '10px' }} />
                    <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} name="Candidates Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARISON DRAWER WITH VISUAL CHART */}
      {selectedForComparison.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#070B12] border border-purple-500/50 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-[#162032] pb-2 text-xs">
            <div className="flex items-center space-x-2 text-purple-300 font-bold">
              <Layers className="w-4 h-4" />
              <span>Multi-Molecule Head-to-Head Comparison ({selectedForComparison.length} selected)</span>
            </div>
            <button
              onClick={() => setSelectedForComparison([])}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Clear Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedForComparison.map((id, index) => {
              const cand = candidates.find(c => c.id === id);
              if (!cand) return null;
              return (
                <div key={cand.id} className="p-3.5 rounded-xl bg-[#030509] border border-[#162032] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: candidateColors[index] }} />
                      <span>{cand.id}: {cand.name}</span>
                    </span>
                    <button
                      onClick={() => handleToggleCompare(cand.id)}
                      className="text-slate-500 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex justify-center bg-[#070B12] p-2 rounded border border-[#162032]">
                    <MoleculeRenderer candidate={cand} width={180} height={110} />
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400"><span>Target:</span> <span className="text-purple-300">{cand.targetGene}</span></div>
                    <div className="flex justify-between text-slate-400"><span>QED:</span> <span className="text-cyan-300 font-bold">{cand.qed.toFixed(2)}</span></div>
                    <div className="flex justify-between text-slate-400"><span>SAS:</span> <span className="text-white font-bold">{cand.sas.toFixed(2)}</span></div>
                    <div className="flex justify-between text-slate-400"><span>Tanimoto:</span> <span className="text-emerald-300 font-bold">{cand.tanimotoMax.toFixed(2)}</span></div>
                    <div className="flex justify-between text-slate-400"><span>Retro Depth:</span> <span className="text-white font-bold">{cand.retrosynthesisDepth} steps</span></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SIDE-BY-SIDE METRICS BAR CHART */}
          <div className="p-4 rounded-xl bg-[#030509] border border-[#162032] space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Comparative Multi-Metric Profiling
            </span>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#162032" vertical={false} />
                  <XAxis dataKey="metric" stroke="#475569" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" />
                  <Tooltip contentStyle={{ backgroundColor: '#070B12', borderColor: '#162032', fontSize: '10px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  {selectedForComparison.map((id, index) => {
                    const cand = candidates.find(c => c.id === id);
                    if (!cand) return null;
                    return (
                      <Bar key={cand.id} dataKey={cand.name} fill={candidateColors[index]} radius={[3, 3, 0, 0]} />
                    );
                  })}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE DETAIL DOSSIER MODAL */}
      {modalCandidate && (
        <CandidateDetailModal
          candidate={modalCandidate}
          onClose={() => setModalCandidate(null)}
        />
      )}
    </div>
  );
};
