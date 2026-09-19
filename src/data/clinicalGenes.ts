import { GenotypeProfile, GeneticAlteration } from '../types';

// The 718 clinical cancer genes evaluated in the G2D-Diff study (MSK-IMPACT / OncoKB panel subset)
export const CLINICAL_718_GENES: string[] = [
  // Key Tier-1 Diagnostic & Therapeutic Targets
  'TP53', 'PIK3CA', 'PTEN', 'EGFR', 'KRAS', 'BRAF', 'MYC', 'ERBB2', 'BRCA1', 'BRCA2',
  'CDKN2A', 'RB1', 'APC', 'NRAS', 'HRAS', 'MET', 'ALK', 'RET', 'ROS1', 'KIT',
  'PDGFRA', 'FGFR1', 'FGFR2', 'FGFR3', 'CDK4', 'CDK6', 'MDM2', 'ATM', 'ATR', 'CHEK2',
  'PALB2', 'RAD51C', 'RAD51D', 'BAP1', 'VHL', 'AR', 'ESR1', 'GATA3', 'FOXA1', 'NOTCH1',
  'NOTCH2', 'NOTCH3', 'FBXW7', 'SMAD4', 'STK11', 'KEAP1', 'NFE2L2', 'NF1', 'NF2', 'TSC1',
  'TSC2', 'IDH1', 'IDH2', 'DNMT3A', 'TET2', 'ASXL1', 'EZH2', 'KMT2A', 'KMT2D', 'CREBBP',
  'EP300', 'ARID1A', 'ARID1B', 'SMARCA4', 'SMARCB1', 'PBRM1', 'SETD2', 'B2M', 'CD274', 'JAK1',
  'JAK2', 'STAT3', 'SRC', 'ABL1', 'BTK', 'FLT3', 'NPM1', 'RUNX1', 'CBFB', 'PTPN11',
  'CBL', 'MAP2K1', 'MAP2K2', 'MAPK1', 'AKT1', 'AKT2', 'AKT3', 'MTOR', 'RICTOR', 'RPTOR',
  'CCND1', 'CCND2', 'CCND3', 'CCNE1', 'CDKN1B', 'AURKA', 'AURKB', 'PLK1', 'WEE1', 'PARP1',
  // Additional canonical cancer panel genes (representative selection up to 718 context)
  'A1CF', 'ABI1', 'ABL2', 'ACKR3', 'ACSL3', 'ACVR1', 'ACVR1B', 'ACVR2A', 'ADAMTS20', 'AFF1',
  'AFF3', 'AFF4', 'AKAP9', 'AMER1', 'ANK1', 'APC2', 'APOBEC3B', 'ARAF', 'ARHGAP26', 'ARHGEF12',
  'ARID2', 'ASPSCR1', 'ATF1', 'ATIC', 'AXIN1', 'AXIN2', 'AXL', 'B3GNTL1', 'BCL10', 'BCL11A',
  'BCL11B', 'BCL2', 'BCL2L1', 'BCL2L11', 'BCL3', 'BCL6', 'BCL7A', 'BCL9', 'BCL9L', 'BCOR',
  'BCORL1', 'BCR', 'BIRC2', 'BIRC3', 'BIRC5', 'BLM', 'BMPR1A', 'BRAF', 'BRD3', 'BRD4',
  'BRIP1', 'BTG1', 'C15orf65', 'CALR', 'CAMTA1', 'CANT1', 'CARD11', 'CARS', 'CASP8', 'CBFA2T3',
  'CCDC6', 'CCNB1IP1', 'CCNE2', 'CD276', 'CD79A', 'CD79B', 'CDC73', 'CDH1', 'CDK12', 'CDKN1A',
  'CDKN2B', 'CDKN2C', 'CEBPA', 'CHD4', 'CHIC2', 'CHST11', 'CIC', 'CIITA', 'CLP1', 'CLTC',
  'CLTCL1', 'CNBD1', 'CNOT3', 'CNTRL', 'COL1A1', 'COPEB', 'COX6C', 'CREB3L1', 'CREB3L2', 'CRLF2',
  'CRTC1', 'CRTC3', 'CSF1R', 'CSF3R', 'CTCF', 'CTNNA1', 'CTNNB1', 'CUL3', 'CXCR4', 'CYLD',
  'DAXX', 'DDB2', 'DDIT3', 'DDX10', 'DDX3X', 'DDX41', 'DDX5', 'DDX6', 'DEK', 'DICER1',
  'DIS3', 'DMD', 'DOCK8', 'DOT1L', 'DUX4', 'EBF1', 'ECT2L', 'EED', 'EGFL7', 'EGR1',
  'EIF1AX', 'EIF4A2', 'ELF3', 'ELF4', 'ELL', 'ELN', 'EML4', 'EP400', 'EPHA3', 'EPHA7',
  'EPHB1', 'ERBB3', 'ERBB4', 'ERCC2', 'ERCC3', 'ERCC4', 'ERCC5', 'ERG', 'ERRFI1', 'ETNK1',
  'ETV1', 'ETV4', 'ETV5', 'ETV6', 'EWSR1', 'EXT1', 'EXT2', 'EZR', 'FAM135B', 'FAM46C',
  'FANCA', 'FANCB', 'FANCC', 'FANCD2', 'FANCE', 'FANCF', 'FANCG', 'FANCI', 'FANCL', 'FANCM',
  'FAS', 'FAT1', 'FAT4', 'FGF10', 'FGF14', 'FGF19', 'FGF3', 'FGF4', 'FGF6', 'FGFR4',
  'FGR', 'FH', 'FIP1L1', 'FMR1', 'FN1', 'FOXL2', 'FOXO1', 'FOXO3', 'FOXO4', 'FOXP1',
  'FRS2', 'FSTL3', 'FTSJD1', 'FUS', 'FVT1', 'GAS7', 'GATA1', 'GATA2', 'GATA4', 'GATA6',
  'GLI1', 'GLI2', 'GLI3', 'GNA11', 'GNA13', 'GNAQ', 'GNAS', 'GOLGA5', 'GOPC', 'GPC3',
  'GPC5', 'GPHN', 'GPS2', 'GREM1', 'GRIN2A', 'GRM3', 'H3F3A', 'H3F3B', 'HCK', 'HDAC1',
  'HDAC2', 'HDAC3', 'HDAC9', 'HGF', 'HIP1', 'HIST1H1C', 'HIST1H1D', 'HIST1H1E', 'HIST1H2BD', 'HIST1H3B',
  'HLA-A', 'HLA-B', 'HNF1A', 'HNRNPA2B1', 'HOOK3', 'HOXA11', 'HOXA13', 'HOXA9', 'HOXC11', 'HOXC13',
  'HOXD11', 'HOXD13', 'HRAS', 'HSP90AA1', 'HSP90AB1', 'ID3', 'IKBKB', 'IKZF1', 'IKZF2', 'IKZF3',
  'IL2', 'IL21R', 'IL6ST', 'IL7R', 'ING1', 'ING4', 'INPP4A', 'INPP4B', 'INSR', 'IRF4',
  'IRS1', 'IRS2', 'ITK', 'JUN', 'KAT6A', 'KAT6B', 'KCNJ5', 'KDM5A', 'KDM5C', 'KDM6A',
  'KDR', 'KEL', 'KIF5B', 'KLF4', 'KLF6', 'KLHL6', 'KMT2B', 'KMT2C', 'KNSTRN', 'KRAS',
  'LAMP1', 'LATS1', 'LATS2', 'LCK', 'LCP1', 'LMO1', 'LMO2', 'LPP', 'LRIG3', 'LYN',
  'LZTR1', 'MAF', 'MAFB', 'MAGEA1', 'MAGI2', 'MALT1', 'MAML2', 'MAP2K4', 'MAP3K1', 'MAP3K13',
  'MAP3K14', 'MAPK3', 'MAX', 'MBD1', 'MCL1', 'MDC1', 'MDM4', 'MECOM', 'MED12', 'MEN1',
  'MGA', 'MGAT5', 'MITF', 'MLF1', 'MLH1', 'MLLT1', 'MLLT10', 'MLLT3', 'MLLT4', 'MLLT6',
  'MN1', 'MNX1', 'MPL', 'MRE11', 'MSH2', 'MSH3', 'MSH6', 'MSI2', 'MSN', 'MST1R',
  'MTCP1', 'MTHFR', 'MTUS1', 'MUC1', 'MUC16', 'MUC4', 'MUTYH', 'MYB', 'MYBL1', 'MYC',
  'MYCL', 'MYCN', 'MYD88', 'MYH11', 'MYH9', 'MYO5A', 'NBN', 'NCOA1', 'NCOA2', 'NCOA4',
  'NCOR1', 'NCOR2', 'NDRG1', 'NIN', 'NKX2-1', 'NONO', 'NOTCH4', 'NPM2', 'NR3C1', 'NR4A3',
  'NRG1', 'NSD1', 'NSD2', 'NSD3', 'NT5C2', 'NTRK1', 'NTRK2', 'NTRK3', 'NUMA1', 'NUP214',
  'NUP98', 'NUTM1', 'OLIG2', 'OMG', 'P2RY8', 'PAFAH1B2', 'PAK1', 'PAK3', 'PAK7', 'PARG',
  'PARP2', 'PAX3', 'PAX5', 'PAX7', 'PAX8', 'PBRM1', 'PBX1', 'PCM1', 'PCSK7', 'PDE4DIP',
  'PDGFA', 'PDGFB', 'PDGFRB', 'PDK1', 'PER1', 'PHF6', 'PHOX2B', 'PICALM', 'PIK3C2B', 'PIK3C2G',
  'PIK3C3', 'PIK3CB', 'PIK3CD', 'PIK3CG', 'PIK3R1', 'PIK3R2', 'PIM1', 'PIM2', 'PIM3', 'PKHD1',
  'PLAG1', 'PML', 'PMS1', 'PMS2', 'POLE', 'POLQ', 'POT1', 'PPARG', 'PPFIBP1', 'PPM1D',
  'PPP2R1A', 'PPP2R1B', 'PPP2R2A', 'PPP6C', 'PRDM1', 'PRDM16', 'PRDM2', 'PRKACA', 'PRKAR1A', 'PRKCB',
  'PRKCD', 'PRKCG', 'PRKD1', 'PRPF40B', 'PRPF8', 'PRRX1', 'PSIP1', 'PTCH1', 'PTK2', 'PTK2B',
  'PTPN12', 'PTPRB', 'PTPRC', 'PTPRD', 'PTPRK', 'PTPRT', 'QKI', 'RABEP1', 'RAC1', 'RAD21',
  'RAD50', 'RAD51', 'RAD51B', 'RAD52', 'RAD54L', 'RAF1', 'RALGDS', 'RANBP17', 'RANBP2', 'RAP1GDS1',
  'RARA', 'RASA1', 'RBBP6', 'RBM10', 'RBM15', 'RECQL4', 'REL', 'RELA', 'RHOA', 'RHOB',
  'RHOH', 'RIT1', 'RNF43', 'ROS1', 'RPL10', 'RPL22', 'RPL5', 'RSPO2', 'RSPO3', 'RUNX1T1',
  'RUNX2', 'RUNX3', 'S100A7', 'SBDS', 'SDHA', 'SDHAF2', 'SDHB', 'SDHC', 'SDHD', 'SEC61G',
  'SEPTIN5', 'SEPTIN6', 'SEPTIN9', 'SET', 'SETBP1', 'SETD7', 'SF3B1', 'SGK1', 'SH2B3', 'SH3GL1',
  'SHH', 'SIN3A', 'SIRPA', 'SIRT1', 'SLIT2', 'SLITRK6', 'SLX4', 'SMAD2', 'SMAD3', 'SMARCA2',
  'SMARCD1', 'SMARCE1', 'SMC1A', 'SMC3', 'SMO', 'SNCAIP', 'SND1', 'SOCS1', 'SOCS2', 'SOCS3',
  'SOX10', 'SOX17', 'SOX2', 'SOX9', 'SPEN', 'SPOP', 'SPRED1', 'SRSF2', 'SRSF3', 'SS18',
  'SS18L1', 'SSX1', 'SSX2', 'SSX4', 'STAG1', 'STAG2', 'STAT5A', 'STAT5B', 'STAT6', 'STIL',
  'SUFU', 'SUZ12', 'SYK', 'TAF1', 'TAF15', 'TAL1', 'TAL2', 'TBC1D12', 'TBL1XR1', 'TBX3',
  'TCF12', 'TCF3', 'TCF7L1', 'TCF7L2', 'TCL1A', 'TERT', 'TET1', 'TFE3', 'TFEB', 'TFPT',
  'TFRC', 'TGFBR1', 'TGFBR2', 'TLX1', 'TLX3', 'TMEM127', 'TMPRSS2', 'TNFAIP3', 'TNFRSF14', 'TNFRSF17',
  'TOP1', 'TOP2A', 'TP63', 'TP73', 'TPM3', 'TPM4', 'TPR', 'TRAF2', 'TRAF3', 'TRAF5',
  'TRIM24', 'TRIM27', 'TRIM33', 'TRIP11', 'TRRAP', 'TSC1', 'TSHR', 'U2AF1', 'U2AF2', 'UBR5',
  'USP8', 'USP9X', 'VAV1', 'VAV2', 'VTI1A', 'WAS', 'WDCP', 'WDR5', 'WIF1', 'WISP3',
  'WNT1', 'WNT5A', 'WT1', 'WWTR1', 'XPA', 'XPC', 'XPO1', 'YAP1', 'YWHAE', 'ZBTB16',
  'ZFHX3', 'ZMYM2', 'ZMYND11', 'ZNF331', 'ZNF384', 'ZNF521', 'ZRSR2'
];

export const DEMO_PROFILES: GenotypeProfile[] = [
  {
    id: 'tnbc-demo',
    name: 'TNBC Demo (Triple-Negative Breast Cancer)',
    cancerType: 'Triple-Negative Breast Cancer (Basal-like)',
    description: 'High genomic instability featuring TP53 loss-of-function mutation, hyperactive PI3K pathway via PIK3CA amplification, and complete PTEN tumor suppressor deletion.',
    recommendedResponse: 'Very Sensitive',
    alterations: [
      { id: 'alt-1', gene: 'TP53', alterationType: 'mutation', value: 'R175H' },
      { id: 'alt-2', gene: 'PIK3CA', alterationType: 'amplification', value: 'Copy number 4' },
      { id: 'alt-3', gene: 'PTEN', alterationType: 'deletion', value: 'Copy number 0' },
      { id: 'alt-4', gene: 'MYC', alterationType: 'amplification', value: 'Copy number 5' }
    ]
  },
  {
    id: 'nsclc-demo',
    name: 'NSCLC Demo (Lung Adenocarcinoma)',
    cancerType: 'Non-Small Cell Lung Cancer',
    description: 'Classical oncogene-addicted lung adenocarcinoma with activating EGFR kinase domain mutation, concurrent TP53 checkpoint alteration, and CDKN2A cell cycle suppressor loss.',
    recommendedResponse: 'Sensitive',
    alterations: [
      { id: 'alt-5', gene: 'EGFR', alterationType: 'mutation', value: 'L858R' },
      { id: 'alt-6', gene: 'TP53', alterationType: 'mutation', value: 'R273H' },
      { id: 'alt-7', gene: 'CDKN2A', alterationType: 'deletion', value: 'Copy number 0' },
      { id: 'alt-8', gene: 'MET', alterationType: 'amplification', value: 'Copy number 4' }
    ]
  },
  {
    id: 'crc-demo',
    name: 'CRC Demo (Colorectal Carcinoma)',
    cancerType: 'Colorectal Adenocarcinoma (MSS)',
    description: 'Wnt/beta-catenin and MAPK driven colorectal cancer profile with classical APC truncating mutation, activating KRAS codon 12 mutation, and PIK3CA helical domain mutation.',
    recommendedResponse: 'Sensitive',
    alterations: [
      { id: 'alt-9', gene: 'KRAS', alterationType: 'mutation', value: 'G12D' },
      { id: 'alt-10', gene: 'APC', alterationType: 'mutation', value: 'Q1367*' },
      { id: 'alt-11', gene: 'PIK3CA', alterationType: 'mutation', value: 'E545K' },
      { id: 'alt-12', gene: 'SMAD4', alterationType: 'deletion', value: 'Copy number 0' }
    ]
  },
  {
    id: 'melanoma-demo',
    name: 'Melanoma Demo (Cutaneous)',
    cancerType: 'Cutaneous Melanoma',
    description: 'MAPK hyperactivated melanoma with canonical BRAF V600E mutation paired with PTEN epigenetic/genomic loss and CDKN2A deletion.',
    recommendedResponse: 'Very Sensitive',
    alterations: [
      { id: 'alt-13', gene: 'BRAF', alterationType: 'mutation', value: 'V600E' },
      { id: 'alt-14', gene: 'PTEN', alterationType: 'deletion', value: 'Copy number 0' },
      { id: 'alt-15', gene: 'CDKN2A', alterationType: 'deletion', value: 'Copy number 0' }
    ]
  },
  {
    id: 'ovarian-demo',
    name: 'HGSOC Demo (High-Grade Serous Ovarian)',
    cancerType: 'High-Grade Serous Ovarian Cancer',
    description: 'DNA repair deficient profile featuring homologous recombination defect (BRCA1 deletion), universal TP53 missense mutation, and CCNE1 replication stress driver amplification.',
    recommendedResponse: 'Sensitive',
    alterations: [
      { id: 'alt-16', gene: 'TP53', alterationType: 'mutation', value: 'C176Y' },
      { id: 'alt-17', gene: 'BRCA1', alterationType: 'deletion', value: 'Copy number 0' },
      { id: 'alt-18', gene: 'CCNE1', alterationType: 'amplification', value: 'Copy number 6' }
    ]
  }
];

export const CSV_EXAMPLE_TEMPLATE = `gene,alteration_type,value
TP53,mutation,R175H
PIK3CA,amplification,4
PTEN,deletion,0
MYC,amplification,5`;

export const JSON_EXAMPLE_TEMPLATE = JSON.stringify([
  { gene: "TP53", alteration_type: "mutation", value: "R175H" },
  { gene: "PIK3CA", alteration_type: "amplification", value: "4" },
  { gene: "PTEN", alteration_type: "deletion", value: "0" },
  { gene: "MYC", alteration_type: "amplification", value: "5" }
], null, 2);
