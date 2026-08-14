import { NextResponse } from 'next/server';
import {
  getAdminCredentials,
  isLockedOut,
  recordFailedAttempt,
  resetFailedAttempts,
  signToken,
  getSessionCookieOptions,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Rate limiting lockout check
    const lockout = isLockedOut(cleanEmail);
    if (lockout.locked) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Account locked temporarily. Try again in ${lockout.remainingSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const { email: adminEmail, password: adminPassword } = getAdminCredentials();

    if (cleanEmail !== adminEmail.toLowerCase() || password !== adminPassword) {
      const failedInfo = recordFailedAttempt(cleanEmail);
      if (failedInfo.locked) {
        return NextResponse.json(
          {
            error: 'Too many failed login attempts. Account temporarily locked for 15 minutes.',
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: 'Invalid administrator credentials.',
        },
        { status: 401 }
      );
    }

    // Success - reset failed attempts and set session cookie
    resetFailedAttempts(cleanEmail);

    const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const token = signToken({ email: cleanEmail, exp });

    const cookieOpts = getSessionCookieOptions();
    const response = NextResponse.json({ success: true, redirect: '/admin' });
    response.cookies.set(cookieOpts.name, token, cookieOpts);

    return response;
  } catch {
    return NextResponse.json({ error: 'Server authentication error' }, { status: 500 });
  }
}
