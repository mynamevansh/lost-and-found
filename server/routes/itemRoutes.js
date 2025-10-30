const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.originalUrl.includes('/found') ? 'found' : 'lost';
    const uploadPath = path.join(__dirname, '..', 'uploads', folder);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// 🔐 (Optional later) Auth middleware placeholder
// const { protect } = require('../middleware/authMiddleware');

// ================= LOST ITEMS ================= //

// Create Lost Item
router.post('/lost', upload.single('photo'), async (req, res) => {
  try {
    const { name, itemName, location, contactInfo, description, userId } = req.body;
    const imageUrl = req.file ? `/uploads/lost/${req.file.filename}` : null;

    const newItem = new LostItem({
      name,
      itemName,
      location,
      contactInfo,
      description,
      imageUrl,
      user: userId // Associate item with user
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error saving lost item', error: error.message });
  }
});

// Get All Lost Items
router.get('/lost', async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lost items', error: error.message });
  }
});

// ================= FOUND ITEMS ================= //

// Create Found Item
router.post('/found', upload.single('photo'), async (req, res) => {
  try {
    const { name, itemName, location, contactInfo, description, userId } = req.body;
    const imageUrl = req.file ? `/uploads/found/${req.file.filename}` : null;

    const newItem = new FoundItem({
      name,
      itemName,
      location,
      contactInfo,
      description,
      imageUrl,
      user: userId // Associate item with user
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error saving found item', error: error.message });
  }
});

// Get All Found Items
router.get('/found', async (req, res) => {
  try {
    const items = await FoundItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching found items', error: error.message });
  }
});

// ================= DELETE ITEM (BOTH COLLECTIONS) ================= //

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedLost = await LostItem.findByIdAndDelete(id);
    const deletedFound = await FoundItem.findByIdAndDelete(id);

    if (deletedLost || deletedFound) {
      res.json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

module.exports = router;
