import { MONTH_KEYS, MonthKey, SolarProfileResolution } from './types';

type SolarProfile = Record<MonthKey, number>;

// Daily kWh/m²/day climatology used as peak-sun-hour equivalents.
// Source: NASA POWER ALLSKY_SFC_SW_DWN monthly climatology (2001–2020).
export const PAKISTAN_SOLAR_PROFILES: Record<string, SolarProfile> = {
  islamabad: {
    jan: 2.9126, feb: 3.5009, mar: 4.8053, apr: 6.025, may: 6.9874, jun: 6.9746,
    jul: 5.8702, aug: 5.3851, sep: 5.3561, oct: 4.6666, nov: 3.4445, dec: 2.8375,
  },
  lahore: {
    jan: 2.9153, feb: 4.014, mar: 5.2822, apr: 6.3036, may: 6.8998, jun: 6.4927,
    jul: 5.5426, aug: 5.3722, sep: 5.2915, oct: 4.6145, nov: 3.5292, dec: 2.9016,
  },
  karachi: {
    jan: 4.3814, feb: 5.3479, mar: 6.3384, apr: 7.0049, may: 7.1498, jun: 6.5405,
    jul: 5.2802, aug: 5.2078, sep: 5.7862, oct: 5.5795, nov: 4.6207, dec: 4.1311,
  },
  peshawar: {
    jan: 2.9748, feb: 3.4807, mar: 4.7251, apr: 6.1346, may: 7.3212, jun: 7.7419,
    jul: 6.9689, aug: 6.282, sep: 5.8409, oct: 4.8482, nov: 3.4654, dec: 2.8985,
  },
  multan: {
    jan: 3.1469, feb: 4.1582, mar: 5.3482, apr: 6.4435, may: 6.9754, jun: 6.5914,
    jul: 5.8898, aug: 5.6981, sep: 5.4158, oct: 4.6006, nov: 3.5124, dec: 3.0643,
  },
  quetta: {
    jan: 3.7265, feb: 4.4678, mar: 5.8682, apr: 6.9852, may: 7.915, jun: 8.4511,
    jul: 7.9054, aug: 7.4366, sep: 6.8374, oct: 5.7043, nov: 4.3646, dec: 3.7166,
  },
};

const CITY_PROFILE_MAP: Record<string, string> = {
  islamabad: 'islamabad',
  rawalpindi: 'islamabad',
  abbottabad: 'islamabad',
  murree: 'islamabad',
  lahore: 'lahore',
  faisalabad: 'lahore',
  gujranwala: 'lahore',
  sialkot: 'lahore',
  sheikhupura: 'lahore',
  karachi: 'karachi',
  hyderabad: 'karachi',
  peshawar: 'peshawar',
  mardan: 'peshawar',
  swat: 'peshawar',
  multan: 'multan',
  bahawalpur: 'multan',
  sukkur: 'multan',
  quetta: 'quetta',
};

export const SUPPORTED_PAKISTAN_CITIES = Object.keys(CITY_PROFILE_MAP)
  .map((city) => city.replace(/\b\w/g, (letter) => letter.toUpperCase()))
  .sort();

function normalizeCity(city: string): string {
  return city
    .toLowerCase()
    .replace(/,?\s*pakistan\s*$/i, '')
    .replace(/[^a-z\s]/g, '')
    .trim();
}

export function resolvePakistanSolarProfile(city: string): SolarProfileResolution {
  const normalized = normalizeCity(city);
  const directMatch = CITY_PROFILE_MAP[normalized];
  const fuzzyCity = Object.keys(CITY_PROFILE_MAP).find(
    (candidate) => normalized.includes(candidate) || candidate.includes(normalized)
  );
  const profileKey = directMatch || (fuzzyCity ? CITY_PROFILE_MAP[fuzzyCity] : 'islamabad');
  const profile = PAKISTAN_SOLAR_PROFILES[profileKey];

  return {
    requestedCity: city,
    profileCity: profileKey.replace(/\b\w/g, (letter) => letter.toUpperCase()),
    profileKey,
    fallbackUsed: !directMatch && !fuzzyCity,
    monthlyPeakSunHours: MONTH_KEYS.reduce((result, month) => {
      result[month] = profile[month];
      return result;
    }, {} as SolarProfile),
  };
}
