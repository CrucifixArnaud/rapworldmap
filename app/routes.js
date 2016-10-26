// routes.js
//==============================================

//====== Define depencies ======
const express = require ('express'),
  atlasController = require('./modules/atlas/atlas.controller'),
  usersController = require('./modules/users/users.controller'),
  userMiddlewares = require('./modules/users/user.middlewares'),
  artistsController = require('./modules/artists/artists.controller');

//====== Define routes ======
module.exports = function(app, passport) {
  var router = express.Router();

  // Atltas
  app.get('/', atlasController.showAtlas);

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
  app.get('/artists/', artistsController.showArtists);
  app.get('/artists/geojson', artistsController.getArtistsGeojson);
  app.get('/artists/create', artistsController.showCreate);
  app.post('/artists/create', artistsController.processCreate);
  app.get('/artists/:slug', artistsController.showSingle);
  app.get('/artists/:slug/edit', artistsController.showEdit);
  app.post('/artists/:slug', artistsController.processEdit);
  app.get('/artists/:slug/delete', artistsController.deleteArtist);
};