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
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const payload = verifyJwt(token, JWT_SECRET);
    if (!payload?.sub) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    req.userEmail = payload.sub;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}


