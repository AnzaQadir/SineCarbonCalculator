"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class WeeklySummary extends sequelize_1.Model {
}
WeeklySummary.init({
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
    weekStart: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        field: 'week_start',
    },
    rupeesSaved: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'rupees_saved',
    },
    co2SavedKg: {
        type: sequelize_1.DataTypes.DECIMAL(12, 3),
        allowNull: false,
        field: 'co2_saved_kg',
    },
    actionsCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'actions_count',
    },
    cityText: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: 'city_text',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'created_at',
    },
}, {
    sequelize: db_1.default,
    modelName: 'WeeklySummary',
    tableName: 'weekly_summaries',
    timestamps: false, // Only createdAt, no updatedAt
    indexes: [
        {
            unique: true,
            fields: ['userId', 'week_start'],
        },
        {
            fields: ['userId'],
        },
    ],
});
exports.default = WeeklySummary;
