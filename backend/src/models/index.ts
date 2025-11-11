import sequelize from '../db';
import User from './User';
import UserActivity from './UserActivity';
import UserSession from './UserSession';
import EventLog from './EventLog';
import UserPersonality from './UserPersonality';
import ShareContent from './ShareContent';
import UserAction from './UserAction';
import UserStreak from './UserStreak';
import WeeklySummary from './WeeklySummary';
import AppConfig from './AppConfig';
import UserPersonalityExtended from './UserPersonalityExtended';
import RecommendationCatalog from './RecommendationCatalog';
import UserActionEvent from './UserActionEvent';

// Export models
export { User, UserActivity, UserSession, EventLog, UserPersonality, ShareContent, UserAction, UserStreak, WeeklySummary, AppConfig, UserPersonalityExtended, RecommendationCatalog, UserActionEvent };

// Define associations
const defineAssociations = () => {
  // UserSession belongs to User
  UserSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(UserSession, { foreignKey: 'userId', as: 'sessions' });

  // EventLog belongs to UserSession
  EventLog.belongsTo(UserSession, { foreignKey: 'sessionId', targetKey: 'sessionId' });
  UserSession.hasMany(EventLog, { foreignKey: 'sessionId', sourceKey: 'sessionId' });

  // UserPersonality belongs to User
  UserPersonality.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(UserPersonality, { foreignKey: 'userId', as: 'personalities' });

  // UserPersonality belongs to UserSession (optional)
  UserPersonality.belongsTo(UserSession, { foreignKey: 'sessionId', targetKey: 'sessionId', as: 'session' });
  UserSession.hasMany(UserPersonality, { foreignKey: 'sessionId', sourceKey: 'sessionId', as: 'personalities' });

  // UserAction belongs to User
  UserAction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(UserAction, { foreignKey: 'userId', as: 'actions' });

  // UserStreak belongs to User
  UserStreak.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasOne(UserStreak, { foreignKey: 'userId', as: 'streak' });

  // WeeklySummary belongs to User
  WeeklySummary.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(WeeklySummary, { foreignKey: 'userId', as: 'weeklySummaries' });

  // UserPersonalityExtended belongs to User
  UserPersonalityExtended.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasOne(UserPersonalityExtended, { foreignKey: 'userId', as: 'personalityExtended' });

  // UserActionEvent belongs to User
  UserActionEvent.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(UserActionEvent, { foreignKey: 'userId', as: 'actionEvents' });
};

// Sync database (create tables if they don't exist)
export const syncDatabase = async () => {
  try {
    // Define associations before syncing
    defineAssociations();
    
    // Check and fix user_personalities table structure before sync
    try {
      // Check if table exists
      const [tableCheck] = await sequelize.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'user_personalities'
        );
      `);
      
      const tableExists = Array.isArray(tableCheck) && tableCheck.length > 0 && (tableCheck[0] as any)?.exists;
      
      if (tableExists) {
        // Check if userId column exists
        const [columnCheck] = await sequelize.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'user_personalities' AND column_name = 'userId';
        `);
        
        const columnExists = Array.isArray(columnCheck) && columnCheck.length > 0;
        
        if (!columnExists) {
          // Column doesn't exist, add it as nullable first
          await sequelize.query(`
            ALTER TABLE user_personalities 
            ADD COLUMN "userId" UUID;
          `);
          
          // Delete orphaned rows without valid user reference
          await sequelize.query(`
            DELETE FROM user_personalities 
            WHERE "userId" IS NULL;
          `);
          
          // Now make it NOT NULL
          await sequelize.query(`
            ALTER TABLE user_personalities 
            ALTER COLUMN "userId" SET NOT NULL;
          `);
        }
        
        // Check and drop existing foreign key constraints that might conflict
        try {
          const [constraints] = await sequelize.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'user_personalities' 
            AND constraint_type = 'FOREIGN KEY'
            AND constraint_name LIKE '%user_id%';
          `);
          
          if (Array.isArray(constraints) && constraints.length > 0) {
            for (const constraint of constraints) {
              const constraintName = (constraint as any).constraint_name;
              try {
                await sequelize.query(`
                  ALTER TABLE user_personalities 
                  DROP CONSTRAINT IF EXISTS "${constraintName}";
                `);
              } catch (dropError: any) {
                // Ignore if constraint doesn't exist
                if (!dropError.message.includes('does not exist')) {
                  console.warn(`Warning dropping constraint ${constraintName}:`, dropError.message);
                }
              }
            }
          }
        } catch (constraintError: any) {
          // Ignore constraint check errors
          if (!constraintError.message.includes('does not exist')) {
            console.warn('Warning checking constraints:', constraintError.message);
          }
        }
      }
    } catch (migrationError: any) {
      // If table doesn't exist or column already exists, that's fine
      if (!migrationError.message.includes('does not exist') && 
          !migrationError.message.includes('already exists') &&
          !migrationError.message.includes('duplicate key')) {
        console.warn('Warning fixing user_personalities structure:', migrationError.message);
      }
    }
    
    await sequelize.sync({ alter: true });
    
    // Fix any NULL updated_at values in user_personality_extended table
    try {
      await sequelize.query(`
        UPDATE user_personality_extended 
        SET updated_at = NOW() 
        WHERE updated_at IS NULL;
      `);
      
      // Now make the column NOT NULL if it was nullable
      await sequelize.query(`
        ALTER TABLE user_personality_extended 
        ALTER COLUMN updated_at SET NOT NULL;
      `);
    } catch (migrationError: any) {
      // If column doesn't exist or already has constraint, that's fine
      if (!migrationError.message.includes('does not exist') && 
          !migrationError.message.includes('already exists') &&
          !migrationError.message.includes('violates not-null constraint')) {
        console.warn('Warning updating user_personality_extended updated_at:', migrationError.message);
      }
    }
    
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

// Initialize database connection and sync
export const initializeDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models
    await syncDatabase();
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export default sequelize; 