// artists.controller.js
//==============================================

//====== Define depencies ======

//====== Export method ======
module.exports = {
  showAtlas: showAtlas
};

//====== Methods ======

/**
 * [showAtlas Show the atlas]
 */
function showAtlas (req, res) {
  res.render('pages/atlas/atlas');
}