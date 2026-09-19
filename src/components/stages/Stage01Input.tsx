import React, { useState, useId } from 'react';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Dna, 
  Sparkles, 
  Sliders, 
  FileText,
  FileCode,
  Info
} from 'lucide-react';
import { GeneticAlteration, AlterationType, ResponseClass, GenotypeProfile } from '../../types';
import { CLINICAL_718_GENES, DEMO_PROFILES, CSV_EXAMPLE_TEMPLATE, JSON_EXAMPLE_TEMPLATE } from '../../data/clinicalGenes';

interface Stage01InputProps {
  alterations: GeneticAlteration[];
  onChangeAlterations: (alterations: GeneticAlteration[]) => void;
  responseClass: ResponseClass;
  onChangeResponseClass: (resClass: ResponseClass) => void;
  numCandidates: number;
  onChangeNumCandidates: (num: number) => void;
  guidanceStrength: number;
  onChangeGuidanceStrength: (val: number) => void;
  onStartGeneration: () => void;
}

const RESPONSE_CLASSES: Array<{
  id: ResponseClass;
  label: string;
  badgeColor: string;
  description: string;
}> = [
  { id: 'Very Sensitive', label: 'Very Sensitive', badgeColor: 'border-emerald-500/80 bg-emerald-950/40 text-emerald-300', description: 'Maximum cellular growth inhibition (Target IC50 < 0.1 μM)' },
  { id: 'Sensitive', label: 'Sensitive', badgeColor: 'border-cyan-500/80 bg-cyan-950/40 text-cyan-300', description: 'Potent therapeutic response in cancer cell models' },
  { id: 'Moderate', label: 'Moderate', badgeColor: 'border-blue-500/80 bg-blue-950/40 text-blue-300', description: 'Intermediate anti-proliferative response spectrum' },
  { id: 'Resistant', label: 'Resistant', badgeColor: 'border-amber-500/80 bg-amber-950/40 text-amber-300', description: 'Sub-lethal sensitivity condition for contrast analysis' },
  { id: 'Very Resistant', label: 'Very Resistant', badgeColor: 'border-rose-500/80 bg-rose-950/40 text-rose-300', description: 'Negative control response condition (resistance mode)' },
];

export const Stage01Input: React.FC<Stage01InputProps> = ({
  alterations,
  onChangeAlterations,
  responseClass,
  onChangeResponseClass,
  numCandidates,
  onChangeNumCandidates,
  guidanceStrength,
  onChangeGuidanceStrength,
  onStartGeneration,
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'upload' | 'demo'>('manual');
  const [geneInputError, setGeneInputError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const fileInputId = useId();

  // Add new row
  const handleAddRow = () => {
    const newAlt: GeneticAlteration = {
      id: `alt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      gene: 'TP53',
      alterationType: 'mutation',
      value: 'Missense'
    };
    onChangeAlterations([...alterations, newAlt]);
  };

  // Remove row
  const handleRemoveRow = (id: string) => {
    if (alterations.length <= 1) {
      setGeneInputError('At least one cancer genetic alteration is required.');
      return;
    }
    onChangeAlterations(alterations.filter(a => a.id !== id));
    setGeneInputError(null);
  };

  // Update row
  const handleUpdateRow = (id: string, field: keyof GeneticAlteration, val: string) => {
    onChangeAlterations(
      alterations.map(a => {
        if (a.id === id) {
          return { ...a, [field]: val };
        }
        return a;
      })
    );
    setGeneInputError(null);
  };

  // Select demo profile
  const handleSelectDemoProfile = (profile: GenotypeProfile) => {
    onChangeAlterations(profile.alterations.map(a => ({ ...a, id: `demo-${Date.now()}-${a.id}` })));
    onChangeResponseClass(profile.recommendedResponse);
    setUploadSuccessMessage(`Loaded ${profile.name} (${profile.alterations.length} alterations)`);
    setTimeout(() => setUploadSuccessMessage(null), 3000);
  };

  // Handle CSV / JSON File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mapped: GeneticAlteration[] = parsed.map((item, idx) => ({
              id: `upl-${Date.now()}-${idx}`,
              gene: String(item.gene || 'TP53').toUpperCase().trim(),
              alterationType: (['mutation', 'amplification', 'deletion', 'cna'].includes(item.alteration_type?.toLowerCase())
                ? item.alteration_type.toLowerCase()
                : 'mutation') as AlterationType,
              value: String(item.value || 'Detected')
            }));
            onChangeAlterations(mapped);
            setUploadSuccessMessage(`Successfully uploaded ${mapped.length} genetic alterations.`);
          } else {
            setGeneInputError('JSON file must contain an array of alteration objects.');
          }
        } else {
          // CSV Parsing
          const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
          const parsedAlts: GeneticAlteration[] = [];

          // Skip header if present
          const startIndex = lines[0].toLowerCase().includes('gene') ? 1 : 0;
          for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].split(',').map(p => p.trim());
            if (parts.length >= 2) {
              const gene = parts[0].toUpperCase();
              let altType: AlterationType = 'mutation';
              const rawType = parts[1].toLowerCase();
              if (rawType.includes('amp')) altType = 'amplification';
              else if (rawType.includes('del')) altType = 'deletion';
              else if (rawType.includes('cna') || rawType.includes('copy')) altType = 'cna';

              parsedAlts.push({
                id: `upl-csv-${Date.now()}-${i}`,
                gene,
                alterationType: altType,
                value: parts[2] || (altType === 'mutation' ? 'Pathogenic' : 'Altered')
              });
            }
          }

          if (parsedAlts.length > 0) {
            onChangeAlterations(parsedAlts);
            setUploadSuccessMessage(`Successfully imported ${parsedAlts.length} genetic alterations from CSV.`);
          } else {
            setGeneInputError('Could not find valid genetic alteration lines in CSV.');
          }
        }
      } catch (err) {
        setGeneInputError('Failed to parse uploaded file. Please verify CSV or JSON format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Download template
  const downloadTemplate = (format: 'csv' | 'json') => {
    const data = format === 'csv' ? CSV_EXAMPLE_TEMPLATE : JSON_EXAMPLE_TEMPLATE;
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `g2d_diff_genotype_template.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Validation checks
  const validateForm = () => {
    if (alterations.length === 0) {
      return 'Please provide at least one cancer genetic alteration.';
    }
    const genes = alterations.map(a => a.gene.trim().toUpperCase());
    const uniqueGenes = new Set(genes);
    if (uniqueGenes.size !== genes.length) {
      return 'Duplicate genes detected in alteration list. Each gene should be specified once.';
    }
    for (const alt of alterations) {
      if (!alt.gene || alt.gene.trim() === '') {
        return 'Gene names cannot be blank.';
      }
    }
    return null;
  };

  const validationError = geneInputError || validateForm();
  const isValid = !validationError;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title & Scientific Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Dna className="w-3.5 h-3.5" />
            <span>Pipeline Phase 01</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            01 — Define Cancer Genotype
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Input structured cancer genetic alterations across clinical cancer genes. The remaining genes across the 
            <span className="text-cyan-300 font-mono"> 718 clinical gene panel</span> are represented as unaltered diploid baseline by the condition encoder.
          </p>
        </div>

        {/* Input Method Switcher */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs font-medium self-start">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'manual' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manual Table
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'upload' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'demo' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Demo Profiles
          </button>
        </div>
      </div>

      {/* Upload Feedback */}
      {uploadSuccessMessage && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{uploadSuccessMessage}</span>
        </div>
      )}

      {/* METHOD A: MANUAL TABLE */}
      {activeTab === 'manual' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">Structured Mutation Matrix</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{alterations.length} alterations specified</span>
            </div>
            <button
              onClick={handleAddRow}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 rounded-lg text-xs font-medium transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Genetic Alteration</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Gene Symbol</th>
                  <th className="py-2.5 px-3">Alteration Type</th>
                  <th className="py-2.5 px-3">Value / Detail</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {alterations.map((alt) => (
                  <tr key={alt.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-2 px-3">
                      <div className="relative">
                        <input
                          type="text"
                          value={alt.gene}
                          onChange={(e) => handleUpdateRow(alt.id, 'gene', e.target.value.toUpperCase())}
                          placeholder="e.g. TP53"
                          className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300 uppercase outline-none focus:ring-1 focus:ring-cyan-500/30"
                          list="genes-list"
                        />
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <select
                        value={alt.alterationType}
                        onChange={(e) => handleUpdateRow(alt.id, 'alterationType', e.target.value as AlterationType)}
                        className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                      >
                        <option value="mutation">Mutation</option>
                        <option value="amplification">Amplification</option>
                        <option value="deletion">Deletion</option>
                        <option value="cna">Copy-number alteration</option>
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={alt.value}
                        onChange={(e) => handleUpdateRow(alt.id, 'value', e.target.value)}
                        placeholder="e.g. R175H or Copy number 4"
                        className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 outline-none"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => handleRemoveRow(alt.id)}
                        title="Remove alteration"
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <datalist id="genes-list">
            {CLINICAL_718_GENES.slice(0, 100).map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>
      )}

      {/* METHOD B: UPLOAD */}
      {activeTab === 'upload' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-8 text-center bg-slate-950/40 transition-colors">
            <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-3 animate-bounce" />
            <h3 className="text-base font-semibold text-white">Upload Alteration Matrix</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Drag and drop or select your structured <span className="text-cyan-300 font-mono">.csv</span> or{' '}
              <span className="text-cyan-300 font-mono">.json</span> genetic alteration file.
            </p>

            <div className="mt-4 flex justify-center">
              <label
                htmlFor={fileInputId}
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-900/30 transition-all inline-flex items-center space-x-2"
              >
                <span>Select File from Disk</span>
              </label>
              <input
                id={fileInputId}
                type="file"
                accept=".csv,.json,text/csv,application/json"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </div>
          </div>

          {/* Template Download Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-200">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Standard CSV Template</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">gene,alteration_type,value</p>
              </div>
              <button
                onClick={() => downloadTemplate('csv')}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-200">
                  <FileCode className="w-4 h-4 text-purple-400" />
                  <span>Standard JSON Template</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">[ {`"gene": "TP53", ...`} ]</p>
              </div>
              <button
                onClick={() => downloadTemplate('json')}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* METHOD C: DEMO PROFILES */}
      {activeTab === 'demo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Select a validated demonstration genotype profile from the study:</span>
            <span className="text-purple-400 font-mono text-[11px]">Nature Comms 2025 Benchmarks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_PROFILES.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleSelectDemoProfile(profile)}
                className="group relative bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                      {profile.cancerType.split(' ')[0]}
                    </span>
                    <span className="text-[11px] font-mono text-purple-300">
                      Target: {profile.recommendedResponse}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {profile.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {profile.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1">
                  {profile.alterations.map((a) => (
                    <span
                      key={a.id}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-700"
                    >
                      {a.gene} ({a.alterationType})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: RESPONSE CONDITION SELECTION */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Target Drug Response Condition</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Desired Cellular Response Class
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 max-w-3xl">
            The response condition specifies the desired drug-response class used by the conditional generation process.
            <span className="text-amber-400/90 font-medium"> Note:</span> This represents the targeted sensitivity tier for AI molecule synthesis, NOT a patient's clinical prognosis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {RESPONSE_CLASSES.map((rc) => {
            const isSelected = responseClass === rc.id;
            return (
              <button
                key={rc.id}
                onClick={() => onChangeResponseClass(rc.id)}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                  isSelected
                    ? `${rc.badgeColor} shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/50`
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {rc.label}
                    </span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                    {rc.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* GENERATION CONFIGURATION SLIDERS */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center text-xs font-medium text-slate-300 mb-1.5">
            <span className="flex items-center space-x-1.5">
              <span>Candidate Pool Size:</span>
              <span className="font-mono text-cyan-400 font-bold">{numCandidates} molecules</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Paper default: 12</span>
          </div>
          <div className="flex items-center space-x-2">
            {[6, 12, 24].map((num) => (
              <button
                key={num}
                onClick={() => onChangeNumCandidates(num)}
                className={`flex-1 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                  numCandidates === num
                    ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {num} Candidates
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs font-medium text-slate-300 mb-1.5">
            <span className="flex items-center space-x-1.5">
              <span>Classifier-Free Guidance Strength (s):</span>
              <span className="font-mono text-purple-400 font-bold">{guidanceStrength.toFixed(1)}</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Range 1.0 - 5.0</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="5.0"
            step="0.5"
            value={guidanceStrength}
            onChange={(e) => onChangeGuidanceStrength(parseFloat(e.target.value))}
            className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Controls condition conditioning trade-off between molecular diversity and genotype specificity.
          </p>
        </div>
      </div>

      {/* VALIDATION & GENERATION TRIGGER */}
      <div className="pt-2">
        {validationError ? (
          <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center space-x-2 mb-4">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        ) : (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>✓ Genotype input validated — Ready for condition encoding</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400/80">
              {alterations.length} alterations • {responseClass}
            </span>
          </div>
        )}

        <button
          onClick={onStartGeneration}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center space-x-3 transition-all duration-300 ${
            isValid
              ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer hover:scale-[1.005]'
              : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
          }`}
        >
          <Sparkles className="w-5 h-5 text-cyan-200 animate-spin" style={{ animationDuration: '4s' }} />
          <span>GENERATE RESEARCH CANDIDATES</span>
        </button>
      </div>
    </div>
  );
};
