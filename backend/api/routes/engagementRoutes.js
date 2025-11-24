"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const engagementController_1 = require("../controllers/engagementController");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.requireAuth);
// Engagement endpoints
router.get('/next-actions', engagementController_1.getNextActionsHandler);
router.post('/action-done', engagementController_1.actionDoneHandler);
router.get('/home-feed', engagementController_1.getHomeFeedHandler);
router.get('/weekly-recap', engagementController_1.getWeeklyRecapHandler);
router.get('/bucket-list', engagementController_1.getBucketListHandler);
exports.default = router;
