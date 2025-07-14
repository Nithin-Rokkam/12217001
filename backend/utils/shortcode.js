function generateShortcode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{4,10}$/.test(code);
}

module.exports = {
  generateShortcode,
  isValidShortcode
}; 