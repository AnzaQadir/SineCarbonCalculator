"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class UserPersonalityExtended extends sequelize_1.Model {
}
UserPersonalityExtended.init({
    userId: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id',
        },
        field: 'user_id',
    },
    archetypeScores: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        field: 'archetype_scores',
        defaultValue: {},
    },
    personaVector: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        field: 'persona_vector',
        defaultValue: {
            money: 0.111,
            time: 0.111,
            comfort: 0.111,
            health: 0.111,
            carbon: 0.111,
            mastery: 0.111,
            social: 0.111,
            certainty: 0.111,
            streak: 0.111,
        },
    },
    weightPrefs: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        field: 'weight_prefs',
        defaultValue: {
            pkr: 1.0,
            time: 1.0,
            co2: 1.0,
            effort: 1.0,
            novelty: 0.7,
            recency: 0.8,
            diversity: 0.6,
            fit: 1.0,
        },
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true, // Allow null initially for migration, then we'll update existing rows
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'updated_at',
    },
}, {
    sequelize: db_1.default,
    modelName: 'UserPersonalityExtended',
    tableName: 'user_personality_extended',
    timestamps: false,
    updatedAt: 'updatedAt',
});
exports.default = UserPersonalityExtended;
