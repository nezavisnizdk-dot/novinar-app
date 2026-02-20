const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');

// Get articles (sa filterima po statusu)
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 300 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sourceRSS', 'name');

    const counts = {
      neobjavljeno: await Article.countDocuments({ status: 'neobjavljeno' }),
      obrada: await Article.countDocuments({ status: 'obrada' }),
      za_zakazivanje: await Article.countDocuments({ status: 'za_zakazivanje' }),
      ceka_facebook: await Article.countDocuments({ status: 'ceka_facebook' }),
      objavljeno: await Article.countDocuments({ status: 'objavljeno' }),
      neuspjesno: await Article.countDocuments({ status: 'neuspjesno' })
    };

    res.json({ articles, counts });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Get single article
router.get('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('sourceRSS');
    if (!article) {
      return res.status(404).json({ message: 'Članak nije pronađen' });
    }
    res.json({ article });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Update article status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Članak nije pronađen' });
    }

    article.status = status;
    article.isNew = false;
    await article.save();

    res.json({ message: 'Status ažuriran', article });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Update article content
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, cleanedContent } = req.body;
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Članak nije pronađen' });
    }

    if (title) article.title = title;
    if (cleanedContent) article.cleanedContent = cleanedContent;
    article.isNew = false;

    await article.save();
    res.json({ message: 'Članak ažuriran', article });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Delete article
router.delete('/:id', auth, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Članak obrisan' });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Mark as NOT new
router.patch('/:id/mark-read', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Članak nije pronađen' });
    }

    article.isNew = false;
    await article.save();

    res.json({ message: 'Označen kao pročitan' });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

module.exports = router;
