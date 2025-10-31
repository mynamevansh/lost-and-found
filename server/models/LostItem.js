const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  itemName: String,
  location: String,
  contactInfo: String,
  description: String,
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('LostItem', lostItemSchema, 'lost-items');
