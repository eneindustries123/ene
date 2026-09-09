import { TariffCategory } from './types';

export const FINANCIAL_MODEL_VERSION = '2026.1';

export interface ConsumptionProfilePreset {
  type: 'daytime' | 'balanced' | 'evening' | 'not-sure';
  label: string;
  description: string;
  daytimeShare: number;
}

export const CONSUMPTION_PROFILE_PRESETS: Record<
  'daytime' | 'balanced' | 'evening',
  ConsumptionProfilePreset
> = {
  daytime: {
    type: 'daytime',
    label: 'Mostly during daytime (65% daytime use)',
    description: 'Offices, commercial shops, or homes with active daytime air conditioning and daytime occupancy.',
    daytimeShare: 0.65,
  },
  balanced: {
    type: 'balanced',
    label: 'Balanced across day and evening (50% daytime use)',
    description: 'Properties with steady, consistent electricity consumption throughout the day and night.',
    daytimeShare: 0.50,
  },
  evening: {
    type: 'evening',
    label: 'Mostly during evening / night (25% daytime use)',
    description: 'Homes where occupants are away during working hours and main loads run in the evening/night.',
    daytimeShare: 0.25,
  },
} as const;

export const DEFAULT_FALLBACK_DAYTIME_SHARES: Record<TariffCategory, number> = {
  residential: 0.38,
  commercial: 0.50,
};

export const CAPEX_AVAILABILITY_STATUS = {
  status: 'UNAVAILABLE — REQUIRES_SITE_PROPOSAL' as const,
  userMessage:
    'Investment payback and return require a project-specific installed system price. Request an exact proposal for a complete financial and payback analysis.',
};
