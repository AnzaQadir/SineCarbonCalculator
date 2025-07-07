"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
exports.userRoutes = router;
// User signup
router.post('/signup', userController_1.UserController.signup);
// Join community
router.post('/join-community', userController_1.UserController.joinCommunity);
// Get user by ID
router.get('/:id', userController_1.UserController.getUser);
// Get user activities
router.get('/:userId/activities', userController_1.UserController.getUserActivities);
// Update user profile
router.put('/:id', userController_1.UserController.updateUser);
// Admin routes
router.get('/admin/users', userController_1.UserController.getAllUsers);
router.get('/admin/count', userController_1.UserController.getUserCount);
