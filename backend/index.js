const express = require('express');
const app = express();
const path = require('path');
const loggingMiddleware = require('./middleware/logging');
const shorturlsRouter = require('./routes/shorturls');

app.use(loggingMiddleware);
app.use(express.json());
app.use('/shorturls', shorturlsRouter);

const { getUrl } = require('./models/urlstore');

app.get('/:shortcode', (req, res) => {
  const code = req.params.shortcode;
  const data = getUrl(code);
  if (!data) {
    return res.status(404).json({ error: 'Shortcode not found.' });
  }
  const now = new Date();
  if (now > data.expiry) {
    return res.status(410).json({ error: 'Short link expired.' });
  }
  const click = {
    timestamp: new Date().toISOString(),
    referrer: req.get('referer') || req.get('referrer') || null,
    location: 'N/A'
  };
  data.clicks.push(click);
  res.redirect(data.originalUrl);
});
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
