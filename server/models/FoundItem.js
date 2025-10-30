const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
    name: String,
    itemName: String,
    location: String,
    contactInfo: String,
    description: String,
    imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', foundItemSchema, 'found-items');