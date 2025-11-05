"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
const COOKIE_NAME = process.env.COOKIE_NAME || 'zerrah_token';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
function requireAuth(req, res, next) {
    try {
        const token = req.cookies?.[COOKIE_NAME];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const payload = (0, jwt_1.verifyJwt)(token, JWT_SECRET);
        if (!payload?.sub) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        req.userEmail = payload.sub;
        return next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}
