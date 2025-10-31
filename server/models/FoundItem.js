const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    itemName: String,
    location: String,
    contactInfo: String,
    description: String,
    imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', foundItemSchema, 'found-items');