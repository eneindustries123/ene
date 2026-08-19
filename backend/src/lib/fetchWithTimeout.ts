const configuredTimeout = Number(process.env.SUPABASE_REQUEST_TIMEOUT_MS);
const requestTimeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout > 0
  ? configuredTimeout
  : process.env.NODE_ENV === 'test' || process.env.VITEST
    ? 750
    : 5000;

export const fetchWithTimeout: typeof fetch = async (input, init = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};
