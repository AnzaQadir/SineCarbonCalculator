"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class UserPersonality extends sequelize_1.Model {
}
UserPersonality.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    sessionId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'user_sessions',
            key: 'sessionId',
        },
    },
    catalogVersion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        comment: 'Version of the personality catalog used for calculation',
    },
    personalityType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        comment: 'Legacy personality type (7 types)',
    },
    newPersonality: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        comment: 'New personality archetype (10 types)',
    },
    response: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        comment: 'Complete response from personality calculation including comprehensivePowerMoves',
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        comment: 'Additional metadata like quiz responses, preferences, etc.',
    },
    ipAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        comment: 'IP address of the user for analytics',
    },
    userAgent: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'User agent string for device/browser analytics',
    },
    calculationTimeMs: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        comment: 'Time taken for personality calculation in milliseconds',
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'success',
        comment: 'Whether the calculation was successful or failed (success/failed)',
    },
    errorMessage: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'Error message if calculation failed',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.default,
    modelName: 'UserPersonality',
    tableName: 'user_personalities',
    timestamps: true,
    indexes: [
        {
            fields: ['userId'],
        },
        {
            fields: ['sessionId'],
        },
        {
            fields: ['personalityType'],
        },
        {
            fields: ['newPersonality'],
        },
        {
            fields: ['createdAt'],
        },
        {
            fields: ['catalogVersion'],
        },
        {
            fields: ['status'],
        },
        {
            fields: ['userId', 'createdAt'],
        },
    ],
});
exports.default = UserPersonality;
