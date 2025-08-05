"use strict";
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
// Load environment variables
dotenv_1.default.config();
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
        vercel: process.env.VERCEL
    });
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
        // Initialize database
        console.log('Initializing database...');
        await (0, models_1.initializeDatabase)();
        console.log('Database initialized successfully');
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
