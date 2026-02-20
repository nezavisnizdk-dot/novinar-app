const mongoose = require('mongoose');

const rssFeedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastFetched: Date,
  fetchInterval: {
    type: Number,
    default: 30 // minuta
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RSSFeed', rssFeedSchema);
