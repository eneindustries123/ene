import {
  AgreementLifecycleStatus,
  ConnectionPhase,
  ExistingSolarInput,
  IntendedModification,
  LegacyAgreementStatus,
  MONTH_KEYS,
  MonthKey,
  NetworkCapacityStatus,
  PakistanUtility,
  PAKISTAN_UTILITIES,
  PhaseStatus,
  PhaseStatusEvaluation,
  ProtectedStatus,
  ProsumerEligibility,
  ProsumerRegime,
  RegulatoryStatus,
  RegulatoryWarning,
  TariffCategory,
} from './types';

export const POLICY_REFERENCE_DATE = '2026-08-26';
export const TARIFF_EFFECTIVE_FROM = '2026-02-12';
export const PROSUMER_EFFECTIVE_FROM = '2026-02-09';

export interface TariffPolicyRecord {
  id: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  utility: 'NATIONAL' | PakistanUtility;
  tariffCategory: TariffCategory;
  protectedStatus: ProtectedStatus | 'not-applicable';
  touStatus: 'tou' | 'non-tou';
  minimumUnitsExclusive: number;
  maximumUnitsInclusive: number | null;
  variableRate: number | null;
  peakRate: number | null;
  offPeakRate: number | null;
  fixedCharge: number;
  fixedChargeBasis:
    | 'none'
    | 'connection-month'
    | 'sanctioned-load-kw-month'
    | 'max-sanctioned-load-multiplier-or-mdi';
  prosumerRegime: 'consumer-tariff';
  exportRate: null;
  exportRateBasis: null;
  sanctionedLoadMultiplier: number | null;
  nepraConcurrenceRequired: null;
  loadFlowThresholdKw: number;
  sourceReference: string;
  lastVerified: string;
}

const TARIFF_SOURCE =
  'NEPRA decision 11 February 2026; S.R.O. 279(I)/2026, notified 12 February 2026';

function tariffRecord(
  record: Pick<
    TariffPolicyRecord,
    | 'id'
    | 'tariffCategory'
    | 'protectedStatus'
    | 'touStatus'
    | 'minimumUnitsExclusive'
    | 'maximumUnitsInclusive'
    | 'variableRate'
    | 'peakRate'
    | 'offPeakRate'
    | 'fixedCharge'
    | 'fixedChargeBasis'
    | 'sanctionedLoadMultiplier'
  >
): TariffPolicyRecord {
  return {
    ...record,
    effectiveFrom: TARIFF_EFFECTIVE_FROM,
    effectiveTo: null,
    utility: 'NATIONAL',
    prosumerRegime: 'consumer-tariff',
    exportRate: null,
    exportRateBasis: null,
    nepraConcurrenceRequired: null,
    loadFlowThresholdKw: 250,
    sourceReference: TARIFF_SOURCE,
    lastVerified: POLICY_REFERENCE_DATE,
  };
}

export const NATIONAL_BASE_TARIFF_2026: readonly TariffPolicyRecord[] = [
  tariffRecord({ id: 'a1-lifeline-50', tariffCategory: 'residential', protectedStatus: 'lifeline-50', touStatus: 'non-tou', minimumUnitsExclusive: 0, maximumUnitsInclusive: 50, variableRate: 3.95, peakRate: null, offPeakRate: null, fixedCharge: 0, fixedChargeBasis: 'none', sanctionedLoadMultiplier: null }),
  tariffRecord({ id: 'a1-lifeline-100', tariffCategory: 'residential', protectedStatus: 'lifeline-100', touStatus: 'non-tou', minimumUnitsExclusive: 50, maximumUnitsInclusive: 100, variableRate: 7.74, peakRate: null, offPeakRate: null, fixedCharge: 0, fixedChargeBasis: 'none', sanctionedLoadMultiplier: null }),
  tariffRecord({ id: 'a1-protected-100', tariffCategory: 'residential', protectedStatus: 'protected', touStatus: 'non-tou', minimumUnitsExclusive: 0, maximumUnitsInclusive: 100, variableRate: 10.54, peakRate: null, offPeakRate: null, fixedCharge: 200, fixedChargeBasis: 'sanctioned-load-kw-month', sanctionedLoadMultiplier: 1 }),
  tariffRecord({ id: 'a1-protected-200', tariffCategory: 'residential', protectedStatus: 'protected', touStatus: 'non-tou', minimumUnitsExclusive: 100, maximumUnitsInclusive: 200, variableRate: 13.01, peakRate: null, offPeakRate: null, fixedCharge: 300, fixedChargeBasis: 'sanctioned-load-kw-month', sanctionedLoadMultiplier: 1 }),
  tariffRecord({ id: 'a1-nonprotected-100', tariffCategory: 'residential', protectedStatus: 'non-protected', touStatus: 'non-tou', minimumUnitsExclusive: 0, maximumUnitsInclusive: 100, variableRate: 22.44, peakRate: null, offPeakRate: null, fixedCharge: 275, fixedChargeBasis: 'sanctioned-load-kw-month', sanctionedLoadMultiplier: 1 }),
  tariffRecord({ id: 'a1-nonprotected-200', tariffCategory: 'residential', protectedStatus: 'non-protected', touStatus: 'non-tou', minimumUnitsExclusive: 100, maximumUnitsInclusive: 200, variableRate: 28.91, peakRate: null, offPeakRate: null, fixedCharge: 300, fixedChargeBasis: 'sanctioned-load-kw-month', sanctionedLoadMultiplier: 1 }),
  tariffRecord({ id: 'a1-nonprotected-300', tariffCategory: 'residential', protectedStatus: 'non-protected', touStatus: 'non-tou', minimumUnitsExclusive: 200, maximumUnitsInclusive: 300, variableRate: 33.10, peakRate: null, offPeakRate: null, fixedCharge: 350, fixedChargeBasis: 'sanctioned-load-kw-month', sanctionedLoadMultiplier: 1 }),
  tariffRecord({ id: 'a1-nonprotected-400', tariffCategory: 'residential', protectedStatus: 'non-protected', touStatus: 'non-tou', minimumUnitsExclusive: 300, maximumUnitsInclusive: 400, variableRate: 36.46, peakRate: null, offPeakRate: null, fixedCharge: 400, fixedChargeBasis: 'sanctioned-load-kw-month', sanctionedLoadMultiplier: 1 }),
  tariffRecord({ id: 'a1-nonprotected-500', tariffCategory: 'residential', protectedStatus: 'non-protected', touStatus: 'non-tou', minimumUnitsExclusive: 400, maximumUnitsInclusive: 500, variableRate: 38.95, peakRate: null, offPeakRate: null, fixedCharge: 500, fixedChargeBasis: 'sanctioned-load-kw-month', sanctionedLoadMultiplier: 1 }),
  tariffRecord({ id: 'a1-nonprotected-600', tariffCategory: 'residential', protectedStatus: 'non-protected', touStatus: 'non-tou', minimumUnitsExclusive: 500, maximumUnitsInclusive: 600, variableRate: 40.22, peakRate: null, offPeakRate: null, fixedCharge: 675, fixedChargeBasis: 'sanctioned-load-kw-month', sanctionedLoadMultiplier: 1 }),
  tariffRecord({ id: 'a1-nonprotected-700', tariffCategory: 'residential', protectedStatus: 'non-protected', touStatus: 'non-tou', minimumUnitsExclusive: 600, maximumUnitsInclusive: 700, variableRate: 41.85, peakRate: null, offPeakRate: null, fixedCharge: 675, fixedChargeBasis: 'sanctioned-load-kw-month', sanctionedLoadMultiplier: 1 }),
  tariffRecord({ id: 'a1-nonprotected-above-700', tariffCategory: 'residential', protectedStatus: 'non-protected', touStatus: 'non-tou', minimumUnitsExclusive: 700, maximumUnitsInclusive: null, variableRate: 47.20, peakRate: null, offPeakRate: null, fixedCharge: 675, fixedChargeBasis: 'sanctioned-load-kw-month', sanctionedLoadMultiplier: 1 }),
  tariffRecord({ id: 'a1-tou', tariffCategory: 'residential', protectedStatus: 'not-applicable', touStatus: 'tou', minimumUnitsExclusive: 0, maximumUnitsInclusive: null, variableRate: null, peakRate: 46.85, offPeakRate: 34.53, fixedCharge: 675, fixedChargeBasis: 'max-sanctioned-load-multiplier-or-mdi', sanctionedLoadMultiplier: 0.5 }),
  tariffRecord({ id: 'a2-less-than-5kw', tariffCategory: 'commercial', protectedStatus: 'not-applicable', touStatus: 'non-tou', minimumUnitsExclusive: 0, maximumUnitsInclusive: null, variableRate: 37.44, peakRate: null, offPeakRate: null, fixedCharge: 1000, fixedChargeBasis: 'connection-month', sanctionedLoadMultiplier: null }),
  tariffRecord({ id: 'a2-at-least-5kw', tariffCategory: 'commercial', protectedStatus: 'not-applicable', touStatus: 'non-tou', minimumUnitsExclusive: 0, maximumUnitsInclusive: null, variableRate: 39.76, peakRate: null, offPeakRate: null, fixedCharge: 1250, fixedChargeBasis: 'max-sanctioned-load-multiplier-or-mdi', sanctionedLoadMultiplier: 0.25 }),
  tariffRecord({ id: 'a2-tou', tariffCategory: 'commercial', protectedStatus: 'not-applicable', touStatus: 'tou', minimumUnitsExclusive: 0, maximumUnitsInclusive: null, variableRate: null, peakRate: 43.82, offPeakRate: 35.15, fixedCharge: 1250, fixedChargeBasis: 'max-sanctioned-load-multiplier-or-mdi', sanctionedLoadMultiplier: 0.25 }),
] as const;

export interface UtilityAdjustmentLayer {
  utility: PakistanUtility;
  effectiveFrom: string;
  effectiveTo: string | null;
  variableRateAdjustment: number;
  fixedChargeAdjustment: number;
  fcaPerImportedKwh: number | null;
  qtaAmount: number | null;
  statutoryTaxPercent: number | null;
  fcaConfigured: boolean;
  qtaConfigured: boolean;
  taxesConfigured: boolean;
  sourceReference: string;
  lastVerified: string;
}

export const UTILITY_ADJUSTMENTS_2026: Record<PakistanUtility, UtilityAdjustmentLayer> =
  Object.fromEntries(PAKISTAN_UTILITIES.map((utility) => [utility, {
    utility,
    effectiveFrom: TARIFF_EFFECTIVE_FROM,
    effectiveTo: null,
    variableRateAdjustment: 0,
    fixedChargeAdjustment: 0,
    fcaPerImportedKwh: null,
    qtaAmount: null,
    statutoryTaxPercent: null,
    fcaConfigured: false,
    qtaConfigured: false,
    taxesConfigured: false,
    sourceReference: 'No static utility-specific FCA, QTA, or statutory tax value configured in the 26 August 2026 reference pack',
    lastVerified: POLICY_REFERENCE_DATE,
  }])) as Record<PakistanUtility, UtilityAdjustmentLayer>;

export interface ProsumerReferenceValue {
  id: 'NAEPP' | 'NAPPP';
  effectiveFrom: string;
  effectiveTo: string | null;
  utility: 'NATIONAL';
  tariffCategory: 'prosumer-reference';
  protectedStatus: 'not-applicable';
  touStatus: 'not-applicable';
  variableRate: null;
  peakRate: null;
  offPeakRate: null;
  fixedCharge: 0;
  fixedChargeBasis: 'none';
  prosumerRegime: 'current-2026' | 'legacy';
  exportRate: number;
  exportRateBasis: 'NAEPP' | 'NAPPP';
  sanctionedLoadMultiplier: 1;
  nepraConcurrenceRequired: null;
  loadFlowThresholdKw: 250;
  sourceReference: string;
  lastVerified: string;
}

export const PROSUMER_REFERENCE_VALUES_2026: readonly ProsumerReferenceValue[] = [
  {
    id: 'NAEPP', effectiveFrom: '2026-01-07', effectiveTo: null, utility: 'NATIONAL',
    tariffCategory: 'prosumer-reference', protectedStatus: 'not-applicable', touStatus: 'not-applicable',
    variableRate: null, peakRate: null, offPeakRate: null, fixedCharge: 0, fixedChargeBasis: 'none',
    prosumerRegime: 'current-2026', exportRate: 8.13, exportRateBasis: 'NAEPP', sanctionedLoadMultiplier: 1,
    nepraConcurrenceRequired: null, loadFlowThresholdKw: 250,
    sourceReference: 'CY2026 NAEPP reference dated 7 January 2026; NEPRA Prosumer Regulations S.R.O. 251(I)/2026',
    lastVerified: POLICY_REFERENCE_DATE,
  },
  {
    id: 'NAPPP', effectiveFrom: '2026-01-07', effectiveTo: null, utility: 'NATIONAL',
    tariffCategory: 'prosumer-reference', protectedStatus: 'not-applicable', touStatus: 'not-applicable',
    variableRate: null, peakRate: null, offPeakRate: null, fixedCharge: 0, fixedChargeBasis: 'none',
    prosumerRegime: 'legacy', exportRate: 25.32, exportRateBasis: 'NAPPP', sanctionedLoadMultiplier: 1,
    nepraConcurrenceRequired: null, loadFlowThresholdKw: 250,
    sourceReference: 'CY2026 NAPPP reference dated 7 January 2026; legacy protection S.R.O. 547(I)/2026',
    lastVerified: POLICY_REFERENCE_DATE,
  },
] as const;

export const PROSUMER_POLICY_2026 = {
  version: '2026.1',
  effectiveFrom: PROSUMER_EFFECTIVE_FROM,
  effectiveTo: null,
  initialAgreementTermYears: 5,
  renewalTermYears: 5,
  maximumDgCapacityKw: 1000,
  sanctionedLoadMultiplier: 1,
  loadFlowThresholdKw: 250,
  transformerHostingCapacityThreshold: 0.8,
  nepraConcurrenceExemptAtOrBelowKw: 25,
  settlementRules: {
    current: {
      mechanism: 'NAEPP',
      regulatorySource: 'S.R.O. 251(I)/2026 (NEPRA Alternative & Renewable Energy Distributed Generation and Net-Billing Regulations, 2026)',
      ratePkrPerKwh: 8.13,
      rateEffectiveYear: 2026,
      rateSource: 'Applicable NEPRA CY2026 Power Purchase Price / NAEPP reference (subject to periodic regulatory adjustment / external verification)',
      rateStatus: 'REFERENCE_ESTIMATE — SUBJECT_TO_REGULATORY_VERIFICATION',
    },
    legacy: {
      mechanism: 'NAPPP',
      regulatorySource: 'S.R.O. 547(I)/2026 (Grandfathering / Transitional Protection Regulations)',
      ratePkrPerKwh: 25.32,
      rateEffectiveYear: 2026,
      rateSource: 'CY2026 National Average Power Purchase Price (NAPPP) reference (subject to grandfathered contract terms)',
      rateStatus: 'REFERENCE_ESTIMATE — SUBJECT_TO_CONTRACT_VERIFICATION',
    },
  },
  regulatoryCitations: {
    prosumerRegulations: 'S.R.O. 251(I)/2026',
    legacyProtection: 'S.R.O. 547(I)/2026',
    concurrenceExemption: 'S.R.O. 1330(I)/2026 dated 6 August 2026',
    concurrenceFeeStatus: 'DEFERRED — REQUIRES AUTHORITATIVE RATE VERIFICATION',
  },
  exportSettlement: {
    current: {
      basis: 'NAEPP',
      ratePkrPerKwh: 8.13,
      effectiveYear: 2026,
      regulatorySource: 'S.R.O. 251(I)/2026',
      rateSource: 'Applicable NEPRA CY2026 Power Purchase Price / NAEPP reference',
      sourceReference: 'Rule: S.R.O. 251(I)/2026; Rate: CY2026 NAEPP reference (subject to regulatory verification)',
    },
    legacy: {
      basis: 'NAPPP',
      ratePkrPerKwh: 25.32,
      effectiveYear: 2026,
      regulatorySource: 'S.R.O. 547(I)/2026',
      rateSource: 'CY2026 National Average Power Purchase Price (NAPPP) reference',
      sourceReference: 'Rule: S.R.O. 547(I)/2026; Rate: CY2026 NAPPP reference (subject to contract verification)',
    },
  },
  citations: {
    regulations2026: 'S.R.O. 251(I)/2026',
    amendments2026: 'S.R.O. 547(I)/2026',
    concurrenceExemption2026: 'S.R.O. 1330(I)/2026',
  },
  sourceReferences: {
    prosumerRegulations: 'S.R.O. 251(I)/2026 (NEPRA Prosumer Regulations 2026)',
    legacyProtection: 'S.R.O. 547(I)/2026 (Grandfathering / Transitional Protection)',
    concurrenceAmendment: 'S.R.O. 1330(I)/2026 dated 6 August 2026 (≤25 kW Concurrence Exemption)',
    concurrenceFeeStatus: 'DEFERRED — REQUIRES AUTHORITATIVE RATE VERIFICATION',
  },
  sourceReference: 'S.R.O. 251(I)/2026; S.R.O. 547(I)/2026; S.R.O. 1330(I)/2026 dated 6 August 2026',
  lastVerified: POLICY_REFERENCE_DATE,
} as const;

export interface TouWindow {
  startHour: number;
  endHour: number;
  peakHours: 4;
  offPeakHours: 20;
  label: string;
}

export function getTouWindow(month: MonthKey | number): TouWindow {
  const monthNumber = typeof month === 'number' ? month : MONTH_KEYS.indexOf(month) + 1;
  if ([12, 1, 2].includes(monthNumber)) return { startHour: 17, endHour: 21, peakHours: 4, offPeakHours: 20, label: '17:00–21:00' };
  if ([6, 7, 8].includes(monthNumber)) return { startHour: 19, endHour: 23, peakHours: 4, offPeakHours: 20, label: '19:00–23:00' };
  return { startHour: 18, endHour: 22, peakHours: 4, offPeakHours: 20, label: '18:00–22:00' };
}

export function resolveUtility(value?: string | null): PakistanUtility {
  const normalized = (value || '').toUpperCase().replace(/[^A-Z]/g, '');
  const aliases: Array<[string, PakistanUtility]> = [
    ['KELECTRIC', 'K-Electric'], ['KESC', 'K-Electric'],
    ...PAKISTAN_UTILITIES.filter((item) => item !== 'K-Electric').map((item) => [item, item] as [string, PakistanUtility]),
  ];
  return aliases.find(([alias]) => normalized.includes(alias))?.[1] || 'LESCO';
}

export function normalizeConnectionPhase(
  phase?: string | null,
  connectionType?: string | null
): ConnectionPhase {
  const combined = `${phase || ''} ${connectionType || ''}`.toLowerCase();
  if (/3|three|poly/i.test(combined)) return 'three-phase';
  if (/1|single/i.test(combined)) return 'single-phase';
  return 'unknown';
}

export function evaluatePhaseStatus(
  phase: ConnectionPhase,
  exportConnected: boolean
): PhaseStatusEvaluation {
  if (!exportConnected) {
    return {
      phase,
      status: 'compatible',
      note: 'Not blocked by the prosumer/export phase eligibility check.',
    };
  }
  if (phase === 'three-phase') {
    return {
      phase,
      status: 'compatible',
      note: 'Three-phase connection verified for standard prosumer export metering.',
    };
  }
  if (phase === 'single-phase') {
    return {
      phase,
      status: 'upgrade-recommended',
      note: 'Your existing connection may require an upgrade or DISCO verification before grid-export/prosumer interconnection can be enabled.',
    };
  }
  return {
    phase: 'unknown',
    status: 'unverified',
    note: 'Connection phase requires verification with your DISCO for prosumer interconnection.',
  };
}

export function resolveLegacyAgreementStatus(input: {
  hasExistingSolar?: boolean;
  agreementStatus?: AgreementLifecycleStatus | 'yes' | 'no' | 'unsure' | null;
  agreementDate?: string | null;
  legacyAgreementStatus?: LegacyAgreementStatus | 'valid' | 'expired' | 'none' | 'unknown' | null;
  greenMeter?: boolean;
}): LegacyAgreementStatus {
  if (input.legacyAgreementStatus) {
    if (input.legacyAgreementStatus === 'confirmed' || input.legacyAgreementStatus === 'valid') return 'confirmed';
    if (input.legacyAgreementStatus === 'likely') return 'likely';
    if (input.legacyAgreementStatus === 'unverified' || input.legacyAgreementStatus === 'unknown') return 'unverified';
    if (input.legacyAgreementStatus === 'not-applicable' || input.legacyAgreementStatus === 'none' || input.legacyAgreementStatus === 'expired') return 'not-applicable';
  }

  if (!input.hasExistingSolar) return 'not-applicable';
  if (input.agreementStatus === 'none' || input.agreementStatus === 'no' || input.agreementStatus === 'expired') return 'not-applicable';
  if (input.agreementStatus === 'active' || input.agreementStatus === 'yes') {
    if (input.agreementDate && input.agreementDate.trim().length > 0) return 'confirmed';
    return 'likely';
  }
  if (input.agreementStatus === 'unknown' || input.agreementStatus === 'unsure') return 'unverified';
  if (input.greenMeter) return 'unverified';
  return 'not-applicable';
}

export function resolveRequiresAgreementReview(input: {
  hasExistingSolar?: boolean;
  legacyAgreementStatus: LegacyAgreementStatus;
  intendedChange?: IntendedModification | null;
}): boolean {
  if (!input.hasExistingSolar) return false;
  if (input.legacyAgreementStatus === 'not-applicable') return false;
  const modifyingIntents: IntendedModification[] = ['expansion', 'replacement', 'system-modification'];
  return input.intendedChange ? modifyingIntents.includes(input.intendedChange) : false;
}

export function resolveProsumerRegime(input: {
  greenMeter?: boolean;
  exportConnected?: boolean;
  legacyAgreementStatus?: LegacyAgreementStatus | 'valid' | 'expired' | 'none' | 'unknown' | null;
}): ProsumerRegime {
  if (input.exportConnected === false) return 'not-applicable';
  const status = input.legacyAgreementStatus;
  if (status === 'confirmed' || status === 'valid') return 'legacy';
  if (status === 'likely') return 'legacy';
  if (status === 'unverified' || status === 'unknown') return 'uncertain';
  if (status === 'not-applicable' || status === 'none' || status === 'expired') return 'current-2026';
  if (!input.greenMeter) return 'not-applicable';
  return 'current-2026';
}

export function nepraConcurrenceRequired(capacityKw: number): boolean {
  return capacityKw > PROSUMER_POLICY_2026.nepraConcurrenceExemptAtOrBelowKw;
}

export function loadFlowStudyRequired(capacityKw: number): boolean {
  return capacityKw >= PROSUMER_POLICY_2026.loadFlowThresholdKw;
}

export function buildRegulatoryStatus(input: {
  actualPvCapacityKw: number;
  gridExportAllowed?: boolean;
  exportConnected?: boolean;
  sanctionedLoadKw?: number | null;
  connectionPhase?: ConnectionPhase;
  hasExistingSolar?: boolean;
  legacyAgreementStatus?: LegacyAgreementStatus;
  intendedModification?: IntendedModification;
  requiresAgreementReview?: boolean;
  existingSolar?: ExistingSolarInput | null;
}): RegulatoryStatus {
  const actualPvCapacityKw = input.actualPvCapacityKw;
  const gridExportAllowed = input.gridExportAllowed ?? input.exportConnected ?? true;
  const sanctionedLoadKw = input.sanctionedLoadKw ?? null;
  const connectionPhase: ConnectionPhase = input.connectionPhase || 'unknown';
  const hasExistingSolar = input.hasExistingSolar ?? input.existingSolar?.hasExistingSolar ?? false;

  const resolvedAgreementStatus: LegacyAgreementStatus = input.legacyAgreementStatus || resolveLegacyAgreementStatus({
    hasExistingSolar,
    agreementStatus: input.existingSolar?.agreementStatus as any,
    agreementDate: input.existingSolar?.agreementDate,
    greenMeter: gridExportAllowed,
  });

  const intendedModification: IntendedModification = input.intendedModification || input.existingSolar?.intendedChange || 'analysis-only';
  const requiresAgreementReview = input.requiresAgreementReview ?? resolveRequiresAgreementReview({
    hasExistingSolar,
    legacyAgreementStatus: resolvedAgreementStatus,
    intendedChange: intendedModification,
  });

  const exceedsSanctionedLoad = gridExportAllowed && sanctionedLoadKw !== null && actualPvCapacityKw > sanctionedLoadKw + 0.0001;
  const excessCapacityKw = exceedsSanctionedLoad && sanctionedLoadKw !== null
    ? Number((actualPvCapacityKw - sanctionedLoadKw).toFixed(3))
    : 0;

  const phaseStatus = evaluatePhaseStatus(connectionPhase, gridExportAllowed);

  const currentGridEligibleCapacityKw = !gridExportAllowed
    ? 0
    : sanctionedLoadKw !== null
      ? Math.min(actualPvCapacityKw, sanctionedLoadKw)
      : null;

  const loadExtensionRequired = exceedsSanctionedLoad;
  const nepraConcurrence = gridExportAllowed ? nepraConcurrenceRequired(actualPvCapacityKw) : false;
  const loadFlow = gridExportAllowed ? loadFlowStudyRequired(actualPvCapacityKw) : false;
  const networkCapacityStatus: NetworkCapacityStatus = 'requires-disco-verification';

  let prosumerEligibility: ProsumerEligibility = 'not-applicable';
  if (gridExportAllowed) {
    if (phaseStatus.status === 'upgrade-recommended') {
      prosumerEligibility = 'upgrade-required';
    } else if (exceedsSanctionedLoad) {
      prosumerEligibility = 'load-extension-required';
    } else if (sanctionedLoadKw === null || phaseStatus.status === 'unverified') {
      prosumerEligibility = 'requires-disco-verification';
    } else {
      prosumerEligibility = 'eligible';
    }
  }

  const nepraConcurrenceNote = nepraConcurrence
    ? 'System capacity exceeds 25 kW; formal NEPRA regulatory concurrence is required in addition to DISCO processing (Application fee status: DEFERRED — REQUIRES AUTHORITATIVE RATE VERIFICATION).'
    : 'NEPRA concurrence is exempt under current framework (≤25 kW); prosumer application proceeds directly through your DISCO.';

  const loadFlowStudyNote = loadFlow
    ? 'A load-flow study / technical grid assessment is required under the applicable framework (≥250 kW).'
    : 'System capacity is <250 kW; standard distribution connection criteria apply without mandatory load flow study.';

  const transformerCapacityNote = 'Distribution transformer hosting capacity limit is 80% of rated capacity under NEPRA guidelines; local transformer headroom requires DISCO technical survey verification.';

  const regime = resolveProsumerRegime({
    greenMeter: gridExportAllowed,
    exportConnected: gridExportAllowed,
    legacyAgreementStatus: resolvedAgreementStatus,
  });

  const applicableRate = regime === 'legacy'
    ? PROSUMER_POLICY_2026.settlementRules.legacy.ratePkrPerKwh
    : PROSUMER_POLICY_2026.settlementRules.current.ratePkrPerKwh;

  const settlementBasis = {
    regime,
    applicableRatePkrPerKwh: applicableRate,
    description: regime === 'legacy'
      ? `Legacy net-metering settlement at NAPPP reference (Rs ${applicableRate}/kWh) applies under grandfathering terms.`
      : regime === 'uncertain'
      ? `Unverified agreement terms; provisional net-billing settlement at NAEPP reference (Rs ${applicableRate}/kWh) applied.`
      : `Current 2026 net-billing settlement at NAEPP reference (Rs ${applicableRate}/kWh) applies per NEPRA prosumer framework.`,
  };

  const warnings: RegulatoryWarning[] = [];
  const userNotes: string[] = [];

  if (gridExportAllowed) {
    if (exceedsSanctionedLoad) {
      warnings.push({
        code: 'SANCTIONED_LOAD_EXCEEDED',
        severity: 'warning',
        message: `Engineering PV requirement (${actualPvCapacityKw} kWp) exceeds verified sanctioned load (${sanctionedLoadKw} kW).`,
        actionableGuidance: `Apply for sanctioned-load extension to match the proposed system capacity (${actualPvCapacityKw} kWp) with your DISCO, or operate with zero-export / export-limiting until load extension is approved.`,
      });
      userNotes.push(`Sanctioned load extension from ${sanctionedLoadKw} kW to at least ${actualPvCapacityKw} kWp (or DISCO technical verification) is required for full export interconnection.`);
    }

    if (phaseStatus.status === 'upgrade-recommended') {
      warnings.push({
        code: 'SINGLE_PHASE_EXPORT_RESTRICTION',
        severity: 'warning',
        message: 'Single-phase connection detected. Your existing connection may require an upgrade or DISCO verification before grid-export / prosumer interconnection can be enabled.',
        actionableGuidance: 'Consult your DISCO regarding 3-phase meter upgrade or verification requirements for grid export, or select a Zero-Export / Off-Grid solar configuration.',
      });
      userNotes.push('Single-phase connection may require DISCO verification or upgrade to three-phase for export metering.');
    } else if (phaseStatus.status === 'unverified') {
      warnings.push({
        code: 'PHASE_UNVERIFIED',
        severity: 'info',
        message: 'Connection phase requires verification with your DISCO for prosumer interconnection.',
      });
    }

    if (nepraConcurrence) {
      warnings.push({
        code: 'NEPRA_CONCURRENCE_REQUIRED',
        severity: 'info',
        message: nepraConcurrenceNote,
      });
      userNotes.push('NEPRA concurrence filing applies for systems >25 kW.');
    }

    if (loadFlow) {
      warnings.push({
        code: 'LOAD_FLOW_STUDY_REQUIRED',
        severity: 'warning',
        message: loadFlowStudyNote,
      });
      userNotes.push('A load-flow study / technical grid assessment is required under the applicable framework (≥250 kW).');
    }

    warnings.push({
      code: 'TRANSFORMER_CAPACITY_VERIFICATION',
      severity: 'info',
      message: 'Transformer hosting capacity (80% threshold) requires DISCO site survey verification.',
    });
  }

  let agreementReviewNote: string | undefined;
  if (requiresAgreementReview) {
    agreementReviewNote = 'Expansion or modification of an existing distributed-generation system may affect legacy/grandfathered regulatory treatment. Existing agreement terms should be reviewed with the relevant DISCO before relying on legacy settlement assumptions.';
    warnings.push({
      code: 'LEGACY_AGREEMENT_MODIFICATION_REVIEW',
      severity: 'action-required',
      message: agreementReviewNote,
      actionableGuidance: 'Consult with ENE and your DISCO before modifying your existing solar capacity to verify whether grandfathered tariff terms remain applicable.',
    });
    userNotes.push('Modification of existing system requires verification of grandfathered net-metering contract terms.');
  }

  return {
    frameworkVersion: PROSUMER_POLICY_2026.version,
    gridExportAllowed,
    actualPvCapacityKw,
    sanctionedLoadKw,
    exceedsSanctionedLoad,
    excessCapacityKw,
    currentGridEligibleCapacityKw,
    loadExtensionRequired,
    connectionPhase,
    phaseStatus,
    prosumerEligibility,
    nepraConcurrenceRequired: nepraConcurrence,
    nepraConcurrenceNote,
    loadFlowStudyRequired: loadFlow,
    loadFlowStudyNote,
    networkCapacityStatus,
    transformerCapacityNote,
    legacyAgreementStatus: resolvedAgreementStatus,
    intendedModification,
    requiresAgreementReview,
    agreementReviewNote,
    settlementBasis,
    warnings,
    userNotes,
  };
}
