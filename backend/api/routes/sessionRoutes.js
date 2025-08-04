"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionController_1 = require("../controllers/sessionController");
const router = (0, express_1.Router)();
// Create or refresh session
router.post('/', sessionController_1.SessionController.createSession);
// Log an event
router.post('/events', sessionController_1.SessionController.logEvent);
// Get user data by session ID
router.get('/:sessionId/user', sessionController_1.SessionController.getUserBySession);
// Get session events
router.get('/:sessionId/events', sessionController_1.SessionController.getSessionEvents);
exports.default = router;
