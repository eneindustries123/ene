import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import {
  buildPvCandidates,
  calculateBatteryEstimate,
  calculatePanelConfiguration,
  recommendSolarSystems,
  selectPracticalInverter,
  simulateMonthlyPerformance,
} from '../src/solar/calculator';
import { SOLAR_ENGINEERING_CONFIG } from '../src/solar/config';
import { calculateConsumptionMetrics } from '../src/solar/consumption';
import { resolvePakistanSolarProfile } from '../src/solar/profiles';
import { MONTH_KEYS, MonthlyConsumption } from '../src/solar/types';
import {
  extractSolarBill,
  normalizeGeminiServiceError,
  parseGeminiBillExtraction,
} from '../src/services/solarAnalyzerGemini.service';
import {
  getSolarAnalyzerMaxFileBytes,
  SolarAnalyzerError,
  validateSolarBillFile,
} from '../src/services/solarAnalyzerFile.service';

const completeConsumption: MonthlyConsumption[] = MONTH_KEYS.map((month, index) => ({
  month,
  kwh: 850 + index * 35,
  confidence: 'high',
}));

const validExtraction = {
  provider: 'LESCO',
  city: 'Lahore',
  citySource: 'customer-address',
  cityConfidence: 'high',
  currentMonth: { month: 'December', year: 2026, kwh: 1235 },
  monthlyHistory: MONTH_KEYS.map((month, index) => ({
    month,
    year: 2026,
    kwh: 850 + index * 35,
    confidence: 'high',
  })),
  connectionType: 'Three phase',
  phase: '3',
  sanctionedLoadKw: 15,
  connectedLoadKw: null,
  consumerCategory: 'Residential',
  currentBillAmount: 48200,
  overallConfidence: 'high',
  warnings: [],
};

function createMulterFile(
  originalname: string,
  mimetype: string,
  buffer: Buffer,
  size = buffer.length
): Express.Multer.File {
  return {
    fieldname: 'bill',
    originalname,
    encoding: '7bit',
    mimetype,
    size,
    destination: '',
    filename: originalname,
    path: '',
    buffer,
    stream: undefined as any,
  };
}

describe('solar analyzer file and Gemini extraction', () => {
  it('accepts valid PDF, JPEG, and PNG signatures', () => {
    const pdf = createMulterFile(
      'bill.pdf',
      'application/pdf',
      Buffer.from('%PDF-1.7\n1 0 obj\nendobj\n%%EOF')
    );
    const jpeg = createMulterFile(
      'bill.jpg',
      'image/jpeg',
      Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])
    );
    const png = createMulterFile(
      'bill.png',
      'image/png',
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00])
    );

    expect(() => validateSolarBillFile(pdf)).not.toThrow();
    expect(() => validateSolarBillFile(jpeg)).not.toThrow();
    expect(() => validateSolarBillFile(png)).not.toThrow();
  });

  it('rejects unsupported, oversized, empty, and corrupt files', () => {
    const unsupported = createMulterFile('bill.txt', 'text/plain', Buffer.from('bill'));
    const oversized = createMulterFile(
      'bill.pdf',
      'application/pdf',
      Buffer.from('%PDF-1.7\n%%EOF'),
      getSolarAnalyzerMaxFileBytes() + 1
    );
    const empty = createMulterFile('bill.pdf', 'application/pdf', Buffer.alloc(0));
    const corrupt = createMulterFile('bill.png', 'image/png', Buffer.from('not-a-png'));

    expect(() => validateSolarBillFile(unsupported)).toThrowError(/Unsupported file extension/);
    expect(() => validateSolarBillFile(oversized)).toThrowError(/maximum allowed/);
    expect(() => validateSolarBillFile(empty)).toThrowError(/empty/);
    expect(() => validateSolarBillFile(corrupt)).toThrowError(/corrupted/);
  });

  it.each([
    ['PDF', createMulterFile(
      'bill.pdf',
      'application/pdf',
      Buffer.from('%PDF-1.7\n1 0 obj\nendobj\n%%EOF'),
    )],
    ['JPEG', createMulterFile(
      'bill.jpg',
      'image/jpeg',
      Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]),
    )],
    ['PNG', createMulterFile(
      'bill.png',
      'image/png',
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]),
    )],
  ])('validates structured extraction from a %s and recomputes bill metrics', async (_format, file) => {
    const result = await extractSolarBill(file, async () => JSON.stringify(validExtraction));

    expect(result.extraction.provider).toBe('LESCO');
    expect(result.extraction.city).toBe('Lahore');
    expect(result.metrics.complete).toBe(true);
    expect(result.metrics.annualKwh).toBe(
      completeConsumption.reduce((total, month) => total + month.kwh, 0)
    );
  });

  it('preserves missing months and low-confidence extraction without fabricating data', async () => {
    const partial = {
      ...validExtraction,
      overallConfidence: 'low',
      monthlyHistory: validExtraction.monthlyHistory.slice(0, 9).map((item) => ({
        ...item,
        confidence: 'low',
      })),
      warnings: ['Three months were unreadable.'],
    };
    const pdf = createMulterFile(
      'bill.pdf',
      'application/pdf',
      Buffer.from('%PDF-1.7\n1 0 obj\nendobj\n%%EOF')
    );
    const result = await extractSolarBill(pdf, async () => JSON.stringify(partial));

    expect(result.extraction.overallConfidence).toBe('low');
    expect(result.metrics.complete).toBe(false);
    expect(result.metrics.missingMonths).toEqual(['oct', 'nov', 'dec']);
  });

  it('rejects malformed Gemini JSON and maps timeout/rate-limit errors safely', () => {
    expect(() => parseGeminiBillExtraction('{not-json')).toThrow(SolarAnalyzerError);
    expect(normalizeGeminiServiceError({ name: 'AbortError' }).code).toBe('GEMINI_TIMEOUT');
    expect(normalizeGeminiServiceError({ status: 429 }).code).toBe('GEMINI_RATE_LIMITED');
  });

  it('does not treat a provider or DISCO name as the installation city', () => {
    const extraction = parseGeminiBillExtraction(JSON.stringify({
      ...validExtraction,
      provider: 'Gujranwala Electric Power Company (GEPCO)',
      city: 'Gujranwala',
      citySource: 'provider-or-disco',
      cityConfidence: 'high',
    }));

    expect(extraction.provider).toBe('Gujranwala Electric Power Company (GEPCO)');
    expect(extraction.city).toBeNull();
    expect(extraction.warnings).toContain('Installation city requires user verification.');
  });
});

describe('solar consumption, Pakistan profiles, and equipment calculations', () => {
  it('calculates annual, monthly, daily, highest, and lowest consumption', () => {
    const metrics = calculateConsumptionMetrics(completeConsumption);

    expect(metrics.complete).toBe(true);
    expect(metrics.validMonthCount).toBe(12);
    expect(metrics.averageMonthlyKwh).toBeCloseTo(metrics.annualKwh / 12, 1);
    expect(metrics.averageDailyKwh).toBeCloseTo(metrics.annualKwh / 365, 1);
    expect(metrics.highestMonth?.month).toBe('dec');
    expect(metrics.lowestMonth?.month).toBe('jan');
  });

  it('reports missing months instead of extrapolating them', () => {
    const metrics = calculateConsumptionMetrics(completeConsumption.slice(0, 10));

    expect(metrics.complete).toBe(false);
    expect(metrics.validMonthCount).toBe(10);
    expect(metrics.missingMonths).toEqual(['nov', 'dec']);
  });

  it('resolves known cities, regional aliases, and conservative unknown fallback', () => {
    const lahore = resolvePakistanSolarProfile('Lahore');
    const faisalabad = resolvePakistanSolarProfile('Faisalabad, Pakistan');
    const unknown = resolvePakistanSolarProfile('Dera Ismail Khan');

    expect(lahore.profileKey).toBe('lahore');
    expect(lahore.monthlyPeakSunHours.jun).toBeGreaterThan(6);
    expect(faisalabad.profileKey).toBe('lahore');
    expect(unknown.profileKey).toBe('islamabad');
    expect(unknown.fallbackUsed).toBe(true);
  });

  it('generates candidates, rounds panels, selects practical inverters, and simulates months', () => {
    const candidates = buildPvCandidates(65);
    const panels = calculatePanelConfiguration(10);
    const profile = resolvePakistanSolarProfile('Islamabad');
    const simulation = simulateMonthlyPerformance(
      10,
      completeConsumption,
      profile.monthlyPeakSunHours
    );

    expect(candidates.every((capacity) => {
      const panelsForCapacity = (capacity * 1000) / SOLAR_ENGINEERING_CONFIG.panelWattage;
      return Math.abs(panelsForCapacity - Math.round(panelsForCapacity)) < 0.001;
    })).toBe(true);
    expect(panels.panelCount).toBe(18);
    expect(panels.actualPvCapacityKw).toBe(10.53);
    expect(selectPracticalInverter(panels.actualPvCapacityKw)).toBe(10);
    expect(simulation.monthlySimulation).toHaveLength(12);
    expect(simulation.monthlySimulation[0].generationKwh).toBeGreaterThan(0);
  });

  it('generates low-consumption candidates from integer panel quantities', () => {
    const candidates = buildPvCandidates(2);
    const panelCapacityKw = SOLAR_ENGINEERING_CONFIG.panelWattage / 1000;

    for (const panelCount of [3, 4, 5, 6]) {
      expect(candidates).toContain(Number((panelCount * panelCapacityKw).toFixed(3)));
    }
  });

  it('matches sub-3-kWp arrays to a practical smaller inverter', () => {
    const panelCapacityKw = SOLAR_ENGINEERING_CONFIG.panelWattage / 1000;

    expect(selectPracticalInverter(4 * panelCapacityKw)).toBe(3);
    expect(selectPracticalInverter(5 * panelCapacityKw)).toBe(3);
    expect(selectPracticalInverter(6 * panelCapacityKw)).toBe(3);
  });

  it('supports low annual consumption without excessive PV oversizing', () => {
    const lowConsumptionKwh = [180, 190, 210, 230, 260, 290, 320, 310, 260, 220, 180, 160];
    const lowConsumption = MONTH_KEYS.map((month, index) => ({
      month,
      kwh: lowConsumptionKwh[index],
      confidence: 'high' as const,
    }));
    const result = recommendSolarSystems({ city: 'Gujranwala', monthlyConsumption: lowConsumption });
    const expectedFourPanelCapacity = Number(
      ((4 * SOLAR_ENGINEERING_CONFIG.panelWattage) / 1000).toFixed(3)
    );

    expect(result.consumption.annualKwh).toBe(2810);
    expect(result.bestMatch.actualPvCapacityKw).toBe(expectedFourPanelCapacity);
    expect(result.bestMatch.consumptionCoveragePercent).toBeGreaterThan(95);
    expect(result.bestMatch.generationToConsumptionPercent).toBeLessThan(130);
    expect(result.bestMatch.inverterKw).toBe(3);
  });

  it('calculates preliminary and refined battery estimates with module rounding', () => {
    const preliminary = calculateBatteryEstimate(40, 'hybrid');
    const refined = calculateBatteryEstimate(40, 'hybrid', {
      backupLevel: 'essential',
      backupHours: 4,
    });
    const offGrid = calculateBatteryEstimate(40, 'off-grid');

    expect(preliminary.minKwh % 5).toBe(0);
    expect(refined.basis).toBe('refined-backup-selection');
    expect(offGrid.minKwh).toBeGreaterThan(preliminary.minKwh);
  });

  it('returns deterministic three-system comparison with off-grid caution', () => {
    const result = recommendSolarSystems({
      city: 'Islamabad',
      monthlyConsumption: completeConsumption,
    });

    expect(result.bestMatch.type).toBe('on-grid');
    expect(result.systems.onGrid.battery).toBeNull();
    expect(result.systems.hybrid.battery).not.toBeNull();
    expect(result.systems.offGrid.caution).toMatch(/Detailed load assessment/);
    expect(result.systems.offGrid.actualPvCapacityKw)
      .toBeGreaterThan(result.systems.onGrid.actualPvCapacityKw);
    expect(result.systems.offGrid.generationToConsumptionPercent)
      .toBeGreaterThanOrEqual(100 * SOLAR_ENGINEERING_CONFIG.offGridPvMargin);
    expect(result.systems.onGrid.monthlySimulation).toHaveLength(12);
  });
});

describe('solar analyzer API', () => {
  it('returns public analyzer configuration without exposing secrets', async () => {
    const response = await request(app).get('/api/solar-analyzer/config');

    expect(response.status).toBe(200);
    expect(response.body.cities).toContain('Lahore');
    expect(response.body.upload.maxFileBytes).toBeGreaterThan(0);
    expect(response.body).not.toHaveProperty('geminiApiKey');
  });

  it('rejects malformed recommendation input and accepts verified twelve-month data', async () => {
    const invalid = await request(app)
      .post('/api/solar-analyzer/recommend')
      .send({ city: 'Lahore', monthlyConsumption: completeConsumption.slice(0, 11) });
    const valid = await request(app)
      .post('/api/solar-analyzer/recommend')
      .send({ city: 'Lahore', monthlyConsumption: completeConsumption });

    expect(invalid.status).toBe(400);
    expect(valid.status).toBe(200);
    expect(valid.body.systems.onGrid.type).toBe('on-grid');
    expect(valid.body.systems.hybrid.type).toBe('hybrid');
    expect(valid.body.systems.offGrid.type).toBe('off-grid');
  });

  it('rejects corrupt uploads before any Gemini request', async () => {
    const response = await request(app)
      .post('/api/solar-analyzer/extract')
      .attach('bill', Buffer.from('not-a-real-pdf'), {
        filename: 'bill.pdf',
        contentType: 'application/pdf',
      });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVALID_FILE_SIGNATURE');
  });

  it('rejects oversized uploads at the Multer boundary', async () => {
    const response = await request(app)
      .post('/api/solar-analyzer/extract')
      .attach('bill', Buffer.alloc(getSolarAnalyzerMaxFileBytes() + 1, 1), {
        filename: 'bill.pdf',
        contentType: 'application/pdf',
      });

    expect(response.status).toBe(413);
    expect(response.body.code).toBe('FILE_TOO_LARGE');
  });
});
