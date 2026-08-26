export const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const;

export type MonthKey = (typeof MONTH_KEYS)[number];
export type Confidence = 'high' | 'medium' | 'low';
export type CitySource =
  | 'customer-address'
  | 'explicit-installation-location'
  | 'provider-or-disco'
  | 'unknown';
export type SystemType = 'on-grid' | 'hybrid' | 'off-grid';
export const PAKISTAN_UTILITIES = [
  'FESCO', 'GEPCO', 'HAZECO', 'HESCO', 'IESCO', 'LESCO', 'MEPCO',
  'PESCO', 'QESCO', 'SEPCO', 'TESCO', 'K-Electric',
] as const;
export type PakistanUtility = (typeof PAKISTAN_UTILITIES)[number];
export type TariffCategory = 'residential' | 'commercial';
export type ProtectedStatus = 'lifeline-50' | 'lifeline-100' | 'protected' | 'non-protected';
export type AnalysisMode = 'recommend' | 'chosen' | 'both';
export type ScenarioArchitecture =
  | 'on-grid-only'
  | 'hybrid-green-no-battery'
  | 'hybrid-green-battery'
  | 'hybrid-no-green-no-battery'
  | 'hybrid-no-green-battery'
  | 'off-grid';
export type ProsumerRegime = 'not-applicable' | 'current-2026' | 'legacy' | 'uncertain';
export type ResultConfidence = 'High' | 'Medium' | 'Preliminary';

export interface MonthlyConsumption {
  month: MonthKey;
  year?: number | null;
  kwh: number;
  confidence?: Confidence;
}

export interface BillExtraction {
  provider: string | null;
  city: string | null;
  citySource: CitySource | null;
  cityConfidence: Confidence | null;
  currentMonth: {
    month: string | null;
    year: number | null;
    kwh: number | null;
  };
  monthlyHistory: Array<{
    month: string;
    year: number | null;
    kwh: number | null;
    confidence: Confidence;
  }>;
  connectionType: string | null;
  phase: string | null;
  sanctionedLoadKw: number | null;
  connectedLoadKw: number | null;
  consumerCategory: string | null;
  currentBillAmount: number | null;
  overallConfidence: Confidence;
  warnings: string[];
}

export interface ConsumptionMetrics {
  annualKwh: number;
  averageMonthlyKwh: number;
  averageDailyKwh: number;
  highestMonth: MonthlyConsumption | null;
  lowestMonth: MonthlyConsumption | null;
  validMonthCount: number;
  missingMonths: MonthKey[];
  complete: boolean;
}

export interface MonthlySimulation {
  month: MonthKey;
  consumptionKwh: number;
  generationKwh: number;
  balanceKwh: number;
  matchedConsumptionKwh: number;
  coveragePercent: number;
}

export interface BatteryEstimate {
  minKwh: number;
  maxKwh: number;
  basis: 'preliminary-bill-profile' | 'refined-backup-selection' | 'off-grid-autonomy';
}

export interface SystemRecommendation {
  type: SystemType;
  label: string;
  pvCapacityKw: number;
  actualPvCapacityKw: number;
  inverterKw: number;
  panelCount: number;
  annualGenerationKwh: number;
  annualConsumptionKwh: number;
  consumptionCoveragePercent: number;
  generationToConsumptionPercent: number;
  annualSurplusKwh: number;
  annualShortfallKwh: number;
  seasonalMatch: 'strong' | 'moderate' | 'limited';
  monthlySimulation: MonthlySimulation[];
  battery: BatteryEstimate | null;
  suitability: string;
  caution?: string;
  architecture?: ScenarioArchitecture;
  annualGridImportKwh?: number;
  annualGridExportKwh?: number;
  annualDirectConsumptionKwh?: number;
  annualUnusableSurplusKwh?: number;
  currentEstimatedBill?: number;
  postSolarEstimatedBill?: number;
  billReduction?: number;
  billReductionPercent?: number;
  prosumerRegime?: ProsumerRegime;
  nepraConcurrenceRequired?: boolean;
  utilityApprovalRequired?: boolean;
  loadFlowStudyRequired?: boolean;
  regulatoryValid?: boolean;
  confidence?: ResultConfidence;
  policyConfidence?: ResultConfidence;
  recommendationConfidence?: ResultConfidence;
  qualifications?: string[];
}

export interface SolarProfileResolution {
  requestedCity: string;
  profileCity: string;
  profileKey: string;
  fallbackUsed: boolean;
  monthlyPeakSunHours: Record<MonthKey, number>;
}

export interface SolarRecommendationResult {
  bestMatch: SystemRecommendation;
  systems: {
    onGrid: SystemRecommendation;
    hybrid: SystemRecommendation;
    offGrid: SystemRecommendation;
  };
  consumption: ConsumptionMetrics;
  location: SolarProfileResolution;
  explanation: string;
  assumptions: {
    panelWattage: number;
    performanceRatio: number;
    profileBasis: string;
    dcAcRatioTarget: number;
    dcAcRatioRange: { min: number; max: number };
    selectionRule: string;
  };
  dataCompleteness: 'complete' | 'incomplete';
  disclaimer: string;
  scenarios?: SystemRecommendation[];
  selectedSystem?: SystemRecommendation | null;
  analysisMode?: AnalysisMode;
  billing?: {
    currentEstimatedBill: number;
    postSolarEstimatedBill: number;
    billReduction: number;
    billReductionPercent: number;
    dynamicComponentsConfigured: boolean;
    excludedComponents: string[];
    fixedChargeConfidence: ResultConfidence;
  };
  confidence?: {
    billExtraction: ResultConfidence;
    tariffPolicy: ResultConfidence;
    recommendation: ResultConfidence;
  };
  policy?: {
    utility: PakistanUtility;
    tariffCategory: TariffCategory;
    prosumerRegime: ProsumerRegime;
    referenceDate: string;
    tariffSource: string;
    prosumerSource: string;
  };
}
