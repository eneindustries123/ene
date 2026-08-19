import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'solix_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

interface FailedAttempt {
  count: number;
  lockedUntil: number;
}
const failedAttemptsMap = new Map<string, FailedAttempt>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!email || !password || !secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'ADMIN_EMAIL, ADMIN_PASSWORD, and AUTH_SECRET must be configured in environment variables'
      );
    }
  }

  return {
    email: email || 'admin@example.com',
    password: password || 'dev_admin_password_change_in_env',
    secret: secret || 'dev_auth_secret_minimum_32_characters_long_for_hmac',
  };
}

export function isLockedOut(email: string): { locked: boolean; remainingSeconds?: number } {
  const attempt = failedAttemptsMap.get(email.toLowerCase());
  if (!attempt) return { locked: false };

  const now = Date.now();
  if (attempt.lockedUntil > now) {
    const remainingSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
    return { locked: true, remainingSeconds };
  }

  if (attempt.lockedUntil > 0 && attempt.lockedUntil <= now) {
    failedAttemptsMap.delete(email.toLowerCase());
  }

  return { locked: false };
}

export function recordFailedAttempt(email: string): { locked: boolean; attemptsLeft: number } {
  const key = email.toLowerCase();
  const now = Date.now();
  const current = failedAttemptsMap.get(key) || { count: 0, lockedUntil: 0 };

  current.count += 1;
  if (current.count >= MAX_FAILED_ATTEMPTS) {
    current.lockedUntil = now + LOCKOUT_DURATION_MS;
    failedAttemptsMap.set(key, current);
    return { locked: true, attemptsLeft: 0 };
  }

  failedAttemptsMap.set(key, current);
  return { locked: false, attemptsLeft: MAX_FAILED_ATTEMPTS - current.count };
}

export function resetFailedAttempts(email: string) {
  failedAttemptsMap.delete(email.toLowerCase());
}

export function signToken(payload: { email: string; exp: number }): string {
  const { secret } = getAdminCredentials();
  const jsonPayload = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonPayload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(base64Payload)
    .digest('base64url');
  return `${base64Payload}.${signature}`;
}

export function verifyToken(token: string): { valid: boolean; email?: string } {
  try {
    const { secret } = getAdminCredentials();
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };

    const [base64Payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(base64Payload)
      .digest('base64url');

    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);
    if (
      signatureBuffer.length !== expectedSignatureBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
      return { valid: false };
    }

    const jsonPayload = Buffer.from(base64Payload, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonPayload);

    if (!payload.exp || Date.now() >= payload.exp) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

export function getSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ('none' as const) : ('lax' as const),
    path: '/',
    maxAge: SESSION_MAX_AGE * 1000,
  };
}

export interface AuthenticatedRequest extends Request {
  adminEmail?: string;
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token =
    req.cookies?.[SESSION_COOKIE_NAME] ||
    req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const { valid, email } = verifyToken(token);
  if (!valid || !email) {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }

  req.adminEmail = email;
  next();
}
