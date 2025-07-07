import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

// User signup
router.post('/signup', UserController.signup);

// Join community
router.post('/join-community', UserController.joinCommunity);

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