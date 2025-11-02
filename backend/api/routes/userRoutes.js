"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.userRoutes = router;
// User signup
router.post('/signup', userController_1.UserController.signup);
// Join community
router.post('/join-community', userController_1.UserController.joinCommunity);
// Check if user exists
router.get('/check', userController_1.UserController.checkUserExists);
// Check if user has completed quiz (requires authentication)
router.get('/checkquiz', auth_1.requireAuth, userController_1.UserController.checkQuiz);
// Get user by ID
router.get('/:id', userController_1.UserController.getUser);
// Get user activities
router.get('/:userId/activities', userController_1.UserController.getUserActivities);
// Update user profile
router.put('/:id', userController_1.UserController.updateUser);
// Admin routes
router.get('/admin/users', userController_1.UserController.getAllUsers);
router.get('/admin/count', userController_1.UserController.getUserCount);
