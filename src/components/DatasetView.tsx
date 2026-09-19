import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Dna, 
  Layers, 
  Info, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  Activity,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, ZAxis, Cell } from 'recharts';
import { CELL_LINE_RECORDS, CONDITION_DRUG_PAIRS, DATASET_SUMMARY_STATS } from '../data/cellLineDatabase';
import { CellLineRecord, ConditionDrugPair, ResponseClass } from '../types';

export const DatasetView: React.FC = () => {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCancerType, setSelectedCancerType] = useState<string>('all');
  const [selectedResponse, setSelectedResponse] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof CellLineRecord>('auc');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Selected cell line for modal detail
  const [selectedCellLine, setSelectedCellLine] = useState<CellLineRecord | null>(null);

  // Selected Condition-Drug Pair for Fig 1d inspection
  const [selectedPair, setSelectedPair] = useState<ConditionDrugPair | null>(CONDITION_DRUG_PAIRS[0]);

  // Unique cancer types for filter
  const cancerTypes = useMemo(() => {
    const types = new Set(CELL_LINE_RECORDS.map(c => c.cancerType));
    return ['all', ...Array.from(types)];
  }, []);

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    return CELL_LINE_RECORDS.filter(record => {
      const matchSearch = 
        record.cellLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.compound.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.keyMutations.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCancer = selectedCancerType === 'all' || record.cancerType === selectedCancerType;
      const matchResponse = selectedResponse === 'all' || record.responseClass === selectedResponse;
      return matchSearch && matchCancer && matchResponse;
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
  }, [searchTerm, selectedCancerType, selectedResponse, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof CellLineRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // 2D Projection Scatter data for Figure 1d
  const scatterConditionPoints = CONDITION_DRUG_PAIRS.map(p => ({
    x: p.conditionCoord[0],
    y: p.conditionCoord[1],
    name: `${p.cellLine} (Condition)`,
    type: 'condition',
    auc: p.auc,
    pair: p
  }));

  const scatterDrugPoints = CONDITION_DRUG_PAIRS.map(p => ({
    x: p.drugCoord[0],
    y: p.drugCoord[1],
    name: `${p.compound} (Drug)`,
    type: 'drug',
    auc: p.auc,
    pair: p
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* HEADER */}
      <div className="border-b border-[#162032] pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <Database className="w-3.5 h-3.5" />
          <span>Curated Pharmacogenomic Datasets & Cell Lines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
          DATASET & CELL LINES
        </h1>
        <p className="text-xs text-[#9AA4B2] mt-1">
          High-throughput cell line response data, genomic alteration profiles, and contrastive condition-drug pair embeddings from GDSC, CTRP, and ChEMBL.
        </p>
      </div>

      {/* PAPER REPORTED DATASET SPECIFICATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#9AA4B2]">
            <span>Chemical VAE Pretraining</span>
            <span className="text-cyan-400 font-bold">ChEMBL 33</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {DATASET_SUMMARY_STATS.chemicalVaeUniqueSmiles}
          </div>
          <p className="text-[11px] text-[#9AA4B2] leading-snug">
            Unique SMILES structures (Training: {DATASET_SUMMARY_STATS.chemicalVaeTraining} • Validation: {DATASET_SUMMARY_STATS.chemicalVaeValidation}).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#9AA4B2]">
            <span>Cell-Line-Centric Response</span>
            <span className="text-purple-400 font-bold">GDSC / CTRP</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {DATASET_SUMMARY_STATS.cellLineCentricResponsePairs}
          </div>
          <p className="text-[11px] text-[#9AA4B2] leading-snug">
            Validated drug-response pairs across {DATASET_SUMMARY_STATS.cellLineCentricResponseLines} cell lines and {DATASET_SUMMARY_STATS.cellLineCentricResponseCompounds} antineoplastic compounds.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#070B12] border border-[#162032] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#9AA4B2]">
            <span>Drug-Centric Diffusion Set</span>
            <span className="text-emerald-400 font-bold">Nature Comms</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {DATASET_SUMMARY_STATS.drugCentricDiffusionPairs}
          </div>
          <p className="text-[11px] text-[#9AA4B2] leading-snug">
            Conditioned pairs spanning {DATASET_SUMMARY_STATS.drugCentricDiffusionLines} cell lines and {DATASET_SUMMARY_STATS.drugCentricDiffusionCompounds} compounds.
          </p>
        </div>
      </div>

      {/* FIGURE 1d: CONDITION-DRUG PAIR VISUALIZATION */}
      <div className="p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#162032] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Condition–Drug Pair Latent Manifold (Paper Figure 1d)</span>
            </h3>
            <p className="text-[11px] text-[#9AA4B2] mt-0.5">
              Contrastive joint embedding space where condition representation (Cell Line) and drug representation (Compound) align by predicted response sensitivity.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300 self-start sm:self-auto">
            Interactive Contrastive Space
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Scatter Chart (2D Latent Projection) */}
          <div className="lg:col-span-8 bg-[#030509] p-4 rounded-xl border border-[#162032]">
            <div className="flex items-center justify-between text-[11px] font-mono mb-2 text-[#9AA4B2]">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                  <span>Condition Encoder Projection (Cell Line)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
                  <span>Chemical VAE Projection (Drug)</span>
                </span>
              </div>
              <span>Click point to inspect</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Latent Dim 1" 
                    stroke="#475569" 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    label={{ value: 'Shared Latent Dimension 1', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Latent Dim 2" 
                    stroke="#475569" 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    label={{ value: 'Shared Latent Dimension 2', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3', stroke: '#334155' }}
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#070B12] border border-[#162032] p-2.5 rounded-lg shadow-xl text-[11px] font-mono space-y-1">
                          <p className="text-white font-bold">{data.name}</p>
                          <p className="text-cyan-400">Response: {data.pair.responseClass}</p>
                          <p className="text-slate-300">Measured AUC: {data.auc.toFixed(2)}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter 
                    name="Condition" 
                    data={scatterConditionPoints} 
                    fill="#38bdf8"
                    onClick={(entry: any) => setSelectedPair(entry?.pair || entry?.payload?.pair)}
                    className="cursor-pointer"
                  >
                    {scatterConditionPoints.map((entry, index) => (
                      <Cell 
                        key={`cell-c-${index}`} 
                        fill={selectedPair?.id === entry.pair.id ? '#38bdf8' : '#0284c7'} 
                        stroke={selectedPair?.id === entry.pair.id ? '#ffffff' : 'none'}
                        strokeWidth={2}
                      />
                    ))}
                  </Scatter>
                  <Scatter 
                    name="Drug" 
                    data={scatterDrugPoints} 
                    fill="#c084fc"
                    onClick={(entry: any) => setSelectedPair(entry?.pair || entry?.payload?.pair)}
                    className="cursor-pointer"
                  >
                    {scatterDrugPoints.map((entry, index) => (
                      <Cell 
                        key={`cell-d-${index}`} 
                        fill={selectedPair?.id === entry.pair.id ? '#c084fc' : '#7e22ce'} 
                        stroke={selectedPair?.id === entry.pair.id ? '#ffffff' : 'none'}
                        strokeWidth={2}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inspection Panel for Selected Condition-Drug Pair */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-[#030509] border border-[#162032] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#162032]">
              <span className="text-[#9AA4B2]">Selected Condition-Drug Pair</span>
              <span className="text-purple-300 font-bold">{selectedPair?.id}</span>
            </div>

            {selectedPair ? (
              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Cell Line (Condition)</span>
                  <div className="text-white font-bold text-sm">{selectedPair.cellLine}</div>
                  <span className="text-[10px] text-cyan-400">{selectedPair.cancerType} carcinoma</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Evaluated Compound</span>
                  <div className="text-purple-300 font-bold text-sm">{selectedPair.compound}</div>
                </div>

                <div className="p-2 rounded bg-[#070B12] border border-[#162032] flex items-center justify-between">
                  <span className="text-slate-400">Response Category:</span>
                  <span className="font-bold text-white px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40">
                    {selectedPair.responseClass}
                  </span>
                </div>

                <div className="p-2 rounded bg-[#070B12] border border-[#162032] flex items-center justify-between">
                  <span className="text-slate-400">Measured Area Under Curve:</span>
                  <span className="font-bold text-cyan-300">
                    AUC = {selectedPair.auc.toFixed(2)}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 pt-1 leading-relaxed">
                  Notice how sensitive pairs (AUC ≤ 0.6) cluster tightly together in the negative quadrant, enabling the diffusion model to steer trajectories toward this therapeutic subspace.
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Select any point on the scatter plot to inspect pair coordinates.</p>
            )}
          </div>
        </div>
      </div>

      {/* CELL LINE DATA TABLE WITH SEARCH, FILTER, SORT & PAGINATION */}
      <div className="p-5 rounded-2xl bg-[#070B12] border border-[#162032] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#162032] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
              <Dna className="w-4 h-4 text-cyan-400" />
              <span>Cancer Cell Line Repository ({filteredRecords.length} lines)</span>
            </h3>
            <p className="text-[11px] text-[#9AA4B2] mt-0.5">
              Click any cell line to view complete molecular alterations, sensitivity curve, and drug interaction profile.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search cell line, gene, drug..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#030509] border border-[#162032] text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Filter Cancer Type */}
            <select
              value={selectedCancerType}
              onChange={(e) => {
                setSelectedCancerType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#030509] border border-[#162032] text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Cancer Types</option>
              {cancerTypes.filter(t => t !== 'all').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Filter Response Class */}
            <select
              value={selectedResponse}
              onChange={(e) => {
                setSelectedResponse(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#030509] border border-[#162032] text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Response Classes</option>
              <option value="Very Sensitive">Very Sensitive</option>
              <option value="Sensitive">Sensitive</option>
              <option value="Moderate">Moderate</option>
              <option value="Resistant">Resistant</option>
              <option value="Very Resistant">Very Resistant</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#162032] text-[10px] text-slate-400 uppercase tracking-wider bg-[#030509]">
                <th onClick={() => handleSort('cellLine')} className="p-3 cursor-pointer hover:text-white">
                  <div className="flex items-center space-x-1">
                    <span>Cell Line</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th onClick={() => handleSort('cancerType')} className="p-3 cursor-pointer hover:text-white">
                  <div className="flex items-center space-x-1">
                    <span>Cancer Type</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th onClick={() => handleSort('responseClass')} className="p-3 cursor-pointer hover:text-white">
                  <div className="flex items-center space-x-1">
                    <span>Response Class</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th onClick={() => handleSort('auc')} className="p-3 cursor-pointer hover:text-white">
                  <div className="flex items-center space-x-1">
                    <span>AUC</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th onClick={() => handleSort('compound')} className="p-3 cursor-pointer hover:text-white">
                  <div className="flex items-center space-x-1">
                    <span>Compound</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th onClick={() => handleSort('mutationCount')} className="p-3 cursor-pointer hover:text-white text-center">
                  <span>Mutation Count</span>
                </th>
                <th onClick={() => handleSort('cnaCount')} className="p-3 cursor-pointer hover:text-white text-center">
                  <span>CNA Count</span>
                </th>
                <th onClick={() => handleSort('cndCount')} className="p-3 cursor-pointer hover:text-white text-center">
                  <span>CND Count</span>
                </th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162032]">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record) => (
                  <tr 
                    key={record.id}
                    onClick={() => setSelectedCellLine(record)}
                    className="hover:bg-[#0B101A] transition-colors cursor-pointer group"
                  >
                    <td className="p-3 font-bold text-white group-hover:text-cyan-300">
                      {record.cellLine}
                    </td>
                    <td className="p-3 text-[#9AA4B2]">
                      {record.cancerType}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        record.responseClass === 'Very Sensitive' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40' :
                        record.responseClass === 'Sensitive' ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40' :
                        record.responseClass === 'Moderate' ? 'bg-blue-950/70 text-blue-300 border border-blue-500/40' :
                        record.responseClass === 'Resistant' ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40' :
                        'bg-red-950/70 text-red-300 border border-red-500/40'
                      }`}>
                        {record.responseClass}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-cyan-300">
                      {record.auc.toFixed(2)}
                    </td>
                    <td className="p-3 text-purple-300">
                      {record.compound}
                    </td>
                    <td className="p-3 text-center text-slate-300">
                      {record.mutationCount}
                    </td>
                    <td className="p-3 text-center text-slate-300">
                      {record.cnaCount}
                    </td>
                    <td className="p-3 text-center text-slate-300">
                      {record.cndCount}
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCellLine(record);
                        }}
                        className="px-2 py-1 rounded bg-[#030509] hover:bg-cyan-950 text-cyan-400 hover:text-cyan-200 border border-[#162032] text-[10px] cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-slate-500 font-mono">
                    No cell lines found matching search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between pt-2 text-xs font-mono text-[#9AA4B2]">
          <span>Page {currentPage} of {totalPages} ({filteredRecords.length} records)</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-[#030509] border border-[#162032] text-slate-300 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-[#030509] border border-[#162032] text-slate-300 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CELL LINE DETAIL MODAL */}
      {selectedCellLine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020409]/80 backdrop-blur-md">
          <div className="bg-[#070B12] border border-[#162032] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#162032] pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Cell Line Dossier</span>
                <h3 className="text-xl font-bold font-mono text-white flex items-center space-x-2">
                  <span>{selectedCellLine.cellLine}</span>
                  <span className="text-xs text-purple-300 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40">
                    {selectedCellLine.cancerType}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedCellLine(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#0B101A]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#9AA4B2] leading-relaxed">
              {selectedCellLine.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#030509] border border-[#162032]">
                <span className="text-[10px] text-slate-500">Response Class</span>
                <div className="font-bold text-white mt-0.5">{selectedCellLine.responseClass}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#030509] border border-[#162032]">
                <span className="text-[10px] text-slate-500">Measured AUC</span>
                <div className="font-bold text-cyan-300 mt-0.5">{selectedCellLine.auc.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#030509] border border-[#162032]">
                <span className="text-[10px] text-slate-500">Mutations</span>
                <div className="font-bold text-white mt-0.5">{selectedCellLine.mutationCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#030509] border border-[#162032]">
                <span className="text-[10px] text-slate-500">CNA / CND</span>
                <div className="font-bold text-white mt-0.5">{selectedCellLine.cnaCount} / {selectedCellLine.cndCount}</div>
              </div>
            </div>

            {/* Key Alterations */}
            <div className="space-y-1.5 font-mono text-xs">
              <span className="text-[10px] text-slate-400 uppercase">Key Genetic Alterations</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCellLine.keyMutations.map((m, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-[#030509] text-cyan-300 border border-[#162032] text-xs">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#162032] flex justify-end">
              <button
                onClick={() => setSelectedCellLine(null)}
                className="px-4 py-2 rounded-lg bg-[#0B101A] hover:bg-[#121826] text-white font-mono text-xs border border-[#162032] cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
