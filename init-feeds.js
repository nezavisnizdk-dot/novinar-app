// init-feeds.js - Script za automatsko dodavanje RSS feedova
const mongoose = require('mongoose');
require('dotenv').config();

// RSS Feed Model
const rssFeedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  lastFetched: Date,
  fetchInterval: { type: Number, default: 30 }
}, { timestamps: true });

const RSSFeed = mongoose.model('RSSFeed', rssFeedSchema);

// Lista feedova za dodavanje
const feeds = [
  {
    name: 'Dnevni Avaz',
    url: 'https://avaz.ba/rss',
    fetchInterval: 30
  },
  {
    name: 'Klix.ba',
    url: 'https://www.klix.ba/rss',
    fetchInterval: 30
  },
  {
    name: 'Crna Hronika',
    url: 'https://crna-hronika.info/feed/',
    fetchInterval: 30
  },
  {
    name: 'Nezavisne Novine',
    url: 'https://www.nezavisne.com/rss/najnovije',
    fetchInterval: 30
  },
  {
    name: 'Zenit.ba',
    url: 'https://www.zenit.ba/feed/',
    fetchInterval: 30
  },
  {
    name: 'ZenicaBlog',
    url: 'https://www.zenicablog.com/feeds/posts/default',
    fetchInterval: 30
  }
];

async function initFeeds() {
  try {
    console.log('🔗 Povezivanje sa MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Povezan sa bazom!');

    console.log('\n📡 Dodavanje RSS feedova...\n');

    for (const feedData of feeds) {
      try {
        // Provjeri da li već postoji
        const existing = await RSSFeed.findOne({ url: feedData.url });
        
        if (existing) {
          console.log(`⏭️  ${feedData.name} - već postoji`);
        } else {
          await RSSFeed.create(feedData);
          console.log(`✅ ${feedData.name} - dodan!`);
        }
      } catch (err) {
        console.log(`❌ ${feedData.name} - greška: ${err.message}`);
      }
    }

    console.log('\n✨ Gotovo! Feedovi dodani u bazu.');
    console.log('🔄 Sada osvježi stranicu i klikni "Dohvati nove članke"');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Greška:', error);
    process.exit(1);
  }
}

initFeeds();
