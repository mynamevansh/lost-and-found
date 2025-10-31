const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  createLostItem,
  createFoundItem,
  getLostItems,
  getFoundItems,
  deleteLostItem,
  deleteFoundItem
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.originalUrl.includes('/found') ? 'found' : 'lost';
    const uploadPath = path.join(__dirname, '..', 'uploads', folder);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post('/lost', protect, upload.single('photo'), createLostItem);
router.get('/lost', getLostItems);
router.post('/found', protect, upload.single('photo'), createFoundItem);
router.get('/found', getFoundItems);
router.delete('/lost/:id', protect, deleteLostItem);
router.delete('/found/:id', protect, deleteFoundItem);

module.exports = router;
