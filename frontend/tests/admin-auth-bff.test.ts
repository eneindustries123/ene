import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';
import { POST as login } from '../app/api/admin/login/route';
import { POST as logout } from '../app/api/admin/logout/route';
import { GET as proxyGet, PATCH as proxyPatch } from '../app/api/admin/backend/[...path]/route';
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionCookieOptions,
} from '../lib/admin-auth';

const FRONTEND_URL = 'https://ene-chi.vercel.app';
const BACKEND_URL = 'https://ene-97d4.onbelmo.uk';
const SESSION_TOKEN = 'eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIn0.test-signature';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('admin same-origin authentication bridge', () => {
  it('creates an HttpOnly frontend cookie and admits authenticated admin requests and refreshes', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', BACKEND_URL);
    const backendFetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const url = input.toString();
      if (url.endsWith('/api/auth/login')) {
        return Response.json({
          success: true,
          token: SESSION_TOKEN,
          email: 'admin@example.com',
        });
      }

      expect(url).toBe(`${BACKEND_URL}/api/auth/verify`);
      expect(new Headers(init?.headers).get('authorization')).toBe(`Bearer ${SESSION_TOKEN}`);
      return Response.json({ authenticated: true, email: 'admin@example.com' });
    });

    const loginResponse = await login(new NextRequest(`${FRONTEND_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: FRONTEND_URL,
      },
      body: JSON.stringify({ email: 'admin@example.com', password: 'correct-password' }),
    }));

    expect(loginResponse.status).toBe(200);
    await expect(loginResponse.json()).resolves.toEqual({
      success: true,
      email: 'admin@example.com',
    });

    const setCookie = loginResponse.headers.get('set-cookie');
    expect(setCookie).toContain(`${ADMIN_SESSION_COOKIE_NAME}=${SESSION_TOKEN}`);
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('SameSite=lax');
    expect(setCookie).not.toContain('Domain=');
    const cookie = setCookie!.split(';')[0];

    const firstAdminResponse = await middleware(new NextRequest(`${FRONTEND_URL}/admin`, {
      headers: { Cookie: cookie },
    }));
    expect(firstAdminResponse.status).toBe(200);
    expect(firstAdminResponse.headers.get('location')).toBeNull();

    const refreshedAdminResponse = await middleware(new NextRequest(`${FRONTEND_URL}/admin`, {
      headers: { Cookie: cookie },
    }));
    expect(refreshedAdminResponse.status).toBe(200);
    expect(refreshedAdminResponse.headers.get('location')).toBeNull();
    expect(backendFetch).toHaveBeenCalledTimes(3);
  });

  it('uses production-safe cookie attributes', () => {
    expect(getAdminSessionCookieOptions(true)).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 86400,
    });
  });

  it('redirects an unauthenticated admin request to login', async () => {
    const response = await middleware(new NextRequest(`${FRONTEND_URL}/admin`));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      `${FRONTEND_URL}/admin/login?from=%2Fadmin`
    );
  });

  it('rejects and clears a cookie that backend verification does not validate', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({ authenticated: false }, { status: 401 })
    );

    const response = await middleware(new NextRequest(`${FRONTEND_URL}/admin`, {
      headers: { Cookie: `${ADMIN_SESSION_COOKIE_NAME}=${SESSION_TOKEN}` },
    }));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      `${FRONTEND_URL}/admin/login?from=%2Fadmin`
    );
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  });

  it('does not create a frontend session for invalid credentials', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(
      { error: 'Invalid email or password.' },
      { status: 401 }
    ));

    const response = await login(new NextRequest(`${FRONTEND_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: FRONTEND_URL,
      },
      body: JSON.stringify({ email: 'admin@example.com', password: 'wrong-password' }),
    }));

    expect(response.status).toBe(401);
    expect(response.headers.get('set-cookie')).toBeNull();
    await expect(response.json()).resolves.toEqual({ error: 'Invalid email or password.' });
  });

  it('clears the frontend session on logout', async () => {
    const response = await logout(new NextRequest(`${FRONTEND_URL}/api/admin/logout`, {
      method: 'POST',
      headers: { Origin: FRONTEND_URL },
    }));

    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain(`${ADMIN_SESSION_COOKIE_NAME}=`);
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  });

  it('forwards the HttpOnly session as backend Bearer authorization', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', BACKEND_URL);
    const backendFetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      expect(input.toString()).toBe(`${BACKEND_URL}/api/reviews?status=pending`);
      expect(init?.method).toBe('GET');
      expect(new Headers(init?.headers).get('authorization')).toBe(`Bearer ${SESSION_TOKEN}`);
      return Response.json({ reviews: [{ id: 'review-1' }] });
    });

    const response = await proxyGet(
      new NextRequest(`${FRONTEND_URL}/api/admin/backend/reviews?status=pending`, {
        headers: { Cookie: `${ADMIN_SESSION_COOKIE_NAME}=${SESSION_TOKEN}` },
      }),
      { params: { path: ['reviews'] } }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ reviews: [{ id: 'review-1' }] });
    expect(backendFetch).toHaveBeenCalledOnce();
  });

  it('rejects cross-origin state-changing admin proxy requests', async () => {
    const backendFetch = vi.spyOn(globalThis, 'fetch');
    const response = await proxyPatch(
      new NextRequest(`${FRONTEND_URL}/api/admin/backend/reviews/review-1`, {
        method: 'PATCH',
        headers: {
          Cookie: `${ADMIN_SESSION_COOKIE_NAME}=${SESSION_TOKEN}`,
          Origin: 'https://attacker.example',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      }),
      { params: { path: ['reviews', 'review-1'] } }
    );

    expect(response.status).toBe(403);
    expect(backendFetch).not.toHaveBeenCalled();
  });
});
