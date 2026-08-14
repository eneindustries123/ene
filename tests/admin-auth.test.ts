import { describe, it, expect } from 'vitest';
import {
  signToken,
  verifyToken,
  isLockedOut,
  recordFailedAttempt,
  resetFailedAttempts,
  getAdminCredentials,
} from '../lib/auth';

describe('Admin Authentication & Security Unit Tests', () => {
  it('signs and verifies valid JWT session tokens', () => {
    const email = 'admin@solix-energy.com';
    const exp = Date.now() + 60000;
    const token = signToken({ email, exp });

    const result = verifyToken(token);
    expect(result.valid).toBe(true);
    expect(result.email).toBe(email);
  });

  it('rejects tampered signature tokens', () => {
    const token = signToken({ email: 'admin@solix-energy.com', exp: Date.now() + 60000 });
    const tampered = token.slice(0, -5) + 'xxxxx';

    const result = verifyToken(tampered);
    expect(result.valid).toBe(false);
  });

  it('rejects expired session tokens', () => {
    const expiredToken = signToken({ email: 'admin@solix-energy.com', exp: Date.now() - 1000 });
    const result = verifyToken(expiredToken);
    expect(result.valid).toBe(false);
  });

  it('enforces lockout after 5 failed login attempts', () => {
    const testEmail = 'attacker@test.com';
    resetFailedAttempts(testEmail);

    expect(isLockedOut(testEmail).locked).toBe(false);

    recordFailedAttempt(testEmail);
    recordFailedAttempt(testEmail);
    recordFailedAttempt(testEmail);
    recordFailedAttempt(testEmail);
    const finalAttempt = recordFailedAttempt(testEmail);

    expect(finalAttempt.locked).toBe(true);
    expect(isLockedOut(testEmail).locked).toBe(true);

    resetFailedAttempts(testEmail);
    expect(isLockedOut(testEmail).locked).toBe(false);
  });
});
