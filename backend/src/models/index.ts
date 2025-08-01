import sequelize from '../db';
import User from './User';
import UserActivity from './UserActivity';
import UserSession from './UserSession';
import EventLog from './EventLog';

// Export models
export { User, UserActivity, UserSession, EventLog };

// Define associations
const defineAssociations = () => {
  // UserSession belongs to User
  UserSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(UserSession, { foreignKey: 'userId', as: 'sessions' });

  // EventLog belongs to UserSession
  EventLog.belongsTo(UserSession, { foreignKey: 'sessionId', targetKey: 'sessionId' });
  UserSession.hasMany(EventLog, { foreignKey: 'sessionId', sourceKey: 'sessionId' });
};

// Sync database (create tables if they don't exist)
export const syncDatabase = async () => {
  try {
    // Define associations before syncing
    defineAssociations();
    
    await sequelize.sync({ alter: true });
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