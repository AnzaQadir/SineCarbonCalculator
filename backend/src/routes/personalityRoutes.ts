import { Router } from 'express';
import { PersonalityController } from '../controllers/personalityController';

const router = Router();
const personalityController = new PersonalityController();

// POST /api/personality/calculate
router.post('/calculate', personalityController.calculatePersonality);

export const personalityRoutes = router; 