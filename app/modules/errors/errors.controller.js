// errors.controller.js
//==============================================

//====== Define depencies ======

//====== Export method ======
module.exports = {
  showMaintenance: showMaintenance
};

//====== Methods ======

/**
 * [showMaintenance Show the maintenance]
 */
function showMaintenance (req, res) {
  const locals = {
    slug: 'page-atlas',
    title: 'Under maintenance',
    description: 'Discover rap artists from all around the world.'
  };
  res.render('pages/errors/maintenance', locals);
}