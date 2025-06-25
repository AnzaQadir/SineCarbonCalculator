"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalityController = void 0;
const personalityService_1 = require("../services/personalityService");
class PersonalityController {
    constructor() {
        this.calculatePersonality = async (req, res) => {
            try {
                const responses = req.body;
                const result = await this.personalityService.calculatePersonality(responses);
                res.json(result);
            }
            catch (error) {
                console.error('Error calculating personality:', error);
                res.status(500).json({ error: 'Failed to calculate personality' });
            }
        };
        this.personalityService = new personalityService_1.PersonalityService();
    }
}
exports.PersonalityController = PersonalityController;
