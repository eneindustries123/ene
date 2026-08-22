export const ADMIN_SESSION_COOKIE_NAME = 'solix_admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;

const DEFAULT_BACKEND_URL = 'http://localhost:4000';
const SESSION_VERIFICATION_TIMEOUT_MS = 5000;

export function getBackendApiUrl(path: string): string {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_BACKEND_URL).replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function getAdminSessionCookieOptions(
  isProduction = process.env.NODE_ENV === 'production'
) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

export async function verifyAdminSessionToken(token: string): Promise<{
  valid: boolean;
  email?: string;
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SESSION_VERIFICATION_TIMEOUT_MS);

  try {
    const response = await fetch(getBackendApiUrl('/api/auth/verify'), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      return { valid: false };
    }

    const data = (await response.json()) as { authenticated?: boolean; email?: unknown };
    if (data.authenticated !== true) {
      return { valid: false };
    }

    return {
      valid: true,
      email: typeof data.email === 'string' ? data.email : undefined,
    };
  } catch {
    return { valid: false };
  } finally {
    clearTimeout(timeoutId);
  }
}
