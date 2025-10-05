import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { SessionService } from '../services/sessionService';

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || 'zerrah_session_id';

export interface SessionAwareRequest extends Request {
  sessionId?: string;
}

export async function ensureSession(req: SessionAwareRequest, res: Response, next: NextFunction) {
  try {
    let sessionId = req.cookies?.[SESSION_COOKIE] as string | undefined;
    if (!sessionId) {
      sessionId = uuidv4();
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
    }

    req.sessionId = sessionId;

    // Best-effort session upsert (non-blocking failures)
    try {
      await SessionService.createSessionIfNotExists(sessionId!, {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      });
    } catch (e) {
      // ignore errors; app should still work even if DB is unavailable
    }

    return next();
  } catch (err) {
    return next();
  }
}


