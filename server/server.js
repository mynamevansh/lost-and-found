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

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true
}));
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

const lostItemSchema = new mongoose.Schema({
    name: String,
    itemName: String,
    location: String,
    contactInfo: String,
    description: String,
    imageUrl: String
}, { timestamps: true });

const foundItemSchema = new mongoose.Schema({
    name: String,
    itemName: String,
    location: String,
    contactInfo: String,
    description: String,
    imageUrl: String
}, { timestamps: true });

const LostItem = mongoose.model('LostItem', lostItemSchema, 'lost-items');
const FoundItem = mongoose.model('FoundItem', foundItemSchema, 'found-items');

// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = req.body.type === 'found' ? 'found' : 'lost';
        const uploadPath = path.join(__dirname, 'uploads', type);
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

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
    const { token } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, sub } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            // Create user if not exists
            user = await User.create({ name, email, password: sub }); // Use Google sub as a placeholder password
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ _id: user._id, name: user.name, email: user.email, token: jwtToken });
    } catch (error) {
        res.status(401).json({ message: 'Google authentication failed' });
    }
});

// ====== Item Routes ====== //
app.post('/api/items', upload.single('photo'), async (req, res) => {
    try {
        const { name, ['item-lost']: itemLost, ['last-seen']: lastSeen, ['contact-info']: contactInfo, description, type } = req.body;
        const folderType = type === 'found' ? 'found' : 'lost';
        const imageUrl = req.file ? `http://localhost:5000/uploads/${folderType}/${req.file.filename}` : null;

        const newItemData = { name, itemName: itemLost, location: lastSeen, contactInfo, description, imageUrl };
        let newItem;
        if (type === 'found') {
            newItem = new FoundItem(newItemData);
        } else {
            newItem = new LostItem(newItemData);
        }

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/items/lost', async (req, res) => {
    try {
        const items = await LostItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/items/found', async (req, res) => {
    try {
        const items = await FoundItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.delete('/api/items/:id', async (req, res) => {
    try {
        const deletedFromLost = await LostItem.findByIdAndDelete(req.params.id);
        const deletedFromFound = await FoundItem.findByIdAndDelete(req.params.id);
        if (deletedFromLost || deletedFromFound) {
            res.status(200).json({ message: 'Item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ====== Server Start ====== //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));