// config/passport.js
//==============================================

var LocalStrategy = require('passport-local').Strategy;

//  up the user model
var User = require('../models/user.model');

//====== Create the strategy ======
var passportStrategy = (passport) => {

  //====== Passport session setup ======

  // Serialize user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

  //====== Local signup ======
  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'email' :  email }, function(err, user) {

        // if there are any errors, return the error
        if (err)
          return done(err);

        // check to see if theres already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          // if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.email = email;
          newUser.password = newUser.generateHash(password);

          // save the user
          newUser.save(function(err) {
              if (err)
                  throw err;
              return done(null, newUser);
          });
        }
      });
    });
  }));

  //====== Local login ======
  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'email' :  email }, function(err, user) {

      // if there are any errors, return the error
      if (err)
        return done(err);

      // if no user is found, return the message
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found'));

      // if the user is found but password invalid
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Login/Password dont match'));

      return done(null, user);
    });

  }));

};

//====== Export the configuration ======
module.exports = passportStrategy;