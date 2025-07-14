// Generate a random, friendly shortcode (5 chars)
function generateShortcode() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return code;
}

// Check if a shortcode is valid (alphanumeric, 4-10 chars)
function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{4,10}$/.test(code);
}

module.exports = {
  generateShortcode,
  isValidShortcode
}; 