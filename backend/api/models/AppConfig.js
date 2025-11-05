"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class AppConfig extends sequelize_1.Model {
}
AppConfig.init({
    key: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    value: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'updated_at',
    },
}, {
    sequelize: db_1.default,
    modelName: 'AppConfig',
    tableName: 'app_configs',
    timestamps: false, // Only updatedAt, no createdAt
    updatedAt: 'updatedAt',
});
exports.default = AppConfig;
