import { Request, Response } from 'express';
import {
  getAdminCredentials,
  isLockedOut,
  recordFailedAttempt,
  resetFailedAttempts,
  signToken,
  verifyToken,
  SESSION_COOKIE_NAME,
  getSessionCookieOptions,
  AuthenticatedRequest,
} from '../middleware/auth';

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { locked, remainingSeconds } = isLockedOut(email);
    if (locked) {
      return res.status(429).json({
        error: `Too many failed attempts. Account temporarily locked for ${remainingSeconds} seconds.`,
        locked: true,
      });
    }

    const { email: adminEmail, password: adminPassword } = getAdminCredentials();

    if (
      email.toLowerCase().trim() !== adminEmail.toLowerCase().trim() ||
      password !== adminPassword
    ) {
      const { locked: nowLocked, attemptsLeft } = recordFailedAttempt(email);

      if (nowLocked) {
        return res.status(429).json({
          error: 'Account locked due to 5 consecutive failed login attempts. Try again in 15 minutes.',
          locked: true,
        });
      }

      return res.status(401).json({
        error: `Invalid email or password. ${attemptsLeft} attempts remaining before lockout.`,
        attemptsLeft,
      });
    }

    resetFailedAttempts(email);

    // Sign HMAC token valid for 24 hours
    const exp = Date.now() + 24 * 60 * 60 * 1000;
    const token = signToken({ email: adminEmail, exp });

    // Set HTTP-only Cookie
    res.cookie(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      email: adminEmail,
    });
  }

  static async logout(req: Request, res: Response) {
    const options = getSessionCookieOptions();
    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: options.httpOnly,
      secure: options.secure,
      sameSite: options.sameSite,
      path: options.path,
    });

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  static async verify(req: Request, res: Response) {
    const token =
      req.cookies?.[SESSION_COOKIE_NAME] ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const result = verifyToken(token);
    if (!result.valid) {
      return res.status(401).json({ authenticated: false });
    }

    return res.status(200).json({
      authenticated: true,
      email: result.email,
    });
  }
}
