import 'server-only';

import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE_NAME, getBackendApiUrl } from './admin-auth';

export async function fetchAdminBackend(
  path: string,
  init: RequestInit = {}
): Promise<Response | null> {
  const token = cookies().get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Accept', 'application/json');

  return fetch(getBackendApiUrl(path), {
    ...init,
    headers,
    cache: 'no-store',
  });
}
