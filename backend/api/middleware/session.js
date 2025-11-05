"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSession = ensureSession;
const uuid_1 = require("uuid");
const sessionService_1 = require("../services/sessionService");
const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || 'zerrah_session_id';
async function ensureSession(req, res, next) {
    try {
        let sessionId = req.cookies?.[SESSION_COOKIE];
        if (!sessionId) {
            sessionId = (0, uuid_1.v4)();
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
            await sessionService_1.SessionService.createSessionIfNotExists(sessionId, {
                userAgent: req.headers['user-agent'],
                ip: req.ip,
            });
        }
        catch (e) {
            // ignore errors; app should still work even if DB is unavailable
        }
        return next();
    }
    catch (err) {
        return next();
    }
}
