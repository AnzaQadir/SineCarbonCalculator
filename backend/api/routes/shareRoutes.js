"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shareController_1 = require("../controllers/shareController");
const router = (0, express_1.Router)();
router.post('/', shareController_1.createShare);
router.get('/:id', shareController_1.getShare);
exports.default = router;
