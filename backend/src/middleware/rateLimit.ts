import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts from this IP, please try again after 15 minutes.',
  },
});

export const publicApiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please slow down.',
  },
});

export const solarAnalyzerExtractionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.SOLAR_ANALYZER_RATE_LIMIT_MAX) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many bill analysis requests. Please retry after 15 minutes or enter usage manually.',
    code: 'SOLAR_ANALYZER_RATE_LIMITED',
  },
});
