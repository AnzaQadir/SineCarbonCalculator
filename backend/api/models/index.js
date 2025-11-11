"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.syncDatabase = exports.UserActionEvent = exports.RecommendationCatalog = exports.UserPersonalityExtended = exports.AppConfig = exports.WeeklySummary = exports.UserStreak = exports.UserAction = exports.ShareContent = exports.UserPersonality = exports.EventLog = exports.UserSession = exports.UserActivity = exports.User = void 0;
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
const ShareContent_1 = __importDefault(require("./ShareContent"));
exports.ShareContent = ShareContent_1.default;
const UserAction_1 = __importDefault(require("./UserAction"));
exports.UserAction = UserAction_1.default;
const UserStreak_1 = __importDefault(require("./UserStreak"));
exports.UserStreak = UserStreak_1.default;
const WeeklySummary_1 = __importDefault(require("./WeeklySummary"));
exports.WeeklySummary = WeeklySummary_1.default;
const AppConfig_1 = __importDefault(require("./AppConfig"));
exports.AppConfig = AppConfig_1.default;
const UserPersonalityExtended_1 = __importDefault(require("./UserPersonalityExtended"));
exports.UserPersonalityExtended = UserPersonalityExtended_1.default;
const RecommendationCatalog_1 = __importDefault(require("./RecommendationCatalog"));
exports.RecommendationCatalog = RecommendationCatalog_1.default;
const UserActionEvent_1 = __importDefault(require("./UserActionEvent"));
exports.UserActionEvent = UserActionEvent_1.default;
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
    // UserAction belongs to User
    UserAction_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
    User_1.default.hasMany(UserAction_1.default, { foreignKey: 'userId', as: 'actions' });
    // UserStreak belongs to User
    UserStreak_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
    User_1.default.hasOne(UserStreak_1.default, { foreignKey: 'userId', as: 'streak' });
    // WeeklySummary belongs to User
    WeeklySummary_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
    User_1.default.hasMany(WeeklySummary_1.default, { foreignKey: 'userId', as: 'weeklySummaries' });
    // UserPersonalityExtended belongs to User
    UserPersonalityExtended_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
    User_1.default.hasOne(UserPersonalityExtended_1.default, { foreignKey: 'userId', as: 'personalityExtended' });
    // UserActionEvent belongs to User
    UserActionEvent_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
    User_1.default.hasMany(UserActionEvent_1.default, { foreignKey: 'userId', as: 'actionEvents' });
};
// Sync database (create tables if they don't exist)
const syncDatabase = async () => {
    try {
        // Define associations before syncing
        defineAssociations();
        // Check and fix user_personalities table structure before sync
        try {
            // Check if table exists
            const [tableCheck] = await db_1.default.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'user_personalities'
        );
      `);
            const tableExists = Array.isArray(tableCheck) && tableCheck.length > 0 && tableCheck[0]?.exists;
            if (tableExists) {
                // Check if userId column exists
                const [columnCheck] = await db_1.default.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'user_personalities' AND column_name = 'userId';
        `);
                const columnExists = Array.isArray(columnCheck) && columnCheck.length > 0;
                if (!columnExists) {
                    // Column doesn't exist, add it as nullable first
                    await db_1.default.query(`
            ALTER TABLE user_personalities 
            ADD COLUMN "userId" UUID;
          `);
                    // Delete orphaned rows without valid user reference
                    await db_1.default.query(`
            DELETE FROM user_personalities 
            WHERE "userId" IS NULL;
          `);
                    // Now make it NOT NULL
                    await db_1.default.query(`
            ALTER TABLE user_personalities 
            ALTER COLUMN "userId" SET NOT NULL;
          `);
                }
                // Check and drop existing foreign key constraints that might conflict
                try {
                    const [constraints] = await db_1.default.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'user_personalities' 
            AND constraint_type = 'FOREIGN KEY'
            AND constraint_name LIKE '%user_id%';
          `);
                    if (Array.isArray(constraints) && constraints.length > 0) {
                        for (const constraint of constraints) {
                            const constraintName = constraint.constraint_name;
                            try {
                                await db_1.default.query(`
                  ALTER TABLE user_personalities 
                  DROP CONSTRAINT IF EXISTS "${constraintName}";
                `);
                            }
                            catch (dropError) {
                                // Ignore if constraint doesn't exist
                                if (!dropError.message.includes('does not exist')) {
                                    console.warn(`Warning dropping constraint ${constraintName}:`, dropError.message);
                                }
                            }
                        }
                    }
                }
                catch (constraintError) {
                    // Ignore constraint check errors
                    if (!constraintError.message.includes('does not exist')) {
                        console.warn('Warning checking constraints:', constraintError.message);
                    }
                }
            }
        }
        catch (migrationError) {
            // If table doesn't exist or column already exists, that's fine
            if (!migrationError.message.includes('does not exist') &&
                !migrationError.message.includes('already exists') &&
                !migrationError.message.includes('duplicate key')) {
                console.warn('Warning fixing user_personalities structure:', migrationError.message);
            }
        }
        await db_1.default.sync({ alter: true });
        // Fix any NULL updated_at values in user_personality_extended table
        try {
            await db_1.default.query(`
        UPDATE user_personality_extended 
        SET updated_at = NOW() 
        WHERE updated_at IS NULL;
      `);
            // Now make the column NOT NULL if it was nullable
            await db_1.default.query(`
        ALTER TABLE user_personality_extended 
        ALTER COLUMN updated_at SET NOT NULL;
      `);
        }
        catch (migrationError) {
            // If column doesn't exist or already has constraint, that's fine
            if (!migrationError.message.includes('does not exist') &&
                !migrationError.message.includes('already exists') &&
                !migrationError.message.includes('violates not-null constraint')) {
                console.warn('Warning updating user_personality_extended updated_at:', migrationError.message);
            }
        }
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
