/**
 * E&E Industries Frontend API Client Helper
 */

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
).replace(/\/$/, '');

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; ok: boolean; status: number }> {
  const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint);

  try {
    const res = await fetch(url, {
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
