"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class UserAction extends sequelize_1.Model {
}
UserAction.init({
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
    recommendationId: {
        type: sequelize_1.DataTypes.STRING, // Using string since catalog uses string IDs
        allowNull: false,
    },
    occurredAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    impactRupees: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'impact_rupees',
    },
    impactCo2Kg: {
        type: sequelize_1.DataTypes.DECIMAL(12, 3),
        allowNull: false,
        defaultValue: 0,
        field: 'impact_co2_kg',
    },
    surface: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'web',
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
    },
    source: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'catalog:v1',
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
    modelName: 'UserAction',
    tableName: 'user_actions',
    timestamps: true,
    indexes: [
        {
            fields: ['userId', 'occurredAt'],
        },
        {
            fields: ['recommendationId'],
        },
        {
            fields: ['userId', 'recommendationId'],
        },
    ],
});
exports.default = UserAction;
