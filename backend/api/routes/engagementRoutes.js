"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const engagementController_1 = require("../controllers/engagementController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply auth middleware to all engagement routes
router.use(auth_1.requireAuth);
// GET /v1/engagement/next-actions (returns multiple cards - primary + alternatives)
router.get('/next-actions', engagementController_1.EngagementController.getNextActions);
// GET /v1/engagement/best-next-action (legacy single action)
router.get('/best-next-action', engagementController_1.EngagementController.getBestNextAction);
// POST /v1/engagement/action-done
router.post('/action-done', engagementController_1.EngagementController.actionDone);
// GET /v1/engagement/home-feed
router.get('/home-feed', engagementController_1.EngagementController.getHomeFeed);
// GET /v1/engagement/weekly-recap
router.get('/weekly-recap', engagementController_1.EngagementController.getWeeklyRecap);
exports.default = router;
