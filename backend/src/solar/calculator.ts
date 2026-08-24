import {
  DAYS_IN_MONTH,
  SOLAR_ENGINEERING_CONFIG,
  SOLAR_MODEL_BASIS,
  SOLAR_RECOMMENDATION_DISCLAIMER,
} from './config';
import { calculateConsumptionMetrics, round } from './consumption';
import { resolvePakistanSolarProfile } from './profiles';
import {
  BatteryEstimate,
  MONTH_KEYS,
  MonthlyConsumption,
  MonthlySimulation,
  SolarRecommendationResult,
  SystemRecommendation,
  SystemType,
} from './types';

export interface BatteryPreferences {
  backupLevel: 'essential' | 'most' | 'entire';
  backupHours: 2 | 4 | 6 | 8;
  knownBackupLoadKw?: number;
}

export interface RecommendationInput {
  city: string;
  monthlyConsumption: MonthlyConsumption[];
  batteryPreferences?: BatteryPreferences;
}

export function calculatePanelConfiguration(targetPvKw: number) {
  const panelCount = Math.max(
    1,
    Math.ceil((targetPvKw * 1000) / SOLAR_ENGINEERING_CONFIG.panelWattage)
  );
  const actualPvCapacityKw = round(
    (panelCount * SOLAR_ENGINEERING_CONFIG.panelWattage) / 1000,
    3
  );
  return { panelCount, actualPvCapacityKw };
}

export function selectPracticalInverter(actualPvCapacityKw: number): number {
  const { min, max } = SOLAR_ENGINEERING_CONFIG.dcAcRatioRange;
  const compatible = SOLAR_ENGINEERING_CONFIG.standardInverterSizesKw.filter(
    (size) => {
      const ratio = actualPvCapacityKw / size;
      return ratio >= min && ratio <= max;
    }
  );

  if (compatible.length) {
    return compatible.reduce((best, size) => {
      const bestDistance = Math.abs(
        actualPvCapacityKw / best - SOLAR_ENGINEERING_CONFIG.dcAcRatioTarget
      );
      const sizeDistance = Math.abs(
        actualPvCapacityKw / size - SOLAR_ENGINEERING_CONFIG.dcAcRatioTarget
      );
      return sizeDistance < bestDistance ? size : best;
    });
  }

  const safeStandard = SOLAR_ENGINEERING_CONFIG.standardInverterSizesKw.find(
    (size) => actualPvCapacityKw / size <= max
  );
  if (safeStandard) return safeStandard;

  const minimumInverterKw = actualPvCapacityKw / max;
  return Math.ceil(minimumInverterKw / 50) * 50;
}

export function buildPvCandidates(theoreticalPvKw: number): number[] {
  const panelCapacityKw = SOLAR_ENGINEERING_CONFIG.panelWattage / 1000;
  const theoreticalPanelCount = Math.max(1, theoreticalPvKw / panelCapacityKw);
  const configuredMaximumPanelCount = Math.floor(
    SOLAR_ENGINEERING_CONFIG.maximumCandidateKw / panelCapacityKw
  );
  const minimumPanelCount = Math.min(
    configuredMaximumPanelCount,
    Math.max(
      1,
      Math.floor(
        theoreticalPanelCount * SOLAR_ENGINEERING_CONFIG.pvCandidateRange.minimumRatio
      )
    )
  );
  const maximumPanelCount = Math.max(
    minimumPanelCount,
    Math.min(
      configuredMaximumPanelCount,
      Math.ceil(
        theoreticalPanelCount * SOLAR_ENGINEERING_CONFIG.pvCandidateRange.maximumRatio
      )
    )
  );

  const candidates: number[] = [];
  for (let panelCount = minimumPanelCount; panelCount <= maximumPanelCount; panelCount += 1) {
    candidates.push(round(panelCount * panelCapacityKw, 3));
  }

  return candidates;
}

export function simulateMonthlyPerformance(
  targetPvKw: number,
  monthlyConsumption: MonthlyConsumption[],
  monthlyPeakSunHours: Record<(typeof MONTH_KEYS)[number], number>
): {
  panelCount: number;
  actualPvCapacityKw: number;
  monthlySimulation: MonthlySimulation[];
} {
  const { panelCount, actualPvCapacityKw } = calculatePanelConfiguration(targetPvKw);
  const consumptionByMonth = new Map(monthlyConsumption.map((item) => [item.month, item.kwh]));

  const monthlySimulation = MONTH_KEYS.map((month) => {
    const consumptionKwh = consumptionByMonth.get(month) || 0;
    const generationKwh = round(
      actualPvCapacityKw *
        monthlyPeakSunHours[month] *
        DAYS_IN_MONTH[month] *
        SOLAR_ENGINEERING_CONFIG.performanceRatio,
      1
    );
    const matchedConsumptionKwh = Math.min(consumptionKwh, generationKwh);

    return {
      month,
      consumptionKwh: round(consumptionKwh, 1),
      generationKwh,
      balanceKwh: round(generationKwh - consumptionKwh, 1),
      matchedConsumptionKwh: round(matchedConsumptionKwh, 1),
      coveragePercent: consumptionKwh
        ? round((matchedConsumptionKwh / consumptionKwh) * 100, 1)
        : 100,
    };
  });

  return { panelCount, actualPvCapacityKw, monthlySimulation };
}

function summarizeSimulation(monthlySimulation: MonthlySimulation[]) {
  const annualGenerationKwh = monthlySimulation.reduce(
    (total, month) => total + month.generationKwh,
    0
  );
  const annualConsumptionKwh = monthlySimulation.reduce(
    (total, month) => total + month.consumptionKwh,
    0
  );
  const matchedConsumptionKwh = monthlySimulation.reduce(
    (total, month) => total + month.matchedConsumptionKwh,
    0
  );
  const annualSurplusKwh = monthlySimulation.reduce(
    (total, month) => total + Math.max(0, month.balanceKwh),
    0
  );
  const annualShortfallKwh = monthlySimulation.reduce(
    (total, month) => total + Math.max(0, -month.balanceKwh),
    0
  );
  const materiallyShortMonths = monthlySimulation.filter(
    (month) => month.consumptionKwh > 0 && month.coveragePercent < 75
  ).length;

  return {
    annualGenerationKwh: round(annualGenerationKwh, 1),
    annualConsumptionKwh: round(annualConsumptionKwh, 1),
    consumptionCoveragePercent: annualConsumptionKwh
      ? round((matchedConsumptionKwh / annualConsumptionKwh) * 100, 1)
      : 0,
    generationToConsumptionPercent: annualConsumptionKwh
      ? round((annualGenerationKwh / annualConsumptionKwh) * 100, 1)
      : 0,
    annualSurplusKwh: round(annualSurplusKwh, 1),
    annualShortfallKwh: round(annualShortfallKwh, 1),
    seasonalMatch: materiallyShortMonths <= 2
      ? ('strong' as const)
      : materiallyShortMonths <= 5
        ? ('moderate' as const)
        : ('limited' as const),
  };
}

function roundBatteryToModule(value: number): number {
  const moduleSize = SOLAR_ENGINEERING_CONFIG.batteryModuleKwh;
  return Math.max(moduleSize, Math.ceil(value / moduleSize) * moduleSize);
}

export function calculateBatteryEstimate(
  averageDailyKwh: number,
  type: 'hybrid' | 'off-grid',
  preferences?: BatteryPreferences
): BatteryEstimate {
  const usableFactor =
    SOLAR_ENGINEERING_CONFIG.batteryDepthOfDischarge *
    SOLAR_ENGINEERING_CONFIG.batteryRoundTripEfficiency;

  if (type === 'hybrid' && preferences) {
    const inferredPeakLoad =
      (averageDailyKwh / 24) * SOLAR_ENGINEERING_CONFIG.peakToAverageLoadFactor;
    const backupLoadKw = preferences.knownBackupLoadKw ||
      inferredPeakLoad * SOLAR_ENGINEERING_CONFIG.backupLoadFractions[preferences.backupLevel];
    const nominalKwh =
      (backupLoadKw * preferences.backupHours * SOLAR_ENGINEERING_CONFIG.batteryDesignMargin) /
      usableFactor;
    const rounded = roundBatteryToModule(nominalKwh);

    return {
      minKwh: rounded,
      maxKwh: rounded + SOLAR_ENGINEERING_CONFIG.batteryModuleKwh,
      basis: 'refined-backup-selection',
    };
  }

  if (type === 'hybrid') {
    const min =
      (averageDailyKwh * SOLAR_ENGINEERING_CONFIG.hybridPreliminaryDailyFractions.min) /
      usableFactor;
    const max =
      (averageDailyKwh * SOLAR_ENGINEERING_CONFIG.hybridPreliminaryDailyFractions.max) /
      usableFactor;
    return {
      minKwh: roundBatteryToModule(min),
      maxKwh: roundBatteryToModule(max),
      basis: 'preliminary-bill-profile',
    };
  }

  return {
    minKwh: roundBatteryToModule(
      (averageDailyKwh * SOLAR_ENGINEERING_CONFIG.offGridAutonomyDays.min) / usableFactor
    ),
    maxKwh: roundBatteryToModule(
      (averageDailyKwh * SOLAR_ENGINEERING_CONFIG.offGridAutonomyDays.max) / usableFactor
    ),
    basis: 'off-grid-autonomy',
  };
}

function selectCandidate(
  candidates: number[],
  monthlyConsumption: MonthlyConsumption[],
  monthlyPeakSunHours: Record<(typeof MONTH_KEYS)[number], number>,
  targetGenerationRatio: number,
  minimumGenerationRatio = 0
) {
  const simulations = candidates.map((candidate) => {
    const simulation = simulateMonthlyPerformance(
      candidate,
      monthlyConsumption,
      monthlyPeakSunHours
    );
    const summary = summarizeSimulation(simulation.monthlySimulation);
    const ratioDistance = Math.abs(summary.generationToConsumptionPercent - targetGenerationRatio);
    const excessiveSurplusPenalty = summary.annualConsumptionKwh
      ? (summary.annualSurplusKwh / summary.annualConsumptionKwh) * 20
      : 0;
    const shortfallPenalty = summary.annualConsumptionKwh
      ? (summary.annualShortfallKwh / summary.annualConsumptionKwh) * 100
      : 0;
    const seasonalPenalty = summary.seasonalMatch === 'limited' ? 12 : summary.seasonalMatch === 'moderate' ? 4 : 0;
    const inverterKw = selectPracticalInverter(simulation.actualPvCapacityKw);
    const dcAcRatio = simulation.actualPvCapacityKw / inverterKw;
    const inverterCompatibilityPenalty =
      dcAcRatio < SOLAR_ENGINEERING_CONFIG.dcAcRatioRange.min
        ? (SOLAR_ENGINEERING_CONFIG.dcAcRatioRange.min - dcAcRatio) * 20
        : dcAcRatio > SOLAR_ENGINEERING_CONFIG.dcAcRatioRange.max
          ? (dcAcRatio - SOLAR_ENGINEERING_CONFIG.dcAcRatioRange.max) * 20
          : Math.abs(dcAcRatio - SOLAR_ENGINEERING_CONFIG.dcAcRatioTarget) * 2;

    return {
      candidate,
      simulation,
      summary,
      score:
        100 -
        ratioDistance -
        excessiveSurplusPenalty -
        shortfallPenalty -
        seasonalPenalty -
        inverterCompatibilityPenalty,
    };
  });

  const eligibleSimulations = simulations.filter(
    (item) => item.summary.generationToConsumptionPercent >= minimumGenerationRatio
  );
  const selectionPool = eligibleSimulations.length ? eligibleSimulations : simulations;

  return selectionPool.reduce((best, item) => (item.score > best.score ? item : best));
}

function buildSystemRecommendation(
  type: SystemType,
  selected: ReturnType<typeof selectCandidate>,
  averageDailyKwh: number,
  preferences?: BatteryPreferences
): SystemRecommendation {
  const battery = type === 'on-grid'
    ? null
    : calculateBatteryEstimate(averageDailyKwh, type, preferences);

  const labels: Record<SystemType, string> = {
    'on-grid': 'On-Grid',
    hybrid: 'Hybrid',
    'off-grid': 'Off-Grid',
  };

  return {
    type,
    label: labels[type],
    pvCapacityKw: selected.candidate,
    actualPvCapacityKw: selected.simulation.actualPvCapacityKw,
    inverterKw: selectPracticalInverter(selected.simulation.actualPvCapacityKw),
    panelCount: selected.simulation.panelCount,
    ...selected.summary,
    monthlySimulation: selected.simulation.monthlySimulation,
    battery,
    suitability: type === 'on-grid'
      ? 'Best bill-based energy match'
      : type === 'hybrid'
        ? 'Backup-capable alternative'
        : 'Preliminary independence option',
    caution: type === 'off-grid'
      ? 'Detailed load assessment required for final off-grid sizing.'
      : type === 'hybrid'
        ? 'Battery capacity is preliminary until backup loads and duration are confirmed.'
        : undefined,
  };
}

export function recommendSolarSystems(input: RecommendationInput): SolarRecommendationResult {
  const consumption = calculateConsumptionMetrics(input.monthlyConsumption);
  if (!consumption.complete || consumption.annualKwh <= 0) {
    throw new Error('Twelve verified monthly consumption values are required.');
  }

  const location = resolvePakistanSolarProfile(input.city);
  const averageDailyPeakSunHours = MONTH_KEYS.reduce(
    (total, month) => total + location.monthlyPeakSunHours[month] * DAYS_IN_MONTH[month],
    0
  ) / 365;
  const theoreticalPvKw =
    consumption.averageDailyKwh /
    (averageDailyPeakSunHours * SOLAR_ENGINEERING_CONFIG.performanceRatio);
  const candidates = buildPvCandidates(theoreticalPvKw);

  const onGridSelection = selectCandidate(
    candidates,
    input.monthlyConsumption,
    location.monthlyPeakSunHours,
    100
  );
  const hybridSelection = selectCandidate(
    candidates,
    input.monthlyConsumption,
    location.monthlyPeakSunHours,
    110
  );
  const offGridSelection = selectCandidate(
    candidates,
    input.monthlyConsumption,
    location.monthlyPeakSunHours,
    100 * SOLAR_ENGINEERING_CONFIG.offGridPvMargin,
    100 * SOLAR_ENGINEERING_CONFIG.offGridPvMargin
  );

  const onGrid = buildSystemRecommendation(
    'on-grid',
    onGridSelection,
    consumption.averageDailyKwh
  );
  const hybrid = buildSystemRecommendation(
    'hybrid',
    hybridSelection,
    consumption.averageDailyKwh,
    input.batteryPreferences
  );
  const offGrid = buildSystemRecommendation(
    'off-grid',
    offGridSelection,
    consumption.averageDailyKwh
  );

  const locationText = location.fallbackUsed
    ? `${input.city} using the conservative ${location.profileCity} regional profile`
    : location.profileCity;

  return {
    bestMatch: onGrid,
    systems: { onGrid, hybrid, offGrid },
    consumption,
    location,
    explanation: `Your verified monthly consumption pattern aligns most efficiently with an approximately ${onGrid.actualPvCapacityKw} kWp On-Grid system under the ${locationText} solar profile. It provides a strong annual energy match without the battery assumptions required by Hybrid or Off-Grid designs.`,
    assumptions: {
      panelWattage: SOLAR_ENGINEERING_CONFIG.panelWattage,
      performanceRatio: SOLAR_ENGINEERING_CONFIG.performanceRatio,
      profileBasis: SOLAR_MODEL_BASIS,
      dcAcRatioTarget: SOLAR_ENGINEERING_CONFIG.dcAcRatioTarget,
      dcAcRatioRange: SOLAR_ENGINEERING_CONFIG.dcAcRatioRange,
      selectionRule:
        'Integer-panel candidates around the theoretical requirement are simulated month by month and scored for annual energy match, consumption coverage, surplus, shortfall, seasonal match, and practical inverter compatibility. Excess generation is penalized rather than maximizing coverage.',
    },
    dataCompleteness: 'complete',
    disclaimer: SOLAR_RECOMMENDATION_DISCLAIMER,
  };
}
