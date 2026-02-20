const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');
const axios = require('axios');

// Schedule article
router.post('/:id', auth, async (req, res) => {
  try {
    const { scheduledStart, scheduledEnd, scheduledInterval, scheduledTime } = req.body;
    
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Članak nije pronađen' });
    }

    article.scheduledStart = scheduledStart;
    article.scheduledEnd = scheduledEnd;
    article.scheduledInterval = scheduledInterval;
    article.scheduledTime = scheduledTime;
    article.status = 'za_zakazivanje';
    article.isNew = false;

    await article.save();

    res.json({ message: 'Zakazan za objavljivanje', article });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Publish to Facebook immediately
router.post('/:id/facebook', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Članak nije pronađen' });
    }

    if (!req.user.facebookConnected || !req.user.facebookToken) {
      return res.status(400).json({ message: 'Facebook nije povezan. Povežite Facebook account.' });
    }

    // Post to Facebook
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${req.user.facebookPageId}/feed`,
        {
          message: article.cleanedContent?.substring(0, 5000) || article.content.substring(0, 5000),
          link: article.link,
          access_token: req.user.facebookToken
        }
      );

      article.facebookPosted = true;
      article.facebookPostId = response.data.id;
      article.status = 'objavljeno';
      article.isNew = false;
      await article.save();

      res.json({ 
        message: 'Uspješno objavljeno na Facebook', 
        facebookPostId: response.data.id 
      });
    } catch (fbError) {
      article.status = 'neuspjesno';
      article.facebookError = fbError.response?.data?.error?.message || fbError.message;
      await article.save();

      res.status(500).json({ 
        message: 'Greška pri objavljivanju na Facebook', 
        error: fbError.response?.data || fbError.message 
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Publish to WordPress immediately
router.post('/:id/wordpress', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Članak nije pronađen' });
    }

    if (!req.user.wordpressConnected) {
      return res.status(400).json({ message: 'WordPress nije povezan. Povežite WordPress account.' });
    }

    // WordPress.com zahtijeva OAuth ili Application Password
    // Za sada vraćamo poruku da mora ručno
    res.status(501).json({ 
      message: 'WordPress API zahtijeva Business plan. Molimo koristite copy-paste metodu.',
      content: article.cleanedContent
    });

  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Get scheduled articles
router.get('/scheduled', auth, async (req, res) => {
  try {
    const scheduled = await Article.find({
      status: { $in: ['za_zakazivanje', 'ceka_facebook'] },
      scheduledTime: { $exists: true }
    }).sort({ scheduledTime: 1 });

    res.json({ scheduled });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

module.exports = router;
