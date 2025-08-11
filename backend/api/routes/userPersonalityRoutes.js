"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userPersonalityController_1 = __importDefault(require("../controllers/userPersonalityController"));
const router = (0, express_1.Router)();
const userPersonalityController = new userPersonalityController_1.default();
/**
 * @route GET /api/user-personality
 * @desc Get user personalities with filtering and pagination
 * @access Private (requires authentication)
 * @query {string} userId - Filter by user ID
 * @query {string} sessionId - Filter by session ID
 * @query {string} personalityType - Filter by legacy personality type
 * @query {string} newPersonality - Filter by new personality archetype
 * @query {string} catalogVersion - Filter by catalog version
 * @query {string} startDate - Filter by start date (ISO string)
 * @query {string} endDate - Filter by end date (ISO string)
 * @query {number} limit - Number of results per page (max 100, default 10)
 * @query {number} offset - Number of results to skip (default 0)
 */
router.get('/', userPersonalityController.getUserPersonalities);
/**
 * @route GET /api/user-personality/latest/:userId
 * @desc Get latest personality for a specific user
 * @access Private (requires authentication)
 * @param {string} userId - User ID
 */
router.get('/latest/:userId', userPersonalityController.getLatestPersonality);
/**
 * @route GET /api/user-personality/:id
 * @desc Get personality by ID
 * @access Private (requires authentication)
 * @param {string} id - Personality record ID
 */
router.get('/:id', userPersonalityController.getPersonalityById);
/**
 * @route GET /api/user-personality/stats/analytics
 * @desc Get personality statistics for analytics
 * @access Private (requires authentication)
 * @query {string} userId - Filter by user ID
 * @query {string} startDate - Filter by start date (ISO string)
 * @query {string} endDate - Filter by end date (ISO string)
 */
router.get('/stats/analytics', userPersonalityController.getPersonalityStats);
/**
 * @route POST /api/user-personality/cleanup
 * @desc Cleanup old personality records
 * @access Private (requires authentication)
 * @query {number} daysToKeep - Number of days to keep records (min 30, default 90)
 */
router.post('/cleanup', userPersonalityController.cleanupOldRecords);
exports.default = router;
