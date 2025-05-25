import express from 'express';
import { generateRecommendationsHandler, generateStaticRecommendationsHandler } from '../controllers/recommendationController';

const router = express.Router();

router.post('/', generateRecommendationsHandler);
router.post('/static', generateStaticRecommendationsHandler);

export { router as recommendationRoutes }; 