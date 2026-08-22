import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionCookieOptions,
  getBackendApiUrl,
  isSameOriginRequest,
} from '../../../../lib/admin-auth';

const LOGIN_TIMEOUT_MS = 10000;

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  let credentials: { email?: unknown; password?: unknown };
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS);

  try {
    const backendResponse = await fetch(getBackendApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
      cache: 'no-store',
      signal: controller.signal,
    });

    let backendData: { token?: unknown; email?: unknown; error?: unknown } = {};
    try {
      backendData = await backendResponse.json();
    } catch {
      // A malformed backend response is handled below without exposing its body.
    }

    if (!backendResponse.ok) {
      const status = backendResponse.status >= 400 && backendResponse.status < 500
        ? backendResponse.status
        : 502;
      const error = typeof backendData.error === 'string'
        ? backendData.error
        : 'Authentication service rejected the request.';
      return NextResponse.json({ error }, { status });
    }

    if (typeof backendData.token !== 'string' || !backendData.token.includes('.')) {
      return NextResponse.json(
        { error: 'Authentication service returned an invalid session.' },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      success: true,
      email: typeof backendData.email === 'string' ? backendData.email : credentials.email,
    });

    response.cookies.set(
      ADMIN_SESSION_COOKIE_NAME,
      backendData.token,
      getAdminSessionCookieOptions()
    );

    return response;
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return NextResponse.json(
      { error: timedOut ? 'Authentication service timed out.' : 'Authentication service unavailable.' },
      { status: timedOut ? 504 : 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
