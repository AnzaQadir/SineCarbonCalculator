"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklySummary = exports.UserStreak = exports.UserAction = exports.ShareContent = exports.UserPersonality = exports.EventLog = exports.UserSession = exports.UserActivity = exports.User = exports.initializeDatabase = exports.syncDatabase = void 0;
const db_1 = __importDefault(require("../db"));
// Import models
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const UserActivity_1 = __importDefault(require("./UserActivity"));
exports.UserActivity = UserActivity_1.default;
const UserSession_1 = __importDefault(require("./UserSession"));
exports.UserSession = UserSession_1.default;
const EventLog_1 = __importDefault(require("./EventLog"));
exports.EventLog = EventLog_1.default;
const UserPersonality_1 = __importDefault(require("./UserPersonality"));
exports.UserPersonality = UserPersonality_1.default;
const ShareContent_1 = __importDefault(require("./ShareContent"));
exports.ShareContent = ShareContent_1.default;
const UserAction_1 = __importDefault(require("./UserAction"));
exports.UserAction = UserAction_1.default;
const UserStreak_1 = __importDefault(require("./UserStreak"));
exports.UserStreak = UserStreak_1.default;
const WeeklySummary_1 = __importDefault(require("./WeeklySummary"));
exports.WeeklySummary = WeeklySummary_1.default;
// Define associations
const defineAssociations = () => {
    // UserSession belongs to User
    UserSession_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
    User_1.default.hasMany(UserSession_1.default, { foreignKey: 'userId', as: 'sessions' });
    // EventLog belongs to UserSession
    EventLog_1.default.belongsTo(UserSession_1.default, { foreignKey: 'sessionId', targetKey: 'sessionId' });
    UserSession_1.default.hasMany(EventLog_1.default, { foreignKey: 'sessionId', sourceKey: 'sessionId' });
    // UserPersonality belongs to User
    UserPersonality_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
    User_1.default.hasMany(UserPersonality_1.default, { foreignKey: 'userId', as: 'personalities' });
    // UserPersonality belongs to UserSession (optional)
    UserPersonality_1.default.belongsTo(UserSession_1.default, { foreignKey: 'sessionId', targetKey: 'sessionId', as: 'session' });
    UserSession_1.default.hasMany(UserPersonality_1.default, { foreignKey: 'sessionId', sourceKey: 'sessionId', as: 'personalities' });
    // Engagement Layer associations
    UserAction_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
    User_1.default.hasMany(UserAction_1.default, { foreignKey: 'userId', as: 'actions' });
    UserStreak_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
    User_1.default.hasOne(UserStreak_1.default, { foreignKey: 'userId', as: 'streak' });
    WeeklySummary_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
    User_1.default.hasMany(WeeklySummary_1.default, { foreignKey: 'userId', as: 'weeklySummaries' });
};
// Sync database (create tables if they don't exist)
const syncDatabase = async () => {
    try {
        // Define associations before syncing
        defineAssociations();
        await db_1.default.sync({ alter: true });
        console.log('Database synchronized successfully');
    }
    catch (error) {
        console.error('Error synchronizing database:', error);
        throw error;
    }
};
exports.syncDatabase = syncDatabase;
// Initialize database connection and sync
const initializeDatabase = async () => {
    try {
        // Test connection
        await db_1.default.authenticate();
        console.log('Database connection established successfully.');
        // Sync models
        await (0, exports.syncDatabase)();
    }
    catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
exports.default = db_1.default;
