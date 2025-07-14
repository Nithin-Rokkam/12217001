const express = require('express');
const router = express.Router();
const { generateShortcode, isValidShortcode } = require('../utils/shortcode');
const { saveUrl, getUrl, shortcodeExists } = require('../models/urlstore');

router.post('/', (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Whoops! No data received. Please send a JSON body.' });
  }
  const { url, validity, shortcode } = req.body;
  if (!url || typeof url !== 'string' || !/^https?:\/\/.+\..+/.test(url)) {
    return res.status(400).json({ error: 'Please provide a valid URL (must start with http:// or https://).' });
  }

  let chosenCode = shortcode;
  if (chosenCode) {
    if (!isValidShortcode(chosenCode)) {
      return res.status(400).json({ error: 'Custom shortcode must be 4-10 alphanumeric characters.' });
    }
    if (shortcodeExists(chosenCode)) {
      return res.status(409).json({ error: 'Sorry, that shortcode is already taken. Try another!' });
    }
  } else {
    do {
      chosenCode = generateShortcode();
    } while (shortcodeExists(chosenCode));
  }

  const now = new Date();
  const minutes = Number.isInteger(validity) ? validity : 30;
  const expiresAt = new Date(now.getTime() + minutes * 60000);

  saveUrl(chosenCode, {
    originalUrl: url,
    createdAt: now,
    expiry: expiresAt,
    clicks: []
  });

  res.status(201).json({
    shortLink: `${req.protocol}://${req.get('host')}/${chosenCode}`,
    expiry: expiresAt.toISOString()
  });
});

// Endpoint to get analytics for a short URL
router.get('/:shortcode', (req, res) => {
  const code = req.params.shortcode;
  const record = getUrl(code);
  if (!record) {
    return res.status(404).json({ error: 'No stats found for that shortcode.' });
  }
  const now = new Date();
  if (now > record.expiry) {
    return res.status(410).json({ error: 'This short link has expired. No stats available.' });
  }
  res.json({
    originalUrl: record.originalUrl,
    createdAt: record.createdAt,
    expiry: record.expiry,
    totalClicks: record.clicks.length,
    clicks: record.clicks
  });
});

module.exports = router;