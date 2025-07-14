const express = require('express');
const router = express.Router();
const { generateShortcode, isValidShortcode } = require('../utils/shortcode');
const { saveUrl, getUrl, shortcodeExists } = require('../models/urlstore');

router.post('/', (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Missing request body.' });
  }
  const { url, validity, shortcode } = req.body;
  if (!url || typeof url !== 'string' || !/^https?:\/\/.+\..+/.test(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL.' });
  }

  let code = shortcode;
  if (code) {
    if (!isValidShortcode(code)) {
      return res.status(400).json({ error: 'Invalid shortcode format.' });
    }
    if (shortcodeExists(code)) {
      return res.status(409).json({ error: 'Shortcode already exists.' });
    }
  } else {
    do {
      code = generateShortcode();
    } while (shortcodeExists(code));
  }

  const now = new Date();
  const minutes = Number.isInteger(validity) ? validity : 30;
  const expiry = new Date(now.getTime() + minutes * 60000);

  saveUrl(code, {
    originalUrl: url,
    createdAt: now,
    expiry,
    clicks: []
  });

  res.status(201).json({
    shortLink: `${req.protocol}://${req.get('host')}/${code}`,
    expiry: expiry.toISOString()
  });
});

router.get('/:shortcode', (req, res) => {
  const code = req.params.shortcode;
  const data = getUrl(code);
  if (!data) {
    return res.status(404).json({ error: 'Shortcode not found.' });
  }
  const now = new Date();
  if (now > data.expiry) {
    return res.status(410).json({ error: 'Short link expired.' });
  }
  res.json({
    originalUrl: data.originalUrl,
    createdAt: data.createdAt,
    expiry: data.expiry,
    totalClicks: data.clicks.length,
    clicks: data.clicks
  });
});

module.exports = router;