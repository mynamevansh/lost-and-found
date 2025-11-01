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

// ✅ Update allowed origins — include your deployed frontend domain (Vercel)
const allowedOrigins = [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://your-frontend-name.vercel.app' // 🔁 Replace this with your actual Vercel URL
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
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

// Error handlers
app.use(notFound);
app.use(errorHandler);

// ✅ Use Render-assigned dynamic port
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
