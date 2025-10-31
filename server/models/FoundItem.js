const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User reference is required']
  },
  name: { 
    type: String, 
    required: [true, 'Finder name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  itemName: { 
    type: String, 
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  location: { 
    type: String, 
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  contactInfo: { 
    type: String, 
    required: [true, 'Contact info is required'],
    trim: true,
    maxlength: [100, 'Contact info cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: { 
    type: String 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('FoundItem', foundItemSchema, 'found-items');