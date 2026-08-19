/**
 * E&E Industries Frontend API Client Helper
 */

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
).replace(/\/$/, '');

const DEFAULT_API_TIMEOUT_MS = 4000;

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export function isProductionBuild(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

export async function apiFetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_API_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; ok: boolean; status: number }> {
  const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint);

  try {
    const res = await apiFetchWithTimeout(url, {
      ...options,
      credentials: options.credentials || 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      // Body may be empty
    }

    if (!res.ok) {
      return {
        data: null,
        error: (data && data.error) || `Request failed with status ${res.status}`,
        ok: false,
        status: res.status,
      };
    }

    return { data, error: null, ok: true, status: res.status };
  } catch (err: any) {
    return {
      data: null,
      error: err.message || 'Network error occurred',
      ok: false,
      status: 0,
    };
  }
}
