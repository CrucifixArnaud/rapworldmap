// routes.js
//==============================================

//====== Define depencies ======
const express = require ('express'),
  atlasController = require('./modules/atlas/atlas.controller'),
  errorsController = require('./modules/errors/errors.controller'),
  usersController = require('./modules/users/users.controller'),
  userMiddlewares = require('./modules/users/user.middlewares'),
  artistsController = require('./modules/artists/artists.controller'),
  adminController = require('./modules/admin/admin.controller');

//====== Define routes ======
module.exports = function(app, passport) {
  var router = express.Router();

  if(process.env.MAINTENANCE === 'true') {
    // Maintenance
    app.get('/', errorsController.showMaintenance);
  } else {
    // Atlas
    app.get('/', atlasController.showAtlas);
  }

  // users
  app.post('/users/:slug', userMiddlewares.isLoggedIn, usersController.processEdit);

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
    successRedirect : '/admin/artists/',
    failureRedirect : '/login',
    failureFlash : true
  }));
  // Logout
  app.get('/logout', usersController.processLogout);
  // Profile
  app.get('/profile', userMiddlewares.isLoggedIn, usersController.showProfile);
  // Admin
  app.get('/admin/artists', userMiddlewares.isLoggedIn, adminController.showArtists);
  // Artists
  app.get('/artists/', artistsController.showArtists);
  app.get('/artists/index', artistsController.getArtistsIndex);
  app.get('/artists/download', artistsController.getArtistsDownload);
  app.get('/artists/geojson', artistsController.getArtistsGeojson);
  app.get('/artists/create', artistsController.showCreate);
  app.post('/artists/create', userMiddlewares.isLoggedIn, artistsController.uploadThumbnail, artistsController.processCreate);
  app.post('/artists/submit', artistsController.processSubmit);
  app.get('/artists/:slug', artistsController.showSingle);
  app.get('/artists/:slug/edit', userMiddlewares.isLoggedIn, artistsController.showEdit);
  app.post('/artists/:slug', userMiddlewares.isLoggedIn, artistsController.uploadThumbnail, artistsController.processEdit);
  app.get('/artists/:slug/delete', userMiddlewares.isLoggedIn, artistsController.deleteArtist);

  //====== Configure the errors pages (404/500) ======
  // Create route for the 500 (even if no error occurs, should stay above the error handling)
  app.get('/500', errorsController.show500);

  // 404
  app.use(function(req, res, next) {
    errorsController.show404(req, res);
  });

  // 500
  app.use(function (err, req, res, next) {
    errorsController.show500(err, req, res);
  })
};