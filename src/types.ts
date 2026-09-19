export type AlterationType = 'mutation' | 'amplification' | 'deletion' | 'cna';

export type ResponseClass = 
  | 'Very Sensitive' 
  | 'Sensitive' 
  | 'Moderate' 
  | 'Resistant' 
  | 'Very Resistant';

export interface GeneticAlteration {
  id: string;
  gene: string;
  alterationType: AlterationType;
  value: string; // e.g. "R175H", "Copy number 4", "Copy number 0"
}

export interface GenotypeProfile {
  id: string;
  name: string;
  cancerType: string;
  description: string;
  alterations: GeneticAlteration[];
  recommendedResponse: ResponseClass;
}

export interface GeneTokenEmbedding {
  gene: string;
  alterationType: AlterationType;
  value: string;
  subsystem: string;
  color: string;
  vector: number[];
}

export interface ConditionEncodingResult {
  geneTokens: GeneTokenEmbedding[];
  attentionMatrix: number[][]; // N x N attention heatmap
  subsystemHierarchy: { name: string; genes: string[]; weight: number }[];
  conditionVector: number[]; // 64-dim condition vector
  responseClass: ResponseClass;
  responseScore: number;
  timestamp: string;
}

export interface DiffusionParticle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  noiseX: number;
  noiseY: number;
  clusterId: number;
  color: string;
  size: number;
}

export interface DiffusionStepState {
  step: number; // 0 to 300
  totalSteps: number; // 300
  noiseLevel: number; // variance
  loss: number;
  statusMessage: string;
}

export interface MolecularCandidate {
  id: string;
  candidateNumber: number;
  name: string;
  smiles: string;
  formula: string;
  molecularWeight: number;
  qed: number; // Quantitative Estimate of Drug-likeness (0 - 1), target > 0.8
  sas: number; // Synthetic Accessibility Score (1 - 10), target < 4.56
  logP: number; // Octanol-water partition coefficient
  hbd: number; // Hydrogen Bond Donors
  hba: number; // Hydrogen Bond Acceptors
  rotatableBonds: number;
  tpsa: number; // Topological polar surface area
  tanimotoMax: number; // Max Tanimoto similarity to ChEMBL/training compounds, target < 0.25
  retrosynthesisDepth: number; // AiZynthFinder retrosynthetic depth, target <= 4
  lipinskiViolations: number;
  passesLipinski: boolean;
  isValid: boolean;
  isUnique: boolean;
  isNovel: boolean;
  passedFilters: boolean;
  filterFailReasons: string[];
  primaryPathwayTarget: string;
  targetGene: string;
  attentionScore: number;
  atoms: Array<{ id: number; symbol: string; x: number; y: number; charge?: number }>;
  bonds: Array<{ source: number; target: number; order: 1 | 2 | 3 }>;
}

export interface ScreeningCriteria {
  maxTanimoto: number; // default 0.25
  minQED: number; // default 0.80
  maxSAS: number; // default 4.56
  maxRetrosynthesisDepth: number; // default 4
  enforceLipinski: boolean; // default true
}

export interface PathwayInsight {
  id: string;
  name: string;
  category: string;
  associatedGenes: string[];
  attentionScore: number; // 0.0 - 1.0
  subsystemNeST: string;
  mechanism: string;
  clinicalSignificance: string;
  highlightedMolecules: string[];
}

export interface GenerationRun {
  id: string;
  timestamp: string;
  profileName: string;
  alterations: GeneticAlteration[];
  responseClass: ResponseClass;
  guidanceStrength: number;
  numCandidatesRequested: number;
  encodingResult: ConditionEncodingResult;
  candidates: MolecularCandidate[];
  pathwayInsights: PathwayInsight[];
  filterStats: {
    total: number;
    passed: number;
    filtered: number;
  };
}

export interface CellLineRecord {
  id: string;
  cellLine: string;
  cancerType: string;
  responseClass: ResponseClass;
  auc: number;
  compound: string;
  mutationCount: number;
  cnaCount: number;
  cndCount: number;
  keyMutations: string[];
  description: string;
}

export interface ConditionDrugPair {
  id: string;
  cellLine: string;
  compound: string;
  cancerType: string;
  responseClass: ResponseClass;
  auc: number;
  conditionCoord: [number, number]; // 2D projected embedding
  drugCoord: [number, number]; // 2D projected embedding
}

export interface AUCDensityPoint {
  auc: number;
  candidatesDensity: number;
  referenceDensity: number;
  knownDrugsDensity: number;
}

export type PipelineStage = 
  | 'input' 
  | 'genotype' 
  | 'condition_encoder' 
  | 'response_context' 
  | 'diffusion' 
  | 'decoding' 
  | 'molecular_analysis' 
  | 'filtering' 
  | 'pathway_insights' 
  | 'results';

export type AppView = 
  | 'home' 
  | 'generate' 
  | 'dataset'
  | 'diffusion_lab'
  | 'molecules'
  | 'auc_analysis'
  | 'pathway_insights'
  | 'history' 
  | 'research_method' 
  | 'about';

export const DEFAULT_SCREENING_CRITERIA: ScreeningCriteria = {
  minQED: 0.80,
  maxSAS: 4.56,
  maxTanimoto: 0.25,
  maxRetrosynthesisDepth: 4,
  enforceLipinski: true,
};
