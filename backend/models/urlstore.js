const urlStore = {};

function saveUrl(shortcode, data) {
  urlStore[shortcode] = data;
}

function getUrl(shortcode) {
  return urlStore[shortcode] || null;
}

function shortcodeExists(shortcode) {
  return !!urlStore[shortcode];
}

module.exports = {
  saveUrl,
  getUrl,
  shortcodeExists
};
