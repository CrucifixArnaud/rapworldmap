// users.controller.js
//==============================================

//====== Define depencies ======
const User = require('./user.model');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//====== Export method ======
module.exports = {
  showSingle: showSingle,
  showProfile: showProfile,
  showSignup: showSignup,
  showLogin: showLogin,
  processLogin: processLogin,
  processLogout: processLogout,
  processEdit: processEdit
};

//====== Methods ======

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
  const locals = {
    layout: 'admin',
    title: 'Profile (' + req.user.email + ')',
    slug: 'page-admin',
    user : req.user,
    success: req.flash('success'),
    errors: req.flash('errors')
  };

  res.render('pages/users/profile', locals);
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
 * [showLogin Display login form]
 */
function showLogin (req, res) {
  const locals = {
    layout: 'admin',
    title: 'Login',
    slug: 'page-admin',
    errors: req.flash('error'),
    message: req.flash('message')
  };

  res.render('pages/users/login', locals);
}

/**
 * [processLogin After the user login, generate a JWT token and save inside a cookie]
 */
function processLogin (req, res) {
  // user has authenticated correctly thus we create a JWT token
  const token = jwt.sign({ email: req.user.email }, process.env.SECRET);
  // Save it inside a cookie
  res.cookie('jwt', token);
  // Redirect
  res.redirect('/admin/artists');
}

/**
 * [processEdit Process the edit profile form]
 */
function processEdit (req, res) {
  User.findOne({ id: req.params.id }, (err, user) => {
    user.email = req.body.email;
    user.password = user.generateHash(req.body.password);

    user.save ( (err) => {
      if(err)
        throw err;

      req.flash('success', `Successfuly update ${user.email}`);
      res.redirect('/profile');
    });
  });
}

/**
 * [processLogout Logout user]
 */
function processLogout (req, res) {
  // Clear the JWT cookie on logout
  res.clearCookie('jwt');

  req.logout();
  res.redirect('/');
}