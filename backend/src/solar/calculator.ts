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
  CAPEX_AVAILABILITY_STATUS,
  CONSUMPTION_PROFILE_PRESETS,
  DEFAULT_FALLBACK_DAYTIME_SHARES,
  FINANCIAL_MODEL_VERSION,
} from './financialConfig';
import {
  buildRegulatoryStatus,
  getTouWindow,
  loadFlowStudyRequired,
  nepraConcurrenceRequired,
  normalizeConnectionPhase,
  POLICY_REFERENCE_DATE,
  PROSUMER_POLICY_2026,
  PROSUMER_REFERENCE_VALUES_2026,
  resolveLegacyAgreementStatus,
  resolveProsumerRegime,
  resolveRequiresAgreementReview,
  resolveUtility,
} from './policy';
import {
  AnalysisMode,
  AnnualEnergyFlow,
  BatteryEstimate,
  ConnectionPhase,
  ConsumptionProfileInput,
  ConsumptionProfileResolution,
  ExistingSolarInput,
  FinancialAssumptions,
  FinancialBreakdown,
  LegacyAgreementStatus,
  MONTH_KEYS,
  MonthlyConsumption,
  MonthlyEnergyFlow,
  MonthlySimulation,
  ProtectedStatus,
  RegulatoryStatus,
  ResultConfidence,
  ScenarioArchitecture,
  SolarRecommendationResult,
  SystemRecommendation,
  SystemType,
  TariffCategory,
  UserPrimaryObjective,
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
  phase?: string | null;
  connectionType?: string | null;
  connectionPhase?: ConnectionPhase;
  greenMeter?: boolean;
  legacyAgreementStatus?: 'valid' | 'expired' | 'none' | 'unknown' | LegacyAgreementStatus;
  existingSolar?: ExistingSolarInput;
  peakConsumptionShare?: number;
  consumptionProfile?: ConsumptionProfileInput;
  primaryObjective?: UserPrimaryObjective;
  analysisMode?: AnalysisMode;
  chosenArchitecture?: ScenarioArchitecture;
  billExtractionConfidence?: 'high' | 'medium' | 'low' | 'manual';
}

export function resolveConsumptionProfile(
  input?: ConsumptionProfileInput,
  tariffCategory: TariffCategory = 'residential'
): ConsumptionProfileResolution {
  if (
    input?.profileType === 'custom' &&
    typeof input.customDaytimeSharePercent === 'number' &&
    Number.isFinite(input.customDaytimeSharePercent)
  ) {
    const clamped = Math.min(100, Math.max(0, input.customDaytimeSharePercent));
    return {
      profileType: 'custom',
      daytimeSharePercent: Math.round(clamped),
      daytimeShareFraction: clamped / 100,
      source: 'user-specified',
      description: `Custom daytime electricity usage share of ${Math.round(clamped)}% specified by user.`,
    };
  }

  if (
    input?.profileType &&
    input.profileType !== 'not-sure' &&
    input.profileType in CONSUMPTION_PROFILE_PRESETS
  ) {
    const preset = CONSUMPTION_PROFILE_PRESETS[input.profileType as 'daytime' | 'balanced' | 'evening'];
    return {
      profileType: preset.type,
      daytimeSharePercent: Math.round(preset.daytimeShare * 100),
      daytimeShareFraction: preset.daytimeShare,
      source: 'preset-profile',
      description: preset.description,
    };
  }

  const fallback = DEFAULT_FALLBACK_DAYTIME_SHARES[tariffCategory] || 0.38;
  return {
    profileType: 'not-sure',
    daytimeSharePercent: Math.round(fallback * 100),
    daytimeShareFraction: fallback,
    source: 'fallback-assumption',
    description: `Standard ${tariffCategory} baseline assumption of ${Math.round(fallback * 100)}% daytime consumption.`,
  };
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
  const legacyStatus = resolveLegacyAgreementStatus({
    hasExistingSolar: input.existingSolar?.hasExistingSolar,
    agreementStatus: input.existingSolar?.agreementStatus,
    agreementDate: input.existingSolar?.agreementDate,
    legacyAgreementStatus: input.legacyAgreementStatus,
    greenMeter: input.greenMeter,
  });
  return resolveProsumerRegime({
    exportConnected: true,
    greenMeter: input.greenMeter ?? true,
    legacyAgreementStatus: legacyStatus,
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
  currentBill: ReturnType<typeof aggregateAnnualBill>,
  consumptionProfile: ConsumptionProfileResolution
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
  let annualBatteryChargeKwh = 0;
  let annualBatteryDischargeKwh = 0;
  let annualUnusableSurplusKwh = 0;

  const monthlyEnergyFlows: MonthlyEnergyFlow[] = [];

  const postBills = simulation.map((month) => {
    const touWindow = getTouWindow(month.month);
    const peakConsumption = account.tou
      ? month.consumptionKwh * peakShare * (touWindow.peakHours / 4)
      : 0;
    const offPeakConsumption = month.consumptionKwh - peakConsumption;

    // Daytime consumption based on user profile
    const daytimeShare = consumptionProfile.daytimeShareFraction;
    const daytimeConsumption = month.consumptionKwh * daytimeShare;

    // Direct daytime self-consumption
    const directConsumption = Math.min(
      month.generationKwh,
      account.tou ? Math.min(daytimeConsumption, offPeakConsumption) : daytimeConsumption
    );

    let remainingPeak = peakConsumption;
    let remainingOffPeak = Math.max(0, offPeakConsumption - directConsumption);
    let remainingNonTouLoad = Math.max(0, month.consumptionKwh - directConsumption);
    const surplusBeforeBattery = Math.max(0, month.generationKwh - directConsumption);

    let batteryDischarge = 0;
    let batteryCharge = 0;

    if (battery) {
      const usableMonthlyThroughput = battery.minKwh * DAYS_IN_MONTH[month.month];
      const unservedLoad = account.tou
        ? remainingPeak + remainingOffPeak
        : remainingNonTouLoad;

      batteryDischarge = Math.min(
        surplusBeforeBattery * SOLAR_ENGINEERING_CONFIG.batteryRoundTripEfficiency,
        unservedLoad,
        usableMonthlyThroughput
      );
      batteryCharge = batteryDischarge / SOLAR_ENGINEERING_CONFIG.batteryRoundTripEfficiency;

      if (account.tou) {
        // TOU dispatch preserves stored solar for the configured four-hour peak window first
        const peakDischarge = Math.min(remainingPeak, batteryDischarge);
        remainingPeak -= peakDischarge;
        remainingOffPeak = Math.max(0, remainingOffPeak - (batteryDischarge - peakDischarge));
      } else {
        remainingNonTouLoad = Math.max(0, remainingNonTouLoad - batteryDischarge);
      }
    }

    const surplusAfterBattery = Math.max(0, surplusBeforeBattery - batteryCharge);
    const exportedKwh = definition.exportConnected ? surplusAfterBattery : 0;
    const unusableSurplus = definition.exportConnected ? 0 : surplusAfterBattery;
    const gridImport = definition.type === 'off-grid'
      ? 0
      : account.tou
        ? remainingPeak + remainingOffPeak
        : remainingNonTouLoad;

    annualGridImportKwh += gridImport;
    annualGridExportKwh += exportedKwh;
    annualDirectConsumptionKwh += directConsumption;
    annualBatteryChargeKwh += batteryCharge;
    annualBatteryDischargeKwh += batteryDischarge;
    annualUnusableSurplusKwh += unusableSurplus;

    const unmetMonthLoad = definition.type === 'off-grid'
      ? Math.max(0, month.consumptionKwh - (directConsumption + batteryDischarge))
      : 0;

    const monthFlow: MonthlyEnergyFlow = {
      month: month.month,
      consumptionKwh: round(month.consumptionKwh, 1),
      generationKwh: round(month.generationKwh, 1),
      selfConsumedKwh: round(directConsumption, 1),
      batteryChargeKwh: round(batteryCharge, 1),
      batteryDischargeKwh: round(batteryDischarge, 1),
      gridExportKwh: round(exportedKwh, 1),
      curtailedKwh: round(unusableSurplus, 1),
      gridImportKwh: round(gridImport, 1),
      selfConsumptionRatio: month.generationKwh > 0
        ? round((directConsumption + batteryCharge) / month.generationKwh, 3)
        : 0,
      exportRatio: month.generationKwh > 0
        ? round(exportedKwh / month.generationKwh, 3)
        : 0,
      unmetLoadKwh: round(unmetMonthLoad, 1),
    };
    monthlyEnergyFlows.push(monthFlow);

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
    ? { ...currentBill, total: 0, energyImportCharges: 0, peakImportCharges: 0, offPeakImportCharges: 0, fixedCharges: 0, exportCredit: 0 }
    : aggregateAnnualBill(postBills.filter((bill): bill is NonNullable<typeof bill> => bill !== null));

  const actualPvCapacityKw = selected.simulation.actualPvCapacityKw;

  const connectionPhase: ConnectionPhase = input.connectionPhase ||
    normalizeConnectionPhase(input.phase, input.connectionType);
  const hasExistingSolar = input.existingSolar?.hasExistingSolar ?? false;
  const legacyAgreementStatus = resolveLegacyAgreementStatus({
    hasExistingSolar,
    agreementStatus: input.existingSolar?.agreementStatus,
    agreementDate: input.existingSolar?.agreementDate,
    legacyAgreementStatus: input.legacyAgreementStatus,
    greenMeter: input.greenMeter,
  });
  const requiresAgreementReview = resolveRequiresAgreementReview({
    hasExistingSolar,
    legacyAgreementStatus,
    intendedChange: input.existingSolar?.intendedChange,
  });

  const regulatoryStatus = buildRegulatoryStatus({
    actualPvCapacityKw,
    exportConnected: definition.exportConnected,
    sanctionedLoadKw: input.sanctionedLoadKw,
    connectionPhase,
    hasExistingSolar,
    legacyAgreementStatus,
    requiresAgreementReview,
  });

  const regulatoryValid = !regulatoryStatus.exceedsSanctionedLoad &&
    regulatoryStatus.phaseStatus.status !== 'upgrade-recommended';

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

  const annualGenerationKwh = round(summary.annualGenerationKwh, 1);
  const annualConsumptionKwh = round(summary.annualConsumptionKwh, 1);
  const roundedSelfConsumed = round(annualDirectConsumptionKwh, 1);
  const roundedBatteryCharge = round(annualBatteryChargeKwh, 1);
  const roundedBatteryDischarge = round(annualBatteryDischargeKwh, 1);
  const roundedGridExport = round(annualGridExportKwh, 1);
  const roundedCurtailed = round(annualUnusableSurplusKwh, 1);
  const roundedGridImport = round(annualGridImportKwh, 1);

  const servedBySolarAndBattery = roundedSelfConsumed + roundedBatteryDischarge;
  const unmetLoadKwh = definition.type === 'off-grid'
    ? round(Math.max(0, annualConsumptionKwh - servedBySolarAndBattery), 1)
    : 0;
  const loadCoveragePercent = annualConsumptionKwh > 0
    ? round(Math.min(100, (servedBySolarAndBattery / annualConsumptionKwh) * 100), 1)
    : 0;

  const energyFlow: AnnualEnergyFlow = {
    annualGenerationKwh,
    annualConsumptionKwh,
    selfConsumedKwh: roundedSelfConsumed,
    batteryChargeKwh: roundedBatteryCharge,
    batteryDischargeKwh: roundedBatteryDischarge,
    gridExportKwh: roundedGridExport,
    curtailedKwh: roundedCurtailed,
    gridImportKwh: roundedGridImport,
    selfConsumptionRatio: annualGenerationKwh > 0
      ? round((roundedSelfConsumed + roundedBatteryCharge) / annualGenerationKwh, 3)
      : 0,
    exportRatio: annualGenerationKwh > 0
      ? round(roundedGridExport / annualGenerationKwh, 3)
      : 0,
    curtailmentRatio: annualGenerationKwh > 0
      ? round(roundedCurtailed / annualGenerationKwh, 3)
      : 0,
    gridIndependenceRatio: definition.type === 'off-grid'
      ? 1.0
      : annualConsumptionKwh > 0
        ? round(servedBySolarAndBattery / annualConsumptionKwh, 3)
        : 0,
    loadCoveragePercent,
    unmetLoadKwh,
  };

  const currentEnergyCharges = currentBill.energyImportCharges + currentBill.peakImportCharges + currentBill.offPeakImportCharges;
  const postEnergyCharges = postBill.energyImportCharges + postBill.peakImportCharges + postBill.offPeakImportCharges;
  const avoidedGridPurchaseValuePkr = round(Math.max(0, currentEnergyCharges - postEnergyCharges), 0);
  const exportCreditValuePkr = round(postBill.exportCredit, 0);
  const annualBillReductionPkr = round(Math.max(0, currentBill.total - postBill.total), 0);
  const annualBillReductionPercent = currentBill.total > 0
    ? round((annualBillReductionPkr / currentBill.total) * 100, 1)
    : 0;

  const financialAnalysis: FinancialBreakdown = {
    currentAnnualBillPkr: round(currentBill.total, 0),
    postSolarAnnualBillPkr: round(postBill.total, 0),
    annualBillReductionPkr,
    annualBillReductionPercent,
    avoidedGridPurchaseValuePkr,
    exportCreditValuePkr,
    batteryEnergyShiftValuePkr: battery ? round(roundedBatteryDischarge * (account.tou ? 40 : 33), 0) : 0,
    estimatedCapexPkr: null,
    simplePaybackYears: null,
    roiPercent: null,
    capexStatus: CAPEX_AVAILABILITY_STATUS.status,
    financialModelVersion: FINANCIAL_MODEL_VERSION,
  };

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
    caution: regulatoryStatus.warnings.find((w) => w.severity === 'action-required')?.message || qualifications[0],
    annualGridImportKwh: roundedGridImport,
    annualGridExportKwh: roundedGridExport,
    annualDirectConsumptionKwh: roundedSelfConsumed + roundedBatteryDischarge,
    annualUnusableSurplusKwh: roundedCurtailed,
    currentEstimatedBill: round(currentBill.total, 0),
    postSolarEstimatedBill: round(postBill.total, 0),
    billReduction: annualBillReductionPkr,
    billReductionPercent: annualBillReductionPercent,
    prosumerRegime: regime,
    nepraConcurrenceRequired: regulatoryStatus.nepraConcurrenceRequired,
    utilityApprovalRequired: definition.exportConnected,
    loadFlowStudyRequired: regulatoryStatus.loadFlowStudyRequired,
    regulatoryValid,
    regulatoryStatus,
    confidence: recommendationConfidence,
    policyConfidence,
    recommendationConfidence,
    qualifications,
    energyFlow,
    monthlyEnergyFlows,
    financialAnalysis,
  };
}

function candidatesForScenario(
  definition: (typeof SCENARIO_DEFINITIONS)[number],
  candidates: number[]
) {
  return candidates.filter((candidate) =>
    calculatePanelConfiguration(candidate).actualPvCapacityKw <= PROSUMER_POLICY_2026.maximumDgCapacityKw
  );
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
  const consumptionProfile = resolveConsumptionProfile(input.consumptionProfile, tariffCategory);
  const primaryObjective: UserPrimaryObjective = input.primaryObjective || 'maximum-savings';

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
    let scenarioCandidates = candidatesForScenario(definition, candidates);
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
        currentBill,
        consumptionProfile
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

  function getArchitectureComplexity(arch?: ScenarioArchitecture): number {
    switch (arch) {
      case 'on-grid-only': return 1;
      case 'hybrid-green-no-battery': return 2;
      case 'hybrid-no-green-no-battery': return 2;
      case 'hybrid-green-battery': return 3;
      case 'hybrid-no-green-battery': return 3;
      case 'off-grid': return 4;
      default: return 5;
    }
  }

  const scoreScenario = (result: SystemRecommendation): number => {
    const billReduction = result.billReductionPercent || 0;
    const isOffGrid = result.type === 'off-grid';
    const hasBattery = Boolean(result.battery);
    const complexity = getArchitectureComplexity(result.architecture);
    const regulatoryValid = result.regulatoryValid !== false;

    if (primaryObjective === 'grid-independence') {
      // Off-Grid explicitly represents complete disconnection from utility
      if (isOffGrid) {
        return 1000 + (result.energyFlow?.loadCoveragePercent || 0);
      }
      return -1000;
    }

    if (isOffGrid) {
      // Off-grid is excluded when grid connection is retained
      return -1000;
    }

    if (primaryObjective === 'maximum-backup') {
      // Prioritize architectures capable of meeting backup resilience
      if (!hasBattery) return -500 + billReduction;
      // Between battery architectures, rank by modeled bill reduction & regulatory feasibility
      const regBonus = regulatoryValid ? 5 : 0;
      return billReduction + regBonus;
    }

    if (primaryObjective === 'balanced-backup') {
      // Backup is a genuine user requirement
      if (!hasBattery) return -500 + billReduction;
      // Between battery architectures (e.g. Hybrid+Green vs Hybrid No-Green), rank by bill reduction & regulatory feasibility
      const regBonus = regulatoryValid ? 5 : 0;
      return billReduction + regBonus - (complexity * 0.01);
    }

    // Default: maximum-savings
    // Purely deterministic optimization of modeled annual bill reduction across all grid-connected architectures.
    // If two architectures achieve virtually equivalent bill reduction (within 0.1%), prefer lower complexity / fewer components.
    return billReduction - (complexity * 0.01);
  };

  let bestMatch = scenarios.reduce((best, result) => {
    const scoreDiff = scoreScenario(result) - scoreScenario(best);
    if (scoreDiff > 0.001) return result;
    if (Math.abs(scoreDiff) <= 0.001 && result.actualPvCapacityKw < best.actualPvCapacityKw) return result;
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
    input.analysisMode !== undefined ||
    input.existingSolar !== undefined ||
    input.connectionPhase !== undefined ||
    input.consumptionProfile !== undefined ||
    input.primaryObjective !== undefined;
  if (!policyInputsProvided) {
    const establishedOnGridSelection = selectCandidate(
      candidates, input.monthlyConsumption, location.monthlyPeakSunHours, 100
    );
    bestMatch = buildEconomicRecommendation(
      SCENARIO_DEFINITIONS[0], establishedOnGridSelection, input, account,
      consumption.averageDailyKwh, peakShare, currentBill, consumptionProfile
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

  const isLegacy = bestMatch.prosumerRegime === 'legacy';
  const exportRate = isLegacy
    ? PROSUMER_POLICY_2026.settlementRules.legacy.ratePkrPerKwh
    : PROSUMER_POLICY_2026.settlementRules.current.ratePkrPerKwh;
  const financialAssumptions: FinancialAssumptions = {
    modelVersion: FINANCIAL_MODEL_VERSION,
    profileSource: consumptionProfile.source,
    daytimeSharePercent: consumptionProfile.daytimeSharePercent,
    exportCreditMechanism: isLegacy
      ? 'Legacy Net-Metering (CY2026 NAPPP Reference Rate)'
      : 'NAEPP Net-Billing (CY2026 Reference Rate)',
    applicableExportRatePkrPerKwh: exportRate,
    excludedDynamicCharges: currentBill.excludedComponents,
    capexAvailable: false,
    capexNotice: CAPEX_AVAILABILITY_STATUS.userMessage,
  };

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
    consumptionProfile,
    financialAssumptions,
  };
}
