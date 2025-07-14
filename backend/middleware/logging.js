const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../access.log');

module.exports = (req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const logEntry = `[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - startTime}ms)\n`;
    fs.appendFileSync(logFilePath, logEntry);
  });
  next();
};