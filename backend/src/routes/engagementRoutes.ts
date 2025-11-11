import express from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getNextActionsHandler,
  actionDoneHandler,
  getHomeFeedHandler,
  getWeeklyRecapHandler,
  getBucketListHandler,
} from '../controllers/engagementController';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Engagement endpoints
router.get('/next-actions', getNextActionsHandler);
router.post('/action-done', actionDoneHandler);
router.get('/home-feed', getHomeFeedHandler);
router.get('/weekly-recap', getWeeklyRecapHandler);
router.get('/bucket-list', getBucketListHandler);

export default router;

