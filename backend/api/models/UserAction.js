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
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: 'ID from recommendation catalog (e.g., clothing_repair_first_kit)',
    },
    occurredAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    impactRupees: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    impactCo2Kg: {
        type: sequelize_1.DataTypes.DECIMAL(12, 3),
        allowNull: false,
    },
    source: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'catalog:v1',
    },
}, {
    sequelize: db_1.default,
    modelName: 'UserAction',
    tableName: 'user_actions',
    timestamps: true,
    indexes: [
        {
            fields: ['userId'],
        },
        {
            fields: ['recommendationId'],
        },
        {
            fields: ['occurredAt'],
        },
        {
            unique: true,
            fields: ['userId', 'recommendationId'],
            name: 'unique_user_reco_per_day',
        },
    ],
});
exports.default = UserAction;
