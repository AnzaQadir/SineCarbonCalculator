import sequelize from '../db';
import User from './User';
import UserActivity from './UserActivity';

// Export models
export { User, UserActivity };

// Sync database (create tables if they don't exist)
export const syncDatabase = async () => {
  try {
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