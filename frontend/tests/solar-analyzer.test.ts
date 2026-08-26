import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  ANALYZER_MONTHS,
  buildAnalyzerComparisonExplanation,
  buildAnalyzerHeroExplanation,
  buildAnalyzerQuoteUrl,
  buildAnalyzerWhatsAppMessage,
  calculateAnalyzerMetrics,
  createEmptyMonthlyValues,
  formatBatteryRange,
  getAnalyzerResultPresentation,
  getBatteryRefinementTitle,
  getCustomerBillPresentation,
  AnalyzerArchitecture,
  SolarRecommendationResponse,
  transitionAnalysisMode,
  validateAnalysisSelection,
  validateAnalyzerBillFile,
} from '../lib/solar-analyzer';

function completeValues() {
  const values = createEmptyMonthlyValues();
  ANALYZER_MONTHS.forEach((month, index) => {
    values[month.key] = String(700 + index * 25);
  });
  return values;
}

const recommendation = {
  bestMatch: {
    type: 'on-grid',
    architecture: 'on-grid-only',
    label: 'On-Grid Only',
    pvCapacityKw: 10,
    actualPvCapacityKw: 10.53,
    inverterKw: 10,
    panelCount: 18,
    annualGenerationKwh: 14800,
    annualConsumptionKwh: 13800,
    consumptionCoveragePercent: 94,
    generationToConsumptionPercent: 107,
    annualSurplusKwh: 2100,
    annualShortfallKwh: 1100,
    seasonalMatch: 'strong',
    monthlySimulation: [],
    battery: null,
    suitability: 'Best bill-based energy match',
    billReductionPercent: 90,
    postSolarEstimatedBill: 12000,
    annualGridImportKwh: 2200,
    annualGridExportKwh: 1800,
    utilityApprovalRequired: true,
    prosumerRegime: 'current-2026',
  },
  systems: {} as SolarRecommendationResponse['systems'],
  consumption: {
    annualKwh: 13800,
    averageMonthlyKwh: 1150,
    averageDailyKwh: 37.81,
    highestMonth: { month: 'jul', kwh: 1450 },
    lowestMonth: { month: 'jan', kwh: 850 },
    validMonthCount: 12,
    missingMonths: [],
    complete: true,
  },
  location: {
    requestedCity: 'Islamabad',
    profileCity: 'Islamabad',
    profileKey: 'islamabad',
    fallbackUsed: false,
  },
  explanation: 'Deterministic explanation',
  assumptions: {
    panelWattage: 585,
    performanceRatio: 0.8,
    profileBasis: 'NASA POWER',
    dcAcRatioTarget: 1.15,
    dcAcRatioRange: { min: 0.75, max: 1.3 },
    selectionRule: 'Panel-based selection rule.',
  },
  dataCompleteness: 'complete',
  disclaimer: 'Preliminary only.',
  analysisMode: 'recommend',
} as SolarRecommendationResponse;

function scenario(
  architecture: AnalyzerArchitecture,
  label: string,
  billReductionPercent: number,
  options: Partial<SolarRecommendationResponse['bestMatch']> = {}
) {
  return {
    ...recommendation.bestMatch,
    architecture,
    label,
    billReductionPercent,
    ...options,
  };
}

const sixScenarios = [
  recommendation.bestMatch,
  scenario('hybrid-green-no-battery', 'Hybrid + Green Meter — No Battery', 87),
  scenario('hybrid-green-battery', 'Hybrid + Green Meter + Battery', 91, { type: 'hybrid', battery: { minKwh: 10, maxKwh: 15, basis: 'test' } }),
  scenario('hybrid-no-green-no-battery', 'Hybrid Only — No Green Meter / No Battery', 88, { type: 'hybrid', utilityApprovalRequired: false, annualGridExportKwh: 0, prosumerRegime: 'not-applicable' }),
  scenario('hybrid-no-green-battery', 'Hybrid + Battery — No Green Meter', 86, { type: 'hybrid', battery: { minKwh: 10, maxKwh: 15, basis: 'test' }, utilityApprovalRequired: false, annualGridExportKwh: 0 }),
  scenario('off-grid', 'Off-Grid', 92, { type: 'off-grid', battery: { minKwh: 20, maxKwh: 30, basis: 'test' }, utilityApprovalRequired: false, annualGridImportKwh: 0, annualGridExportKwh: 0 }),
];

describe('frontend solar analyzer helpers', () => {
  it('calculates verified annual, monthly, daily, highest, and lowest metrics', () => {
    const metrics = calculateAnalyzerMetrics(completeValues());

    expect(metrics.complete).toBe(true);
    expect(metrics.validMonthCount).toBe(12);
    expect(metrics.averageMonthlyKwh).toBeCloseTo(metrics.annualKwh / 12, 1);
    expect(metrics.averageDailyKwh).toBeCloseTo(metrics.annualKwh / 365, 1);
    expect(metrics.highestMonth?.month).toBe('dec');
    expect(metrics.lowestMonth?.month).toBe('jan');
  });

  it('keeps missing monthly consumption visibly incomplete', () => {
    const values = completeValues();
    values.mar = '';
    values.sep = '';
    const metrics = calculateAnalyzerMetrics(values);

    expect(metrics.complete).toBe(false);
    expect(metrics.missingMonths).toEqual(['mar', 'sep']);
    expect(metrics.averageDailyKwh).toBe(0);
  });

  it('accepts valid PDF, JPEG, and PNG signatures in the browser validator', async () => {
    const pdf = new File([Buffer.from('%PDF-1.7\n1 0 obj\nendobj\n%%EOF')], 'bill.pdf', {
      type: 'application/pdf',
    });
    const jpeg = new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], 'bill.jpg', {
      type: 'image/jpeg',
    });
    const png = new File([
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    ], 'bill.png', { type: 'image/png' });

    await expect(validateAnalyzerBillFile(pdf)).resolves.toBeNull();
    await expect(validateAnalyzerBillFile(jpeg)).resolves.toBeNull();
    await expect(validateAnalyzerBillFile(png)).resolves.toBeNull();
  });

  it('rejects unsupported and corrupt browser uploads', async () => {
    const unsupported = new File(['plain text'], 'bill.txt', { type: 'text/plain' });
    const corrupt = new File(['not a png'], 'bill.png', { type: 'image/png' });

    await expect(validateAnalyzerBillFile(unsupported)).resolves.toMatch(/PDF, JPG/);
    await expect(validateAnalyzerBillFile(corrupt)).resolves.toMatch(/corrupted/);
  });

  it('builds quote and WhatsApp handoffs with engineering context but no bill PII', () => {
    const quoteUrl = buildAnalyzerQuoteUrl(recommendation, 'high');
    const whatsapp = buildAnalyzerWhatsAppMessage(recommendation);

    expect(quoteUrl).toContain('source=solar_bill_analyzer');
    expect(quoteUrl).toContain('recommendedPvKw=10.53');
    expect(quoteUrl).toContain('billAnalysisConfidence=high');
    expect(whatsapp).toContain('10.53 kWp On-Grid');
    expect(whatsapp).toContain('Islamabad');
    expect(`${quoteUrl}${whatsapp}`).not.toMatch(/account|meter|consumer number|address/i);
  });

  it('formats an equal battery range as a single capacity', () => {
    expect(formatBatteryRange(5, 5)).toBe('5 kWh');
    expect(formatBatteryRange(5, 10)).toBe('5–10 kWh');
  });

  it('blocks missing analysis selections and conditionally requires one chosen architecture', () => {
    expect(validateAnalysisSelection('', '')).toMatch(/Choose how/);
    expect(validateAnalysisSelection('recommend', '')).toBeNull();
    expect(validateAnalysisSelection('chosen', '')).toMatch(/Choose one/);
    expect(validateAnalysisSelection('chosen', 'off-grid')).toBeNull();
    expect(validateAnalysisSelection('both', '')).toMatch(/Choose one/);
    expect(validateAnalysisSelection('both', 'hybrid-green-battery')).toBeNull();
  });

  it('preserves the cached chosen architecture when analysis mode changes', () => {
    const chosen = transitionAnalysisMode('hybrid-no-green-battery', 'chosen');
    const both = transitionAnalysisMode(chosen.chosenArchitecture, 'both');
    const recommend = transitionAnalysisMode(both.chosenArchitecture, 'recommend');

    expect(chosen.chosenArchitecture).toBe('hybrid-no-green-battery');
    expect(both.chosenArchitecture).toBe('hybrid-no-green-battery');
    expect(recommend.chosenArchitecture).toBe('hybrid-no-green-battery');
  });

  it('shows recommend mode as best plus no more than one useful alternative', () => {
    const result = { ...recommendation, scenarios: sixScenarios, analysisMode: 'recommend' };
    const presented = getAnalyzerResultPresentation(result);

    expect(presented).toHaveLength(2);
    expect(presented[0].title).toBe('Best Recommendation');
    expect(presented[1].title).toBe('Zero-Export Alternative');
    expect(presented.map((item) => item.system.architecture)).not.toHaveLength(6);
  });

  it('shows only the optimized selected architecture in chosen mode', () => {
    const selected = sixScenarios[4];
    const result = {
      ...recommendation,
      analysisMode: 'chosen' as const,
      bestMatch: selected,
      selectedSystem: selected,
      scenarios: [selected],
    };
    const presented = getAnalyzerResultPresentation(result);

    expect(presented).toHaveLength(1);
    expect(presented[0].title).toBe('Your Selected System');
    expect(presented[0].system.architecture).toBe('hybrid-no-green-battery');
  });

  it('shows recommended versus selected results and deterministic comparison in both mode', () => {
    const selected = sixScenarios[2];
    const result = {
      ...recommendation,
      analysisMode: 'both' as const,
      scenarios: sixScenarios,
      selectedSystem: selected,
    };
    const presented = getAnalyzerResultPresentation(result);
    const explanation = buildAnalyzerComparisonExplanation(result);

    expect(presented.map((item) => item.title)).toEqual(['Best Recommended System', 'Your Selected System']);
    expect(explanation).toHaveLength(3);
    expect(explanation.join(' ')).toMatch(/bill reduction|imports|exports|battery/i);
  });

  it('keeps analysis selectors responsive at mobile, tablet, and desktop breakpoints', () => {
    const source = readFileSync(
      new URL('../components/solar-analyzer/SolarBillAnalyzer.tsx', import.meta.url),
      'utf8'
    );
    expect(source).toContain('grid grid-cols-1 lg:grid-cols-3');
    expect(source).toContain('grid grid-cols-1 md:grid-cols-2');
    expect(source).toContain('min-w-0 rounded-2xl');
  });

  it('uses not-applicable grid-bill semantics for Off-Grid instead of savings claims', () => {
    const offGrid = scenario('off-grid', 'Off-Grid', 100, {
      type: 'off-grid',
      postSolarEstimatedBill: 0,
      annualGridImportKwh: 0,
      annualGridExportKwh: 0,
      battery: { minKwh: 20, maxKwh: 30, basis: 'test' },
    });
    const presentation = getCustomerBillPresentation(offGrid);

    expect(presentation.applicable).toBe(false);
    expect(presentation.billReductionPercent).toBeNull();
    expect(presentation.remainingBill).toBeNull();
    expect(presentation.gridBillMessage).toMatch(/Not applicable.*disconnected/i);
    expect(JSON.stringify(presentation)).not.toContain('100%');
    expect(JSON.stringify(presentation)).not.toContain('Rs 0');
  });

  it('uses deterministic Off-Grid hero copy without export or prosumer language', () => {
    const offGrid = scenario('off-grid', 'Off-Grid', 100, {
      type: 'off-grid',
      postSolarEstimatedBill: 0,
      battery: { minKwh: 20, maxKwh: 30, basis: 'test' },
    });
    const explanation = buildAnalyzerHeroExplanation({
      ...recommendation,
      analysisMode: 'chosen',
      bestMatch: offGrid,
      selectedSystem: offGrid,
      explanation: 'Retains fixed charges and values exports under the prosumer regime.',
    });

    expect(explanation).toMatch(/preliminary Off-Grid configuration/i);
    expect(explanation).toMatch(/load, surge-demand, battery-autonomy and site assessment/i);
    expect(explanation).not.toMatch(/export|prosumer/i);
  });

  it('uses the Battery & Autonomy refinement title for a selected Off-Grid system', () => {
    const offGrid = scenario('off-grid', 'Off-Grid', 100, {
      type: 'off-grid',
      battery: { minKwh: 20, maxKwh: 30, basis: 'test' },
    });
    const offGridResult = {
      ...recommendation,
      analysisMode: 'chosen' as const,
      bestMatch: offGrid,
      selectedSystem: offGrid,
    };
    const hybridResult = {
      ...recommendation,
      analysisMode: 'chosen' as const,
      bestMatch: sixScenarios[2],
      selectedSystem: sixScenarios[2],
    };

    expect(getBatteryRefinementTitle(offGridResult)).toBe('Refine Battery & Autonomy Estimate');
    expect(getBatteryRefinementTitle(hybridResult)).toBe('Refine the Hybrid battery estimate');
  });

  it('treats Off-Grid as independence rather than 100% bill reduction in Both mode', () => {
    const offGrid = scenario('off-grid', 'Off-Grid', 100, {
      type: 'off-grid',
      postSolarEstimatedBill: 0,
      annualGridImportKwh: 0,
      annualGridExportKwh: 0,
      battery: { minKwh: 20, maxKwh: 30, basis: 'test' },
    });
    const explanation = buildAnalyzerComparisonExplanation({
      ...recommendation,
      analysisMode: 'both',
      selectedSystem: offGrid,
      scenarios: [...sixScenarios.slice(0, 5), offGrid],
    });

    expect(explanation).toHaveLength(3);
    expect(explanation.join(' ')).toMatch(/independence option.*not directly comparable/i);
    expect(explanation.join(' ')).not.toContain('100%');
  });

  it('preserves normal bill-reduction metrics for the other five architectures', () => {
    for (const system of sixScenarios.filter((item) => item.architecture !== 'off-grid')) {
      const presentation = getCustomerBillPresentation(system);
      expect(presentation.applicable).toBe(true);
      expect(presentation.billReductionPercent).toBe(system.billReductionPercent);
      expect(presentation.remainingBill).toBe(system.postSolarEstimatedBill);
    }
  });
});
