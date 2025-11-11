"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class UserActionEvent extends sequelize_1.Model {
}
UserActionEvent.init({
    userId: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id',
        },
        field: 'user_id',
    },
    recommendationId: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        field: 'recommendation_id',
    },
    eventType: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        field: 'event_type',
        validate: {
            isIn: [['SHOWN', 'DONE', 'DISMISS', 'SNOOZE']],
        },
    },
    occurredAt: {
        type: sequelize_1.DataTypes.DATE,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'occurred_at',
    },
}, {
    sequelize: db_1.default,
    modelName: 'UserActionEvent',
    tableName: 'user_action_events',
    timestamps: false,
    indexes: [
        {
            fields: ['user_id', 'occurred_at'],
        },
        {
            fields: ['recommendation_id'],
        },
        {
            fields: ['user_id', 'event_type'],
        },
        {
            fields: ['event_type'],
        },
    ],
});
exports.default = UserActionEvent;
