// users.controller.js
//==============================================

//====== Define depencies ======
const User = require('./user.model');
const passport = require('passport');

//====== Export method ======
module.exports = {
  showUsers: showUsers,
  showSingle: showSingle,
  showProfile: showProfile,
  showSignup: showSignup,
  // processSignup: processSignup,
  showLogin: showLogin,
  showCreate: showCreate,
  processCreate: processCreate
};

//====== Methods ======

/**
 * [showUsers Display list of users]
 */
function showUsers (req, res) {

}

/**
 * [showSingle Display single user]
 */
function showSingle (req, res) {
  res.render('pages/users/single');
}

/**
 * [showProfile Display profile]
 */
function showProfile (req, res) {
  res.render('pages/users/profile', {
    user : req.user,
    errors: req.flash('errors')
  });
}

/**
 * [showSignup Display signup form]
 */
function showSignup (req, res) {
  res.render('pages/users/signup', {
    errors: req.flash('signupMessage')
  });
}

/**
 * [processSignup Process the signup form]
 */
function processSignup (req, res) {
  console.log('processSignup');

  passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  });
}

/**
 * [showLogin Display login form]
 */
function showLogin (req, res) {
  res.render('pages/users/login', {
    errors: req.flash('loginMessage')
  });
}

/**
 * [showCreate Display create user form]
 */
function showCreate (req, res) {
  res.render('pages/users/create', {
      errors: req.flash('errors')
    });
}

/**
 * [processCreate Process the creation form]
 */
function processCreate (req, res) {

}