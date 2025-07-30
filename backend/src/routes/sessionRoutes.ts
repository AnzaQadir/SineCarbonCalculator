import { Router } from 'express';
import { SessionController } from '../controllers/sessionController';

const router = Router();

// Create or refresh session
router.post('/', SessionController.createSession);

// Log an event
router.post('/events', SessionController.logEvent);

// Get user data by session ID
router.get('/:sessionId/user', SessionController.getUserBySession);

// Get session events
router.get('/:sessionId/events', SessionController.getSessionEvents);

export default router; 