const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Korisnik već postoji' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        facebookConnected: user.facebookConnected,
        wordpressConnected: user.wordpressConnected
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Pogrešan email ili lozinka' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Pogrešan email ili lozinka' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        facebookConnected: user.facebookConnected,
        wordpressConnected: user.wordpressConnected
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ 
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        facebookConnected: req.user.facebookConnected,
        wordpressConnected: req.user.wordpressConnected
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Connect Facebook
router.post('/facebook/connect', auth, async (req, res) => {
  try {
    const { accessToken, pageId } = req.body;
    
    req.user.facebookConnected = true;
    req.user.facebookToken = accessToken;
    req.user.facebookPageId = pageId;
    await req.user.save();

    res.json({ message: 'Facebook uspješno povezan' });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Disconnect Facebook
router.post('/facebook/disconnect', auth, async (req, res) => {
  try {
    req.user.facebookConnected = false;
    req.user.facebookToken = null;
    req.user.facebookPageId = null;
    await req.user.save();

    res.json({ message: 'Facebook isključen' });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Connect WordPress
router.post('/wordpress/connect', auth, async (req, res) => {
  try {
    const { siteUrl, username, password } = req.body;
    
    req.user.wordpressConnected = true;
    req.user.wordpressSiteUrl = siteUrl;
    req.user.wordpressUsername = username;
    req.user.wordpressPassword = password;
    await req.user.save();

    res.json({ message: 'WordPress uspješno povezan' });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

// Disconnect WordPress
router.post('/wordpress/disconnect', auth, async (req, res) => {
  try {
    req.user.wordpressConnected = false;
    req.user.wordpressSiteUrl = null;
    req.user.wordpressUsername = null;
    req.user.wordpressPassword = null;
    await req.user.save();

    res.json({ message: 'WordPress isključen' });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru', error: error.message });
  }
});

module.exports = router;
