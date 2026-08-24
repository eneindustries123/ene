export const SOLAR_ANALYZER_MAX_FILE_BYTES = 10 * 1024 * 1024;

export const ANALYZER_MONTHS = [
  { key: 'jan', label: 'January' },
  { key: 'feb', label: 'February' },
  { key: 'mar', label: 'March' },
  { key: 'apr', label: 'April' },
  { key: 'may', label: 'May' },
  { key: 'jun', label: 'June' },
  { key: 'jul', label: 'July' },
  { key: 'aug', label: 'August' },
  { key: 'sep', label: 'September' },
  { key: 'oct', label: 'October' },
  { key: 'nov', label: 'November' },
  { key: 'dec', label: 'December' },
] as const;

export type AnalyzerMonthKey = (typeof ANALYZER_MONTHS)[number]['key'];
export type AnalyzerConfidence = 'high' | 'medium' | 'low';

export interface ExtractionResponse {
  extraction: {
    provider: string | null;
    city: string | null;
    citySource: 'customer-address' | 'explicit-installation-location' | 'provider-or-disco' | 'unknown' | null;
    cityConfidence: AnalyzerConfidence | null;
    currentMonth: { month: string | null; year: number | null; kwh: number | null };
    monthlyHistory: Array<{
      month: string;
      year: number | null;
      kwh: number | null;
      confidence: AnalyzerConfidence;
    }>;
    connectionType: string | null;
    phase: string | null;
    sanctionedLoadKw: number | null;
    connectedLoadKw: number | null;
    consumerCategory: string | null;
    currentBillAmount: number | null;
    overallConfidence: AnalyzerConfidence;
    warnings: string[];
  };
  normalizedHistory: Array<{
    month: AnalyzerMonthKey;
    year?: number | null;
    kwh: number;
    confidence?: AnalyzerConfidence;
  }>;
  metrics: AnalyzerConsumptionMetrics;
}

export interface AnalyzerConsumptionMetrics {
  annualKwh: number;
  averageMonthlyKwh: number;
  averageDailyKwh: number;
  highestMonth: { month: AnalyzerMonthKey; kwh: number } | null;
  lowestMonth: { month: AnalyzerMonthKey; kwh: number } | null;
  validMonthCount: number;
  missingMonths: AnalyzerMonthKey[];
  complete: boolean;
}

export interface AnalyzerSystemRecommendation {
  type: 'on-grid' | 'hybrid' | 'off-grid';
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
  monthlySimulation: Array<{
    month: AnalyzerMonthKey;
    consumptionKwh: number;
    generationKwh: number;
    balanceKwh: number;
    coveragePercent: number;
  }>;
  battery: {
    minKwh: number;
    maxKwh: number;
    basis: string;
  } | null;
  suitability: string;
  caution?: string;
}

export interface SolarRecommendationResponse {
  bestMatch: AnalyzerSystemRecommendation;
  systems: {
    onGrid: AnalyzerSystemRecommendation;
    hybrid: AnalyzerSystemRecommendation;
    offGrid: AnalyzerSystemRecommendation;
  };
  consumption: AnalyzerConsumptionMetrics;
  location: {
    requestedCity: string;
    profileCity: string;
    profileKey: string;
    fallbackUsed: boolean;
  };
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
}

const MONTH_LOOKUP = ANALYZER_MONTHS.reduce<Record<string, AnalyzerMonthKey>>((lookup, month) => {
  lookup[month.key] = month.key;
  lookup[month.label.toLowerCase()] = month.key;
  lookup[month.label.slice(0, 3).toLowerCase()] = month.key;
  return lookup;
}, {});

export function normalizeAnalyzerMonth(value: string): AnalyzerMonthKey | null {
  return MONTH_LOOKUP[value.toLowerCase().replace(/[^a-z]/g, '')] || null;
}

export function createEmptyMonthlyValues(): Record<AnalyzerMonthKey, string> {
  return ANALYZER_MONTHS.reduce((values, month) => {
    values[month.key] = '';
    return values;
  }, {} as Record<AnalyzerMonthKey, string>);
}

export function formatBatteryRange(minKwh: number, maxKwh: number): string {
  return minKwh === maxKwh ? `${minKwh} kWh` : `${minKwh}–${maxKwh} kWh`;
}

export function calculateAnalyzerMetrics(
  values: Record<AnalyzerMonthKey, string>
): AnalyzerConsumptionMetrics {
  const valid = ANALYZER_MONTHS.flatMap((month) => {
    const value = Number(values[month.key]);
    return values[month.key] !== '' && Number.isFinite(value) && value >= 0
      ? [{ month: month.key, kwh: value }]
      : [];
  });
  const annualKwh = valid.reduce((total, item) => total + item.kwh, 0);
  const missingMonths = ANALYZER_MONTHS
    .filter((month) => values[month.key] === '' || !Number.isFinite(Number(values[month.key])))
    .map((month) => month.key);

  return {
    annualKwh: Math.round(annualKwh * 100) / 100,
    averageMonthlyKwh: valid.length ? Math.round((annualKwh / valid.length) * 100) / 100 : 0,
    averageDailyKwh: valid.length === 12 ? Math.round((annualKwh / 365) * 100) / 100 : 0,
    highestMonth: valid.length
      ? valid.reduce((highest, item) => item.kwh > highest.kwh ? item : highest)
      : null,
    lowestMonth: valid.length
      ? valid.reduce((lowest, item) => item.kwh < lowest.kwh ? item : lowest)
      : null,
    validMonthCount: valid.length,
    missingMonths,
    complete: valid.length === 12,
  };
}

export function monthlyValuesFromExtraction(
  extraction: ExtractionResponse
): Record<AnalyzerMonthKey, string> {
  const values = createEmptyMonthlyValues();
  for (const item of extraction.normalizedHistory) {
    values[item.month] = String(item.kwh);
  }
  return values;
}

export async function validateAnalyzerBillFile(file: File): Promise<string | null> {
  const extension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
  if (!['.pdf', '.jpg', '.jpeg', '.png'].includes(extension)) {
    return 'Upload a PDF, JPG, JPEG, or PNG electricity bill.';
  }
  if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
    return 'The selected file type is not supported.';
  }
  if (file.size <= 0) return 'The selected file is empty.';
  if (file.size > SOLAR_ANALYZER_MAX_FILE_BYTES) return 'The selected file exceeds 10 MB.';

  const bytes = new Uint8Array(await file.arrayBuffer());
  const isPdf = file.type === 'application/pdf' &&
    new TextDecoder('ascii').decode(bytes.slice(0, 5)) === '%PDF-' &&
    new TextDecoder('latin1').decode(bytes.slice(Math.max(0, bytes.length - 2048))).includes('%%EOF');
  const isJpeg = file.type === 'image/jpeg' &&
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const isPng = file.type === 'image/png' &&
    pngSignature.every((byte, index) => bytes[index] === byte);

  return isPdf || isJpeg || isPng
    ? null
    : 'The selected file appears corrupted or does not match its file type.';
}

export function buildAnalyzerQuoteUrl(
  result: SolarRecommendationResponse,
  billAnalysisConfidence: AnalyzerConfidence | 'manual'
): string {
  const best = result.bestMatch;
  const params = new URLSearchParams({
    source: 'solar_bill_analyzer',
    recommendedSystem: best.label,
    recommendedPvKw: String(best.actualPvCapacityKw),
    recommendedInverterKw: String(best.inverterKw),
    annualConsumptionKwh: String(result.consumption.annualKwh),
    averageMonthlyConsumptionKwh: String(result.consumption.averageMonthlyKwh),
    city: result.location.requestedCity,
    billAnalysisConfidence,
  });
  if (best.battery) {
    params.set('recommendedBatteryRange', `${best.battery.minKwh}-${best.battery.maxKwh} kWh`);
  }
  return `/request-a-quote?${params.toString()}`;
}

export function buildAnalyzerWhatsAppMessage(result: SolarRecommendationResponse): string {
  const best = result.bestMatch;
  return [
    'Hello, I used the ENE Solar Bill Analyzer.',
    '',
    'Preliminary recommendation:',
    `${best.actualPvCapacityKw} kWp ${best.label}`,
    `Location: ${result.location.requestedCity}`,
    `Annual consumption: ${Math.round(result.consumption.annualKwh).toLocaleString('en-US')} kWh`,
    '',
    'I would like an exact solar proposal.',
  ].join('\n');
}
