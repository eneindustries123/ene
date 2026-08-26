import {
  MONTH_KEYS,
  MonthKey,
  PakistanUtility,
  PAKISTAN_UTILITIES,
  ProtectedStatus,
  ProsumerRegime,
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
  effectiveFrom: PROSUMER_EFFECTIVE_FROM,
  effectiveTo: null,
  initialAgreementTermYears: 5,
  renewalTermYears: 5,
  maximumDgCapacityKw: 1000,
  sanctionedLoadMultiplier: 1,
  loadFlowThresholdKw: 250,
  transformerHostingCapacityThreshold: 0.8,
  nepraConcurrenceExemptAtOrBelowKw: 25,
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

export function resolveProsumerRegime(input: {
  greenMeter: boolean;
  legacyAgreementStatus?: 'valid' | 'expired' | 'none' | 'unknown';
}): ProsumerRegime {
  if (!input.greenMeter) return 'not-applicable';
  if (input.legacyAgreementStatus === 'valid') return 'legacy';
  if (input.legacyAgreementStatus === 'expired' || input.legacyAgreementStatus === 'none') return 'current-2026';
  return 'uncertain';
}

export function nepraConcurrenceRequired(capacityKw: number): boolean {
  return capacityKw > PROSUMER_POLICY_2026.nepraConcurrenceExemptAtOrBelowKw;
}

export function loadFlowStudyRequired(capacityKw: number): boolean {
  return capacityKw >= PROSUMER_POLICY_2026.loadFlowThresholdKw;
}
