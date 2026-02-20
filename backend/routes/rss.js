const express = require('express');
const router = express.Router();
const RSSFeed = require('../models/RSSFeed');
const Article = require('../models/Article');
const auth = require('../middleware/auth');
const { fetchRSSFeed, fetchFullArticle, cleanHTMLContent } = require('../utils/rssUtils');

// Get all RSS feeds
router.get('/feeds', auth, async (req, res) => {
  try {
    const feeds = await RSSFeed.find().sort({ createdAt: -1 });
    res.json({ feeds });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Add RSS feed
router.post('/feeds', auth, async (req, res) => {
  try {
    const { name, url, fetchInterval } = req.body;

    // Test RSS
    try {
      await fetchRSSFeed(url);
    } catch (error) {
      return res.status(400).json({ message: 'Nevažeći RSS URL' });
    }

    const feed = new RSSFeed({
      name,
      url,
      fetchInterval: fetchInterval || 30
    });

    await feed.save();
    res.status(201).json({ message: 'RSS feed dodan', feed });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Delete RSS feed
router.delete('/feeds/:id', auth, async (req, res) => {
  try {
    await RSSFeed.findByIdAndDelete(req.params.id);
    res.json({ message: 'RSS feed obrisan' });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Fetch articles from specific feed
router.post('/feeds/:id/fetch', auth, async (req, res) => {
  try {
    const feed = await RSSFeed.findById(req.params.id);
    if (!feed) {
      return res.status(404).json({ message: 'Feed nije pronađen' });
    }

    const rssFeed = await fetchRSSFeed(feed.url);
    let newArticles = 0;

    for (const item of rssFeed.items) {
      const exists = await Article.findOne({ link: item.link });
      if (exists) continue;

      const fullContent = await fetchFullArticle(item.link);
      
      const article = new Article({
        title: item.title,
        content: item.contentEncoded || item.description || '',
        cleanedContent: fullContent ? fullContent.cleanText : cleanHTMLContent(item.contentEncoded || item.description || ''),
        link: item.link,
        sourceName: feed.name,
        sourceRSS: feed._id,
        publishedDate: item.pubDate || new Date(),
        images: fullContent ? fullContent.images : [],
        status: 'neobjavljeno',
        isNew: true,
        assignedTo: req.user._id
      });

      await article.save();
      newArticles++;
    }

    feed.lastFetched = new Date();
    await feed.save();

    res.json({ 
      message: `Dohvaćeno ${newArticles} novih članaka`,
      newArticles 
    });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Fetch all active feeds
router.post('/fetch-all', auth, async (req, res) => {
  try {
    const feeds = await RSSFeed.find({ isActive: true });
    let totalNew = 0;

    for (const feed of feeds) {
      try {
        const rssFeed = await fetchRSSFeed(feed.url);
        
        for (const item of rssFeed.items) {
          const exists = await Article.findOne({ link: item.link });
          if (exists) continue;

          const fullContent = await fetchFullArticle(item.link);
          
          const article = new Article({
            title: item.title,
            content: item.contentEncoded || item.description || '',
            cleanedContent: fullContent ? fullContent.cleanText : cleanHTMLContent(item.contentEncoded || item.description || ''),
            link: item.link,
            sourceName: feed.name,
            sourceRSS: feed._id,
            publishedDate: item.pubDate || new Date(),
            images: fullContent ? fullContent.images : [],
            status: 'neobjavljeno',
            isNew: true,
            assignedTo: req.user._id
          });

          await article.save();
          totalNew++;
        }

        feed.lastFetched = new Date();
        await feed.save();
      } catch (error) {
        console.error(`Greška kod feeda ${feed.name}:`, error.message);
      }
    }

    res.json({ 
      message: `Dohvaćeno ${totalNew} novih članaka`,
      totalNew 
    });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

module.exports = router;
