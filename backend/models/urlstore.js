const urlDatabase = {};
function saveUrl(shortcode, data) {
  urlDatabase[shortcode] = data;
}
function getUrl(shortcode) {
  return urlDatabase[shortcode] || null;
}
function shortcodeExists(shortcode) {
  return Boolean(urlDatabase[shortcode]);
}

module.exports = {
  saveUrl,
  getUrl,
  shortcodeExists
};
