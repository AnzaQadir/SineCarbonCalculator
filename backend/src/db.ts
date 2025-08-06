import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  throw new Error('DATABASE_URL is required');
}

console.log('Initializing database connection...');
console.log('DATABASE_URL length:', process.env.DATABASE_URL.length);

// Check if pg module is available
try {
  require('pg');
  console.log('pg module is available');
} catch (error) {
  console.error('❌ pg module not found. Please install it manually.');
  throw new Error('Please install pg package manually');
}

// Parse DATABASE_URL manually to handle URL encoding issues
function parseDatabaseUrl(url: string) {
  try {
    // Handle URL encoding issues by manually parsing
    const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!match) {
      throw new Error('Invalid DATABASE_URL format');
    }
    
    const [, username, password, host, port, database] = match;
    
    // Decode the password (handle %23 -> #)
    const decodedPassword = decodeURIComponent(password);
    
    return {
      username,
      password: decodedPassword,
      host,
      port: parseInt(port),
      database
    };
  } catch (error) {
    console.error('❌ Error parsing DATABASE_URL:', error);
    throw error;
  }
}

const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);

console.log('Parsed database config:', process.env.DATABASE_URL, {
  username: dbConfig.username,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  passwordLength: dbConfig.password.length
});

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3,
    timeout: 10000
  }
});

// Test database connection
export async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Initialize database
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
    
    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export default sequelize; 