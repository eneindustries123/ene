import { round } from './consumption';
import {
  NATIONAL_BASE_TARIFF_2026,
  PROSUMER_REFERENCE_VALUES_2026,
  TariffPolicyRecord,
  UTILITY_ADJUSTMENTS_2026,
} from './policy';
import {
  PakistanUtility,
  ProtectedStatus,
  ProsumerRegime,
  ResultConfidence,
  TariffCategory,
} from './types';

export interface BillingAccount {
  utility: PakistanUtility;
  tariffCategory: TariffCategory;
  protectedStatus: ProtectedStatus;
  tou: boolean;
  sanctionedLoadKw?: number;
  mdiKw?: number;
}

export interface AdjustmentConfig {
  fcaPerImportedKwh?: number;
  qtaAmount?: number;
  statutoryTaxPercent?: number;
  minimumCharge?: number;
}

export interface MonthlyBillFlow {
  importedKwh: number;
  peakImportedKwh?: number;
  offPeakImportedKwh?: number;
  exportedKwh?: number;
  peakExportedKwh?: number;
  offPeakExportedKwh?: number;
}

export interface BillBreakdown {
  energyImportCharges: number;
  peakImportCharges: number;
  offPeakImportCharges: number;
  exportCredit: number;
  fixedCharges: number;
  minimumUnavoidableCharges: number;
  configuredAdjustments: number;
  total: number;
  importedKwhBilled: number;
  exportedKwhCredited: number;
  tariffRecordId: string;
  fixedChargeConfidence: ResultConfidence;
  excludedComponents: string[];
  warnings: string[];
}

function selectTariff(account: BillingAccount, monthlyImportedKwh: number): TariffPolicyRecord {
  const records = NATIONAL_BASE_TARIFF_2026.filter(
    (record) => record.tariffCategory === account.tariffCategory
  );

  if (account.tou) return records.find((record) => record.touStatus === 'tou')!;

  if (account.tariffCategory === 'commercial') {
    const lessThanFive = account.sanctionedLoadKw !== undefined && account.sanctionedLoadKw < 5;
    return records.find((record) => record.id === (lessThanFive ? 'a2-less-than-5kw' : 'a2-at-least-5kw'))!;
  }

  if (account.protectedStatus === 'lifeline-50') return records.find((record) => record.id === 'a1-lifeline-50')!;
  if (account.protectedStatus === 'lifeline-100') return records.find((record) => record.id === 'a1-lifeline-100')!;

  const protectedStatus = account.protectedStatus === 'protected' ? 'protected' : 'non-protected';
  const matching = records.filter((record) =>
    record.touStatus === 'non-tou' &&
    record.protectedStatus === protectedStatus &&
    monthlyImportedKwh >= record.minimumUnitsExclusive &&
    (record.maximumUnitsInclusive === null || monthlyImportedKwh <= record.maximumUnitsInclusive)
  );
  if (matching.length) return matching[0];
  return records.filter((record) => record.protectedStatus === protectedStatus).at(-1)!;
}

function calculateFixedCharge(record: TariffPolicyRecord, account: BillingAccount) {
  const warnings: string[] = [];
  if (record.fixedChargeBasis === 'none') {
    return { amount: 0, confidence: 'High' as const, warnings };
  }
  if (record.fixedChargeBasis === 'connection-month') {
    return { amount: record.fixedCharge, confidence: 'High' as const, warnings };
  }
  if (record.fixedChargeBasis === 'sanctioned-load-kw-month') {
    if (account.sanctionedLoadKw === undefined) {
      warnings.push('Fixed charge excluded because sanctioned load is unavailable.');
      return { amount: 0, confidence: 'Preliminary' as const, warnings };
    }
    return {
      amount: account.sanctionedLoadKw * record.fixedCharge,
      confidence: 'High' as const,
      warnings,
    };
  }

  const loadFloor = account.sanctionedLoadKw === undefined
    ? undefined
    : account.sanctionedLoadKw * (record.sanctionedLoadMultiplier || 0);
  if (loadFloor === undefined && account.mdiKw === undefined) {
    warnings.push('Demand-based fixed charge excluded because sanctioned load and MDI are unavailable.');
    return { amount: 0, confidence: 'Preliminary' as const, warnings };
  }
  if (account.mdiKw === undefined) {
    warnings.push('Demand-based fixed charge is a lower-bound estimate because actual MDI is unavailable.');
    return {
      amount: (loadFloor || 0) * record.fixedCharge,
      confidence: 'Preliminary' as const,
      warnings,
    };
  }
  return {
    amount: Math.max(loadFloor || 0, account.mdiKw) * record.fixedCharge,
    confidence: loadFloor === undefined ? 'Medium' as const : 'High' as const,
    warnings,
  };
}

function resolveNetFlows(flow: MonthlyBillFlow, regime: ProsumerRegime) {
  const rawPeakImport = flow.peakImportedKwh ?? 0;
  const rawOffPeakImport = flow.offPeakImportedKwh ?? Math.max(0, flow.importedKwh - rawPeakImport);
  const rawPeakExport = flow.peakExportedKwh ?? 0;
  const rawOffPeakExport = flow.offPeakExportedKwh ?? Math.max(0, (flow.exportedKwh || 0) - rawPeakExport);

  if (regime !== 'legacy') {
    return {
      peakImport: rawPeakImport,
      offPeakImport: rawOffPeakImport,
      peakExcessExport: rawPeakExport,
      offPeakExcessExport: rawOffPeakExport,
    };
  }

  return {
    peakImport: Math.max(0, rawPeakImport - rawPeakExport),
    offPeakImport: Math.max(0, rawOffPeakImport - rawOffPeakExport),
    peakExcessExport: Math.max(0, rawPeakExport - rawPeakImport),
    offPeakExcessExport: Math.max(0, rawOffPeakExport - rawOffPeakImport),
  };
}

export function calculateMonthlyBill(
  account: BillingAccount,
  flow: MonthlyBillFlow,
  regime: ProsumerRegime = 'not-applicable',
  adjustments: AdjustmentConfig = {}
): BillBreakdown {
  const warnings: string[] = [];
  const net = resolveNetFlows(flow, regime);
  const billedImports = account.tou
    ? net.peakImport + net.offPeakImport
    : regime === 'legacy'
      ? net.peakImport + net.offPeakImport
      : flow.importedKwh;
  const tariff = selectTariff(account, billedImports);
  const fixed = calculateFixedCharge(tariff, account);
  warnings.push(...fixed.warnings);

  if (account.tariffCategory === 'commercial' && !account.tou && account.sanctionedLoadKw === undefined) {
    warnings.push('Commercial load band is preliminary because sanctioned load is unavailable; the ≥5 kW rate is used.');
  }

  const peakImportCharges = account.tou ? net.peakImport * (tariff.peakRate || 0) : 0;
  const offPeakImportCharges = account.tou ? net.offPeakImport * (tariff.offPeakRate || 0) : 0;
  const energyImportCharges = account.tou
    ? 0
    : billedImports * (tariff.variableRate || 0);

  const creditedExports = net.peakExcessExport + net.offPeakExcessExport;
  const naepp = PROSUMER_REFERENCE_VALUES_2026.find((value) => value.id === 'NAEPP')!.exportRate;
  const nappp = PROSUMER_REFERENCE_VALUES_2026.find((value) => value.id === 'NAPPP')!.exportRate;
  const exportRate = regime === 'legacy' ? nappp : regime === 'current-2026' || regime === 'uncertain' ? naepp : 0;
  const exportCredit = creditedExports * exportRate;
  if (regime === 'uncertain') {
    warnings.push('Preliminary — prosumer agreement status must be confirmed. Current NAEPP treatment is shown provisionally.');
  }

  const adjustmentLayer = UTILITY_ADJUSTMENTS_2026[account.utility];
  const excludedComponents: string[] = [];
  if (adjustments.fcaPerImportedKwh === undefined && !adjustmentLayer.fcaConfigured) excludedComponents.push('FCA');
  if (adjustments.qtaAmount === undefined && !adjustmentLayer.qtaConfigured) excludedComponents.push('QTA');
  if (adjustments.statutoryTaxPercent === undefined && !adjustmentLayer.taxesConfigured) excludedComponents.push('statutory taxes');

  const beforeAdjustments = energyImportCharges + peakImportCharges + offPeakImportCharges + fixed.amount - exportCredit;
  const configuredAdjustments =
    (adjustments.fcaPerImportedKwh || 0) * billedImports +
    (adjustments.qtaAmount || 0) +
    beforeAdjustments * ((adjustments.statutoryTaxPercent || 0) / 100);
  const minimumUnavoidableCharges = Math.max(0, adjustments.minimumCharge || 0);
  const total = Math.max(minimumUnavoidableCharges, beforeAdjustments + configuredAdjustments);

  return {
    energyImportCharges: round(energyImportCharges, 2),
    peakImportCharges: round(peakImportCharges, 2),
    offPeakImportCharges: round(offPeakImportCharges, 2),
    exportCredit: round(exportCredit, 2),
    fixedCharges: round(fixed.amount, 2),
    minimumUnavoidableCharges: round(minimumUnavoidableCharges, 2),
    configuredAdjustments: round(configuredAdjustments, 2),
    total: round(total, 2),
    importedKwhBilled: round(billedImports, 2),
    exportedKwhCredited: round(creditedExports, 2),
    tariffRecordId: tariff.id,
    fixedChargeConfidence: fixed.confidence,
    excludedComponents,
    warnings,
  };
}

export function aggregateAnnualBill(months: BillBreakdown): BillBreakdown;
export function aggregateAnnualBill(months: BillBreakdown[]): BillBreakdown;
export function aggregateAnnualBill(months: BillBreakdown | BillBreakdown[]): BillBreakdown {
  if (!Array.isArray(months)) return months;
  const first = months[0];
  return {
    energyImportCharges: round(months.reduce((sum, month) => sum + month.energyImportCharges, 0), 2),
    peakImportCharges: round(months.reduce((sum, month) => sum + month.peakImportCharges, 0), 2),
    offPeakImportCharges: round(months.reduce((sum, month) => sum + month.offPeakImportCharges, 0), 2),
    exportCredit: round(months.reduce((sum, month) => sum + month.exportCredit, 0), 2),
    fixedCharges: round(months.reduce((sum, month) => sum + month.fixedCharges, 0), 2),
    minimumUnavoidableCharges: round(months.reduce((sum, month) => sum + month.minimumUnavoidableCharges, 0), 2),
    configuredAdjustments: round(months.reduce((sum, month) => sum + month.configuredAdjustments, 0), 2),
    total: round(months.reduce((sum, month) => sum + month.total, 0), 2),
    importedKwhBilled: round(months.reduce((sum, month) => sum + month.importedKwhBilled, 0), 2),
    exportedKwhCredited: round(months.reduce((sum, month) => sum + month.exportedKwhCredited, 0), 2),
    tariffRecordId: first?.tariffRecordId || 'none',
    fixedChargeConfidence: months.some((month) => month.fixedChargeConfidence === 'Preliminary') ? 'Preliminary' : months.some((month) => month.fixedChargeConfidence === 'Medium') ? 'Medium' : 'High',
    excludedComponents: [...new Set(months.flatMap((month) => month.excludedComponents))],
    warnings: [...new Set(months.flatMap((month) => month.warnings))],
  };
}
