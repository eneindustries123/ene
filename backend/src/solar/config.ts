import { MonthKey } from './types';

export const DAYS_IN_MONTH: Record<MonthKey, number> = {
  jan: 31,
  feb: 28,
  mar: 31,
  apr: 30,
  may: 31,
  jun: 30,
  jul: 31,
  aug: 31,
  sep: 30,
  oct: 31,
  nov: 30,
  dec: 31,
};

export const SOLAR_ENGINEERING_CONFIG = {
  panelWattage: 585,
  performanceRatio: 0.8,
  standardPvCandidatesKw: [3, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 100],
  standardInverterSizesKw: [3, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 200, 250, 300, 400, 500],
  pvCandidateRange: { minimumRatio: 0.65, maximumRatio: 1.8 },
  dcAcRatioTarget: 1.15,
  dcAcRatioRange: { min: 0.75, max: 1.3 },
  maximumCandidateKw: 500,
  batteryModuleKwh: 5,
  batteryDepthOfDischarge: 0.9,
  batteryRoundTripEfficiency: 0.92,
  batteryDesignMargin: 1.1,
  hybridPreliminaryDailyFractions: { min: 0.2, max: 0.35 },
  offGridAutonomyDays: { min: 1, max: 1.5 },
  offGridPvMargin: 1.25,
  peakToAverageLoadFactor: 2.5,
  backupLoadFractions: {
    essential: 0.35,
    most: 0.7,
    entire: 1,
  },
} as const;

export const SOLAR_MODEL_BASIS =
  'NASA POWER 2001–2020 monthly all-sky surface solar irradiance climatology, applied as peak-sun-hour equivalents with a configurable system performance ratio.';

export const SOLAR_RECOMMENDATION_DISCLAIMER =
  'This is a preliminary solar recommendation based on your verified electricity consumption and location. Final system design may vary after site assessment, roof and shading review, electrical load analysis, equipment selection, and utility requirements.';
