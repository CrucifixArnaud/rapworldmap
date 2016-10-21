// user.model.js
//==============================================

//====== Define depencies ======
const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs');


//====== Define schema ======
const userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  password: String
});

//====== Method ======
// Generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

//====== Create the model ======
// const userModel =

//====== Export the model ======
module.exports = mongoose.model('User', userSchema);