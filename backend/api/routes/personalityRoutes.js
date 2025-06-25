"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personalityRoutes = void 0;
const express_1 = require("express");
const personalityController_1 = require("../controllers/personalityController");
const router = (0, express_1.Router)();
const personalityController = new personalityController_1.PersonalityController();
// POST /api/personality/calculate
router.post('/calculate', personalityController.calculatePersonality);
exports.personalityRoutes = router;
