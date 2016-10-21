// middlewares/user.middleware.js
//==============================================

//====== Export middleware ======
module.exports = {
  isLoggedIn: isLoggedIn
};

//====== Middleware ======

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
