import {
  DAYS_IN_MONTH,
  SOLAR_ENGINEERING_CONFIG,
  SOLAR_MODEL_BASIS,
  SOLAR_RECOMMENDATION_DISCLAIMER,
} from './config';
import { calculateConsumptionMetrics, round } from './consumption';
import { resolvePakistanSolarProfile } from './profiles';
import { aggregateAnnualBill, BillingAccount, calculateMonthlyBill } from './billing';
import {
  loadFlowStudyRequired,
  nepraConcurrenceRequired,
  getTouWindow,
  POLICY_REFERENCE_DATE,
  PROSUMER_POLICY_2026,
  resolveProsumerRegime,
  resolveUtility,
} from './policy';
import {
  AnalysisMode,
  BatteryEstimate,
  MONTH_KEYS,
  MonthlyConsumption,
  MonthlySimulation,
  ProtectedStatus,
  ResultConfidence,
  ScenarioArchitecture,
  SolarRecommendationResult,
  SystemRecommendation,
  SystemType,
  TariffCategory,
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
  utility?: string;
  tariffCategory?: TariffCategory;
  protectedStatus?: ProtectedStatus;
  tou?: boolean;
  sanctionedLoadKw?: number;
  mdiKw?: number;
  greenMeter?: boolean;
  legacyAgreementStatus?: 'valid' | 'expired' | 'none' | 'unknown';
  peakConsumptionShare?: number;
  analysisMode?: AnalysisMode;
  chosenArchitecture?: ScenarioArchitecture;
  billExtractionConfidence?: 'high' | 'medium' | 'low' | 'manual';
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

const SCENARIO_DEFINITIONS: ReadonlyArray<{
  architecture: ScenarioArchitecture;
  label: string;
  type: SystemType;
  exportConnected: boolean;
  battery: boolean;
  complexityPenalty: number;
}> = [
  { architecture: 'on-grid-only', label: 'On-Grid Only', type: 'on-grid', exportConnected: true, battery: false, complexityPenalty: 0 },
  { architecture: 'hybrid-green-no-battery', label: 'Hybrid + Green Meter — No Battery', type: 'hybrid', exportConnected: true, battery: false, complexityPenalty: 6 },
  { architecture: 'hybrid-green-battery', label: 'Hybrid + Green Meter + Battery', type: 'hybrid', exportConnected: true, battery: true, complexityPenalty: 10 },
  { architecture: 'hybrid-no-green-no-battery', label: 'Hybrid Only — No Green Meter / No Battery', type: 'hybrid', exportConnected: false, battery: false, complexityPenalty: 6 },
  { architecture: 'hybrid-no-green-battery', label: 'Hybrid + Battery — No Green Meter', type: 'hybrid', exportConnected: false, battery: true, complexityPenalty: 10 },
  { architecture: 'off-grid', label: 'Off-Grid', type: 'off-grid', exportConnected: false, battery: true, complexityPenalty: 35 },
] as const;

function confidenceFromInput(value?: RecommendationInput['billExtractionConfidence']): ResultConfidence {
  if (value === 'high') return 'High';
  if (value === 'medium' || value === 'manual') return 'Medium';
  return 'Preliminary';
}

function resolveScenarioRegime(
  definition: (typeof SCENARIO_DEFINITIONS)[number],
  input: RecommendationInput
) {
  if (!definition.exportConnected) return 'not-applicable' as const;
  if (!input.greenMeter) return 'current-2026' as const;
  return resolveProsumerRegime({
    greenMeter: true,
    legacyAgreementStatus: input.legacyAgreementStatus || 'unknown',
  });
}

function buildCurrentAnnualBill(
  input: RecommendationInput,
  account: BillingAccount,
  peakShare: number
) {
  return aggregateAnnualBill(input.monthlyConsumption.map((month) => {
    const peakImportedKwh = input.tou ? month.kwh * peakShare : 0;
    return calculateMonthlyBill(account, {
      importedKwh: month.kwh,
      peakImportedKwh,
      offPeakImportedKwh: month.kwh - peakImportedKwh,
    });
  }));
}

function buildEconomicRecommendation(
  definition: (typeof SCENARIO_DEFINITIONS)[number],
  selected: ReturnType<typeof selectCandidate>,
  input: RecommendationInput,
  account: BillingAccount,
  averageDailyKwh: number,
  peakShare: number,
  currentBill: ReturnType<typeof aggregateAnnualBill>
): SystemRecommendation {
  const simulation = selected.simulation.monthlySimulation;
  const summary = selected.summary;
  const regime = resolveScenarioRegime(definition, input);
  const battery = definition.battery
    ? calculateBatteryEstimate(averageDailyKwh, definition.type === 'off-grid' ? 'off-grid' : 'hybrid', input.batteryPreferences)
    : null;
  const qualifications: string[] = [];
  let annualGridImportKwh = 0;
  let annualGridExportKwh = 0;
  let annualDirectConsumptionKwh = 0;
  let annualUnusableSurplusKwh = 0;

  const postBills = simulation.map((month) => {
    const touWindow = getTouWindow(month.month);
    const peakConsumption = account.tou
      ? month.consumptionKwh * peakShare * (touWindow.peakHours / 4)
      : 0;
    const offPeakConsumption = month.consumptionKwh - peakConsumption;
    const directUseLimit = month.consumptionKwh * (account.tariffCategory === 'commercial' ? 0.5 : 0.38);
    const directConsumption = Math.min(month.generationKwh, offPeakConsumption, directUseLimit);
    let remainingPeak = peakConsumption;
    let remainingOffPeak = Math.max(0, offPeakConsumption - directConsumption);
    const surplusBeforeBattery = Math.max(0, month.generationKwh - directConsumption);
    let batteryDischarge = 0;
    let batteryCharge = 0;

    if (battery) {
      const usableDailyThroughput = battery.minKwh * DAYS_IN_MONTH[month.month];
      batteryDischarge = Math.min(
        surplusBeforeBattery * SOLAR_ENGINEERING_CONFIG.batteryRoundTripEfficiency,
        remainingPeak + remainingOffPeak,
        usableDailyThroughput
      );
      batteryCharge = batteryDischarge / SOLAR_ENGINEERING_CONFIG.batteryRoundTripEfficiency;

      // TOU dispatch preserves stored solar for the configured four-hour peak window first.
      const peakDischarge = Math.min(remainingPeak, batteryDischarge);
      remainingPeak -= peakDischarge;
      remainingOffPeak = Math.max(0, remainingOffPeak - (batteryDischarge - peakDischarge));
    }

    const exportableSurplus = Math.max(0, surplusBeforeBattery - batteryCharge);
    const exportedKwh = definition.exportConnected ? exportableSurplus : 0;
    const unusableSurplus = definition.exportConnected ? 0 : exportableSurplus;
    const gridImport = definition.type === 'off-grid' ? 0 : remainingPeak + remainingOffPeak;

    annualGridImportKwh += gridImport;
    annualGridExportKwh += exportedKwh;
    annualDirectConsumptionKwh += directConsumption + batteryDischarge;
    annualUnusableSurplusKwh += unusableSurplus;

    if (definition.type === 'off-grid') {
      return null;
    }
    return calculateMonthlyBill(account, {
      importedKwh: gridImport,
      peakImportedKwh: remainingPeak,
      offPeakImportedKwh: remainingOffPeak,
      exportedKwh,
      peakExportedKwh: 0,
      offPeakExportedKwh: exportedKwh,
    }, regime);
  });

  const postBill = definition.type === 'off-grid'
    ? { ...currentBill, total: 0, fixedCharges: 0, exportCredit: 0 }
    : aggregateAnnualBill(postBills.filter((bill): bill is NonNullable<typeof bill> => bill !== null));
  const billReduction = Math.max(0, currentBill.total - postBill.total);
  const billReductionPercent = currentBill.total > 0 ? (billReduction / currentBill.total) * 100 : 0;
  const actualPvCapacityKw = selected.simulation.actualPvCapacityKw;
  const regulatoryValid = !definition.exportConnected ||
    input.sanctionedLoadKw === undefined ||
    actualPvCapacityKw <= input.sanctionedLoadKw + 0.0001;

  if (definition.exportConnected) {
    qualifications.push('Utility/interconnection approval remains applicable.');
    qualifications.push('Final interconnection remains subject to DISCO/K-Electric network and transformer feasibility.');
    if (input.sanctionedLoadKw === undefined) {
      qualifications.push('Sanctioned load must be confirmed before the export-connected DG capacity can be validated.');
    }
  }
  if (regime === 'uncertain') {
    qualifications.push('Preliminary — prosumer agreement status must be confirmed.');
  }
  if (definition.type === 'off-grid') {
    qualifications.push('Detailed load assessment and autonomy study required; off-grid economics assume disconnection from grid billing.');
  }
  if (!input.tou && input.peakConsumptionShare === undefined) {
    // No billing impact for non-TOU accounts; keep the assumption out of confidence scoring.
  } else if (input.peakConsumptionShare === undefined) {
    qualifications.push('TOU peak/off-peak consumption split is preliminary because interval data was not provided.');
  }

  const policyConfidence: ResultConfidence = regime === 'uncertain' ? 'Preliminary' : 'High';
  const recommendationConfidence: ResultConfidence =
    (definition.exportConnected && input.sanctionedLoadKw === undefined) ||
    (account.tou && input.peakConsumptionShare === undefined) ||
    (definition.type === 'off-grid' && summary.annualShortfallKwh > 0)
      ? 'Preliminary'
      : 'Medium';

  return {
    type: definition.type,
    architecture: definition.architecture,
    label: definition.label,
    pvCapacityKw: selected.candidate,
    actualPvCapacityKw,
    inverterKw: selectPracticalInverter(actualPvCapacityKw),
    panelCount: selected.simulation.panelCount,
    ...summary,
    monthlySimulation: simulation,
    battery,
    suitability: definition.architecture === 'on-grid-only'
      ? 'Lowest-complexity export-connected option'
      : definition.exportConnected
        ? 'Export-enabled alternative'
        : definition.type === 'off-grid'
          ? 'Independence option'
          : 'Zero-export alternative',
    caution: qualifications[0],
    annualGridImportKwh: round(annualGridImportKwh, 1),
    annualGridExportKwh: round(annualGridExportKwh, 1),
    annualDirectConsumptionKwh: round(annualDirectConsumptionKwh, 1),
    annualUnusableSurplusKwh: round(annualUnusableSurplusKwh, 1),
    currentEstimatedBill: round(currentBill.total, 0),
    postSolarEstimatedBill: round(postBill.total, 0),
    billReduction: round(billReduction, 0),
    billReductionPercent: round(billReductionPercent, 1),
    prosumerRegime: regime,
    nepraConcurrenceRequired: definition.exportConnected ? nepraConcurrenceRequired(actualPvCapacityKw) : false,
    utilityApprovalRequired: definition.exportConnected,
    loadFlowStudyRequired: definition.exportConnected ? loadFlowStudyRequired(actualPvCapacityKw) : false,
    regulatoryValid,
    confidence: recommendationConfidence,
    policyConfidence,
    recommendationConfidence,
    qualifications,
  };
}

function candidatesForScenario(
  definition: (typeof SCENARIO_DEFINITIONS)[number],
  candidates: number[],
  input: RecommendationInput
) {
  const regulatoryScopeCandidates = candidates.filter((candidate) =>
    calculatePanelConfiguration(candidate).actualPvCapacityKw <= PROSUMER_POLICY_2026.maximumDgCapacityKw
  );
  if (!definition.exportConnected || input.sanctionedLoadKw === undefined) return regulatoryScopeCandidates;
  const allowed = regulatoryScopeCandidates.filter((candidate) =>
    calculatePanelConfiguration(candidate).actualPvCapacityKw <= input.sanctionedLoadKw! + 0.0001
  );
  if (allowed.length) return allowed;

  const panelCapacity = SOLAR_ENGINEERING_CONFIG.panelWattage / 1000;
  const panelCount = Math.floor(input.sanctionedLoadKw / panelCapacity);
  return panelCount >= 1 ? [round(panelCount * panelCapacity, 3)] : regulatoryScopeCandidates.slice(0, 1);
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
  const utility = resolveUtility(input.utility);
  const tariffCategory = input.tariffCategory || 'residential';
  const account: BillingAccount = {
    utility,
    tariffCategory,
    protectedStatus: input.protectedStatus || 'non-protected',
    tou: input.tou || false,
    sanctionedLoadKw: input.sanctionedLoadKw,
    mdiKw: input.mdiKw,
  };
  const peakShare = Math.min(
    1,
    Math.max(0, input.peakConsumptionShare ?? getTouWindow('jan').peakHours / 24)
  );
  const currentBill = buildCurrentAnnualBill(input, account, peakShare);
  const analysisMode = input.analysisMode || 'recommend';
  const chosenArchitecture = input.chosenArchitecture || 'on-grid-only';
  const definitionsToEvaluate = analysisMode === 'chosen'
    ? SCENARIO_DEFINITIONS.filter((definition) => definition.architecture === chosenArchitecture)
    : SCENARIO_DEFINITIONS;

  const scenarios = definitionsToEvaluate.map((definition) => {
    let scenarioCandidates = candidatesForScenario(definition, candidates, input);
    if (definition.type === 'off-grid') {
      const technicallyEligible = scenarioCandidates.filter((candidate) => {
        const candidateSimulation = simulateMonthlyPerformance(candidate, input.monthlyConsumption, location.monthlyPeakSunHours);
        return summarizeSimulation(candidateSimulation.monthlySimulation).generationToConsumptionPercent >=
          100 * SOLAR_ENGINEERING_CONFIG.offGridPvMargin;
      });
      if (technicallyEligible.length) scenarioCandidates = technicallyEligible;
    }

    const evaluated = scenarioCandidates.map((candidate) => {
      const selection = selectCandidate(
        [candidate], input.monthlyConsumption, location.monthlyPeakSunHours, 100
      );
      return buildEconomicRecommendation(
        definition,
        selection,
        input,
        account,
        consumption.averageDailyKwh,
        peakShare,
        currentBill
      );
    });
    const maximumReduction = Math.max(...evaluated.map((result) => result.billReductionPercent || 0));
    const marginallyEquivalent = evaluated.filter((result) =>
      (result.billReductionPercent || 0) >= maximumReduction - 5
    );
    return marginallyEquivalent.reduce((smallest, result) =>
      result.actualPvCapacityKw < smallest.actualPvCapacityKw ? result : smallest
    );
  });

  const practicalScore = (result: SystemRecommendation) => {
    const definition = SCENARIO_DEFINITIONS.find((item) => item.architecture === result.architecture)!;
    const unusablePenalty = result.annualConsumptionKwh
      ? ((result.annualUnusableSurplusKwh || 0) / result.annualConsumptionKwh) * 5
      : 0;
    const validityPenalty = result.regulatoryValid ? 0 : 100;
    const offGridShortfallPenalty = result.type === 'off-grid' && result.annualConsumptionKwh
      ? (result.annualShortfallKwh / result.annualConsumptionKwh) * 20
      : 0;
    return (result.billReductionPercent || 0) - definition.complexityPenalty - unusablePenalty - validityPenalty - offGridShortfallPenalty;
  };
  let bestMatch = scenarios.reduce((best, result) => {
    const difference = practicalScore(result) - practicalScore(best);
    if (difference > 0.001) return result;
    if (Math.abs(difference) <= 0.001 && result.actualPvCapacityKw < best.actualPvCapacityKw) return result;
    return best;
  });

  // Preserve the established sizing behavior for older API clients that do not yet send
  // tariff/policy fields. New analyzer requests always send these fields and use the bill optimizer.
  const policyInputsProvided = input.utility !== undefined ||
    input.tariffCategory !== undefined ||
    input.protectedStatus !== undefined ||
    input.tou !== undefined ||
    input.sanctionedLoadKw !== undefined ||
    input.greenMeter !== undefined ||
    input.analysisMode !== undefined;
  if (!policyInputsProvided) {
    const establishedOnGridSelection = selectCandidate(
      candidates, input.monthlyConsumption, location.monthlyPeakSunHours, 100
    );
    bestMatch = buildEconomicRecommendation(
      SCENARIO_DEFINITIONS[0], establishedOnGridSelection, input, account,
      consumption.averageDailyKwh, peakShare, currentBill
    );
  }

  const onGrid = !policyInputsProvided
    ? bestMatch
    : scenarios.find((scenario) => scenario.architecture === 'on-grid-only') || bestMatch;
  const hybrid = scenarios.find((scenario) => scenario.architecture === 'hybrid-green-battery') || bestMatch;
  const offGrid = scenarios.find((scenario) => scenario.architecture === 'off-grid') || bestMatch;
  const selectedSystem = analysisMode === 'both'
    ? scenarios.find((scenario) => scenario.architecture === chosenArchitecture) || null
    : analysisMode === 'chosen'
      ? bestMatch
      : null;

  const locationText = location.fallbackUsed
    ? `${input.city} using the conservative ${location.profileCity} regional profile`
    : location.profileCity;

  return {
    bestMatch,
    systems: { onGrid, hybrid, offGrid },
    scenarios,
    selectedSystem,
    analysisMode,
    consumption,
    location,
    explanation: `The deterministic optimizer identifies ${bestMatch.actualPvCapacityKw} kWp ${bestMatch.label} as the maximum practical bill-reduction option under the ${locationText} solar profile and configured 2026 tariff rules. The estimate retains fixed charges and values exports only under the applicable prosumer regime.`,
    assumptions: {
      panelWattage: SOLAR_ENGINEERING_CONFIG.panelWattage,
      performanceRatio: SOLAR_ENGINEERING_CONFIG.performanceRatio,
      profileBasis: SOLAR_MODEL_BASIS,
      dcAcRatioTarget: SOLAR_ENGINEERING_CONFIG.dcAcRatioTarget,
      dcAcRatioRange: SOLAR_ENGINEERING_CONFIG.dcAcRatioRange,
      selectionRule:
        'Bounded integer-panel candidates are simulated month by month across the applicable architectures and optimized for bill reduction, remaining bill, imports, export value, direct use, battery dispatch, surplus, practical inverter sizing, and regulatory validity. A smaller configuration is selected when further bill reduction is marginal.',
    },
    dataCompleteness: 'complete',
    disclaimer: `${SOLAR_RECOMMENDATION_DISCLAIMER} Estimates exclude dynamic FCA, QTA, and statutory taxes unless separately configured; savings are not guaranteed.`,
    billing: {
      currentEstimatedBill: bestMatch.currentEstimatedBill || 0,
      postSolarEstimatedBill: bestMatch.postSolarEstimatedBill || 0,
      billReduction: bestMatch.billReduction || 0,
      billReductionPercent: bestMatch.billReductionPercent || 0,
      dynamicComponentsConfigured: currentBill.excludedComponents.length === 0,
      excludedComponents: currentBill.excludedComponents,
      fixedChargeConfidence: currentBill.fixedChargeConfidence,
    },
    confidence: {
      billExtraction: confidenceFromInput(input.billExtractionConfidence),
      tariffPolicy: bestMatch.policyConfidence || 'Medium',
      recommendation: bestMatch.recommendationConfidence || 'Medium',
    },
    policy: {
      utility,
      tariffCategory,
      prosumerRegime: bestMatch.prosumerRegime || 'not-applicable',
      referenceDate: POLICY_REFERENCE_DATE,
      tariffSource: 'S.R.O. 279(I)/2026',
      prosumerSource: 'S.R.O. 251(I)/2026; S.R.O. 547(I)/2026; S.R.O. 1330(I)/2026',
    },
  };
}
