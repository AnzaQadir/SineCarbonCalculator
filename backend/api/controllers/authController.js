"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jwt_1 = require("../utils/jwt");
const COOKIE_NAME = process.env.COOKIE_NAME || 'zerrah_token';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body || {};
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password required' });
            }
            // Demo-only password rule
            if (password !== '1234') {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            const token = (0, jwt_1.signJwt)({ sub: email }, JWT_SECRET, 7 * 24 * 60 * 60);
            res.cookie(COOKIE_NAME, token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.json({ success: true, email });
        }
        catch (e) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
    static async logout(req, res) {
        res.clearCookie(COOKIE_NAME);
        return res.json({ success: true });
    }
    static async me(req, res) {
        const cookieHeader = req.headers.cookie;
        const token = (0, jwt_1.parseCookie)(cookieHeader, COOKIE_NAME);
        if (!token)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const payload = (0, jwt_1.verifyJwt)(token, JWT_SECRET);
        if (!payload)
            return res.status(401).json({ success: false, message: 'Invalid token' });
        return res.json({ success: true, email: payload.sub });
    }
}
exports.AuthController = AuthController;
