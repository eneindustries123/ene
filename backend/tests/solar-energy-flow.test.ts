import { describe, it, expect } from 'vitest';
import { recommendSolarSystems } from '../src/solar/calculator';
import { MonthlyConsumption, SolarRecommendationResult } from '../src/solar/types';
import { FINANCIAL_MODEL_VERSION } from '../src/solar/financialConfig';
import { PROSUMER_POLICY_2026, PROSUMER_REFERENCE_VALUES_2026 } from '../src/solar/policy';

const SAMPLE_12_MONTHS: MonthlyConsumption[] = [
  { month: 'jan', kwh: 1200 },
  { month: 'feb', kwh: 1100 },
  { month: 'mar', kwh: 1400 },
  { month: 'apr', kwh: 1800 },
  { month: 'may', kwh: 2400 },
  { month: 'jun', kwh: 2800 },
  { month: 'jul', kwh: 2900 },
  { month: 'aug', kwh: 2700 },
  { month: 'sep', kwh: 2300 },
  { month: 'oct', kwh: 1700 },
  { month: 'nov', kwh: 1300 },
  { month: 'dec', kwh: 1100 },
];

describe('Phase 2 — Solar Energy Flow, Optimization & Regulatory Verification', () => {
  describe('1. Strict Conservation of Energy & Loss Accounting', () => {
    it('conserves generation and consumption energy across all 12 months for On-Grid systems', () => {
      const result: SolarRecommendationResult = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        tariffCategory: 'residential',
        sanctionedLoadKw: 15,
        analysisMode: 'chosen',
        chosenArchitecture: 'on-grid-only',
        consumptionProfile: { profileType: 'custom', customDaytimeSharePercent: 65 },
      });

      const onGrid = result.bestMatch;
      expect(onGrid.energyFlow).toBeDefined();
      expect(onGrid.monthlyEnergyFlows).toHaveLength(12);

      const annual = onGrid.energyFlow!;
      // Generation balance: Gen = Self + Charge + Export + Curtailed
      const sumGenComponents = annual.selfConsumedKwh + annual.batteryChargeKwh + annual.gridExportKwh + annual.curtailedKwh;
      expect(Math.abs(sumGenComponents - annual.annualGenerationKwh)).toBeLessThanOrEqual(2); // rounding tolerance

      // Load balance: Load = Self + Discharge + Import
      const sumLoadComponents = annual.selfConsumedKwh + annual.batteryDischargeKwh + annual.gridImportKwh;
      expect(Math.abs(sumLoadComponents - annual.annualConsumptionKwh)).toBeLessThanOrEqual(2);

      // On-grid has no battery
      expect(annual.batteryChargeKwh).toBe(0);
      expect(annual.batteryDischargeKwh).toBe(0);

      // Check monthly conservation
      for (const m of onGrid.monthlyEnergyFlows!) {
        const genCheck = m.selfConsumedKwh + m.batteryChargeKwh + m.gridExportKwh + m.curtailedKwh;
        expect(Math.abs(genCheck - m.generationKwh)).toBeLessThanOrEqual(0.5);

        const loadCheck = m.selfConsumedKwh + m.batteryDischargeKwh + m.gridImportKwh;
        expect(Math.abs(loadCheck - m.consumptionKwh)).toBeLessThanOrEqual(0.5);
      }
    });

    it('conserves energy and strictly models 92% battery round-trip efficiency for Hybrid systems', () => {
      const result: SolarRecommendationResult = recommendSolarSystems({
        city: 'Karachi',
        monthlyConsumption: SAMPLE_12_MONTHS,
        tariffCategory: 'residential',
        sanctionedLoadKw: 15,
        analysisMode: 'chosen',
        chosenArchitecture: 'hybrid-green-battery',
        consumptionProfile: { profileType: 'custom', customDaytimeSharePercent: 50 },
      });

      const hybrid = result.bestMatch;
      expect(hybrid.energyFlow).toBeDefined();
      const annual = hybrid.energyFlow!;

      // Gen balance
      const sumGen = annual.selfConsumedKwh + annual.batteryChargeKwh + annual.gridExportKwh + annual.curtailedKwh;
      expect(Math.abs(sumGen - annual.annualGenerationKwh)).toBeLessThanOrEqual(2);

      // Load balance
      const sumLoad = annual.selfConsumedKwh + annual.batteryDischargeKwh + annual.gridImportKwh;
      expect(Math.abs(sumLoad - annual.annualConsumptionKwh)).toBeLessThanOrEqual(2);

      // Battery discharge <= charge * efficiency (0.92)
      if (annual.batteryChargeKwh > 0) {
        expect(annual.batteryDischargeKwh).toBeLessThanOrEqual(annual.batteryChargeKwh * 0.92 + 0.5);
        // Conversion losses are positive
        const loss = annual.batteryChargeKwh - annual.batteryDischargeKwh;
        expect(loss).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('2. Consumption Profile Presets and Custom Inputs', () => {
    it('correctly applies user-specified percentages and fallback assumptions', () => {
      const customRes = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        consumptionProfile: { profileType: 'custom', customDaytimeSharePercent: 70 },
      });
      expect(customRes.consumptionProfile?.daytimeSharePercent).toBe(70);
      expect(customRes.consumptionProfile?.source).toBe('user-specified');

      const resFallback = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        tariffCategory: 'residential',
        consumptionProfile: { profileType: 'not-sure' },
      });
      expect(resFallback.consumptionProfile?.daytimeSharePercent).toBe(38);
      expect(resFallback.consumptionProfile?.source).toBe('fallback-assumption');

      const comFallback = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        tariffCategory: 'commercial',
      });
      expect(comFallback.consumptionProfile?.daytimeSharePercent).toBe(50);
      expect(comFallback.consumptionProfile?.source).toBe('fallback-assumption');
    });

    it('demonstrates higher self-consumption ratio for 70% daytime profile compared to 25% evening profile', () => {
      const daytime = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        analysisMode: 'chosen',
        chosenArchitecture: 'on-grid-only',
        consumptionProfile: { profileType: 'custom', customDaytimeSharePercent: 70 },
      });

      const evening = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        analysisMode: 'chosen',
        chosenArchitecture: 'on-grid-only',
        consumptionProfile: { profileType: 'custom', customDaytimeSharePercent: 25 },
      });

      const daytimeSelfConsumption = daytime.bestMatch.energyFlow!.selfConsumedKwh;
      const eveningSelfConsumption = evening.bestMatch.energyFlow!.selfConsumedKwh;

      expect(daytimeSelfConsumption).toBeGreaterThan(eveningSelfConsumption);
      expect(daytime.bestMatch.energyFlow!.gridExportKwh).toBeLessThan(evening.bestMatch.energyFlow!.gridExportKwh);
    });
  });

  describe('3. Separation of Avoided Retail Value vs Export Credit Value', () => {
    it('separates avoided retail savings from export credit savings in financial breakdown', () => {
      const res = recommendSolarSystems({
        city: 'Islamabad',
        monthlyConsumption: SAMPLE_12_MONTHS,
        sanctionedLoadKw: 20,
        analysisMode: 'chosen',
        chosenArchitecture: 'on-grid-only',
        consumptionProfile: { profileType: 'custom', customDaytimeSharePercent: 50 },
      });

      const fin = res.bestMatch.financialAnalysis;
      expect(fin).toBeDefined();
      expect(fin!.avoidedGridPurchaseValuePkr).toBeGreaterThan(0);
      expect(fin!.exportCreditValuePkr).toBeGreaterThan(0);
      expect(fin!.annualBillReductionPkr).toBeGreaterThan(0);
      expect(fin!.financialModelVersion).toBe(FINANCIAL_MODEL_VERSION);

      // Avoided retail unit rate is substantially higher than NAEPP export rate (Rs 8.13/kWh)
      const unitRetailRate = fin!.avoidedGridPurchaseValuePkr / res.bestMatch.energyFlow!.selfConsumedKwh;
      expect(unitRetailRate).toBeGreaterThan(PROSUMER_POLICY_2026.exportSettlement.current.ratePkrPerKwh);
    });

    it('applies legacy net metering ONLY when legacy agreement status is confirmed', () => {
      const legacyRes = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        sanctionedLoadKw: 20,
        analysisMode: 'chosen',
        chosenArchitecture: 'on-grid-only',
        legacyAgreementStatus: 'confirmed',
      });

      const standardRes = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        sanctionedLoadKw: 20,
        analysisMode: 'chosen',
        chosenArchitecture: 'on-grid-only',
        legacyAgreementStatus: 'not-applicable',
      });

      expect(legacyRes.bestMatch.prosumerRegime).toBe('legacy');
      expect(standardRes.bestMatch.prosumerRegime).toBe('current-2026');

      // Legacy 1:1 unit netting yields greater overall bill savings than 2026 gross billing
      const legacySavings = legacyRes.bestMatch.financialAnalysis!.annualBillReductionPkr;
      const standardSavings = standardRes.bestMatch.financialAnalysis!.annualBillReductionPkr;
      expect(legacySavings).toBeGreaterThan(standardSavings);
    });
  });

  describe('4. Zero-Export and Off-Grid Constraints', () => {
    it('enforces 0 kWh export and 0 PKR export credit for zero-export hybrid systems', () => {
      const result = recommendSolarSystems({
        city: 'Faisalabad',
        monthlyConsumption: SAMPLE_12_MONTHS,
        analysisMode: 'chosen',
        chosenArchitecture: 'hybrid-no-green-battery',
        consumptionProfile: { profileType: 'custom', customDaytimeSharePercent: 20 },
      });

      const system = result.bestMatch;
      const energy = system.energyFlow!;
      const fin = system.financialAnalysis!;

      expect(energy.gridExportKwh).toBe(0);
      expect(fin.exportCreditValuePkr).toBe(0);
      expect(energy.curtailedKwh).toBeGreaterThanOrEqual(0);
      // Gen balance
      const sumGen = energy.selfConsumedKwh + energy.batteryChargeKwh + energy.gridExportKwh + energy.curtailedKwh;
      expect(Math.abs(sumGen - energy.annualGenerationKwh)).toBeLessThanOrEqual(2);
    });

    it('enforces 0 grid import and 0 grid export for off-grid systems and distinguishes grid independence from load coverage', () => {
      const result = recommendSolarSystems({
        city: 'Quetta',
        monthlyConsumption: SAMPLE_12_MONTHS,
        analysisMode: 'chosen',
        chosenArchitecture: 'off-grid',
      });

      const offGrid = result.bestMatch;
      const energy = offGrid.energyFlow!;
      const fin = offGrid.financialAnalysis!;

      expect(energy.gridExportKwh).toBe(0);
      expect(energy.gridImportKwh).toBe(0);
      expect(fin.exportCreditValuePkr).toBe(0);
      expect(energy.gridIndependenceRatio).toBe(1); // 100% disconnected from grid
      expect(energy.loadCoveragePercent).toBeGreaterThan(0);
      expect(energy.loadCoveragePercent).toBeLessThanOrEqual(100);
      expect(energy.unmetLoadKwh).toBeGreaterThanOrEqual(0);
    });
  });

  describe('5. Primary Objective Deterministic Optimization', () => {
    it('optimizes maximum-savings without hardcoding: On-Grid wins when export netting or 100% daytime load avoids battery losses', () => {
      // Case 1: Legacy 1:1 net metering where grid netting is 100% efficient, beating battery 92% efficiency
      const legacyResult = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        sanctionedLoadKw: 25,
        primaryObjective: 'maximum-savings',
        legacyAgreementStatus: 'confirmed',
      });
      expect(legacyResult.bestMatch.type).toBe('on-grid');
      expect(legacyResult.bestMatch.architecture).toBe('on-grid-only');

      // Case 2: 100% daytime commercial profile where all consumption occurs during sun hours
      const daytimeCommercialResult = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        tariffCategory: 'commercial',
        sanctionedLoadKw: 25,
        primaryObjective: 'maximum-savings',
        consumptionProfile: { profileType: 'custom', customDaytimeSharePercent: 100 },
      });
      expect(daytimeCommercialResult.bestMatch.type).toBe('on-grid');
      expect(daytimeCommercialResult.bestMatch.architecture).toBe('on-grid-only');
    });

    it('optimizes maximum-savings without hardcoding: Hybrid+Battery wins for evening-heavy profile under 2026 gross-billing', () => {
      const result = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        sanctionedLoadKw: 25,
        primaryObjective: 'maximum-savings',
        consumptionProfile: { profileType: 'custom', customDaytimeSharePercent: 15 },
      });

      // With only 15% daytime use, dumping 85% to grid at Rs 8.13 is inferior to storing and avoiding Rs 47/kWh evening imports
      expect(result.bestMatch.architecture).toBe('hybrid-green-battery');
      expect(result.bestMatch.battery).not.toBeNull();
      // Bill reduction of hybrid must be strictly greater than on-grid for this profile
      const onGridScenario = result.scenarios?.find((s) => s.architecture === 'on-grid-only');
      expect(result.bestMatch.billReductionPercent).toBeGreaterThan(onGridScenario?.billReductionPercent || 0);
    });

    it('recommends hybrid with battery when primaryObjective is balanced-backup and evaluates battery options', () => {
      const result = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        sanctionedLoadKw: 20,
        primaryObjective: 'balanced-backup',
      });

      expect(result.bestMatch.type).toBe('hybrid');
      expect(result.bestMatch.battery).not.toBeNull();
      // When export is permitted, hybrid-green-battery is superior to hybrid-no-green-battery
      expect(result.bestMatch.architecture).toBe('hybrid-green-battery');
    });

    it('recommends off-grid when primaryObjective is grid-independence', () => {
      const result = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        primaryObjective: 'grid-independence',
      });

      expect(result.bestMatch.type).toBe('off-grid');
      expect(result.bestMatch.architecture).toBe('off-grid');
      expect(result.bestMatch.energyFlow?.gridIndependenceRatio).toBe(1);
    });
  });

  describe('6. Legacy Regulatory Metadata & S.R.O. Disambiguation', () => {
    it('associates legacy NAPPP rate with S.R.O. 547 grandfathering rather than S.R.O. 1330', () => {
      expect(PROSUMER_POLICY_2026.settlementRules.legacy.regulatorySource).toContain('S.R.O. 547(I)/2026');
      expect(PROSUMER_POLICY_2026.settlementRules.legacy.regulatorySource).not.toContain('1330');
      expect(PROSUMER_POLICY_2026.settlementRules.legacy.ratePkrPerKwh).toBe(25.32);
      expect(PROSUMER_POLICY_2026.settlementRules.legacy.rateSource).toContain('National Average Power Purchase Price');

      // S.R.O. 1330 is strictly the concurrence exemption
      expect(PROSUMER_POLICY_2026.sourceReferences.concurrenceAmendment).toContain('S.R.O. 1330(I)/2026');
      expect(PROSUMER_POLICY_2026.sourceReferences.concurrenceAmendment).toContain('Concurrence Exemption');
    });
  });

  describe('7. Phase 1 Regulatory Invariant Preservation', () => {
    it('maintains engineering PV requirement against 10 kW sanctioned load without truncation', () => {
      const result = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS, // approx 22,800 kWh/yr -> ~23.985 kWp PV
        sanctionedLoadKw: 10,
      });

      const onGrid = result.systems.onGrid;
      // Engineering PV capacity MUST NOT be truncated to 10 kW
      expect(onGrid.actualPvCapacityKw).toBeGreaterThan(10.0);
      expect(onGrid.actualPvCapacityKw).toBeCloseTo(23.985, 0.1);

      // Regulatory analysis MUST flag the mismatch accurately
      expect(onGrid.regulatoryStatus).toBeDefined();
      expect(onGrid.regulatoryStatus!.sanctionedLoadKw).toBe(10);
      expect(onGrid.regulatoryStatus!.exceedsSanctionedLoad).toBe(true);
      expect(onGrid.regulatoryStatus!.loadExtensionRequired).toBe(true);
      expect(onGrid.regulatoryStatus!.currentGridEligibleCapacityKw).toBe(10);
      expect(onGrid.regulatoryStatus!.excessCapacityKw).toBeGreaterThan(10.0);

      // Energy flow calculations MUST use the full physical generation of 23.985 kWp
      expect(onGrid.energyFlow!.annualGenerationKwh).toBeGreaterThan(30000);
    });
  });

  describe('8. All Six Architectures Evaluation', () => {
    it('successfully evaluates all six standard solar architectures', () => {
      const result = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        sanctionedLoadKw: 20,
      });

      expect(result.scenarios).toHaveLength(6);
      const architectures = result.scenarios!.map((s) => s.architecture);
      expect(architectures).toContain('on-grid-only');
      expect(architectures).toContain('hybrid-green-no-battery');
      expect(architectures).toContain('hybrid-green-battery');
      expect(architectures).toContain('hybrid-no-green-no-battery');
      expect(architectures).toContain('hybrid-no-green-battery');
      expect(architectures).toContain('off-grid');

      for (const s of result.scenarios!) {
        expect(s.energyFlow).toBeDefined();
        expect(s.financialAnalysis).toBeDefined();
        expect(s.actualPvCapacityKw).toBeGreaterThan(0);
      }
    });
  });

  describe('9. Result Transparency & Simulated Battery Capacity Reconciliation', () => {
    it('exposes simulatedKwh on all battery estimates and reconciles financial breakdown components', () => {
      const result = recommendSolarSystems({
        city: 'Lahore',
        monthlyConsumption: SAMPLE_12_MONTHS,
        sanctionedLoadKw: 20,
        analysisMode: 'chosen',
        chosenArchitecture: 'hybrid-green-battery',
      });

      const hybrid = result.bestMatch;
      expect(hybrid.battery).toBeDefined();
      expect(hybrid.battery?.simulatedKwh).toBeDefined();
      expect(hybrid.battery?.simulatedKwh).toBe(hybrid.battery?.minKwh);
      expect(hybrid.battery?.simulatedKwh).toBeGreaterThan(0);

      const fin = hybrid.financialAnalysis!;
      expect(fin).toBeDefined();
      expect(fin.fixedChargeSavingsPkr).toBeDefined();

      // Check mathematical reconciliation:
      // Modeled Annual Bill Reduction == Avoided Grid Purchase + Export Credit + Fixed Charge Savings (within rounding tolerance)
      const reconciledSum = fin.avoidedGridPurchaseValuePkr + fin.exportCreditValuePkr + (fin.fixedChargeSavingsPkr || 0);
      expect(Math.abs(fin.annualBillReductionPkr - reconciledSum)).toBeLessThanOrEqual(5); // rounding tolerance
    });
  });
});
