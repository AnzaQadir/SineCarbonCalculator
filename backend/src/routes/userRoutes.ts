import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// User signup
router.post('/signup', UserController.signup);

// Join community
router.post('/join-community', UserController.joinCommunity);

// Check if user exists
router.get('/check', UserController.checkUserExists);

// Check if user has completed the quiz (must be before /:id route)
router.get('/checkquiz', requireAuth, UserController.checkQuiz);

// Get user by ID
router.get('/:id', UserController.getUser);

// Get user activities
router.get('/:userId/activities', UserController.getUserActivities);

// Update user profile
router.put('/:id', UserController.updateUser);

// Admin routes
router.get('/admin/users', UserController.getAllUsers);
router.get('/admin/count', UserController.getUserCount);

export { router as userRoutes }; 