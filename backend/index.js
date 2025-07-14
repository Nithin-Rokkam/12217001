const express = require('express');
const app = express();
const path = require('path');

const requestLogger = require('./middleware/logging');
const shortUrlRoutes = require('./routes/shorturls');
const { getUrl } = require('./models/urlstore');

app.use(requestLogger);
app.use(express.json());

app.use('/shorturls', shortUrlRoutes);

app.get('/:shortcode', (req, res) => {
  const code = req.params.shortcode;
  const record = getUrl(code);
  if (!record) {
    return res.status(404).json({ error: 'Sorry, that short link does not exist.' });
  }
  const now = new Date();
  if (now > record.expiry) {
    return res.status(410).json({ error: 'This short link has expired.' });
  }
  record.clicks.push({
    timestamp: new Date().toLocaleString(),
    referrer: req.get('referer') || req.get('referrer') || null,
    location: 'N/A' 
  });
  res.redirect(record.originalUrl);
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`URL Shortener is running on port ${PORT}`);
});
