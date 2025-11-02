import { Router } from 'express';
import { EngagementController } from '../controllers/engagementController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all engagement routes
router.use(requireAuth);

// GET /v1/engagement/next-actions (returns multiple cards - primary + alternatives)
router.get('/next-actions', EngagementController.getNextActions);

// GET /v1/engagement/best-next-action (legacy single action)
router.get('/best-next-action', EngagementController.getBestNextAction);

// POST /v1/engagement/action-done
router.post('/action-done', EngagementController.actionDone);

// GET /v1/engagement/home-feed
router.get('/home-feed', EngagementController.getHomeFeed);

// GET /v1/engagement/weekly-recap
router.get('/weekly-recap', EngagementController.getWeeklyRecap);

export default router;
