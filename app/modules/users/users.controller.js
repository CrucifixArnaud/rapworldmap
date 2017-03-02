// users.controller.js
//==============================================

//====== Define depencies ======
const User = require('./user.model');
const passport = require('passport');

//====== Export method ======
module.exports = {
  showSingle: showSingle,
  showProfile: showProfile,
  showSignup: showSignup,
  showLogin: showLogin,
  processLogout: processLogout,
  processEdit: processEdit,
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
    errors: req.flash('loginMessage')
  };

  res.render('pages/users/login', locals);
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
  req.logout();
  res.redirect('/');
}