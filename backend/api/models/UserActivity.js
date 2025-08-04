"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const User_1 = __importDefault(require("./User"));
class UserActivity extends sequelize_1.Model {
}
UserActivity.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: User_1.default,
            key: 'id',
        },
    },
    activityType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.default,
    modelName: 'UserActivity',
    tableName: 'user_activities',
    timestamps: false, // We only want createdAt, not updatedAt
    indexes: [
        {
            fields: ['userId'],
        },
        {
            fields: ['activityType'],
        },
        {
            fields: ['createdAt'],
        },
    ],
});
// Define associations
User_1.default.hasMany(UserActivity, { foreignKey: 'userId', as: 'activities' });
UserActivity.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
exports.default = UserActivity;
