const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const path = require('path');
const fs = require('fs').promises;

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const createLostItem = async (req, res, next) => {
  try {
    const { name, itemName, location, contactInfo, description } = req.body;

    if (!name || !itemName || !location || !contactInfo) {
      res.status(400);
      return next(new Error('Please provide all required fields'));
    }

    if (!req.file) {
      res.status(400);
      return next(new Error('Please upload an image'));
    }

    const imageUrl = `${BASE_URL}/uploads/lost/${req.file.filename}`;

    const item = await LostItem.create({
      user: req.user._id,
      userId: req.user._id.toString(),
      userEmail: req.user.email,
      name,
      itemName,
      location,
      contactInfo,
      description: description || '',
      imageUrl
    });

    const populatedItem = await LostItem.findById(item._id).populate('user', 'name email');

    console.log(`✅ lost item created: ${itemName} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: populatedItem,
      message: 'Lost item created successfully'
    });
  } catch (error) {
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', 'lost', req.file.filename);
      await fs.unlink(filePath).catch(err => console.error('File cleanup error:', err));
    }
    next(error);
  }
};

const createFoundItem = async (req, res, next) => {
  try {
    const { name, itemName, location, contactInfo, description } = req.body;

    if (!name || !itemName || !location || !contactInfo) {
      res.status(400);
      return next(new Error('Please provide all required fields'));
    }

    if (!req.file) {
      res.status(400);
      return next(new Error('Please upload an image'));
    }

    const imageUrl = `${BASE_URL}/uploads/found/${req.file.filename}`;

    const item = await FoundItem.create({
      user: req.user._id,
      userId: req.user._id.toString(),
      userEmail: req.user.email,
      name,
      itemName,
      location,
      contactInfo,
      description: description || '',
      imageUrl
    });

    const populatedItem = await FoundItem.findById(item._id).populate('user', 'name email');

    console.log(`✅ found item created: ${itemName} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: populatedItem,
      message: 'Found item created successfully'
    });
  } catch (error) {
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', 'found', req.file.filename);
      await fs.unlink(filePath).catch(err => console.error('File cleanup error:', err));
    }
    next(error);
  }
};

const getLostItems = async (req, res, next) => {
  try {
    const items = await LostItem.find().populate('user', 'name email').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    next(error);
  }
};

const getFoundItems = async (req, res, next) => {
  try {
    const items = await FoundItem.find().populate('user', 'name email').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    next(error);
  }
};

const deleteLostItem = async (req, res, next) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      return next(new Error('Item not found'));
    }

    const isOwner = item.userEmail === req.user.email || item.userId === req.user._id.toString();
    const isAdmin = req.user.email === 'vanshranawat48@gmail.com' || req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      return next(new Error('Not authorized to delete this item'));
    }

    if (item.imageUrl) {
      const filename = item.imageUrl.split('/').pop();
      const filePath = path.join(__dirname, '..', 'uploads', 'lost', filename);
      await fs.unlink(filePath).catch(err => console.error('File deletion error:', err));
    }

    await item.deleteOne();

    console.log(`✅ lost item deleted: ${item.itemName} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const deleteFoundItem = async (req, res, next) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      return next(new Error('Item not found'));
    }

    const isOwner = item.userEmail === req.user.email || item.userId === req.user._id.toString();
    const isAdmin = req.user.email === 'vanshranawat48@gmail.com' || req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      return next(new Error('Not authorized to delete this item'));
    }

    if (item.imageUrl) {
      const filename = item.imageUrl.split('/').pop();
      const filePath = path.join(__dirname, '..', 'uploads', 'found', filename);
      await fs.unlink(filePath).catch(err => console.error('File deletion error:', err));
    }

    await item.deleteOne();

    console.log(`✅ found item deleted: ${item.itemName} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLostItem,
  createFoundItem,
  getLostItems,
  getFoundItems,
  deleteLostItem,
  deleteFoundItem
};
