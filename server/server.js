const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// ✅ CORS Configuration - Allow Vercel frontend
const allowedOrigins = [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://lost-and-found-omega.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`❌ CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images (important for item photos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');

app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: 'Lost & Found API',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            items: '/api/items'
        }
    });
});

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

// Log all registered routes for debugging
console.log('📍 Registered routes:');
console.log('  - POST /api/users/register');
console.log('  - POST /api/users/login');
console.log('  - POST /api/users/google-login');
console.log('  - GET  /api/users/profile');
console.log('  - POST /api/users/make-admin');

// Error handlers
app.use(notFound);
app.use(errorHandler);

// ✅ Use Render-assigned dynamic port
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
