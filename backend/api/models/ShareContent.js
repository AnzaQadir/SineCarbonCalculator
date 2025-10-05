"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class ShareContent extends sequelize_1.Model {
}
ShareContent.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    contentType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    payload: {
        // use JSONB on postgres if available; JSON otherwise
        type: sequelize_1.DataTypes.JSONB || sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
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
    modelName: 'ShareContent',
    tableName: 'share_contents',
    timestamps: true,
    indexes: [
        { fields: ['contentType'] },
    ],
});
exports.default = ShareContent;
