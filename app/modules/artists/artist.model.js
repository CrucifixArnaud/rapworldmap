// artist.model.js
//==============================================

//====== Define depencies ======
const mongoose = require('mongoose'),
  utils = require('../../utils/utils'),
  Schema = mongoose.Schema;

//====== Define schema ======
const artistSchema = new Schema({
  name: String,
  slug: String,
  location: [{
    city: String,
    coordinates: String,
    neighborhood: String,
    _id : false
  }],
  categories: Array,
  image: [{
    thumbnailUrl: String,
    _id : false
  }],
  bio: [{
    summary: String,
    wikipediaUrl: String,
    birthdate: Date,
    deathdate: Date,
    _id : false
  }],
  youtube: [{
    pageUrl: String,
    clipExampleUrl: String,
    _id : false
  }],
  createDate: {
    type: Date,
    default: Date.now
  },
  published: {
    type: Boolean,
    default: false
  }
});

//====== Middleware ======
artistSchema.pre('save', function(next) {
  this.slug = utils.slugify(this.name);
  next();
});

//====== Export the model ======
module.exports = mongoose.model('Artist', artistSchema);