// errors.controller.js
//==============================================

//====== Define depencies ======

//====== Export method ======
module.exports = {
  showMaintenance: showMaintenance,
  show404: show404
};

//====== Methods ======

/**
 * [showMaintenance Show the maintenance]
 */
function showMaintenance (req, res) {
  const locals = {
    slug: 'page-errors',
    title: 'Under maintenance',
    description: 'Discover rap artists from all around the world.'
  };
  res.render('pages/errors/maintenance', locals);
}

/**
 * [show404 Show the 404]
 */
function show404 (req, res) {
  const locals = {
    slug: 'page-errors',
    title: '404 - Page Not Found',
    url: req.url,
    description: "Discover rap artists from all around the world."
  };

  res.status(404);
  res.render('pages/errors/404', locals);
}