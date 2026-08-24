import {
  ConsumptionMetrics,
  MONTH_KEYS,
  MonthKey,
  MonthlyConsumption,
} from './types';

const MONTH_ALIASES: Record<string, MonthKey> = {
  jan: 'jan', january: 'jan',
  feb: 'feb', february: 'feb',
  mar: 'mar', march: 'mar',
  apr: 'apr', april: 'apr',
  may: 'may',
  jun: 'jun', june: 'jun',
  jul: 'jul', july: 'jul',
  aug: 'aug', august: 'aug',
  sep: 'sep', sept: 'sep', september: 'sep',
  oct: 'oct', october: 'oct',
  nov: 'nov', november: 'nov',
  dec: 'dec', december: 'dec',
};

export function normalizeMonth(value: string): MonthKey | null {
  return MONTH_ALIASES[value.toLowerCase().replace(/[^a-z]/g, '')] || null;
}

export function normalizeMonthlyHistory(
  history: Array<{ month: string; year?: number | null; kwh: number | null; confidence?: 'high' | 'medium' | 'low' }>
): MonthlyConsumption[] {
  const byMonth = new Map<MonthKey, MonthlyConsumption>();

  for (const item of history) {
    const month = normalizeMonth(item.month);
    if (!month || item.kwh === null || !Number.isFinite(item.kwh) || item.kwh < 0) {
      continue;
    }

    if (!byMonth.has(month)) {
      byMonth.set(month, {
        month,
        year: item.year ?? null,
        kwh: item.kwh,
        confidence: item.confidence,
      });
    }
  }

  return MONTH_KEYS.flatMap((month) => {
    const item = byMonth.get(month);
    return item ? [item] : [];
  });
}

export function calculateConsumptionMetrics(
  monthlyConsumption: MonthlyConsumption[]
): ConsumptionMetrics {
  const normalized = normalizeMonthlyHistory(monthlyConsumption);
  const annualKwh = normalized.reduce((total, item) => total + item.kwh, 0);
  const validMonthCount = normalized.length;
  const presentMonths = new Set(normalized.map((item) => item.month));
  const missingMonths = MONTH_KEYS.filter((month) => !presentMonths.has(month));
  const highestMonth = normalized.length
    ? normalized.reduce((highest, item) => (item.kwh > highest.kwh ? item : highest))
    : null;
  const lowestMonth = normalized.length
    ? normalized.reduce((lowest, item) => (item.kwh < lowest.kwh ? item : lowest))
    : null;

  return {
    annualKwh: round(annualKwh, 2),
    averageMonthlyKwh: validMonthCount ? round(annualKwh / validMonthCount, 2) : 0,
    averageDailyKwh: validMonthCount === 12
      ? round(annualKwh / 365, 2)
      : validMonthCount
        ? round(annualKwh / (validMonthCount * (365 / 12)), 2)
        : 0,
    highestMonth,
    lowestMonth,
    validMonthCount,
    missingMonths,
    complete: validMonthCount === 12,
  };
}

export function round(value: number, digits = 1): number {
  const multiplier = 10 ** digits;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}
