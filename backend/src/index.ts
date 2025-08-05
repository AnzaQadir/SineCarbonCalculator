import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { personalityRoutes } from './routes/personalityRoutes';
import { recommendationRoutes } from './routes/recommendationRoutes';
import { userRoutes } from './routes/userRoutes';
import sessionRoutes from './routes/sessionRoutes';
import { initializeDatabase } from './models';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS middleware for Vercel
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://zerrah-backend.vercel.app',
    'https://zerrah.vercel.app',
    'https://www.zerrah.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:8080'
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Session-Id');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  next();
});
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Handle preflight OPTIONS requests explicitly for Vercel
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Session-Id');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// Routes
app.use('/api/personality', personalityRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), cors: 'updated' });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database and conditionally start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Only start the server if not on Vercel
    if (process.env.VERCEL !== '1') {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } else {
      console.log('Running on Vercel - server not started');
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
  }
};

startServer();

export default app; 