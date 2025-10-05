"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
exports.parseCookie = parseCookie;
const crypto_1 = __importDefault(require("crypto"));
function base64UrlEncode(input) {
    const buff = Buffer.isBuffer(input) ? input : Buffer.from(input);
    return buff.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function base64UrlDecode(input) {
    const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
    const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
    return Buffer.from(b64, 'base64');
}
function signJwt(payload, secret, expiresInSeconds = 7 * 24 * 60 * 60) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = { iat: now, exp: now + expiresInSeconds, ...payload };
    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(fullPayload));
    const toSign = `${headerEncoded}.${payloadEncoded}`;
    const signature = crypto_1.default
        .createHmac('sha256', secret)
        .update(toSign)
        .digest();
    const signatureEncoded = base64UrlEncode(signature);
    return `${toSign}.${signatureEncoded}`;
}
function verifyJwt(token, secret) {
    try {
        const [headerB64, payloadB64, signatureB64] = token.split('.');
        if (!headerB64 || !payloadB64 || !signatureB64)
            return null;
        const toSign = `${headerB64}.${payloadB64}`;
        const expectedSig = crypto_1.default.createHmac('sha256', secret).update(toSign).digest();
        const expectedB64 = base64UrlEncode(expectedSig);
        if (!crypto_1.default.timingSafeEqual(Buffer.from(signatureB64), Buffer.from(expectedB64)))
            return null;
        const payloadJson = base64UrlDecode(payloadB64).toString('utf8');
        const payload = JSON.parse(payloadJson);
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now)
            return null;
        return payload;
    }
    catch {
        return null;
    }
}
function parseCookie(header, name) {
    if (!header)
        return null;
    const parts = header.split(';');
    for (const part of parts) {
        const [k, v] = part.trim().split('=');
        if (k === name)
            return decodeURIComponent(v || '');
    }
    return null;
}
