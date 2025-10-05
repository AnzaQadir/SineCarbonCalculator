"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShare = exports.createShare = void 0;
const models_1 = require("../models");
const fallbackStore = new Map();
const createShare = async (req, res) => {
    try {
        const { contentType, payload, imageUrl, id: providedId } = req.body || {};
        if (!contentType || !payload) {
            res.status(400).json({ success: false, error: 'contentType and payload are required' });
            return;
        }
        let id = providedId;
        try {
            const record = await models_1.ShareContent.create({ id: providedId, contentType, payload, imageUrl });
            id = record.id || providedId;
        }
        catch (dbErr) {
            // Fallback to memory
            id = providedId || (await Promise.resolve().then(() => __importStar(require('crypto')))).randomUUID();
            fallbackStore.set(id, { id, contentType, payload, imageUrl, createdAt: new Date().toISOString() });
        }
        const publicUrlBase = process.env.PUBLIC_FRONTEND_BASE_URL || 'http://localhost:8080';
        const shareUrl = `${publicUrlBase}/share/${id}`;
        res.status(201).json({ success: true, id, url: shareUrl });
    }
    catch (error) {
        console.error('Error creating share:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.createShare = createShare;
const getShare = async (req, res) => {
    try {
        const { id } = req.params;
        let record = null;
        try {
            record = await models_1.ShareContent.findByPk(id);
        }
        catch { }
        if (!record && fallbackStore.has(id)) {
            record = fallbackStore.get(id);
        }
        if (!record) {
            res.status(404).json({ success: false, error: 'Share not found' });
            return;
        }
        res.json({ success: true, record });
    }
    catch (error) {
        console.error('Error fetching share:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.getShare = getShare;
