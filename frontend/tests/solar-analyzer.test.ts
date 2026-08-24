import { describe, expect, it } from 'vitest';
import {
  ANALYZER_MONTHS,
  buildAnalyzerQuoteUrl,
  buildAnalyzerWhatsAppMessage,
  calculateAnalyzerMetrics,
  createEmptyMonthlyValues,
  formatBatteryRange,
  SolarRecommendationResponse,
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
    label: 'On-Grid',
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
} as SolarRecommendationResponse;

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
});
