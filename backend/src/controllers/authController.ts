import { Request, Response } from 'express';
import { signJwt, verifyJwt, parseCookie } from '../utils/jwt';

const COOKIE_NAME = process.env.COOKIE_NAME || 'zerrah_token';
const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || 'zerrah_session_id';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
      }
      // Demo-only password rule
      if (password !== '1234') {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = signJwt({ sub: email }, JWT_SECRET, 7 * 24 * 60 * 60);

      const isProd = process.env.NODE_ENV === 'production';
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Ensure a session cookie exists for tracking
      const existingSessionId = (req as any).sessionId || req.cookies?.[SESSION_COOKIE];
      if (!existingSessionId) {
        // session middleware will create one on next request, but we can hint here
        res.cookie(SESSION_COOKIE, 'pending', {
          httpOnly: true,
          sameSite: isProd ? 'none' : 'lax',
          secure: isProd,
          maxAge: 365 * 24 * 60 * 60 * 1000
        });
      }
      return res.json({ success: true, email });
    } catch (e) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async logout(req: Request, res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd });
    res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd });
    return res.json({ success: true });
  }

  static async me(req: Request, res: Response) {
    const cookieHeader = req.headers.cookie;
    const token = parseCookie(cookieHeader, COOKIE_NAME);
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const payload = verifyJwt(token, JWT_SECRET);
    if (!payload) return res.status(401).json({ success: false, message: 'Invalid token' });
    return res.json({ success: true, email: payload.sub });
  }
}


