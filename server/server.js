const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

dotenv.config();
const app = express();

// CORS Configuration - Allow localhost and 127.0.0.1 with and without ports
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost',
            'http://127.0.0.1'
        ];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ CORS blocked origin:', origin);
            callback(null, true); // Allow anyway for development
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600 // Cache preflight requests for 10 minutes
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { dbName: 'LostAndFound' })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection failed:', err.message));

// ====== Schemas ====== //
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema, 'users');

// ====== User Routes ====== //
app.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await user.matchPassword(password)) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.json({ _id: user._id, name: user.name, email: user.email, token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ====== Google Sign-In Route ====== //
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/users/google-login', async (req, res) => {
    console.log('📥 Google login request received');
    console.log('Origin:', req.headers.origin);
    
    const { token } = req.body;
    
    if (!token) {
        console.error('❌ No token provided in request body');
        return res.status(400).json({ message: 'Token is required' });
    }
    
    try {
        console.log('🔐 Verifying Google ID token...');
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { email, name, sub, picture } = payload;
        
        console.log('✅ Token verified for user:', email);

        let user = await User.findOne({ email });
        if (!user) {
            console.log('👤 Creating new user:', email);
            user = await User.create({ 
                name, 
                email, 
                password: await bcrypt.hash(sub, 10) // Hash the Google sub ID
            });
        } else {
            console.log('👤 Existing user found:', email);
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log('✅ JWT token generated, sending response');
        
        res.json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            token: jwtToken,
            picture: picture 
        });
    } catch (error) {
        console.error('❌ Google authentication error:', error.message);
        res.status(401).json({ message: 'Google authentication failed: ' + error.message });
    }
});

// ====== Item Routes ====== //
const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);

// ====== Server Start ====== //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));