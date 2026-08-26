import { describe, expect, it } from 'vitest';
import { calculateMonthlyBill } from '../src/solar/billing';
import { recommendSolarSystems } from '../src/solar/calculator';
import {
  getTouWindow,
  loadFlowStudyRequired,
  NATIONAL_BASE_TARIFF_2026,
  nepraConcurrenceRequired,
  POLICY_REFERENCE_DATE,
  PROSUMER_POLICY_2026,
  PROSUMER_REFERENCE_VALUES_2026,
  UTILITY_ADJUSTMENTS_2026,
} from '../src/solar/policy';
import { BillingAccount } from '../src/solar/billing';
import { MONTH_KEYS, PAKISTAN_UTILITIES } from '../src/solar/types';

const residential: BillingAccount = {
  utility: 'LESCO',
  tariffCategory: 'residential',
  protectedStatus: 'non-protected',
  tou: false,
  sanctionedLoadKw: 5,
};

const monthlyConsumption = MONTH_KEYS.map((month, index) => ({
  month,
  kwh: 700 + index * 20,
}));

describe('verified 2026 tariff and policy configuration', () => {
  it('stores effective-dated national A-1 slabs with source metadata', () => {
    expect(NATIONAL_BASE_TARIFF_2026.find((record) => record.id === 'a1-lifeline-50')?.variableRate).toBe(3.95);
    expect(NATIONAL_BASE_TARIFF_2026.find((record) => record.id === 'a1-lifeline-100')?.variableRate).toBe(7.74);
    expect(NATIONAL_BASE_TARIFF_2026.find((record) => record.id === 'a1-nonprotected-above-700')?.variableRate).toBe(47.2);
    expect(NATIONAL_BASE_TARIFF_2026.every((record) => record.lastVerified === POLICY_REFERENCE_DATE)).toBe(true);
    expect(NATIONAL_BASE_TARIFF_2026.every((record) => record.sourceReference.includes('279'))).toBe(true);
  });

  it('covers every requested utility through the separate adjustment layer', () => {
    expect(Object.keys(UTILITY_ADJUSTMENTS_2026)).toEqual([...PAKISTAN_UTILITIES]);
    expect(Object.values(UTILITY_ADJUSTMENTS_2026).every((layer) => !layer.fcaConfigured && !layer.qtaConfigured && !layer.taxesConfigured)).toBe(true);
  });

  it('applies lifeline and protected A-1 records', () => {
    const lifeline50 = calculateMonthlyBill({ ...residential, protectedStatus: 'lifeline-50' }, { importedKwh: 50 });
    const lifeline100 = calculateMonthlyBill({ ...residential, protectedStatus: 'lifeline-100' }, { importedKwh: 90 });
    const protected100 = calculateMonthlyBill({ ...residential, protectedStatus: 'protected' }, { importedKwh: 100 });
    const protected200 = calculateMonthlyBill({ ...residential, protectedStatus: 'protected' }, { importedKwh: 180 });
    expect(lifeline50.energyImportCharges).toBe(50 * 3.95);
    expect(lifeline100.energyImportCharges).toBe(90 * 7.74);
    expect(protected100.energyImportCharges).toBe(100 * 10.54);
    expect(protected200.energyImportCharges).toBe(180 * 13.01);
  });

  it.each([
    [80, 'a1-nonprotected-100', 22.44],
    [150, 'a1-nonprotected-200', 28.91],
    [250, 'a1-nonprotected-300', 33.10],
    [350, 'a1-nonprotected-400', 36.46],
    [450, 'a1-nonprotected-500', 38.95],
    [550, 'a1-nonprotected-600', 40.22],
    [650, 'a1-nonprotected-700', 41.85],
    [750, 'a1-nonprotected-above-700', 47.20],
  ])('applies residential non-TOU band %s', (kwh, recordId, rate) => {
    const bill = calculateMonthlyBill(residential, { importedKwh: kwh });
    expect(bill.tariffRecordId).toBe(recordId);
    expect(bill.energyImportCharges).toBeCloseTo(kwh * rate, 2);
  });

  it('applies residential TOU rates and demand floor without inventing MDI', () => {
    const bill = calculateMonthlyBill(
      { ...residential, tou: true, sanctionedLoadKw: 10 },
      { importedKwh: 100, peakImportedKwh: 20, offPeakImportedKwh: 80 }
    );
    expect(bill.peakImportCharges).toBe(20 * 46.85);
    expect(bill.offPeakImportCharges).toBe(80 * 34.53);
    expect(bill.fixedCharges).toBe(5 * 675);
    expect(bill.fixedChargeConfidence).toBe('Preliminary');
  });

  it('applies both commercial load bands and commercial TOU', () => {
    const belowFive = calculateMonthlyBill(
      { ...residential, tariffCategory: 'commercial', sanctionedLoadKw: 4 },
      { importedKwh: 100 }
    );
    const aboveFive = calculateMonthlyBill(
      { ...residential, tariffCategory: 'commercial', sanctionedLoadKw: 10, mdiKw: 4 },
      { importedKwh: 100 }
    );
    const tou = calculateMonthlyBill(
      { ...residential, tariffCategory: 'commercial', tou: true, sanctionedLoadKw: 10, mdiKw: 4 },
      { importedKwh: 100, peakImportedKwh: 20, offPeakImportedKwh: 80 }
    );
    expect(belowFive.energyImportCharges).toBe(3744);
    expect(belowFive.fixedCharges).toBe(1000);
    expect(aboveFive.energyImportCharges).toBe(3976);
    expect(aboveFive.fixedCharges).toBe(5000);
    expect(tou.peakImportCharges).toBe(20 * 43.82);
    expect(tou.offPeakImportCharges).toBe(80 * 35.15);
  });

  it('uses the four seasonal TOU windows', () => {
    expect(getTouWindow('jan').label).toBe('17:00–21:00');
    expect(getTouWindow('apr').label).toBe('18:00–22:00');
    expect(getTouWindow('jul').label).toBe('19:00–23:00');
    expect(getTouWindow('oct').label).toBe('18:00–22:00');
    expect(getTouWindow('oct').offPeakHours).toBe(20);
  });

  it('keeps NAEPP and NAPPP separate and applies current net billing', () => {
    expect(PROSUMER_REFERENCE_VALUES_2026.find((value) => value.id === 'NAEPP')?.exportRate).toBe(8.13);
    expect(PROSUMER_REFERENCE_VALUES_2026.find((value) => value.id === 'NAPPP')?.exportRate).toBe(25.32);
    const bill = calculateMonthlyBill(residential, { importedKwh: 100, exportedKwh: 20 }, 'current-2026');
    expect(bill.energyImportCharges).toBe(100 * 22.44);
    expect(bill.exportCredit).toBeCloseTo(20 * 8.13, 2);
  });

  it('nets legacy peak and off-peak buckets independently then values excess at NAPPP', () => {
    const bill = calculateMonthlyBill(
      { ...residential, tou: true, sanctionedLoadKw: 10, mdiKw: 5 },
      {
        importedKwh: 30,
        peakImportedKwh: 10,
        offPeakImportedKwh: 20,
        exportedKwh: 29,
        peakExportedKwh: 4,
        offPeakExportedKwh: 25,
      },
      'legacy'
    );
    expect(bill.peakImportCharges).toBe(6 * 46.85);
    expect(bill.offPeakImportCharges).toBe(0);
    expect(bill.exportCredit).toBe(5 * 25.32);
  });

  it('marks unknown agreements preliminary', () => {
    const bill = calculateMonthlyBill(residential, { importedKwh: 100, exportedKwh: 20 }, 'uncertain');
    expect(bill.exportCredit).toBeCloseTo(20 * 8.13, 2);
    expect(bill.warnings.join(' ')).toMatch(/agreement status must be confirmed/i);
  });

  it('implements concurrence and load-flow thresholds exactly', () => {
    expect(nepraConcurrenceRequired(25)).toBe(false);
    expect(nepraConcurrenceRequired(25.001)).toBe(true);
    expect(loadFlowStudyRequired(249.999)).toBe(false);
    expect(loadFlowStudyRequired(250)).toBe(true);
  });

  it('versions agreement terms and wider DG/transformer rules', () => {
    expect(PROSUMER_POLICY_2026.initialAgreementTermYears).toBe(5);
    expect(PROSUMER_POLICY_2026.renewalTermYears).toBe(5);
    expect(PROSUMER_POLICY_2026.maximumDgCapacityKw).toBe(1000);
    expect(PROSUMER_POLICY_2026.transformerHostingCapacityThreshold).toBe(0.8);
  });

  it('retains fixed charges even when imported energy reaches zero', () => {
    const bill = calculateMonthlyBill(residential, { importedKwh: 0 });
    expect(bill.energyImportCharges).toBe(0);
    expect(bill.fixedCharges).toBe(5 * 275);
    expect(bill.total).toBe(5 * 275);
  });
});

describe('six-scenario billing optimizer', () => {
  it('returns all six architectures and enforces sanctioned load on export-connected DG', () => {
    const result = recommendSolarSystems({
      city: 'Lahore', monthlyConsumption, sanctionedLoadKw: 10, greenMeter: false,
      utility: 'LESCO', tariffCategory: 'residential', protectedStatus: 'non-protected',
    });
    expect(result.scenarios).toHaveLength(6);
    for (const scenario of result.scenarios!.filter((item) => item.utilityApprovalRequired)) {
      expect(scenario.actualPvCapacityKw).toBeLessThanOrEqual(10);
      expect(scenario.regulatoryValid).toBe(true);
      expect(scenario.qualifications?.join(' ')).toMatch(/transformer feasibility/i);
    }
  });

  it('gives no export credit to no-green-meter architectures', () => {
    const result = recommendSolarSystems({ city: 'Lahore', monthlyConsumption, sanctionedLoadKw: 20 });
    const noExport = result.scenarios!.find((item) => item.architecture === 'hybrid-no-green-no-battery')!;
    expect(noExport.annualGridExportKwh).toBe(0);
    expect(noExport.prosumerRegime).toBe('not-applicable');
  });

  it('excludes unconfigured FCA, QTA, and taxes and preserves fixed charges after solar', () => {
    const result = recommendSolarSystems({
      city: 'Lahore', monthlyConsumption, sanctionedLoadKw: 10,
      utility: 'LESCO', tariffCategory: 'residential', protectedStatus: 'non-protected',
      greenMeter: true, legacyAgreementStatus: 'none',
    });
    expect(result.billing?.excludedComponents).toEqual(['FCA', 'QTA', 'statutory taxes']);
    expect(result.billing?.postSolarEstimatedBill).toBeGreaterThan(0);
    expect(result.billing?.billReductionPercent).toBeLessThan(100);
  });

  it('does not equate complete annual generation coverage with complete bill reduction', () => {
    const result = recommendSolarSystems({
      city: 'Islamabad', monthlyConsumption, sanctionedLoadKw: 20,
      tariffCategory: 'residential', protectedStatus: 'non-protected', greenMeter: true,
      legacyAgreementStatus: 'none',
    });
    const covered = result.scenarios!.find((scenario) => scenario.generationToConsumptionPercent >= 100)!;
    expect(covered).toBeDefined();
    expect(covered.billReductionPercent).toBeLessThan(100);
    expect(covered.postSolarEstimatedBill).toBeGreaterThan(0);
  });

  it('supports chosen-only and both analysis modes', () => {
    const chosen = recommendSolarSystems({
      city: 'Lahore', monthlyConsumption, analysisMode: 'chosen',
      chosenArchitecture: 'hybrid-no-green-battery',
    });
    const both = recommendSolarSystems({
      city: 'Lahore', monthlyConsumption, analysisMode: 'both',
      chosenArchitecture: 'hybrid-no-green-battery',
    });
    expect(chosen.scenarios).toHaveLength(1);
    expect(chosen.bestMatch.architecture).toBe('hybrid-no-green-battery');
    expect(both.scenarios).toHaveLength(6);
    expect(both.selectedSystem?.architecture).toBe('hybrid-no-green-battery');
  });
});
