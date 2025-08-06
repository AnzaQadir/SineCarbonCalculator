"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const personalityRoutes_1 = require("./routes/personalityRoutes");
const recommendationRoutes_1 = require("./routes/recommendationRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
const models_1 = require("./models");
// Load environment variables (only in development)
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const app = (0, express_1.default)();
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
        'http://localhost:8080',
        'http://localhost:8081'
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
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Handle preflight OPTIONS requests explicitly for Vercel
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Session-Id');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
});
// Routes
app.use('/api/personality', personalityRoutes_1.personalityRoutes);
app.use('/api/recommendations', recommendationRoutes_1.recommendationRoutes);
app.use('/api/users', userRoutes_1.userRoutes);
app.use('/api/sessions', sessionRoutes_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        cors: 'updated',
        environment: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        database: process.env.VERCEL === '1' ? 'unavailable (graceful fallback)' : 'available'
    });
});
// Simple test endpoint that doesn't require database
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        cors: 'enabled'
    });
});
// Database test endpoint
app.get('/api/db-test', async (req, res) => {
    try {
        const { testDbConnection } = await Promise.resolve().then(() => __importStar(require('./db')));
        const success = await testDbConnection();
        if (!success) {
            throw new Error('Database connection test failed');
        }
        res.json({
            status: 'success',
            message: 'Database connection successful',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.json({
            status: 'error',
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
});
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the API' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Initialize database and conditionally start server
const startServer = async () => {
    try {
        console.log('Starting server initialization...');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('VERCEL:', process.env.VERCEL);
        // Initialize database (with fallback)
        console.log('Initializing database...');
        try {
            await (0, models_1.initializeDatabase)();
            console.log('Database initialized successfully');
        }
        catch (dbError) {
            console.error('Database initialization failed:', dbError);
            if (dbError instanceof Error) {
                console.error('Database error details:', {
                    message: dbError.message,
                    code: dbError.code,
                    hostname: dbError.hostname
                });
            }
            if (process.env.VERCEL === '1') {
                console.log('Continuing without database on Vercel...');
                console.log('API endpoints will work but database features will be limited');
            }
            else {
                throw dbError;
            }
        }
        // Only start the server if not on Vercel
        if (process.env.VERCEL !== '1') {
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        }
        else {
            console.log('Running on Vercel - server not started');
        }
    }
    catch (error) {
        console.error('Failed to start server:', error);
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
        }
        if (process.env.VERCEL !== '1') {
            process.exit(1);
        }
    }
};
// Wrap in try-catch for better error handling
try {
    startServer();
}
catch (error) {
    console.error('Critical error during startup:', error);
    if (error instanceof Error) {
        console.error('Error stack:', error.stack);
    }
}
exports.default = app;
