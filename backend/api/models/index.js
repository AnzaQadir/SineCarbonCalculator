"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.syncDatabase = exports.UserPersonality = exports.EventLog = exports.UserSession = exports.UserActivity = exports.User = void 0;
const db_1 = __importDefault(require("../db"));
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
