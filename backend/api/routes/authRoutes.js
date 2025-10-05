"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/login', authController_1.AuthController.login);
router.post('/logout', authController_1.AuthController.logout);
router.get('/me', authController_1.AuthController.me);
exports.default = router;
