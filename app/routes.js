// routes.js
//==============================================

//====== Define depencies ======
const express = require ('express'),
  usersController = require('./modules/users/users.controller'),
  userMiddlewares = require('./modules/users/user.middlewares'),
  artistsController = require('./modules/artists/artists.controller');

//====== Define routes ======
module.exports = function(app, passport) {
  var router = express.Router();

  // users
  // app.get('/users', usersController.showUsers);
  // app.get('/users/create', usersController.showCreate);
  // app.post('/users/create', usersController.processCreate);

  // Signup
  // app.get('/signup', usersController.showSignup);
  // app.post('/signup', passport.authenticate('local-signup', {
  //     successRedirect : '/profile',
  //     failureRedirect : '/signup',
  //     failureFlash : true
  // }));
  // Login
  app.get('/login', usersController.showLogin);
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile',
      failureRedirect : '/login',
      failureFlash : true
  }));
  // Profile
  app.get('/profile', userMiddlewares.isLoggedIn, usersController.showProfile);

  // Artists
  app.get('/artists/create', artistsController.showCreate);
  app.post('/artists/create', artistsController.processCreate);
  app.get('/artists/:slug', artistsController.showSingle);
};