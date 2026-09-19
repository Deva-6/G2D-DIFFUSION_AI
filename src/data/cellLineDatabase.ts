import { CellLineRecord, ConditionDrugPair, AUCDensityPoint, ResponseClass } from '../types';

export const CELL_LINE_RECORDS: CellLineRecord[] = [
  {
    id: 'CL-001',
    cellLine: 'MDA-MB-231',
    cancerType: 'Breast (TNBC)',
    responseClass: 'Very Sensitive',
    auc: 0.32,
    compound: 'Alpelisib (BYL719)',
    mutationCount: 142,
    cnaCount: 38,
    cndCount: 12,
    keyMutations: ['TP53 R280K', 'BRAF G464V', 'KRAS G13D', 'NF1 Q828*'],
    description: 'Triple-negative breast adenocarcinoma model displaying high basal sensitivity to PI3K and MEK synergistic inhibition.'
  },
  {
    id: 'CL-002',
    cellLine: 'MCF7',
    cancerType: 'Breast (ER+/PR+)',
    responseClass: 'Sensitive',
    auc: 0.48,
    compound: 'Palbociclib (PD-0332991)',
    mutationCount: 78,
    cnaCount: 22,
    cndCount: 5,
    keyMutations: ['PIK3CA E545K', 'GATA3 D336fs', 'MAP3K1 E203*'],
    description: 'Luminal A estrogen receptor-positive mammary ductal carcinoma line sensitive to CDK4/6 cell-cycle checkpoint arrest.'
  },
  {
    id: 'CL-003',
    cellLine: 'PC-9',
    cancerType: 'Non-Small Cell Lung',
    responseClass: 'Very Sensitive',
    auc: 0.28,
    compound: 'Osimertinib (AZD9291)',
    mutationCount: 115,
    cnaCount: 44,
    cndCount: 18,
    keyMutations: ['EGFR delE746_A750', 'TP53 R248W', 'CDKN2A Loss'],
    description: 'Lung adenocarcinoma harboring activating EGFR exon 19 deletion with marked vulnerability to 3rd generation tyrosine kinase inhibitors.'
  },
  {
    id: 'CL-004',
    cellLine: 'A549',
    cancerType: 'Non-Small Cell Lung',
    responseClass: 'Resistant',
    auc: 0.89,
    compound: 'Gefitinib',
    mutationCount: 210,
    cnaCount: 52,
    cndCount: 14,
    keyMutations: ['KRAS G12S', 'STK11 Q37*', 'KEAP1 G333C', 'CDKN2A Del'],
    description: 'KRAS-mutant / LKB1-deficient non-small cell lung carcinoma intrinsically refractory to reversible EGFR kinase inhibitors.'
  },
  {
    id: 'CL-005',
    cellLine: 'HCT116',
    cancerType: 'Colorectal',
    responseClass: 'Sensitive',
    auc: 0.54,
    compound: 'SN-38 (Irinotecan active)',
    mutationCount: 940,
    cnaCount: 16,
    cndCount: 4,
    keyMutations: ['KRAS G13D', 'PIK3CA H1047R', 'MLH1 C77fs', 'CTNNB1 S45del'],
    description: 'Microsatellite unstable (MSI-H) hypermutated colorectal carcinoma model responsive to topoisomerase I DNA cleavage targeting.'
  },
  {
    id: 'CL-006',
    cellLine: 'HT-29',
    cancerType: 'Colorectal',
    responseClass: 'Moderate',
    auc: 0.68,
    compound: 'Cetuximab',
    mutationCount: 168,
    cnaCount: 65,
    cndCount: 26,
    keyMutations: ['BRAF V600E', 'PIK3CA P449T', 'TP53 R273H', 'SMAD4 R361H'],
    description: 'Microsatellite stable colorectal carcinoma carrying BRAF V600E with downstream feedback activation bypassing anti-EGFR monotherapy.'
  },
  {
    id: 'CL-007',
    cellLine: 'A375',
    cancerType: 'Melanoma',
    responseClass: 'Very Sensitive',
    auc: 0.22,
    compound: 'Dabrafenib + Trametinib',
    mutationCount: 380,
    cnaCount: 29,
    cndCount: 8,
    keyMutations: ['BRAF V600E', 'CDKN2A HomDel'],
    description: 'Malignant melanoma bearing canonical BRAF V600E oncogene conferring profound apoptotic response to dual MAPK cascade blockade.'
  },
  {
    id: 'CL-008',
    cellLine: 'SK-MEL-28',
    cancerType: 'Melanoma',
    responseClass: 'Resistant',
    auc: 0.86,
    compound: 'Vemurafenib (post-relapse)',
    mutationCount: 420,
    cnaCount: 48,
    cndCount: 15,
    keyMutations: ['BRAF V600E', 'PTEN Loss', 'TP53 L145R', 'COT/MAP3K8 Amp'],
    description: 'Metastatic melanoma exhibiting secondary resistance mechanisms driven by PTEN null background and compensatory MAP3K8 kinase expression.'
  },
  {
    id: 'CL-009',
    cellLine: 'OVCAR-3',
    cancerType: 'Ovarian (HGSOC)',
    responseClass: 'Sensitive',
    auc: 0.44,
    compound: 'Olaparib',
    mutationCount: 195,
    cnaCount: 78,
    cndCount: 31,
    keyMutations: ['TP53 R248Q', 'BRCA1 Prom-Meth', 'CCNE1 Amp'],
    description: 'High-grade serous ovarian adenocarcinoma with homologous recombination deficiency (HRD) exhibiting synthetic lethality with PARP inhibition.'
  },
  {
    id: 'CL-010',
    cellLine: 'SK-OV-3',
    cancerType: 'Ovarian (HGSOC)',
    responseClass: 'Very Resistant',
    auc: 1.12,
    compound: 'Cisplatin (refractory)',
    mutationCount: 155,
    cnaCount: 82,
    cndCount: 35,
    keyMutations: ['TP53 HomDel', 'PIK3CA H1047R', 'ARID1A G1847fs'],
    description: 'Clear cell / serous ovarian model with extreme chemoresistance and growth promotion under platinum alkylating stress.'
  },
  {
    id: 'CL-011',
    cellLine: 'K562',
    cancerType: 'Leukemia (CML)',
    responseClass: 'Very Sensitive',
    auc: 0.18,
    compound: 'Imatinib (Gleevec)',
    mutationCount: 85,
    cnaCount: 34,
    cndCount: 12,
    keyMutations: ['BCR-ABL1 Fusion', 'TP53 Q136fs', 'CDKN2A Del'],
    description: 'Chronic myelogenous leukemia blast crisis line driven by BCR-ABL1 tyrosine kinase translocations with exquisite imatinib selectivity.'
  },
  {
    id: 'CL-012',
    cellLine: 'HepG2',
    cancerType: 'Liver (HCC)',
    responseClass: 'Moderate',
    auc: 0.72,
    compound: 'Sorafenib',
    mutationCount: 110,
    cnaCount: 28,
    cndCount: 9,
    keyMutations: ['NRAS Q61L', 'CTNNB1 delW383', 'TERT Prom -124C>T'],
    description: 'Hepatocellular carcinoma harboring beta-catenin stabilizing deletion and active TERT promoter with moderate multi-kinase sensitivity.'
  }
];

// Condition-Drug Pairs corresponding to Figure 1d of Nature Communications 2025
export const CONDITION_DRUG_PAIRS: ConditionDrugPair[] = [
  {
    id: 'CDP-01',
    cellLine: 'MDA-MB-231 (TNBC)',
    compound: 'Alpelisib',
    cancerType: 'Breast',
    responseClass: 'Very Sensitive',
    auc: 0.32,
    conditionCoord: [-1.8, 1.4],
    drugCoord: [-1.6, 1.3]
  },
  {
    id: 'CDP-02',
    cellLine: 'PC-9 (NSCLC EGFR-del)',
    compound: 'Osimertinib',
    cancerType: 'Lung',
    responseClass: 'Very Sensitive',
    auc: 0.28,
    conditionCoord: [-2.1, 0.9],
    drugCoord: [-2.0, 1.1]
  },
  {
    id: 'CDP-03',
    cellLine: 'MCF7 (Luminal Breast)',
    compound: 'Palbociclib',
    cancerType: 'Breast',
    responseClass: 'Sensitive',
    auc: 0.48,
    conditionCoord: [-0.9, 0.6],
    drugCoord: [-0.8, 0.5]
  },
  {
    id: 'CDP-04',
    cellLine: 'HCT116 (CRC MSI-H)',
    compound: 'SN-38',
    cancerType: 'Colorectal',
    responseClass: 'Sensitive',
    auc: 0.54,
    conditionCoord: [-0.5, 0.2],
    drugCoord: [-0.6, 0.4]
  },
  {
    id: 'CDP-05',
    cellLine: 'HT-29 (CRC BRAF-mut)',
    compound: 'Cetuximab',
    cancerType: 'Colorectal',
    responseClass: 'Moderate',
    auc: 0.68,
    conditionCoord: [0.3, -0.4],
    drugCoord: [0.4, -0.3]
  },
  {
    id: 'CDP-06',
    cellLine: 'HepG2 (HCC)',
    compound: 'Sorafenib',
    cancerType: 'Liver',
    responseClass: 'Moderate',
    auc: 0.72,
    conditionCoord: [0.6, -0.6],
    drugCoord: [0.7, -0.5]
  },
  {
    id: 'CDP-07',
    cellLine: 'A549 (NSCLC KRAS-mut)',
    compound: 'Gefitinib',
    cancerType: 'Lung',
    responseClass: 'Resistant',
    auc: 0.89,
    conditionCoord: [1.4, -1.2],
    drugCoord: [1.3, -1.1]
  },
  {
    id: 'CDP-08',
    cellLine: 'SK-MEL-28 (Melanoma ref)',
    compound: 'Vemurafenib',
    cancerType: 'Melanoma',
    responseClass: 'Resistant',
    auc: 0.86,
    conditionCoord: [1.2, -1.0],
    drugCoord: [1.4, -0.9]
  },
  {
    id: 'CDP-09',
    cellLine: 'SK-OV-3 (Ovarian ref)',
    compound: 'Cisplatin',
    cancerType: 'Ovarian',
    responseClass: 'Very Resistant',
    auc: 1.12,
    conditionCoord: [2.2, -1.7],
    drugCoord: [2.0, -1.8]
  }
];

// Reference AUC distribution curves from the GDSC / CTRP pharmacogenomic screening benchmarks
export const AUC_DENSITY_DATA: AUCDensityPoint[] = [
  { auc: 0.1, candidatesDensity: 0.12, referenceDensity: 0.05, knownDrugsDensity: 0.08 },
  { auc: 0.2, candidatesDensity: 0.45, referenceDensity: 0.14, knownDrugsDensity: 0.28 },
  { auc: 0.3, candidatesDensity: 0.98, referenceDensity: 0.35, knownDrugsDensity: 0.62 },
  { auc: 0.4, candidatesDensity: 1.42, referenceDensity: 0.68, knownDrugsDensity: 1.10 },
  { auc: 0.5, candidatesDensity: 1.65, referenceDensity: 1.12, knownDrugsDensity: 1.45 },
  { auc: 0.6, candidatesDensity: 1.20, referenceDensity: 1.48, knownDrugsDensity: 1.30 },
  { auc: 0.7, candidatesDensity: 0.65, referenceDensity: 1.55, knownDrugsDensity: 0.95 },
  { auc: 0.8, candidatesDensity: 0.28, referenceDensity: 1.25, knownDrugsDensity: 0.55 },
  { auc: 0.9, candidatesDensity: 0.10, referenceDensity: 0.85, knownDrugsDensity: 0.28 },
  { auc: 1.0, candidatesDensity: 0.04, referenceDensity: 0.42, knownDrugsDensity: 0.12 },
  { auc: 1.1, candidatesDensity: 0.01, referenceDensity: 0.18, knownDrugsDensity: 0.04 },
  { auc: 1.2, candidatesDensity: 0.00, referenceDensity: 0.06, knownDrugsDensity: 0.01 }
];

export const DATASET_SUMMARY_STATS = {
  chemicalVaeUniqueSmiles: '1,583,442',
  chemicalVaeTraining: '1,425,097',
  chemicalVaeValidation: '158,345',
  cellLineCentricResponseLines: '1,244',
  cellLineCentricResponseCompounds: '803',
  cellLineCentricResponsePairs: '432,293',
  drugCentricDiffusionLines: '62',
  drugCentricDiffusionCompounds: '38,502',
  drugCentricDiffusionPairs: '811,585',
  aucInterpretation: [
    { range: 'AUC ≤ 0.4', label: 'Very Sensitive', description: 'Strong cytotoxic cell elimination' },
    { range: '0.4 < AUC ≤ 0.6', label: 'Sensitive', description: 'Marked anti-proliferative response' },
    { range: '0.6 < AUC ≤ 0.8', label: 'Moderate', description: 'Intermediate cytostatic inhibition' },
    { range: '0.8 < AUC ≤ 1.0', label: 'Resistant', description: 'Marginal or negligible drug impact' },
    { range: 'AUC > 1.0', label: 'Very Resistant', description: 'Growth promotion / compensatory resistance' }
  ]
};

export interface DrugResponseObservation {
  id: string;
  cellLine: string;
  cancerType: string;
  drug: string;
  compoundClass: string;
  auc: number;
  responseClass: ResponseClass;
  keyMutations: string[];
  targetPathway: string;
  isOutlier: boolean;
  zScore: number;
  outlierReason?: string;
}

export const DRUG_RESPONSE_OBSERVATIONS: DrugResponseObservation[] = [
  {
    id: 'DRO-01',
    cellLine: 'MDA-MB-231',
    cancerType: 'Breast (TNBC)',
    drug: 'Alpelisib (BYL719)',
    compoundClass: 'PI3Kα Inhibitor',
    auc: 0.32,
    responseClass: 'Very Sensitive',
    keyMutations: ['TP53 R280K', 'BRAF G464V', 'KRAS G13D', 'NF1 Q828*'],
    targetPathway: 'PI3K/AKT Signaling',
    isOutlier: false,
    zScore: -1.45
  },
  {
    id: 'DRO-02',
    cellLine: 'MDA-MB-231',
    cancerType: 'Breast (TNBC)',
    drug: 'Palbociclib',
    compoundClass: 'CDK4/6 Inhibitor',
    auc: 0.88,
    responseClass: 'Resistant',
    keyMutations: ['TP53 R280K', 'RB1 Intact'],
    targetPathway: 'Cell Cycle Control',
    isOutlier: false,
    zScore: 0.95
  },
  {
    id: 'DRO-03',
    cellLine: 'MDA-MB-231',
    cancerType: 'Breast (TNBC)',
    drug: 'Osimertinib',
    compoundClass: '3rd-Gen EGFR TKI',
    auc: 0.74,
    responseClass: 'Moderate',
    keyMutations: ['EGFR WT', 'KRAS G13D'],
    targetPathway: 'RTK/MAPK Signaling',
    isOutlier: false,
    zScore: 0.35
  },
  {
    id: 'DRO-04',
    cellLine: 'MCF7',
    cancerType: 'Breast (ER+/PR+)',
    drug: 'Palbociclib',
    compoundClass: 'CDK4/6 Inhibitor',
    auc: 0.48,
    responseClass: 'Sensitive',
    keyMutations: ['PIK3CA E545K', 'GATA3 D336fs'],
    targetPathway: 'Cell Cycle Control',
    isOutlier: false,
    zScore: -0.78
  },
  {
    id: 'DRO-05',
    cellLine: 'MCF7',
    cancerType: 'Breast (ER+/PR+)',
    drug: 'Alpelisib',
    compoundClass: 'PI3Kα Inhibitor',
    auc: 0.39,
    responseClass: 'Very Sensitive',
    keyMutations: ['PIK3CA E545K'],
    targetPathway: 'PI3K/AKT Signaling',
    isOutlier: false,
    zScore: -1.15
  },
  {
    id: 'DRO-06',
    cellLine: 'MCF7',
    cancerType: 'Breast (ER+/PR+)',
    drug: 'Cisplatin',
    compoundClass: 'DNA Crosslinker',
    auc: 0.79,
    responseClass: 'Moderate',
    keyMutations: ['TP53 WT'],
    targetPathway: 'DNA Damage Repair',
    isOutlier: false,
    zScore: 0.58
  },
  {
    id: 'DRO-07',
    cellLine: 'PC-9',
    cancerType: 'Non-Small Cell Lung',
    drug: 'Osimertinib',
    compoundClass: 'EGFR TKI (T790M/del19)',
    auc: 0.28,
    responseClass: 'Very Sensitive',
    keyMutations: ['EGFR delE746_A750', 'TP53 R248W'],
    targetPathway: 'RTK Signaling',
    isOutlier: false,
    zScore: -1.65
  },
  {
    id: 'DRO-08',
    cellLine: 'PC-9',
    cancerType: 'Non-Small Cell Lung',
    drug: 'Gefitinib',
    compoundClass: '1st-Gen EGFR TKI',
    auc: 0.31,
    responseClass: 'Very Sensitive',
    keyMutations: ['EGFR delE746_A750'],
    targetPathway: 'RTK Signaling',
    isOutlier: false,
    zScore: -1.50
  },
  {
    id: 'DRO-09',
    cellLine: 'PC-9',
    cancerType: 'Non-Small Cell Lung',
    drug: 'Palbociclib',
    compoundClass: 'CDK4/6 Inhibitor',
    auc: 0.82,
    responseClass: 'Resistant',
    keyMutations: ['CDKN2A Del'],
    targetPathway: 'Cell Cycle Control',
    isOutlier: false,
    zScore: 0.71
  },
  {
    id: 'DRO-10',
    cellLine: 'A549',
    cancerType: 'Non-Small Cell Lung',
    drug: 'Gefitinib',
    compoundClass: '1st-Gen EGFR TKI',
    auc: 0.89,
    responseClass: 'Resistant',
    keyMutations: ['KRAS G12S', 'STK11 Q37*', 'KEAP1 G333C'],
    targetPathway: 'RTK Signaling',
    isOutlier: false,
    zScore: 1.02
  },
  {
    id: 'DRO-11',
    cellLine: 'A549',
    cancerType: 'Non-Small Cell Lung',
    drug: 'Osimertinib',
    compoundClass: '3rd-Gen EGFR TKI',
    auc: 0.85,
    responseClass: 'Resistant',
    keyMutations: ['KRAS G12S', 'EGFR WT'],
    targetPathway: 'RTK Signaling',
    isOutlier: false,
    zScore: 0.84
  },
  {
    id: 'DRO-12',
    cellLine: 'A549',
    cancerType: 'Non-Small Cell Lung',
    drug: 'SN-38',
    compoundClass: 'Topoisomerase I Inhibitor',
    auc: 0.58,
    responseClass: 'Sensitive',
    keyMutations: ['KRAS G12S'],
    targetPathway: 'DNA Replication',
    isOutlier: false,
    zScore: -0.32
  },
  {
    id: 'DRO-13',
    cellLine: 'HCT116',
    cancerType: 'Colorectal',
    drug: 'SN-38',
    compoundClass: 'Topoisomerase I Inhibitor',
    auc: 0.54,
    responseClass: 'Sensitive',
    keyMutations: ['KRAS G13D', 'PIK3CA H1047R', 'MLH1 C77fs'],
    targetPathway: 'DNA Replication',
    isOutlier: false,
    zScore: -0.50
  },
  {
    id: 'DRO-14',
    cellLine: 'HCT116',
    cancerType: 'Colorectal',
    drug: 'Cetuximab',
    compoundClass: 'Anti-EGFR mAb',
    auc: 0.92,
    responseClass: 'Resistant',
    keyMutations: ['KRAS G13D', 'PIK3CA H1047R'],
    targetPathway: 'RTK/MAPK Signaling',
    isOutlier: false,
    zScore: 1.15
  },
  {
    id: 'DRO-15',
    cellLine: 'HCT116',
    cancerType: 'Colorectal',
    drug: 'Alpelisib',
    compoundClass: 'PI3Kα Inhibitor',
    auc: 0.42,
    responseClass: 'Sensitive',
    keyMutations: ['PIK3CA H1047R'],
    targetPathway: 'PI3K/AKT Signaling',
    isOutlier: false,
    zScore: -1.02
  },
  {
    id: 'DRO-16',
    cellLine: 'HT-29',
    cancerType: 'Colorectal',
    drug: 'Cetuximab',
    compoundClass: 'Anti-EGFR mAb',
    auc: 0.68,
    responseClass: 'Moderate',
    keyMutations: ['BRAF V600E', 'PIK3CA P449T'],
    targetPathway: 'RTK/MAPK Signaling',
    isOutlier: false,
    zScore: 0.08
  },
  {
    id: 'DRO-17',
    cellLine: 'HT-29',
    cancerType: 'Colorectal',
    drug: 'Dabrafenib',
    compoundClass: 'BRAF V600E Inhibitor',
    auc: 0.45,
    responseClass: 'Sensitive',
    keyMutations: ['BRAF V600E'],
    targetPathway: 'MAPK Signaling',
    isOutlier: false,
    zScore: -0.90
  },
  {
    id: 'DRO-18',
    cellLine: 'A375',
    cancerType: 'Melanoma',
    drug: 'Dabrafenib',
    compoundClass: 'BRAF V600E Inhibitor',
    auc: 0.22,
    responseClass: 'Very Sensitive',
    keyMutations: ['BRAF V600E', 'CDKN2A HomDel'],
    targetPathway: 'MAPK Signaling',
    isOutlier: false,
    zScore: -1.92
  },
  {
    id: 'DRO-19',
    cellLine: 'A375',
    cancerType: 'Melanoma',
    drug: 'Palbociclib',
    compoundClass: 'CDK4/6 Inhibitor',
    auc: 0.62,
    responseClass: 'Moderate',
    keyMutations: ['CDKN2A HomDel'],
    targetPathway: 'Cell Cycle Control',
    isOutlier: false,
    zScore: -0.15
  },
  {
    id: 'DRO-20',
    cellLine: 'SK-MEL-28',
    cancerType: 'Melanoma',
    drug: 'Vemurafenib',
    compoundClass: 'BRAF Inhibitor',
    auc: 0.86,
    responseClass: 'Resistant',
    keyMutations: ['BRAF V600E', 'PTEN Loss', 'COT Amp'],
    targetPathway: 'MAPK Signaling',
    isOutlier: false,
    zScore: 0.88
  },
  {
    id: 'DRO-21',
    cellLine: 'SK-MEL-28',
    cancerType: 'Melanoma',
    drug: 'Alpelisib',
    compoundClass: 'PI3Kα Inhibitor',
    auc: 0.52,
    responseClass: 'Sensitive',
    keyMutations: ['PTEN Loss'],
    targetPathway: 'PI3K/AKT Signaling',
    isOutlier: false,
    zScore: -0.60
  },
  {
    id: 'DRO-22',
    cellLine: 'OVCAR-3',
    cancerType: 'Ovarian (HGSOC)',
    drug: 'Olaparib',
    compoundClass: 'PARP Inhibitor',
    auc: 0.44,
    responseClass: 'Sensitive',
    keyMutations: ['TP53 R248Q', 'BRCA1 Prom-Meth'],
    targetPathway: 'DNA Repair (HRD)',
    isOutlier: false,
    zScore: -0.95
  },
  {
    id: 'DRO-23',
    cellLine: 'OVCAR-3',
    cancerType: 'Ovarian (HGSOC)',
    drug: 'Cisplatin',
    compoundClass: 'DNA Crosslinker',
    auc: 0.50,
    responseClass: 'Sensitive',
    keyMutations: ['BRCA1 Prom-Meth'],
    targetPathway: 'DNA Damage Repair',
    isOutlier: false,
    zScore: -0.68
  },
  {
    id: 'DRO-24',
    cellLine: 'SK-OV-3',
    cancerType: 'Ovarian (HGSOC)',
    drug: 'Cisplatin (Refractory)',
    compoundClass: 'DNA Crosslinker',
    auc: 1.18,
    responseClass: 'Very Resistant',
    keyMutations: ['TP53 HomDel', 'PIK3CA H1047R'],
    targetPathway: 'DNA Damage Repair',
    isOutlier: true,
    zScore: 2.35,
    outlierReason: 'Extreme chemoresistance (Z=2.35, AUC > 1.15) driven by dual TP53 deletion and PIK3CA activation bypass.'
  },
  {
    id: 'DRO-25',
    cellLine: 'K562',
    cancerType: 'Leukemia (CML)',
    drug: 'Imatinib (Gleevec)',
    compoundClass: 'BCR-ABL1 TKI',
    auc: 0.16,
    responseClass: 'Very Sensitive',
    keyMutations: ['BCR-ABL1 Fusion', 'TP53 Q136fs'],
    targetPathway: 'ABL Kinase Signaling',
    isOutlier: true,
    zScore: -2.18,
    outlierReason: 'Unusually high hypersensitivity outlier (Z=-2.18, AUC 0.16) due to oncogene addiction to BCR-ABL1 translocation.'
  },
  {
    id: 'DRO-26',
    cellLine: 'K562',
    cancerType: 'Leukemia (CML)',
    drug: 'Palbociclib',
    compoundClass: 'CDK4/6 Inhibitor',
    auc: 0.91,
    responseClass: 'Resistant',
    keyMutations: ['CDKN2A Del'],
    targetPathway: 'Cell Cycle Control',
    isOutlier: false,
    zScore: 1.10
  },
  {
    id: 'DRO-27',
    cellLine: 'HepG2',
    cancerType: 'Liver (HCC)',
    drug: 'Sorafenib',
    compoundClass: 'Multi-Kinase (VEGFR/RAF)',
    auc: 0.72,
    responseClass: 'Moderate',
    keyMutations: ['NRAS Q61L', 'CTNNB1 delW383'],
    targetPathway: 'Angiogenesis / RAF',
    isOutlier: false,
    zScore: 0.25
  },
  {
    id: 'DRO-28',
    cellLine: 'HepG2',
    cancerType: 'Liver (HCC)',
    drug: 'SN-38',
    compoundClass: 'Topoisomerase I Inhibitor',
    auc: 0.65,
    responseClass: 'Moderate',
    keyMutations: ['CTNNB1 delW383'],
    targetPathway: 'DNA Replication',
    isOutlier: false,
    zScore: -0.05
  },
  {
    id: 'DRO-29',
    cellLine: 'BT-474',
    cancerType: 'Breast (HER2+)',
    drug: 'Trastuzumab + Lapatinib',
    compoundClass: 'Dual HER2/EGFR Blockade',
    auc: 0.24,
    responseClass: 'Very Sensitive',
    keyMutations: ['ERBB2 Amp', 'PIK3CA K111N'],
    targetPathway: 'HER2 Signaling',
    isOutlier: false,
    zScore: -1.82
  },
  {
    id: 'DRO-30',
    cellLine: 'NCI-H1975',
    cancerType: 'Non-Small Cell Lung',
    drug: 'Osimertinib',
    compoundClass: '3rd-Gen EGFR TKI',
    auc: 0.29,
    responseClass: 'Very Sensitive',
    keyMutations: ['EGFR T790M', 'EGFR L858R', 'TP53 R273H'],
    targetPathway: 'RTK Signaling',
    isOutlier: false,
    zScore: -1.60
  },
  {
    id: 'DRO-31',
    cellLine: 'NCI-H1975',
    cancerType: 'Non-Small Cell Lung',
    drug: 'Gefitinib (Refractory)',
    compoundClass: '1st-Gen EGFR TKI',
    auc: 1.15,
    responseClass: 'Very Resistant',
    keyMutations: ['EGFR T790M Gatekeeper'],
    targetPathway: 'RTK Signaling',
    isOutlier: true,
    zScore: 2.22,
    outlierReason: 'Steric gatekeeper mutation T790M prevents reversible 1st-gen TKI binding, causing severe resistance outlier.'
  }
];

// Heatmap Matrix Data (Cell Lines x Drugs)
export const HEATMAP_CELL_LINES = [
  'MDA-MB-231',
  'MCF7',
  'PC-9',
  'A549',
  'HCT116',
  'HT-29',
  'A375',
  'SK-MEL-28',
  'OVCAR-3',
  'K562'
];

export const HEATMAP_DRUGS = [
  'Alpelisib',
  'Palbociclib',
  'Osimertinib',
  'Gefitinib',
  'SN-38',
  'Cetuximab',
  'Dabrafenib',
  'Olaparib',
  'Imatinib',
  'Cisplatin'
];

export interface HeatmapCell {
  cellLine: string;
  drug: string;
  auc: number;
  responseClass: ResponseClass;
  cancerType: string;
  mechanism: string;
}

export const HEATMAP_MATRIX: HeatmapCell[] = [
  // MDA-MB-231
  { cellLine: 'MDA-MB-231', drug: 'Alpelisib', auc: 0.32, responseClass: 'Very Sensitive', cancerType: 'Breast', mechanism: 'PI3Kα Inhibitor' },
  { cellLine: 'MDA-MB-231', drug: 'Palbociclib', auc: 0.88, responseClass: 'Resistant', cancerType: 'Breast', mechanism: 'CDK4/6 Inhibitor' },
  { cellLine: 'MDA-MB-231', drug: 'Osimertinib', auc: 0.74, responseClass: 'Moderate', cancerType: 'Breast', mechanism: 'EGFR TKI' },
  { cellLine: 'MDA-MB-231', drug: 'Gefitinib', auc: 0.81, responseClass: 'Resistant', cancerType: 'Breast', mechanism: 'EGFR TKI' },
  { cellLine: 'MDA-MB-231', drug: 'SN-38', auc: 0.49, responseClass: 'Sensitive', cancerType: 'Breast', mechanism: 'Topo I Inhibitor' },
  { cellLine: 'MDA-MB-231', drug: 'Cetuximab', auc: 0.84, responseClass: 'Resistant', cancerType: 'Breast', mechanism: 'Anti-EGFR mAb' },
  { cellLine: 'MDA-MB-231', drug: 'Dabrafenib', auc: 0.67, responseClass: 'Moderate', cancerType: 'Breast', mechanism: 'BRAF Inhibitor' },
  { cellLine: 'MDA-MB-231', drug: 'Olaparib', auc: 0.58, responseClass: 'Sensitive', cancerType: 'Breast', mechanism: 'PARP Inhibitor' },
  { cellLine: 'MDA-MB-231', drug: 'Imatinib', auc: 0.89, responseClass: 'Resistant', cancerType: 'Breast', mechanism: 'ABL/KIT TKI' },
  { cellLine: 'MDA-MB-231', drug: 'Cisplatin', auc: 0.55, responseClass: 'Sensitive', cancerType: 'Breast', mechanism: 'DNA Crosslinker' },

  // MCF7
  { cellLine: 'MCF7', drug: 'Alpelisib', auc: 0.39, responseClass: 'Very Sensitive', cancerType: 'Breast', mechanism: 'PI3Kα Inhibitor' },
  { cellLine: 'MCF7', drug: 'Palbociclib', auc: 0.48, responseClass: 'Sensitive', cancerType: 'Breast', mechanism: 'CDK4/6 Inhibitor' },
  { cellLine: 'MCF7', drug: 'Osimertinib', auc: 0.78, responseClass: 'Moderate', cancerType: 'Breast', mechanism: 'EGFR TKI' },
  { cellLine: 'MCF7', drug: 'Gefitinib', auc: 0.76, responseClass: 'Moderate', cancerType: 'Breast', mechanism: 'EGFR TKI' },
  { cellLine: 'MCF7', drug: 'SN-38', auc: 0.52, responseClass: 'Sensitive', cancerType: 'Breast', mechanism: 'Topo I Inhibitor' },
  { cellLine: 'MCF7', drug: 'Cetuximab', auc: 0.82, responseClass: 'Resistant', cancerType: 'Breast', mechanism: 'Anti-EGFR mAb' },
  { cellLine: 'MCF7', drug: 'Dabrafenib', auc: 0.79, responseClass: 'Moderate', cancerType: 'Breast', mechanism: 'BRAF Inhibitor' },
  { cellLine: 'MCF7', drug: 'Olaparib', auc: 0.71, responseClass: 'Moderate', cancerType: 'Breast', mechanism: 'PARP Inhibitor' },
  { cellLine: 'MCF7', drug: 'Imatinib', auc: 0.92, responseClass: 'Resistant', cancerType: 'Breast', mechanism: 'ABL/KIT TKI' },
  { cellLine: 'MCF7', drug: 'Cisplatin', auc: 0.79, responseClass: 'Moderate', cancerType: 'Breast', mechanism: 'DNA Crosslinker' },

  // PC-9
  { cellLine: 'PC-9', drug: 'Alpelisib', auc: 0.65, responseClass: 'Moderate', cancerType: 'Lung', mechanism: 'PI3Kα Inhibitor' },
  { cellLine: 'PC-9', drug: 'Palbociclib', auc: 0.82, responseClass: 'Resistant', cancerType: 'Lung', mechanism: 'CDK4/6 Inhibitor' },
  { cellLine: 'PC-9', drug: 'Osimertinib', auc: 0.28, responseClass: 'Very Sensitive', cancerType: 'Lung', mechanism: 'EGFR TKI' },
  { cellLine: 'PC-9', drug: 'Gefitinib', auc: 0.31, responseClass: 'Very Sensitive', cancerType: 'Lung', mechanism: 'EGFR TKI' },
  { cellLine: 'PC-9', drug: 'SN-38', auc: 0.53, responseClass: 'Sensitive', cancerType: 'Lung', mechanism: 'Topo I Inhibitor' },
  { cellLine: 'PC-9', drug: 'Cetuximab', auc: 0.44, responseClass: 'Sensitive', cancerType: 'Lung', mechanism: 'Anti-EGFR mAb' },
  { cellLine: 'PC-9', drug: 'Dabrafenib', auc: 0.85, responseClass: 'Resistant', cancerType: 'Lung', mechanism: 'BRAF Inhibitor' },
  { cellLine: 'PC-9', drug: 'Olaparib', auc: 0.69, responseClass: 'Moderate', cancerType: 'Lung', mechanism: 'PARP Inhibitor' },
  { cellLine: 'PC-9', drug: 'Imatinib', auc: 0.87, responseClass: 'Resistant', cancerType: 'Lung', mechanism: 'ABL/KIT TKI' },
  { cellLine: 'PC-9', drug: 'Cisplatin', auc: 0.62, responseClass: 'Moderate', cancerType: 'Lung', mechanism: 'DNA Crosslinker' },

  // A549
  { cellLine: 'A549', drug: 'Alpelisib', auc: 0.72, responseClass: 'Moderate', cancerType: 'Lung', mechanism: 'PI3Kα Inhibitor' },
  { cellLine: 'A549', drug: 'Palbociclib', auc: 0.75, responseClass: 'Moderate', cancerType: 'Lung', mechanism: 'CDK4/6 Inhibitor' },
  { cellLine: 'A549', drug: 'Osimertinib', auc: 0.85, responseClass: 'Resistant', cancerType: 'Lung', mechanism: 'EGFR TKI' },
  { cellLine: 'A549', drug: 'Gefitinib', auc: 0.89, responseClass: 'Resistant', cancerType: 'Lung', mechanism: 'EGFR TKI' },
  { cellLine: 'A549', drug: 'SN-38', auc: 0.58, responseClass: 'Sensitive', cancerType: 'Lung', mechanism: 'Topo I Inhibitor' },
  { cellLine: 'A549', drug: 'Cetuximab', auc: 0.90, responseClass: 'Resistant', cancerType: 'Lung', mechanism: 'Anti-EGFR mAb' },
  { cellLine: 'A549', drug: 'Dabrafenib', auc: 0.82, responseClass: 'Resistant', cancerType: 'Lung', mechanism: 'BRAF Inhibitor' },
  { cellLine: 'A549', drug: 'Olaparib', auc: 0.77, responseClass: 'Moderate', cancerType: 'Lung', mechanism: 'PARP Inhibitor' },
  { cellLine: 'A549', drug: 'Imatinib', auc: 0.86, responseClass: 'Resistant', cancerType: 'Lung', mechanism: 'ABL/KIT TKI' },
  { cellLine: 'A549', drug: 'Cisplatin', auc: 0.69, responseClass: 'Moderate', cancerType: 'Lung', mechanism: 'DNA Crosslinker' },

  // HCT116
  { cellLine: 'HCT116', drug: 'Alpelisib', auc: 0.42, responseClass: 'Sensitive', cancerType: 'Colorectal', mechanism: 'PI3Kα Inhibitor' },
  { cellLine: 'HCT116', drug: 'Palbociclib', auc: 0.73, responseClass: 'Moderate', cancerType: 'Colorectal', mechanism: 'CDK4/6 Inhibitor' },
  { cellLine: 'HCT116', drug: 'Osimertinib', auc: 0.82, responseClass: 'Resistant', cancerType: 'Colorectal', mechanism: 'EGFR TKI' },
  { cellLine: 'HCT116', drug: 'Gefitinib', auc: 0.86, responseClass: 'Resistant', cancerType: 'Colorectal', mechanism: 'EGFR TKI' },
  { cellLine: 'HCT116', drug: 'SN-38', auc: 0.54, responseClass: 'Sensitive', cancerType: 'Colorectal', mechanism: 'Topo I Inhibitor' },
  { cellLine: 'HCT116', drug: 'Cetuximab', auc: 0.92, responseClass: 'Resistant', cancerType: 'Colorectal', mechanism: 'Anti-EGFR mAb' },
  { cellLine: 'HCT116', drug: 'Dabrafenib', auc: 0.74, responseClass: 'Moderate', cancerType: 'Colorectal', mechanism: 'BRAF Inhibitor' },
  { cellLine: 'HCT116', drug: 'Olaparib', auc: 0.49, responseClass: 'Sensitive', cancerType: 'Colorectal', mechanism: 'PARP Inhibitor' },
  { cellLine: 'HCT116', drug: 'Imatinib', auc: 0.88, responseClass: 'Resistant', cancerType: 'Colorectal', mechanism: 'ABL/KIT TKI' },
  { cellLine: 'HCT116', drug: 'Cisplatin', auc: 0.58, responseClass: 'Sensitive', cancerType: 'Colorectal', mechanism: 'DNA Crosslinker' },

  // HT-29
  { cellLine: 'HT-29', drug: 'Alpelisib', auc: 0.61, responseClass: 'Moderate', cancerType: 'Colorectal', mechanism: 'PI3Kα Inhibitor' },
  { cellLine: 'HT-29', drug: 'Palbociclib', auc: 0.79, responseClass: 'Moderate', cancerType: 'Colorectal', mechanism: 'CDK4/6 Inhibitor' },
  { cellLine: 'HT-29', drug: 'Osimertinib', auc: 0.79, responseClass: 'Moderate', cancerType: 'Colorectal', mechanism: 'EGFR TKI' },
  { cellLine: 'HT-29', drug: 'Gefitinib', auc: 0.83, responseClass: 'Resistant', cancerType: 'Colorectal', mechanism: 'EGFR TKI' },
  { cellLine: 'HT-29', drug: 'SN-38', auc: 0.63, responseClass: 'Moderate', cancerType: 'Colorectal', mechanism: 'Topo I Inhibitor' },
  { cellLine: 'HT-29', drug: 'Cetuximab', auc: 0.68, responseClass: 'Moderate', cancerType: 'Colorectal', mechanism: 'Anti-EGFR mAb' },
  { cellLine: 'HT-29', drug: 'Dabrafenib', auc: 0.45, responseClass: 'Sensitive', cancerType: 'Colorectal', mechanism: 'BRAF Inhibitor' },
  { cellLine: 'HT-29', drug: 'Olaparib', auc: 0.73, responseClass: 'Moderate', cancerType: 'Colorectal', mechanism: 'PARP Inhibitor' },
  { cellLine: 'HT-29', drug: 'Imatinib', auc: 0.89, responseClass: 'Resistant', cancerType: 'Colorectal', mechanism: 'ABL/KIT TKI' },
  { cellLine: 'HT-29', drug: 'Cisplatin', auc: 0.71, responseClass: 'Moderate', cancerType: 'Colorectal', mechanism: 'DNA Crosslinker' },

  // A375
  { cellLine: 'A375', drug: 'Alpelisib', auc: 0.62, responseClass: 'Moderate', cancerType: 'Melanoma', mechanism: 'PI3Kα Inhibitor' },
  { cellLine: 'A375', drug: 'Palbociclib', auc: 0.62, responseClass: 'Moderate', cancerType: 'Melanoma', mechanism: 'CDK4/6 Inhibitor' },
  { cellLine: 'A375', drug: 'Osimertinib', auc: 0.76, responseClass: 'Moderate', cancerType: 'Melanoma', mechanism: 'EGFR TKI' },
  { cellLine: 'A375', drug: 'Gefitinib', auc: 0.84, responseClass: 'Resistant', cancerType: 'Melanoma', mechanism: 'EGFR TKI' },
  { cellLine: 'A375', drug: 'SN-38', auc: 0.48, responseClass: 'Sensitive', cancerType: 'Melanoma', mechanism: 'Topo I Inhibitor' },
  { cellLine: 'A375', drug: 'Cetuximab', auc: 0.89, responseClass: 'Resistant', cancerType: 'Melanoma', mechanism: 'Anti-EGFR mAb' },
  { cellLine: 'A375', drug: 'Dabrafenib', auc: 0.22, responseClass: 'Very Sensitive', cancerType: 'Melanoma', mechanism: 'BRAF Inhibitor' },
  { cellLine: 'A375', drug: 'Olaparib', auc: 0.65, responseClass: 'Moderate', cancerType: 'Melanoma', mechanism: 'PARP Inhibitor' },
  { cellLine: 'A375', drug: 'Imatinib', auc: 0.84, responseClass: 'Resistant', cancerType: 'Melanoma', mechanism: 'ABL/KIT TKI' },
  { cellLine: 'A375', drug: 'Cisplatin', auc: 0.66, responseClass: 'Moderate', cancerType: 'Melanoma', mechanism: 'DNA Crosslinker' },

  // SK-MEL-28
  { cellLine: 'SK-MEL-28', drug: 'Alpelisib', auc: 0.52, responseClass: 'Sensitive', cancerType: 'Melanoma', mechanism: 'PI3Kα Inhibitor' },
  { cellLine: 'SK-MEL-28', drug: 'Palbociclib', auc: 0.76, responseClass: 'Moderate', cancerType: 'Melanoma', mechanism: 'CDK4/6 Inhibitor' },
  { cellLine: 'SK-MEL-28', drug: 'Osimertinib', auc: 0.80, responseClass: 'Resistant', cancerType: 'Melanoma', mechanism: 'EGFR TKI' },
  { cellLine: 'SK-MEL-28', drug: 'Gefitinib', auc: 0.87, responseClass: 'Resistant', cancerType: 'Melanoma', mechanism: 'EGFR TKI' },
  { cellLine: 'SK-MEL-28', drug: 'SN-38', auc: 0.60, responseClass: 'Sensitive', cancerType: 'Melanoma', mechanism: 'Topo I Inhibitor' },
  { cellLine: 'SK-MEL-28', drug: 'Cetuximab', auc: 0.91, responseClass: 'Resistant', cancerType: 'Melanoma', mechanism: 'Anti-EGFR mAb' },
  { cellLine: 'SK-MEL-28', drug: 'Dabrafenib', auc: 0.86, responseClass: 'Resistant', cancerType: 'Melanoma', mechanism: 'BRAF Inhibitor' },
  { cellLine: 'SK-MEL-28', drug: 'Olaparib', auc: 0.74, responseClass: 'Moderate', cancerType: 'Melanoma', mechanism: 'PARP Inhibitor' },
  { cellLine: 'SK-MEL-28', drug: 'Imatinib', auc: 0.87, responseClass: 'Resistant', cancerType: 'Melanoma', mechanism: 'ABL/KIT TKI' },
  { cellLine: 'SK-MEL-28', drug: 'Cisplatin', auc: 0.72, responseClass: 'Moderate', cancerType: 'Melanoma', mechanism: 'DNA Crosslinker' },

  // OVCAR-3
  { cellLine: 'OVCAR-3', drug: 'Alpelisib', auc: 0.68, responseClass: 'Moderate', cancerType: 'Ovarian', mechanism: 'PI3Kα Inhibitor' },
  { cellLine: 'OVCAR-3', drug: 'Palbociclib', auc: 0.80, responseClass: 'Resistant', cancerType: 'Ovarian', mechanism: 'CDK4/6 Inhibitor' },
  { cellLine: 'OVCAR-3', drug: 'Osimertinib', auc: 0.79, responseClass: 'Moderate', cancerType: 'Ovarian', mechanism: 'EGFR TKI' },
  { cellLine: 'OVCAR-3', drug: 'Gefitinib', auc: 0.82, responseClass: 'Resistant', cancerType: 'Ovarian', mechanism: 'EGFR TKI' },
  { cellLine: 'OVCAR-3', drug: 'SN-38', auc: 0.46, responseClass: 'Sensitive', cancerType: 'Ovarian', mechanism: 'Topo I Inhibitor' },
  { cellLine: 'OVCAR-3', drug: 'Cetuximab', auc: 0.87, responseClass: 'Resistant', cancerType: 'Ovarian', mechanism: 'Anti-EGFR mAb' },
  { cellLine: 'OVCAR-3', drug: 'Dabrafenib', auc: 0.83, responseClass: 'Resistant', cancerType: 'Ovarian', mechanism: 'BRAF Inhibitor' },
  { cellLine: 'OVCAR-3', drug: 'Olaparib', auc: 0.44, responseClass: 'Sensitive', cancerType: 'Ovarian', mechanism: 'PARP Inhibitor' },
  { cellLine: 'OVCAR-3', drug: 'Imatinib', auc: 0.91, responseClass: 'Resistant', cancerType: 'Ovarian', mechanism: 'ABL/KIT TKI' },
  { cellLine: 'OVCAR-3', drug: 'Cisplatin', auc: 0.50, responseClass: 'Sensitive', cancerType: 'Ovarian', mechanism: 'DNA Crosslinker' },

  // K562
  { cellLine: 'K562', drug: 'Alpelisib', auc: 0.76, responseClass: 'Moderate', cancerType: 'Leukemia', mechanism: 'PI3Kα Inhibitor' },
  { cellLine: 'K562', drug: 'Palbociclib', auc: 0.91, responseClass: 'Resistant', cancerType: 'Leukemia', mechanism: 'CDK4/6 Inhibitor' },
  { cellLine: 'K562', drug: 'Osimertinib', auc: 0.83, responseClass: 'Resistant', cancerType: 'Leukemia', mechanism: 'EGFR TKI' },
  { cellLine: 'K562', drug: 'Gefitinib', auc: 0.88, responseClass: 'Resistant', cancerType: 'Leukemia', mechanism: 'EGFR TKI' },
  { cellLine: 'K562', drug: 'SN-38', auc: 0.52, responseClass: 'Sensitive', cancerType: 'Leukemia', mechanism: 'Topo I Inhibitor' },
  { cellLine: 'K562', drug: 'Cetuximab', auc: 0.94, responseClass: 'Resistant', cancerType: 'Leukemia', mechanism: 'Anti-EGFR mAb' },
  { cellLine: 'K562', drug: 'Dabrafenib', auc: 0.87, responseClass: 'Resistant', cancerType: 'Leukemia', mechanism: 'BRAF Inhibitor' },
  { cellLine: 'K562', drug: 'Olaparib', auc: 0.78, responseClass: 'Moderate', cancerType: 'Leukemia', mechanism: 'PARP Inhibitor' },
  { cellLine: 'K562', drug: 'Imatinib', auc: 0.16, responseClass: 'Very Sensitive', cancerType: 'Leukemia', mechanism: 'ABL/KIT TKI' },
  { cellLine: 'K562', drug: 'Cisplatin', auc: 0.64, responseClass: 'Moderate', cancerType: 'Leukemia', mechanism: 'DNA Crosslinker' }
];

// Gene-Response Associations for Section 17
export interface GeneResponseAssociation {
  gene: string;
  alterationCount: number;
  wildtypeCount: number;
  description: string;
  associatedDrugs: Array<{
    drug: string;
    alteredMedianAuc: number;
    wildtypeMedianAuc: number;
    deltaAuc: number;
    pValue: string;
    trend: 'Sensitivity Association' | 'Resistance Association';
  }>;
  distributionHistogram: Array<{
    aucBin: string;
    alteredPercentage: number;
    wildtypePercentage: number;
  }>;
}

export const GENE_RESPONSE_ASSOCIATIONS: Record<string, GeneResponseAssociation> = {
  TP53: {
    gene: 'TP53',
    alterationCount: 482,
    wildtypeCount: 512,
    description: 'Tumor suppressor p53 is the most frequently mutated gene across human cancers. Loss of functional p53 impairs DNA-damage apoptosis.',
    associatedDrugs: [
      { drug: 'Nutlin-3a (MDM2 inhibitor)', alteredMedianAuc: 0.92, wildtypeMedianAuc: 0.41, deltaAuc: 0.51, pValue: '< 1e-12', trend: 'Resistance Association' },
      { drug: 'Cisplatin', alteredMedianAuc: 0.68, wildtypeMedianAuc: 0.54, deltaAuc: 0.14, pValue: '2.4e-5', trend: 'Resistance Association' },
      { drug: 'Wee1 Inhibitor (Adavosertib)', alteredMedianAuc: 0.38, wildtypeMedianAuc: 0.62, deltaAuc: -0.24, pValue: '1.1e-7', trend: 'Sensitivity Association' }
    ],
    distributionHistogram: [
      { aucBin: '0.1 - 0.3', alteredPercentage: 8, wildtypePercentage: 18 },
      { aucBin: '0.3 - 0.5', alteredPercentage: 24, wildtypePercentage: 36 },
      { aucBin: '0.5 - 0.7', alteredPercentage: 38, wildtypePercentage: 31 },
      { aucBin: '0.7 - 0.9', alteredPercentage: 22, wildtypePercentage: 12 },
      { aucBin: '> 0.9', alteredPercentage: 8, wildtypePercentage: 3 }
    ]
  },
  PIK3CA: {
    gene: 'PIK3CA',
    alterationCount: 215,
    wildtypeCount: 779,
    description: 'Catalytic subunit of PI3K with hotspot mutations (E545K, H1047R) leading to constitutive AKT phosphorylation.',
    associatedDrugs: [
      { drug: 'Alpelisib (BYL719)', alteredMedianAuc: 0.34, wildtypeMedianAuc: 0.68, deltaAuc: -0.34, pValue: '< 1e-10', trend: 'Sensitivity Association' },
      { drug: 'Taselisib (GDC-0032)', alteredMedianAuc: 0.37, wildtypeMedianAuc: 0.71, deltaAuc: -0.34, pValue: '3.8e-9', trend: 'Sensitivity Association' },
      { drug: 'Rapamycin (mTORC1)', alteredMedianAuc: 0.44, wildtypeMedianAuc: 0.65, deltaAuc: -0.21, pValue: '4.2e-6', trend: 'Sensitivity Association' }
    ],
    distributionHistogram: [
      { aucBin: '0.1 - 0.3', alteredPercentage: 22, wildtypePercentage: 6 },
      { aucBin: '0.3 - 0.5', alteredPercentage: 42, wildtypePercentage: 24 },
      { aucBin: '0.5 - 0.7', alteredPercentage: 24, wildtypePercentage: 38 },
      { aucBin: '0.7 - 0.9', alteredPercentage: 10, wildtypePercentage: 22 },
      { aucBin: '> 0.9', alteredPercentage: 2, wildtypePercentage: 10 }
    ]
  },
  BRAF: {
    gene: 'BRAF',
    alterationCount: 128,
    wildtypeCount: 866,
    description: 'Serine/threonine-protein kinase in the MAPK cascade; V600E alteration confers constitutive monomeric activation.',
    associatedDrugs: [
      { drug: 'Dabrafenib', alteredMedianAuc: 0.25, wildtypeMedianAuc: 0.84, deltaAuc: -0.59, pValue: '< 1e-15', trend: 'Sensitivity Association' },
      { drug: 'Trametinib (MEK1/2)', alteredMedianAuc: 0.31, wildtypeMedianAuc: 0.76, deltaAuc: -0.45, pValue: '< 1e-12', trend: 'Sensitivity Association' },
      { drug: 'Cetuximab (anti-EGFR)', alteredMedianAuc: 0.88, wildtypeMedianAuc: 0.62, deltaAuc: 0.26, pValue: '1.9e-6', trend: 'Resistance Association' }
    ],
    distributionHistogram: [
      { aucBin: '0.1 - 0.3', alteredPercentage: 35, wildtypePercentage: 5 },
      { aucBin: '0.3 - 0.5', alteredPercentage: 32, wildtypePercentage: 21 },
      { aucBin: '0.5 - 0.7', alteredPercentage: 18, wildtypePercentage: 36 },
      { aucBin: '0.7 - 0.9', alteredPercentage: 11, wildtypePercentage: 28 },
      { aucBin: '> 0.9', alteredPercentage: 4, wildtypePercentage: 10 }
    ]
  },
  EGFR: {
    gene: 'EGFR',
    alterationCount: 94,
    wildtypeCount: 900,
    description: 'Epidermal growth factor receptor tyrosine kinase; exon 19 deletions and L858R point mutations drive lung adenocarcinoma.',
    associatedDrugs: [
      { drug: 'Osimertinib (AZD9291)', alteredMedianAuc: 0.28, wildtypeMedianAuc: 0.81, deltaAuc: -0.53, pValue: '< 1e-14', trend: 'Sensitivity Association' },
      { drug: 'Gefitinib', alteredMedianAuc: 0.32, wildtypeMedianAuc: 0.85, deltaAuc: -0.53, pValue: '< 1e-12', trend: 'Sensitivity Association' },
      { drug: 'Afatinib', alteredMedianAuc: 0.29, wildtypeMedianAuc: 0.79, deltaAuc: -0.50, pValue: '< 1e-11', trend: 'Sensitivity Association' }
    ],
    distributionHistogram: [
      { aucBin: '0.1 - 0.3', alteredPercentage: 38, wildtypePercentage: 4 },
      { aucBin: '0.3 - 0.5', alteredPercentage: 34, wildtypePercentage: 18 },
      { aucBin: '0.5 - 0.7', alteredPercentage: 16, wildtypePercentage: 38 },
      { aucBin: '0.7 - 0.9', alteredPercentage: 9, wildtypePercentage: 29 },
      { aucBin: '> 0.9', alteredPercentage: 3, wildtypePercentage: 11 }
    ]
  },
  PTEN: {
    gene: 'PTEN',
    alterationCount: 186,
    wildtypeCount: 808,
    description: 'Phosphatase and tensin homolog acting as a master negative regulator of PIP3 and the PI3K-AKT-mTOR cascade.',
    associatedDrugs: [
      { drug: 'Capivasertib (AKT1/2/3)', alteredMedianAuc: 0.36, wildtypeMedianAuc: 0.72, deltaAuc: -0.36, pValue: '5.2e-9', trend: 'Sensitivity Association' },
      { drug: 'Everolimus (mTORC1)', alteredMedianAuc: 0.42, wildtypeMedianAuc: 0.69, deltaAuc: -0.27, pValue: '2.1e-7', trend: 'Sensitivity Association' },
      { drug: 'Trastuzumab', alteredMedianAuc: 0.86, wildtypeMedianAuc: 0.58, deltaAuc: 0.28, pValue: '8.4e-6', trend: 'Resistance Association' }
    ],
    distributionHistogram: [
      { aucBin: '0.1 - 0.3', alteredPercentage: 19, wildtypePercentage: 7 },
      { aucBin: '0.3 - 0.5', alteredPercentage: 39, wildtypePercentage: 25 },
      { aucBin: '0.5 - 0.7', alteredPercentage: 26, wildtypePercentage: 37 },
      { aucBin: '0.7 - 0.9', alteredPercentage: 12, wildtypePercentage: 23 },
      { aucBin: '> 0.9', alteredPercentage: 4, wildtypePercentage: 8 }
    ]
  },
  CDKN2A: {
    gene: 'CDKN2A',
    alterationCount: 340,
    wildtypeCount: 654,
    description: 'Encodes p16INK4a and p14ARF cyclin-dependent kinase inhibitors regulating the retinoblastoma (Rb) G1/S restriction checkpoint.',
    associatedDrugs: [
      { drug: 'Palbociclib (in RB1-intact)', alteredMedianAuc: 0.46, wildtypeMedianAuc: 0.78, deltaAuc: -0.32, pValue: '1.4e-8', trend: 'Sensitivity Association' },
      { drug: 'Abemaciclib', alteredMedianAuc: 0.42, wildtypeMedianAuc: 0.74, deltaAuc: -0.32, pValue: '9.2e-8', trend: 'Sensitivity Association' },
      { drug: 'Methotrexate', alteredMedianAuc: 0.72, wildtypeMedianAuc: 0.69, deltaAuc: 0.03, pValue: '0.41', trend: 'Resistance Association' }
    ],
    distributionHistogram: [
      { aucBin: '0.1 - 0.3', alteredPercentage: 15, wildtypePercentage: 9 },
      { aucBin: '0.3 - 0.5', alteredPercentage: 35, wildtypePercentage: 28 },
      { aucBin: '0.5 - 0.7', alteredPercentage: 32, wildtypePercentage: 34 },
      { aucBin: '0.7 - 0.9', alteredPercentage: 14, wildtypePercentage: 22 },
      { aucBin: '> 0.9', alteredPercentage: 4, wildtypePercentage: 7 }
    ]
  },
  KRAS: {
    gene: 'KRAS',
    alterationCount: 198,
    wildtypeCount: 796,
    description: 'Small GTPase cycling between active GTP-bound and inactive GDP-bound states; G12/G13 mutations impair intrinsic GTP hydrolysis.',
    associatedDrugs: [
      { drug: 'Sotorasib (KRAS G12C specific)', alteredMedianAuc: 0.30, wildtypeMedianAuc: 0.94, deltaAuc: -0.64, pValue: '< 1e-12', trend: 'Sensitivity Association' },
      { drug: 'Cetuximab (anti-EGFR)', alteredMedianAuc: 0.91, wildtypeMedianAuc: 0.56, deltaAuc: 0.35, pValue: '< 1e-10', trend: 'Resistance Association' },
      { drug: 'Panitumumab', alteredMedianAuc: 0.92, wildtypeMedianAuc: 0.58, deltaAuc: 0.34, pValue: '< 1e-9', trend: 'Resistance Association' }
    ],
    distributionHistogram: [
      { aucBin: '0.1 - 0.3', alteredPercentage: 12, wildtypePercentage: 11 },
      { aucBin: '0.3 - 0.5', alteredPercentage: 28, wildtypePercentage: 30 },
      { aucBin: '0.5 - 0.7', alteredPercentage: 34, wildtypePercentage: 35 },
      { aucBin: '0.7 - 0.9', alteredPercentage: 20, wildtypePercentage: 18 },
      { aucBin: '> 0.9', alteredPercentage: 6, wildtypePercentage: 6 }
    ]
  },
  BRCA1: {
    gene: 'BRCA1',
    alterationCount: 72,
    wildtypeCount: 922,
    description: 'Essential mediator of double-strand break repair through homologous recombination; deficiency leads to synthetic lethality with PARP inhibitors.',
    associatedDrugs: [
      { drug: 'Olaparib (PARP1/2)', alteredMedianAuc: 0.32, wildtypeMedianAuc: 0.77, deltaAuc: -0.45, pValue: '< 1e-12', trend: 'Sensitivity Association' },
      { drug: 'Talazoparib', alteredMedianAuc: 0.28, wildtypeMedianAuc: 0.75, deltaAuc: -0.47, pValue: '< 1e-13', trend: 'Sensitivity Association' },
      { drug: 'Cisplatin', alteredMedianAuc: 0.42, wildtypeMedianAuc: 0.65, deltaAuc: -0.23, pValue: '4.8e-6', trend: 'Sensitivity Association' }
    ],
    distributionHistogram: [
      { aucBin: '0.1 - 0.3', alteredPercentage: 31, wildtypePercentage: 6 },
      { aucBin: '0.3 - 0.5', alteredPercentage: 40, wildtypePercentage: 22 },
      { aucBin: '0.5 - 0.7', alteredPercentage: 18, wildtypePercentage: 39 },
      { aucBin: '0.7 - 0.9', alteredPercentage: 9, wildtypePercentage: 25 },
      { aucBin: '> 0.9', alteredPercentage: 2, wildtypePercentage: 8 }
    ]
  }
};

