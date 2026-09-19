import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Dna, 
  Sparkles, 
  Menu, 
  X
} from 'lucide-react';
import { 
  AppView, 
  ConditionEncodingResult, 
  DEFAULT_SCREENING_CRITERIA, 
  GenerationRun, 
  GeneticAlteration, 
  MolecularCandidate, 
  PathwayInsight, 
  PipelineStage, 
  ResponseClass, 
  ScreeningCriteria 
} from './types';
import { DEMO_PROFILES } from './data/clinicalGenes';
import { 
  analyzePathwaysSync, 
  encodeGenotypeSync, 
  generateLatentCandidatesSync 
} from './services/generationService';

// Layout & View Components
import { Sidebar } from './components/Sidebar';
import { PipelineNavbar } from './components/PipelineNavbar';
import { PipelineTransitionModal } from './components/PipelineTransitionModal';
import { HomeView } from './components/HomeView';
import { DatasetView } from './components/DatasetView';
import { DiffusionLabView } from './components/DiffusionLabView';
import { MoleculesView } from './components/MoleculesView';
import { AucAnalysisView } from './components/AucAnalysisView';
import { PathwayInsightsView } from './components/PathwayInsightsView';
import { HistoryView } from './components/HistoryView';
import { ResearchMethodView } from './components/ResearchMethodView';
import { AboutView } from './components/AboutView';

// 10-Stage Pipeline Component Imports
import { Stage01Input } from './components/stages/Stage01Input';
import { Stage02Genotype } from './components/stages/Stage02Genotype';
import { Stage03ConditionEncoder } from './components/stages/Stage03ConditionEncoder';
import { Stage04ResponseContext } from './components/stages/Stage04ResponseContext';
import { Stage05Diffusion } from './components/stages/Stage05Diffusion';
import { Stage06Decoding } from './components/stages/Stage06Decoding';
import { Stage07MolecularAnalysis } from './components/stages/Stage07MolecularAnalysis';
import { Stage08Filtering } from './components/stages/Stage08Filtering';
import { Stage09BiologicalInsights } from './components/stages/Stage09BiologicalInsights';
import { Stage10Results } from './components/stages/Stage10Results';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentStage, setCurrentStage] = useState<PipelineStage>('input');
  const [completedStages, setCompletedStages] = useState<Set<PipelineStage>>(
    new Set([
      'input',
      'genotype',
      'condition_encoder',
      'response_context',
      'diffusion',
      'decoding',
      'molecular_analysis',
      'filtering',
      'pathway_insights'
    ])
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Cross-stage selection state
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>('G2D-C01');
  const [selectedGene, setSelectedGene] = useState<string | null>('TP53');

  // Input Configuration State
  const defaultProfile = DEMO_PROFILES[0]; // TNBC demo default
  const [alterations, setAlterations] = useState<GeneticAlteration[]>(
    defaultProfile.alterations.map(a => ({ ...a, id: `init-${a.id}` }))
  );
  const [responseClass, setResponseClass] = useState<ResponseClass>(defaultProfile.recommendedResponse);
  const [numCandidates, setNumCandidates] = useState<number>(12);
  const [guidanceStrength, setGuidanceStrength] = useState<number>(2.5);
  const [screeningCriteria, setScreeningCriteria] = useState<ScreeningCriteria>(DEFAULT_SCREENING_CRITERIA);

  // Model & Pipeline Output State
  const [encodingResult, setEncodingResult] = useState<ConditionEncodingResult>(() => 
    encodeGenotypeSync(alterations, responseClass)
  );
  const [candidates, setCandidates] = useState<MolecularCandidate[]>(() =>
    generateLatentCandidatesSync(alterations, responseClass, numCandidates, guidanceStrength)
  );
  const [pathwayInsights, setPathwayInsights] = useState<PathwayInsight[]>(() =>
    analyzePathwaysSync(alterations)
  );

  // Modals & History State
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState<boolean>(false);
  const [isSavedToHistory, setIsSavedToHistory] = useState<boolean>(false);
  const [history, setHistory] = useState<GenerationRun[]>(() => {
    try {
      const saved = localStorage.getItem('g2d_diff_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Pre-seed with benchmark archive item for quick demonstration
    const seedCandidates = generateLatentCandidatesSync(DEMO_PROFILES[1].alterations, 'Very Sensitive', 12, 2.5);
    return [
      {
        id: 'RUN-2025-BENCHMARK-01',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        profileName: 'NSCLC Demo (PC-9)',
        alterations: DEMO_PROFILES[1].alterations,
        responseClass: 'Very Sensitive',
        guidanceStrength: 2.5,
        numCandidatesRequested: 12,
        encodingResult: encodeGenotypeSync(DEMO_PROFILES[1].alterations, 'Very Sensitive'),
        candidates: seedCandidates,
        pathwayInsights: analyzePathwaysSync(DEMO_PROFILES[1].alterations),
        filterStats: {
          total: seedCandidates.length,
          passed: seedCandidates.filter(c => c.passedFilters).length,
          filtered: seedCandidates.filter(c => !c.passedFilters).length
        }
      }
    ];
  });

  // Keep history synced to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('g2d_diff_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Handle pipeline generation launch
  const handleStartGeneration = () => {
    const enc = encodeGenotypeSync(alterations, responseClass);
    const cands = generateLatentCandidatesSync(alterations, responseClass, numCandidates, guidanceStrength);
    const pathways = analyzePathwaysSync(alterations);

    setEncodingResult(enc);
    setCandidates(cands);
    setPathwayInsights(pathways);
    setIsSavedToHistory(false);
    if (cands.length > 0) {
      setSelectedCandidateId(cands[0].id);
    }

    // Open transition modal
    setIsTransitionModalOpen(true);
  };

  // Stage Progression Handlers
  const handleTransitionComplete = () => {
    setIsTransitionModalOpen(false);
    setCompletedStages(prev => new Set([...prev, 'input']));
    setCurrentStage('genotype');
  };

  const handleProceedToConditionEncoder = () => {
    setCompletedStages(prev => new Set([...prev, 'genotype']));
    setCurrentStage('condition_encoder');
  };

  const handleProceedToResponseContext = () => {
    setCompletedStages(prev => new Set([...prev, 'condition_encoder']));
    setCurrentStage('response_context');
  };

  const handleProceedToDiffusion = () => {
    setCompletedStages(prev => new Set([...prev, 'response_context']));
    setCurrentStage('diffusion');
  };

  const handleProceedToDecoding = () => {
    setCompletedStages(prev => new Set([...prev, 'diffusion']));
    setCurrentStage('decoding');
  };

  const handleProceedToMolecularAnalysis = () => {
    setCompletedStages(prev => new Set([...prev, 'decoding']));
    setCurrentStage('molecular_analysis');
  };

  const handleProceedToFiltering = () => {
    setCompletedStages(prev => new Set([...prev, 'molecular_analysis']));
    setCurrentStage('filtering');
  };

  const handleProceedToBiologicalInsights = (evaluatedCandidates: MolecularCandidate[]) => {
    if (evaluatedCandidates) {
      setCandidates(evaluatedCandidates);
    }
    setCompletedStages(prev => new Set([...prev, 'filtering']));
    setCurrentStage('pathway_insights');
  };

  const handleProceedToResults = () => {
    setCompletedStages(prev => new Set([...prev, 'pathway_insights']));
    setCurrentStage('results');
  };

  const handleRestartPipeline = () => {
    setCurrentStage('input');
  };

  // Save current run to History
  const handleSaveToHistory = () => {
    if (isSavedToHistory) return;
    const newRun: GenerationRun = {
      id: `RUN-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      profileName: `Custom Profile (${alterations.length} genes)`,
      alterations,
      responseClass,
      guidanceStrength,
      numCandidatesRequested: numCandidates,
      encodingResult,
      candidates,
      pathwayInsights,
      filterStats: {
        total: candidates.length,
        passed: candidates.filter(c => c.passedFilters).length,
        filtered: candidates.filter(c => !c.passedFilters).length
      }
    };
    setHistory([newRun, ...history]);
    setIsSavedToHistory(true);
  };

  // Reload run from history
  const handleReloadRun = (run: GenerationRun) => {
    setAlterations(run.alterations);
    setResponseClass(run.responseClass);
    setCandidates(run.candidates);
    setPathwayInsights(run.pathwayInsights);
    setGuidanceStrength(run.guidanceStrength);
    setCompletedStages(new Set([
      'input',
      'genotype',
      'condition_encoder',
      'response_context',
      'diffusion',
      'decoding',
      'molecular_analysis',
      'filtering',
      'pathway_insights',
      'results'
    ]));
    setCurrentStage('results');
    setCurrentView('generate');
  };

  // Select demo profile from Home view
  const handleSelectDemoProfile = (profile: { alterations: GeneticAlteration[]; recommendedResponse: ResponseClass }) => {
    setAlterations(profile.alterations.map(a => ({ ...a, id: `demo-${Date.now()}-${a.id}` })));
    setResponseClass(profile.recommendedResponse);
    setCurrentView('generate');
    setCurrentStage('input');
  };

  // Select stage directly from Home view
  const handleSelectStageFromHome = (stage: PipelineStage) => {
    setCurrentStage(stage);
    setCurrentView('generate');
  };

  return (
    <div className="min-h-screen bg-[#020409] text-[#f8fafc] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="flex-1 flex w-full relative">
        {/* Desktop Left Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => {
              setCurrentView(view);
              setMobileMenuOpen(false);
            }}
            isGenerating={currentView === 'generate' && currentStage !== 'input' && currentStage !== 'results'}
          />
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              className="fixed inset-0 z-50 flex md:hidden"
            >
              <div className="w-64 h-full relative z-10 bg-[#030509]">
                <Sidebar
                  currentView={currentView}
                  onNavigate={(view) => {
                    setCurrentView(view);
                    setMobileMenuOpen(false);
                  }}
                  isGenerating={currentView === 'generate' && currentStage !== 'input'}
                />
              </div>
              <div 
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 bg-[#020409]/85 backdrop-blur-sm"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Body */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden bg-[#020409]">
          {/* Top Header Bar */}
          <header className="w-full bg-[#030509]/95 border-b border-[#162032] px-4 py-2.5 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg bg-[#070B12] border border-[#162032] text-slate-300 md:hidden hover:text-white"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-900/50 via-[#070B12] to-cyan-900/40 border border-purple-500/40 flex items-center justify-center">
                  <Dna className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white tracking-tight flex items-center space-x-1.5 font-mono">
                    <span>G2D-Diff Explorer</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-purple-950 border border-purple-500/40 text-purple-300 rounded hidden sm:inline">
                      Nature Comms 2025
                    </span>
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-mono">
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#070B12] border border-[#162032] text-purple-300 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>Research Mode</span>
              </div>

              {currentView !== 'generate' && (
                <button
                  onClick={() => setCurrentView('generate')}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono text-xs flex items-center space-x-1.5 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pipeline</span>
                </button>
              )}
            </div>
          </header>

          {/* 10-Stage Pipeline Navigation Ribbon (Only in Generate view) */}
          {currentView === 'generate' && (
            <PipelineNavbar
              currentStage={currentStage}
              completedStages={completedStages}
              onSelectStage={(stage) => setCurrentStage(stage)}
            />
          )}

          {/* Main Stage / View Content Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* VIEW 1: HOME */}
            {currentView === 'home' && (
              <HomeView
                onStartPipeline={() => {
                  setCurrentView('generate');
                  setCurrentStage('input');
                }}
                onSelectDemoProfile={handleSelectDemoProfile}
                onNavigateMethod={() => setCurrentView('research_method')}
                onSelectStage={handleSelectStageFromHome}
              />
            )}

            {/* VIEW 2: GENERATE PIPELINE (Stages 01 - 10) */}
            {currentView === 'generate' && (
              <div>
                {/* STAGE 01: INPUT */}
                {currentStage === 'input' && (
                  <Stage01Input
                    alterations={alterations}
                    onChangeAlterations={setAlterations}
                    responseClass={responseClass}
                    onChangeResponseClass={setResponseClass}
                    numCandidates={numCandidates}
                    onChangeNumCandidates={setNumCandidates}
                    guidanceStrength={guidanceStrength}
                    onChangeGuidanceStrength={setGuidanceStrength}
                    onStartGeneration={handleStartGeneration}
                  />
                )}

                {/* STAGE 02: GENOTYPE */}
                {currentStage === 'genotype' && (
                  <Stage02Genotype
                    alterations={alterations}
                    responseClass={responseClass}
                    onProceedToConditionEncoder={handleProceedToConditionEncoder}
                    onBackToInput={() => setCurrentStage('input')}
                  />
                )}

                {/* STAGE 03: CONDITION ENCODER */}
                {currentStage === 'condition_encoder' && (
                  <Stage03ConditionEncoder
                    alterations={alterations}
                    responseClass={responseClass}
                    encodingResult={encodingResult}
                    onProceedToResponseContext={handleProceedToResponseContext}
                    onBackToGenotype={() => setCurrentStage('genotype')}
                  />
                )}

                {/* STAGE 04: DRUG RESPONSE CONTEXT */}
                {currentStage === 'response_context' && (
                  <Stage04ResponseContext
                    alterations={alterations}
                    responseClass={responseClass}
                    onProceedToDiffusion={handleProceedToDiffusion}
                    onBackToConditionEncoder={() => setCurrentStage('condition_encoder')}
                  />
                )}

                {/* STAGE 05: DIFFUSION */}
                {currentStage === 'diffusion' && (
                  <Stage05Diffusion
                    guidanceStrength={guidanceStrength}
                    onChangeGuidanceStrength={setGuidanceStrength}
                    responseClass={responseClass}
                    onProceedToChemicalVAE={handleProceedToDecoding}
                    onBackToResponseContext={() => setCurrentStage('response_context')}
                  />
                )}

                {/* STAGE 06: DECODING */}
                {currentStage === 'decoding' && (
                  <Stage06Decoding
                    candidates={candidates}
                    onProceedToMolecularAnalysis={handleProceedToMolecularAnalysis}
                    onBackToDiffusion={() => setCurrentStage('diffusion')}
                  />
                )}

                {/* STAGE 07: MOLECULAR PROPERTY ANALYSIS */}
                {currentStage === 'molecular_analysis' && (
                  <Stage07MolecularAnalysis
                    candidates={candidates}
                    selectedCandidateId={selectedCandidateId}
                    onSelectCandidate={setSelectedCandidateId}
                    onProceedToFiltering={handleProceedToFiltering}
                    onBackToDecoding={() => setCurrentStage('decoding')}
                  />
                )}

                {/* STAGE 08: CANDIDATE FILTERING */}
                {currentStage === 'filtering' && (
                  <Stage08Filtering
                    candidates={candidates}
                    screeningCriteria={screeningCriteria}
                    onChangeScreeningCriteria={setScreeningCriteria}
                    selectedCandidateId={selectedCandidateId}
                    onSelectCandidate={setSelectedCandidateId}
                    onProceedToBiologicalInsights={handleProceedToBiologicalInsights}
                    onBackToMolecularAnalysis={() => setCurrentStage('molecular_analysis')}
                  />
                )}

                {/* STAGE 09: BIOLOGICAL INSIGHTS */}
                {currentStage === 'pathway_insights' && (
                  <Stage09BiologicalInsights
                    pathwayInsights={pathwayInsights}
                    alterations={alterations}
                    candidates={candidates}
                    responseClass={responseClass}
                    selectedCandidateId={selectedCandidateId}
                    selectedGene={selectedGene}
                    onSelectCandidate={setSelectedCandidateId}
                    onSelectGene={setSelectedGene}
                    onProceedToResults={handleProceedToResults}
                    onBackToFiltering={() => setCurrentStage('filtering')}
                  />
                )}

                {/* STAGE 10: RESULTS */}
                {currentStage === 'results' && (
                  <Stage10Results
                    candidates={candidates}
                    alterations={alterations}
                    responseClass={responseClass}
                    pathwayInsights={pathwayInsights}
                    onSaveToHistory={handleSaveToHistory}
                    isSavedToHistory={isSavedToHistory}
                    onBackToBiologicalInsights={() => setCurrentStage('pathway_insights')}
                    onRestartPipeline={handleRestartPipeline}
                  />
                )}
              </div>
            )}

            {/* VIEW 3: DATASET & CELL LINES */}
            {currentView === 'dataset' && <DatasetView />}

            {/* VIEW 4: DIFFUSION LAB */}
            {currentView === 'diffusion_lab' && (
              <DiffusionLabView initialGuidanceStrength={guidanceStrength} />
            )}

            {/* VIEW 5: MOLECULES */}
            {currentView === 'molecules' && (
              <MoleculesView candidates={candidates} />
            )}

            {/* VIEW 6: AUC ANALYSIS */}
            {currentView === 'auc_analysis' && (
              <AucAnalysisView candidates={candidates} />
            )}

            {/* VIEW 7: PATHWAY INSIGHTS */}
            {currentView === 'pathway_insights' && (
              <PathwayInsightsView pathwayInsights={pathwayInsights} />
            )}

            {/* VIEW 8: HISTORY */}
            {currentView === 'history' && (
              <HistoryView
                history={history}
                onReloadRun={handleReloadRun}
                onClearHistory={() => setHistory([])}
                onNavigateGenerate={() => setCurrentView('generate')}
              />
            )}

            {/* VIEW 9: RESEARCH METHOD */}
            {currentView === 'research_method' && <ResearchMethodView />}

            {/* VIEW 10: ABOUT */}
            {currentView === 'about' && <AboutView />}
          </main>
        </div>
      </div>

      {/* Full-Screen Animated Transition Modal (Input -> Genotype) */}
      <PipelineTransitionModal
        isOpen={isTransitionModalOpen}
        alterations={alterations}
        responseClass={responseClass}
        onComplete={handleTransitionComplete}
      />
    </div>
  );
}
