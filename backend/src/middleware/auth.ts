import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

const COOKIE_NAME = process.env.COOKIE_NAME || 'zerrah_token';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export interface AuthenticatedRequest extends Request {
  userEmail?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    
    // Debug logging (can be removed in production)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Auth Middleware] Cookie check:', {
        hasCookies: !!req.cookies,
        cookieNames: req.cookies ? Object.keys(req.cookies) : [],
        hasToken: !!token,
        cookieName: COOKIE_NAME,
      });
    }
    
    if (!token) {
      console.warn('[Auth Middleware] No token found in cookies');
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const payload = verifyJwt(token, JWT_SECRET);
    if (!payload?.sub) {
      console.warn('[Auth Middleware] Invalid token payload');
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    
    req.userEmail = payload.sub;
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Auth Middleware] Authenticated user:', req.userEmail);
    }
    return next();
  } catch (err) {
    console.error('[Auth Middleware] Auth error:', err);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}


