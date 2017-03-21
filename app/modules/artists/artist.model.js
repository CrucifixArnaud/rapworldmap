// artist.model.js
//==============================================

//====== Define depencies ======
const mongoose = require('mongoose'),
  utils = require('../../utils/utils'),
  Schema = mongoose.Schema;

//====== Define schema ======
const artistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  location: [{
    city: {
      type: String,
      required: true
    },
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
    yearsActiveStart: Number,
    yearsActiveEnd: Number,
    _id : false
  }],
  youtube: [{
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

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
artistSchema.post('save', function(error, req, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error(`Artist ${req.name} allready exists`));
  } else {
    next(error);
  }
});

//====== Export the model ======
module.exports = mongoose.model('Artist', artistSchema);