import { z } from 'zod';
import { MONTH_KEYS } from '../solar/types';

const confidenceSchema = z.enum(['high', 'medium', 'low']);
const citySourceSchema = z.enum([
  'customer-address',
  'explicit-installation-location',
  'provider-or-disco',
  'unknown',
]);

export const geminiBillExtractionSchema = z.object({
  provider: z.string().max(120).nullable(),
  city: z.string().max(120).nullable(),
  citySource: citySourceSchema.nullable(),
  cityConfidence: confidenceSchema.nullable(),
  currentMonth: z.object({
    month: z.string().max(30).nullable(),
    year: z.number().int().min(2000).max(2100).nullable(),
    kwh: z.number().min(0).max(10_000_000).nullable(),
  }),
  monthlyHistory: z.array(z.object({
    month: z.string().min(1).max(30),
    year: z.number().int().min(2000).max(2100).nullable(),
    kwh: z.number().min(0).max(10_000_000).nullable(),
    confidence: confidenceSchema,
  })).max(12),
  connectionType: z.string().max(120).nullable(),
  phase: z.string().max(60).nullable(),
  sanctionedLoadKw: z.number().min(0).max(100_000).nullable(),
  connectedLoadKw: z.number().min(0).max(100_000).nullable(),
  consumerCategory: z.string().max(120).nullable(),
  currentBillAmount: z.number().min(0).max(1_000_000_000).nullable(),
  overallConfidence: confidenceSchema,
  warnings: z.array(z.string().max(240)).max(20),
});

const monthlyConsumptionSchema = z.object({
  month: z.enum(MONTH_KEYS),
  year: z.number().int().min(2000).max(2100).nullable().optional(),
  kwh: z.number().min(0).max(10_000_000),
});

const legacyAgreementStatusSchema = z.enum([
  'confirmed',
  'likely',
  'unverified',
  'not-applicable',
  'valid',
  'expired',
  'none',
  'unknown',
]).transform((val): 'confirmed' | 'likely' | 'unverified' | 'not-applicable' => {
  if (val === 'valid') return 'confirmed';
  if (val === 'expired' || val === 'none') return 'not-applicable';
  if (val === 'unknown') return 'unverified';
  return val;
});

const agreementLifecycleStatusSchema = z.enum([
  'active',
  'expired',
  'none',
  'unknown',
  'yes',
  'no',
  'unsure',
]).transform((val): 'active' | 'expired' | 'none' | 'unknown' => {
  if (val === 'yes') return 'active';
  if (val === 'no') return 'none';
  if (val === 'unsure') return 'unknown';
  return val;
});

export const solarRecommendationSchema = z.object({
  city: z.string().trim().min(2).max(120),
  monthlyConsumption: z.array(monthlyConsumptionSchema).length(12),
  utility: z.string().trim().min(2).max(120).optional(),
  tariffCategory: z.enum(['residential', 'commercial']).optional(),
  protectedStatus: z.enum(['lifeline-50', 'lifeline-100', 'protected', 'non-protected']).optional(),
  tou: z.boolean().optional(),
  sanctionedLoadKw: z.number().positive().max(100_000).optional(),
  mdiKw: z.number().nonnegative().max(100_000).optional(),
  phase: z.string().max(60).nullable().optional(),
  connectionType: z.string().max(120).nullable().optional(),
  connectionPhase: z.enum(['single-phase', 'three-phase', 'unknown']).optional(),
  greenMeter: z.boolean().optional(),
  legacyAgreementStatus: legacyAgreementStatusSchema.optional(),
  existingSolar: z.object({
    hasExistingSolar: z.boolean(),
    existingPvCapacityKw: z.number().positive().max(100_000).nullable().optional(),
    existingInverterKw: z.number().positive().max(100_000).nullable().optional(),
    agreementStatus: agreementLifecycleStatusSchema.nullable().optional(),
    agreementDate: z.string().max(60).nullable().optional(),
    intendedChange: z.enum([
      'none',
      'expansion',
      'replacement',
      'battery-addition',
      'system-modification',
      'analysis-only',
    ]).nullable().optional(),
  }).optional(),
  peakConsumptionShare: z.number().min(0).max(1).optional(),
  consumptionProfile: z.object({
    profileType: z.enum(['daytime', 'balanced', 'evening', 'custom', 'not-sure']).optional(),
    customDaytimeSharePercent: z.number().min(0).max(100).nullable().optional(),
    peakKwh: z.number().min(0).max(10_000_000).nullable().optional(),
    offPeakKwh: z.number().min(0).max(10_000_000).nullable().optional(),
  }).optional(),
  primaryObjective: z.enum([
    'maximum-savings',
    'balanced-backup',
    'maximum-backup',
    'grid-independence',
  ]).optional(),
  analysisMode: z.enum(['recommend', 'chosen', 'both']),
  chosenArchitecture: z.enum([
    'on-grid-only',
    'hybrid-green-no-battery',
    'hybrid-green-battery',
    'hybrid-no-green-no-battery',
    'hybrid-no-green-battery',
    'off-grid',
  ]).optional(),
  billExtractionConfidence: z.enum(['high', 'medium', 'low', 'manual']).optional(),
  batteryPreferences: z.object({
    backupLevel: z.enum(['essential', 'most', 'entire']),
    backupHours: z.union([z.literal(2), z.literal(4), z.literal(6), z.literal(8)]),
    knownBackupLoadKw: z.number().positive().max(10_000).optional(),
  }).optional(),
}).superRefine((value, context) => {
  const months = new Set(value.monthlyConsumption.map((item) => item.month));
  if (months.size !== 12) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['monthlyConsumption'],
      message: 'Each calendar month must be provided exactly once.',
    });
  }

  if (value.monthlyConsumption.every((item) => item.kwh === 0)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['monthlyConsumption'],
      message: 'At least one monthly consumption value must be greater than zero.',
    });
  }

  if ((value.analysisMode === 'chosen' || value.analysisMode === 'both') && !value.chosenArchitecture) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['chosenArchitecture'],
      message: 'Choose a system architecture for the selected analysis mode.',
    });
  }
});

export type SolarRecommendationInput = z.infer<typeof solarRecommendationSchema>;
