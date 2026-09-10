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
export type ConnectionPhase = 'single-phase' | 'three-phase' | 'unknown';
export type PhaseStatus = 'compatible' | 'upgrade-recommended' | 'unverified' | 'not-applicable';

export interface PhaseStatusEvaluation {
  phase: ConnectionPhase;
  status: PhaseStatus;
  note: string;
}

export type ProsumerEligibility =
  | 'eligible'
  | 'upgrade-required'
  | 'load-extension-required'
  | 'action-required'
  | 'requires-disco-verification'
  | 'not-applicable';
export type NetworkCapacityStatus =
  | 'requires-disco-verification'
  | 'pre-allocated'
  | 'constrained'
  | 'unverified';
export type LegacyAgreementStatus =
  | 'confirmed'
  | 'likely'
  | 'unverified'
  | 'not-applicable';

export type AgreementLifecycleStatus =
  | 'active'
  | 'expired'
  | 'none'
  | 'unknown';

export type IntendedModification =
  | 'none'
  | 'expansion'
  | 'replacement'
  | 'battery-addition'
  | 'system-modification'
  | 'analysis-only';
export type RegulatoryWarningSeverity = 'info' | 'warning' | 'action-required' | 'critical' | 'error';

export interface RegulatoryWarning {
  code: string;
  severity: RegulatoryWarningSeverity;
  message: string;
  actionableGuidance?: string;
}

export interface RegulatoryStatus {
  frameworkVersion: string;
  gridExportAllowed: boolean;
  actualPvCapacityKw: number;
  sanctionedLoadKw: number | null;
  exceedsSanctionedLoad: boolean;
  excessCapacityKw: number;
  currentGridEligibleCapacityKw: number | null;
  loadExtensionRequired: boolean;
  connectionPhase: ConnectionPhase;
  phaseStatus: PhaseStatusEvaluation;
  prosumerEligibility: ProsumerEligibility;
  nepraConcurrenceRequired: boolean;
  nepraConcurrenceNote: string;
  loadFlowStudyRequired: boolean;
  loadFlowStudyNote: string;
  networkCapacityStatus: NetworkCapacityStatus;
  transformerCapacityNote: string;
  legacyAgreementStatus: LegacyAgreementStatus;
  intendedModification: IntendedModification;
  requiresAgreementReview: boolean;
  agreementReviewNote?: string;
  settlementBasis: {
    regime: string;
    applicableRatePkrPerKwh: number;
    description: string;
  };
  warnings: RegulatoryWarning[];
  userNotes: string[];
}

export interface ExistingSolarInput {
  hasExistingSolar: boolean;
  existingPvCapacityKw?: number | null;
  existingInverterKw?: number | null;
  agreementStatus?: AgreementLifecycleStatus | 'yes' | 'no' | 'unsure' | null;
  agreementDate?: string | null;
  intendedChange?: IntendedModification | null;
}

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
  simulatedKwh?: number;
  basis: 'preliminary-bill-profile' | 'refined-backup-selection' | 'off-grid-autonomy';
}

export type ConsumptionProfileType =
  | 'daytime'
  | 'balanced'
  | 'evening'
  | 'custom'
  | 'not-sure';

export type ConsumptionProfileSource =
  | 'user-specified'
  | 'preset-profile'
  | 'fallback-assumption';

export type UserPrimaryObjective =
  | 'maximum-savings'
  | 'balanced-backup'
  | 'maximum-backup'
  | 'grid-independence';

export interface ConsumptionProfileInput {
  profileType?: ConsumptionProfileType;
  customDaytimeSharePercent?: number | null;
}

export interface ConsumptionProfileResolution {
  profileType: ConsumptionProfileType;
  daytimeSharePercent: number;
  daytimeShareFraction: number;
  source: ConsumptionProfileSource;
  description: string;
}

export interface MonthlyEnergyFlow {
  month: MonthKey;
  consumptionKwh: number;
  generationKwh: number;
  selfConsumedKwh: number;
  batteryChargeKwh: number;
  batteryDischargeKwh: number;
  gridExportKwh: number;
  curtailedKwh: number;
  gridImportKwh: number;
  selfConsumptionRatio: number;
  exportRatio: number;
  unmetLoadKwh?: number;
}

export interface AnnualEnergyFlow {
  annualGenerationKwh: number;
  annualConsumptionKwh: number;
  selfConsumedKwh: number;
  batteryChargeKwh: number;
  batteryDischargeKwh: number;
  gridExportKwh: number;
  curtailedKwh: number;
  gridImportKwh: number;
  selfConsumptionRatio: number;
  exportRatio: number;
  curtailmentRatio: number;
  gridIndependenceRatio: number;
  loadCoveragePercent: number;
  unmetLoadKwh: number;
}

export interface FinancialBreakdown {
  currentAnnualBillPkr: number;
  postSolarAnnualBillPkr: number;
  annualBillReductionPkr: number;
  annualBillReductionPercent: number;
  avoidedGridPurchaseValuePkr: number;
  exportCreditValuePkr: number;
  realizedExportCreditPkr: number;
  surplusExportCreditPkr: number;
  totalModeledAnnualValuePkr: number;
  totalModeledAnnualValuePercent: number;
  batteryEnergyShiftValuePkr: number;
  fixedChargeSavingsPkr?: number;
  estimatedCapexPkr: number | null;
  simplePaybackYears: number | null;
  roiPercent: number | null;
  capexStatus: string;
  financialModelVersion: string;
}

export interface FinancialAssumptions {
  modelVersion: string;
  profileSource: ConsumptionProfileSource;
  daytimeSharePercent: number;
  exportCreditMechanism: string;
  applicableExportRatePkrPerKwh: number;
  excludedDynamicCharges: string[];
  capexAvailable: boolean;
  capexNotice: string;
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
  totalModeledAnnualValuePkr?: number;
  totalModeledAnnualValuePercent?: number;
  prosumerRegime?: ProsumerRegime;
  nepraConcurrenceRequired?: boolean;
  utilityApprovalRequired?: boolean;
  loadFlowStudyRequired?: boolean;
  regulatoryValid?: boolean;
  confidence?: ResultConfidence;
  policyConfidence?: ResultConfidence;
  recommendationConfidence?: ResultConfidence;
  qualifications?: string[];
  regulatoryStatus?: RegulatoryStatus;
  energyFlow?: AnnualEnergyFlow;
  monthlyEnergyFlows?: MonthlyEnergyFlow[];
  financialAnalysis?: FinancialBreakdown;
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
  consumptionProfile?: ConsumptionProfileResolution;
  financialAssumptions?: FinancialAssumptions;
}
