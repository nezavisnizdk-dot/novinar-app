const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  cleanedContent: String,
  link: {
    type: String,
    required: true,
    unique: true
  },
  sourceName: String,
  sourceRSS: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RSSFeed'
  },
  
  // Statusi kao na slici
  status: {
    type: String,
    enum: ['neobjavljeno', 'obrada', 'za_zakazivanje', 'ceka_facebook', 'objavljeno', 'neuspjesno'],
    default: 'neobjavljeno'
  },
  
  isNew: {
    type: Boolean,
    default: true
  },
  
  publishedDate: Date,
  images: [String],
  
  // Zakazivanje
  scheduledStart: Date,
  scheduledEnd: Date,
  scheduledInterval: Number, // u minutama
  scheduledTime: Date,
  
  // Social media
  facebookPosted: {
    type: Boolean,
    default: false
  },
  facebookPostId: String,
  facebookError: String,
  
  wordpressPosted: {
    type: Boolean,
    default: false
  },
  wordpressPostId: String,
  
  // User koji upravlja člankom
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);
