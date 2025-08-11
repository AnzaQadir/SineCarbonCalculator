import express from 'express';
import { generateRecommendationsHandler, generateStaticRecommendationsHandler, getCatalogHandler, getCatalogByDomainHandler } from '../controllers/recommendationController';

const router = express.Router();

router.post('/', generateRecommendationsHandler);
router.post('/static', generateStaticRecommendationsHandler);
router.get('/catalog', getCatalogHandler);
router.get('/catalog/:domain', getCatalogByDomainHandler);

export { router as recommendationRoutes }; 