/**
 * G2D-Diff Service Interface Architecture
 * 
 * Implements the core genotype-to-drug generation pipeline architecture
 * based on "A genotype-to-drug diffusion model for generation of tailored
 * anti-cancer small molecules" - Nature Communications, 2025.
 * 
 * In this research prototype, this service runs the deterministic demonstration
 * engine reproducing the mathematical structure of the paper's components.
 * Future backends can bind real PyTorch/JAX G2D-Diff model checkpoints directly
 * to these function signatures.
 */

import {
  GeneticAlteration,
  ResponseClass,
  ConditionEncodingResult,
  GeneTokenEmbedding,
  MolecularCandidate,
  ScreeningCriteria,
  PathwayInsight,
  DiffusionParticle
} from '../types';
import { CANDIDATE_POOL, PATHWAY_KNOWLEDGE_BASE, DEFAULT_SCREENING_CRITERIA } from '../data/molecularCandidatesDatabase';

// Deterministic seedable pseudo-random helper for scientific reproducibility
function pseudoHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function deterministicFloat(seed: number, offset: number): number {
  const x = Math.sin(seed + offset) * 10000;
  return x - Math.floor(x);
}

// 1. CONDITION ENCODER (SYNCHRONOUS CORE)
export function encodeGenotypeSync(
  alterations: GeneticAlteration[],
  responseClass: ResponseClass
): ConditionEncodingResult {
  const responseValues: Record<ResponseClass, number> = {
    'Very Sensitive': 1.0,
    'Sensitive': 0.75,
    'Moderate': 0.5,
    'Resistant': 0.25,
    'Very Resistant': 0.0
  };

  const responseScore = responseValues[responseClass] ?? 0.75;
  const signature = alterations.map(a => `${a.gene}:${a.alterationType}:${a.value}`).join('|');
  const baseSeed = pseudoHash(signature || 'default-seed');

  // Generate gene token embeddings
  const geneTokens: GeneTokenEmbedding[] = alterations.map((alt, index) => {
    const geneSeed = baseSeed + index * 37 + alt.gene.charCodeAt(0);
    const vectorLength = 16; // Display vector block
    const vector: number[] = [];
    for (let i = 0; i < vectorLength; i++) {
      const val = (deterministicFloat(geneSeed, i) * 2 - 1).toFixed(2);
      vector.push(parseFloat(val));
    }

    let subsystem = 'NeST-General';
    let color = '#38bdf8'; // sky blue
    const g = alt.gene.toUpperCase();

    if (['PIK3CA', 'PTEN', 'AKT1', 'MTOR'].includes(g)) {
      subsystem = 'NeST-621 (PI3K/AKT)';
      color = '#a855f7'; // purple
    } else if (['CDKN2A', 'CDK4', 'CDK6', 'RB1', 'CCND1', 'CCNE1'].includes(g)) {
      subsystem = 'NeST-412 (Cell Cycle)';
      color = '#06b6d4'; // cyan
    } else if (['TP53', 'ATM', 'BRCA1', 'BRCA2', 'PARP1'].includes(g)) {
      subsystem = 'NeST-305 (DDR/Repair)';
      color = '#ec4899'; // pink
    } else if (['KRAS', 'BRAF', 'EGFR', 'MET'].includes(g)) {
      subsystem = 'NeST-514 (RTK/MAPK)';
      color = '#f59e0b'; // amber
    }

    return {
      gene: alt.gene,
      alterationType: alt.alterationType,
      value: alt.value,
      subsystem,
      color,
      vector
    };
  });

  // NeST Subsystem hierarchy aggregation
  const subsystemHierarchy = [
    { name: 'NeST-621: Phosphatidylinositol 3-Kinase/AKT', genes: ['PIK3CA', 'PTEN', 'AKT1'], weight: 0.88 },
    { name: 'NeST-412: G1/S Cyclin Checkpoint Regulation', genes: ['CDKN2A', 'CDK4', 'CCNE1'], weight: 0.82 },
    { name: 'NeST-305: Homologous Recombination Repair', genes: ['TP53', 'BRCA1', 'ATM'], weight: 0.79 },
    { name: 'NeST-514: Receptor Tyrosine Kinase Signaling', genes: ['EGFR', 'KRAS', 'BRAF'], weight: 0.75 }
  ];

  // Self-attention matrix (N tokens x N tokens)
  const N = Math.max(geneTokens.length, 3);
  const attentionMatrix: number[][] = [];
  for (let i = 0; i < N; i++) {
    const row: number[] = [];
    let rowSum = 0;
    for (let j = 0; j < N; j++) {
      const raw = deterministicFloat(baseSeed + i * 13, j * 17);
      const isDiag = i === j ? 1.5 : 0.8;
      const val = raw * isDiag;
      row.push(val);
      rowSum += val;
    }
    // Softmax normalization
    attentionMatrix.push(row.map(v => parseFloat((v / Math.max(0.01, rowSum)).toFixed(3))));
  }

  // Final Condition Vector (64-dimensional latent condition c)
  const conditionVector: number[] = [];
  for (let i = 0; i < 64; i++) {
    const weight = deterministicFloat(baseSeed, i * 7) * 2 - 1;
    // Condition vector blends genotype tokens with response class bias
    const cVal = (weight * 0.7 + (responseScore - 0.5) * 0.6).toFixed(3);
    conditionVector.push(parseFloat(cVal));
  }

  return {
    geneTokens,
    attentionMatrix,
    subsystemHierarchy,
    conditionVector,
    responseClass,
    responseScore,
    timestamp: new Date().toISOString()
  };
}

export async function encodeGenotype(
  alterations: GeneticAlteration[],
  responseClass: ResponseClass
): Promise<ConditionEncodingResult> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return encodeGenotypeSync(alterations, responseClass);
}

// 2. LATENT DIFFUSION PARTICLES SIMULATION
export function createInitialDiffusionParticles(count: number = 80): DiffusionParticle[] {
  const particles: DiffusionParticle[] = [];
  const clusters = [
    { cx: 160, cy: 150, color: '#38bdf8' }, // cyan
    { cx: 280, cy: 120, color: '#a855f7' }, // purple
    { cx: 400, cy: 160, color: '#ec4899' }, // pink
    { cx: 260, cy: 230, color: '#10b981' }  // emerald
  ];

  for (let i = 0; i < count; i++) {
    const cluster = clusters[i % clusters.length];
    // Random noise state (Step 0)
    const noiseX = 50 + deterministicFloat(i, 11) * 440;
    const noiseY = 40 + deterministicFloat(i, 23) * 260;

    // Coherent molecular manifold state (Step 300)
    const angle = deterministicFloat(i, 41) * Math.PI * 2;
    const radius = 10 + deterministicFloat(i, 53) * 35;
    const targetX = cluster.cx + Math.cos(angle) * radius;
    const targetY = cluster.cy + Math.sin(angle) * radius;

    particles.push({
      id: i,
      x: noiseX,
      y: noiseY,
      targetX,
      targetY,
      noiseX,
      noiseY,
      clusterId: i % clusters.length,
      color: cluster.color,
      size: 2.5 + deterministicFloat(i, 67) * 3
    });
  }

  return particles;
}

// 3. CANDIDATE SET GENERATION (SYNCHRONOUS CORE)
export function generateLatentCandidatesSync(
  alterations: GeneticAlteration[],
  responseClass: ResponseClass,
  numCandidates: number = 12,
  guidanceStrength: number = 2.5
): MolecularCandidate[] {
  let baseList: MolecularCandidate[] = [];

  if (numCandidates <= 6) {
    baseList = CANDIDATE_POOL.slice(0, 6);
  } else if (numCandidates <= 12) {
    baseList = CANDIDATE_POOL.slice(0, 12);
  } else {
    baseList = [...CANDIDATE_POOL];
    for (let i = 0; i < 12; i++) {
      const parent = CANDIDATE_POOL[i];
      const variantNumber = 13 + i;
      baseList.push({
        ...parent,
        id: `G2D-C${variantNumber < 10 ? '0' : ''}${variantNumber}`,
        candidateNumber: variantNumber,
        name: `${parent.name} (Isoform-β)`,
        qed: Math.min(0.95, Math.max(0.65, parent.qed + (i % 2 === 0 ? 0.02 : -0.03))),
        sas: Math.min(5.5, Math.max(2.1, parent.sas + (i % 3 === 0 ? 0.15 : -0.12))),
        molecularWeight: parseFloat((parent.molecularWeight + (i % 2 === 0 ? 14.02 : -2.01)).toFixed(2))
      });
    }
  }

  const primaryGenes = alterations.map(t => t.gene.toUpperCase());
  return baseList.map((c, idx) => {
    const gene = primaryGenes[idx % Math.max(1, primaryGenes.length)] || c.targetGene;
    return {
      ...c,
      candidateNumber: idx + 1,
      targetGene: gene
    };
  });
}

export async function generateLatentCandidates(
  alterations: GeneticAlteration[],
  responseClass: ResponseClass,
  numCandidates: number = 12,
  guidanceStrength: number = 2.5
): Promise<MolecularCandidate[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return generateLatentCandidatesSync(alterations, responseClass, numCandidates, guidanceStrength);
}

// 4. CHEMICAL VAE DECODING
export async function decodeMolecule(
  latentVector: number[]
): Promise<{ smiles: string; formula: string; qed: number }> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    smiles: 'Cc1nc2c(cnn2-c2ccccc2)c(=O)[nH]1',
    formula: 'C13H11N5O',
    qed: 0.86
  };
}

// 5. CANDIDATE EVALUATION & FILTERING
export function evaluateCandidate(
  candidate: MolecularCandidate,
  criteria: ScreeningCriteria = DEFAULT_SCREENING_CRITERIA
): { passed: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (!candidate.isValid) {
    reasons.push('Invalid chemical valence / SMILES syntax');
  }
  if (!candidate.isUnique) {
    reasons.push('Duplicate generated candidate structure');
  }
  if (candidate.qed < criteria.minQED) {
    reasons.push(`QED ${candidate.qed.toFixed(2)} < target threshold ${criteria.minQED.toFixed(2)}`);
  }
  if (candidate.sas > criteria.maxSAS) {
    reasons.push(`SAS ${candidate.sas.toFixed(2)} > synthetic accessibility cap ${criteria.maxSAS.toFixed(2)}`);
  }
  if (candidate.tanimotoMax >= criteria.maxTanimoto) {
    reasons.push(`Max Tanimoto similarity ${candidate.tanimotoMax.toFixed(2)} >= ${criteria.maxTanimoto.toFixed(2)} cap vs training compounds`);
  }
  if (candidate.retrosynthesisDepth > criteria.maxRetrosynthesisDepth) {
    reasons.push(`Retrosynthetic depth ${candidate.retrosynthesisDepth} exceeds ${criteria.maxRetrosynthesisDepth}-step synthesis limit`);
  }
  if (criteria.enforceLipinski && !candidate.passesLipinski) {
    reasons.push(`Violates Lipinski Rule of 5 (LogP: ${candidate.logP}, MW: ${candidate.molecularWeight})`);
  }

  return {
    passed: reasons.length === 0,
    reasons
  };
}

// 6. BIOLOGICAL PATHWAY & ATTENTION INSIGHTS
export function analyzePathwaysSync(
  alterations: GeneticAlteration[],
  condition?: ConditionEncodingResult
): PathwayInsight[] {
  const inputGenes = alterations.map(a => a.gene.toUpperCase());

  return PATHWAY_KNOWLEDGE_BASE.map(pw => {
    // Check overlap with input genes
    const matchingGenes = pw.associatedGenes.filter(g => inputGenes.includes(g));
    const baseScore = matchingGenes.length > 0 ? 0.82 + matchingGenes.length * 0.05 : 0.62;
    const finalScore = Math.min(0.96, parseFloat((baseScore + deterministicFloat(pw.name.length, 7) * 0.08).toFixed(2)));

    return {
      id: pw.id,
      name: pw.name,
      category: pw.category,
      associatedGenes: matchingGenes.length > 0 ? matchingGenes : pw.associatedGenes.slice(0, 3),
      attentionScore: finalScore,
      subsystemNeST: pw.subsystemNeST,
      mechanism: pw.mechanism,
      clinicalSignificance: pw.clinicalSignificance,
      highlightedMolecules: pw.highlightedMolecules
    };
  }).sort((a, b) => b.attentionScore - a.attentionScore);
}

export function analyzePathways(
  alterations: GeneticAlteration[],
  condition?: ConditionEncodingResult
): PathwayInsight[] {
  return analyzePathwaysSync(alterations, condition);
}

// 7. EXPORT JSON REPORT BUILDER
export function generateResearchExportReport(
  runData: {
    alterations: GeneticAlteration[];
    responseClass: ResponseClass;
    condition: ConditionEncodingResult;
    candidates: MolecularCandidate[];
    pathways: PathwayInsight[];
    guidanceStrength: number;
    screeningCriteria: ScreeningCriteria;
  }
) {
  return {
    application: 'G2D-Diff: Genotype-to-Drug Diffusion Explorer',
    paperReference: 'A genotype-to-drug diffusion model for generation of tailored anti-cancer small molecules - Nature Communications, 2025',
    generatedAt: new Date().toISOString(),
    inputGenotype: runData.alterations,
    targetResponseClass: runData.responseClass,
    guidanceScale: runData.guidanceStrength,
    screeningThresholds: runData.screeningCriteria,
    pathwayAttentions: runData.pathways.map(p => ({
      name: p.name,
      attentionScore: p.attentionScore,
      associatedGenes: p.associatedGenes
    })),
    candidatesSummary: {
      total: runData.candidates.length,
      passed: runData.candidates.filter(c => c.passedFilters).length,
      filtered: runData.candidates.filter(c => !c.passedFilters).length
    },
    candidates: runData.candidates
  };
}
