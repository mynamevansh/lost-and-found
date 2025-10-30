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
    const { name, itemName, location, contactInfo, description } = req.body;
    
    // Construct full image URL with server domain
    const imageUrl = req.file 
      ? `http://localhost:5000/uploads/lost/${req.file.filename}` 
      : null;

    // Log received data for debugging
    console.log('📝 Creating Lost Item:');
    console.log('  name:', name);
    console.log('  itemName:', itemName);
    console.log('  location:', location);
    console.log('  contactInfo:', contactInfo);
    console.log('  description:', description);
    console.log('  imageUrl:', imageUrl);

    const newItem = new LostItem({
      name,
      itemName,
      location,
      contactInfo,
      description,
      imageUrl
    });

    await newItem.save();
    
    // Log saved item
    console.log('✅ Lost item saved:', newItem._id);
    
    // Return item with exact field names frontend expects
    res.status(201).json({
      _id: newItem._id,
      name: newItem.name,
      itemName: newItem.itemName,
      location: newItem.location,
      contactInfo: newItem.contactInfo,
      description: newItem.description,
      imageUrl: newItem.imageUrl,
      createdAt: newItem.createdAt,
      updatedAt: newItem.updatedAt
    });
  } catch (error) {
    console.error('❌ Error saving lost item:', error);
    res.status(500).json({ message: 'Error saving lost item', error: error.message });
  }
});

// Get All Lost Items
router.get('/lost', async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });
    
    // Transform items to ensure full image URLs and correct field names
    const transformedItems = items.map(item => ({
      _id: item._id,
      name: item.name,
      itemName: item.itemName,
      location: item.location,
      contactInfo: item.contactInfo,
      description: item.description,
      imageUrl: item.imageUrl && !item.imageUrl.startsWith('http') 
        ? `http://localhost:5000${item.imageUrl}` 
        : item.imageUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    
    console.log(`📦 Fetched ${transformedItems.length} lost items`);
    res.json(transformedItems);
  } catch (error) {
    console.error('❌ Error fetching lost items:', error);
    res.status(500).json({ message: 'Error fetching lost items', error: error.message });
  }
});

// ================= FOUND ITEMS ================= //

// Create Found Item
router.post('/found', upload.single('photo'), async (req, res) => {
  try {
    const { name, itemName, location, contactInfo, description } = req.body;
    
    // Construct full image URL with server domain
    const imageUrl = req.file 
      ? `http://localhost:5000/uploads/found/${req.file.filename}` 
      : null;

    // Log received data for debugging
    console.log('📝 Creating Found Item:');
    console.log('  name:', name);
    console.log('  itemName:', itemName);
    console.log('  location:', location);
    console.log('  contactInfo:', contactInfo);
    console.log('  description:', description);
    console.log('  imageUrl:', imageUrl);

    const newItem = new FoundItem({
      name,
      itemName,
      location,
      contactInfo,
      description,
      imageUrl
    });

    await newItem.save();
    
    // Log saved item
    console.log('✅ Found item saved:', newItem._id);
    
    // Return item with exact field names frontend expects
    res.status(201).json({
      _id: newItem._id,
      name: newItem.name,
      itemName: newItem.itemName,
      location: newItem.location,
      contactInfo: newItem.contactInfo,
      description: newItem.description,
      imageUrl: newItem.imageUrl,
      createdAt: newItem.createdAt,
      updatedAt: newItem.updatedAt
    });
  } catch (error) {
    console.error('❌ Error saving found item:', error);
    res.status(500).json({ message: 'Error saving found item', error: error.message });
  }
});

// Get All Found Items
router.get('/found', async (req, res) => {
  try {
    const items = await FoundItem.find().sort({ createdAt: -1 });
    
    // Transform items to ensure full image URLs and correct field names
    const transformedItems = items.map(item => ({
      _id: item._id,
      name: item.name,
      itemName: item.itemName,
      location: item.location,
      contactInfo: item.contactInfo,
      description: item.description,
      imageUrl: item.imageUrl && !item.imageUrl.startsWith('http') 
        ? `http://localhost:5000${item.imageUrl}` 
        : item.imageUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    
    console.log(`📦 Fetched ${transformedItems.length} found items`);
    res.json(transformedItems);
  } catch (error) {
    console.error('❌ Error fetching found items:', error);
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
