// routes.js
//==============================================

//====== Define depencies ======
const express = require ('express'),
  usersController = require('./controllers/users.controller'),
  userMiddlewares = require('./middlewares/user.middlewares');

//====== Define routes ======
module.exports = function(app, passport) {
  var router = express.Router();

  // users
  app.get('/users', usersController.showUsers);
  app.get('/users/create', usersController.showCreate);
  app.post('/users/create', usersController.processCreate);

  // Signup
  app.get('/signup', usersController.showSignup);
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile',
      failureRedirect : '/signup',
      failureFlash : true
  }));
  // Login
  app.get('/login', usersController.showLogin);
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile',
      failureRedirect : '/login',
      failureFlash : true
  }));
  // Profile
  app.get('/profile', userMiddlewares.isLoggedIn, usersController.showProfile);
};