"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class UserStreak extends sequelize_1.Model {
}
UserStreak.init({
    userId: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    currentStreakDays: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'current_streak_days',
    },
    longestStreakDays: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'longest_streak_days',
    },
    lastActionDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
        field: 'last_action_date',
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.default,
    modelName: 'UserStreak',
    tableName: 'user_streaks',
    timestamps: false, // Only updatedAt, no createdAt
    updatedAt: 'updatedAt',
});
exports.default = UserStreak;
