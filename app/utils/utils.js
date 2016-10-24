// utils/utils.js
//==============================================

//====== Export utils ======
module.exports = {
  slugify: slugify
};

//====== Methods ======

/**
 * [slugify Slugify a string]
 * @param  {string} text [String to slugify]
 * @return {string}      [Slugified string]
 */
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}