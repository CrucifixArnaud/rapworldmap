// utils/utils.js
//==============================================

//====== Export utils ======
module.exports = {
  slugify: slugify,
  JsonError: JsonError
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

/**
 * A custom JsonError
 * @param {String} message A message to store in error
 * @param {String} param The name of the param (key) that caused the error
 * @param {String} value The value of the key that caused the error
 * @constructor
 */
function JsonError(message, param, value) {
  this.constructor.prototype.__proto__ = Error.prototype;
  // properly capture stack trace in Node.js
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.msg = message;
  this.param = param;
  this.value = value;
}