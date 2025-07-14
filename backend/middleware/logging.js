const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../access.log');

module.exports = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const log = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms\n`;
    fs.appendFileSync(logFile, log);
  });
  next();
};