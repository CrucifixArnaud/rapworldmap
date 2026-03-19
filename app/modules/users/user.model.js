// user.model.js
//==============================================

//====== Define depencies ======
const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs'),
  utils = require('../../utils/utils');


//====== Define schema ======
const userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  slug: {
    type: String,
    unique: true
  },
  password: String
});

//====== Middleware ======
// Ensure every user has a unique slug (derived from email) before saving.
// This is required because other flows (e.g. passport signup, scripts/db/create-user)
// only set `email` and `password`.
userSchema.pre('save', function(next) {
  // If slug is already set (e.g. migration / manual creation), keep it.
  if (this.slug) return next();
  if (!this.email) return next();

  const baseSlug = utils.slugify(this.email) || 'user';
  const UserModel = this.constructor;

  let i = 0;
  const trySlug = () => {
    const candidate = i === 0 ? baseSlug : `${baseSlug}-${i}`;
    UserModel.findOne({ slug: candidate }, (err, existing) => {
      if (err) return next(err);

      // If no collision, or it is the same document, we can use this slug.
      if (!existing || (this._id && existing._id && existing._id.equals(this._id))) {
        this.slug = candidate;
        return next();
      }

      i += 1;
      trySlug();
    });
  };

  trySlug();
});

//====== Method ======
// Generating a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//====== Create the model ======
// const userModel =

//====== Export the model ======
module.exports = mongoose.model('User', userSchema);
