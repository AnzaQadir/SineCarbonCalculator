"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class EventLog extends sequelize_1.Model {
}
EventLog.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    eventId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        unique: true,
    },
    sessionId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'user_sessions',
            key: 'sessionId',
        },
    },
    eventType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    payload: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    timestamp: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
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
    modelName: 'EventLog',
    tableName: 'event_logs',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['eventId'],
        },
        {
            fields: ['sessionId'],
        },
        {
            fields: ['eventType'],
        },
        {
            fields: ['timestamp'],
        },
    ],
});
exports.default = EventLog;
